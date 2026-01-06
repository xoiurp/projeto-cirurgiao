"""
Script para processar transcrições do AWS Transcribe e fazer upload para o Qdrant
Autor: Cline - Projeto Cirurgião
Data: 2025-01-07
"""

import os
import json
import argparse
from pathlib import Path
from typing import List, Dict, Any
import requests
from sentence_transformers import SentenceTransformer

# Configurações Padrão (podem ser sobrescritas via argumentos)
DEFAULT_QDRANT_URL = "http://qdrant.agencia.bot:6333"
DEFAULT_COLLECTION_NAME = "video_transcriptions"
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

class VideoTranscribeUploader:
    def __init__(self, qdrant_url: str, collection_name: str):
        self.qdrant_url = qdrant_url
        self.collection_name = collection_name
        print(f"⏳ Carregando modelo de embedding: {EMBEDDING_MODEL}...")
        self.model = SentenceTransformer(EMBEDDING_MODEL)
        self.vector_size = 384  # Tamanho do vetor do modelo all-MiniLM-L6-v2
        print("✅ Modelo carregado!")
        
    def create_collection(self):
        """Cria a collection no Qdrant se não existir"""
        url = f"{self.qdrant_url}/collections/{self.collection_name}"
        
        # Verifica se collection já existe
        try:
            response = requests.get(url)
            if response.status_code == 200:
                print(f"✅ Collection '{self.collection_name}' já existe")
                return True
        except requests.exceptions.ConnectionError:
            print(f"❌ Erro de conexão com Qdrant em {self.qdrant_url}")
            return False
        
        # Cria nova collection
        payload = {
            "vectors": {
                "size": self.vector_size,
                "distance": "Cosine"
            }
        }
        
        response = requests.put(url, json=payload)
        if response.status_code in [200, 201]:
            print(f"✅ Collection '{self.collection_name}' criada com sucesso")
            return True
        else:
            print(f"❌ Erro ao criar collection: {response.text}")
            return False

    def parse_aws_transcribe_json(self, file_path: str) -> List[Dict[str, Any]]:
        """
        Lê o JSON do AWS Transcribe e extrai segmentos com timestamps.
        Retorna uma lista de dicionários com 'text', 'start_time', 'end_time'.
        """
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        segments = []
        
        # Tenta usar audio_segments se disponível (mais estruturado)
        if 'results' in data and 'audio_segments' in data['results']:
            print("📍 Usando 'audio_segments' do JSON...")
            for segment in data['results']['audio_segments']:
                if 'transcript' in segment and segment['transcript'].strip():
                    segments.append({
                        'text': segment['transcript'],
                        'start_time': float(segment['start_time']),
                        'end_time': float(segment['end_time'])
                    })
        
        # Fallback para items se audio_segments não existir ou estiver vazio
        elif 'results' in data and 'items' in data['results']:
            print("📍 Usando 'items' do JSON (reconstruindo frases)...")
            # Lógica simplificada para agrupar itens em frases (pode ser melhorada)
            current_text = []
            start_time = None
            
            for item in data['results']['items']:
                if item['type'] == 'pronunciation':
                    if start_time is None:
                        start_time = float(item['start_time'])
                    current_text.append(item['alternatives'][0]['content'])
                    end_time = float(item['end_time'])
                elif item['type'] == 'punctuation':
                    current_text.append(item['alternatives'][0]['content'])
                    # Se for pontuação final, fecha o segmento
                    if item['alternatives'][0]['content'] in ['.', '?', '!']:
                        text = " ".join(current_text).replace(" .", ".").replace(" ,", ",").replace(" ?", "?")
                        segments.append({
                            'text': text,
                            'start_time': start_time,
                            'end_time': end_time
                        })
                        current_text = []
                        start_time = None
            
            # Adiciona o resto se sobrou
            if current_text and start_time is not None:
                text = " ".join(current_text)
                segments.append({
                    'text': text,
                    'start_time': start_time,
                    'end_time': end_time
                })

        return segments

    def upload_transcription(self, file_path: str, video_name: str = None):
        """Processa e faz upload de uma transcrição"""
        if not video_name:
            video_name = Path(file_path).stem

        print(f"\n📄 Processando arquivo: {file_path}")
        print(f"   Vídeo: {video_name}")
        
        try:
            chunks = self.parse_aws_transcribe_json(file_path)
        except Exception as e:
            print(f"❌ Erro ao ler arquivo JSON: {e}")
            return

        if not chunks:
            print("⚠️ Nenhum segmento de texto encontrado no arquivo.")
            return

        print(f"   Segmentos encontrados: {len(chunks)}")
        
        points = []
        # Usar um hash do nome do arquivo para gerar IDs únicos mas consistentes
        base_id = abs(hash(video_name)) % (10**12) 
        
        for i, chunk in enumerate(chunks):
            # Gera embedding
            embedding = self.model.encode(chunk['text']).tolist()
            
            # Cria ponto
            point = {
                "id": base_id + i,
                "vector": embedding,
                "payload": {
                    "video_name": video_name,
                    "source_file": str(file_path),
                    "text": chunk['text'],
                    "start_time": chunk['start_time'],
                    "end_time": chunk['end_time'],
                    "chunk_index": i
                }
            }
            points.append(point)
            
            # Upload em lotes de 100 para não sobrecarregar
            if len(points) >= 100:
                self._send_batch(points)
                points = []
        
        # Envia o restante
        if points:
            self._send_batch(points)

    def _send_batch(self, points: List[Dict]):
        url = f"{self.qdrant_url}/collections/{self.collection_name}/points"
        payload = {"points": points}
        
        try:
            response = requests.put(url, json=payload)
            if response.status_code in [200, 201]:
                print(f"   ✅ Lote de {len(points)} segmentos enviado.")
            else:
                print(f"   ❌ Erro ao enviar lote: {response.text}")
        except Exception as e:
            print(f"   ❌ Erro de conexão ao enviar lote: {e}")

    def test_search(self, query: str, limit: int = 3):
        """Testa a busca no Qdrant"""
        print(f"\n🔍 Testando busca: '{query}'")
        
        query_vector = self.model.encode(query).tolist()
        
        url = f"{self.qdrant_url}/collections/{self.collection_name}/points/search"
        payload = {
            "vector": query_vector,
            "limit": limit,
            "with_payload": True
        }
        
        try:
            response = requests.post(url, json=payload)
            if response.status_code == 200:
                results = response.json()["result"]
                print(f"\n📊 Resultados encontrados: {len(results)}")
                for i, result in enumerate(results, 1):
                    payload = result['payload']
                    print(f"\n{i}. Score: {result['score']:.4f}")
                    print(f"   Vídeo: {payload.get('video_name', 'N/A')}")
                    print(f"   Tempo: {payload.get('start_time', 0):.2f}s - {payload.get('end_time', 0):.2f}s")
                    print(f"   Texto: {payload.get('text', '')[:200]}...")
            else:
                print(f"❌ Erro na busca: {response.text}")
        except Exception as e:
            print(f"❌ Erro ao buscar: {e}")

def main():
    parser = argparse.ArgumentParser(description="Upload de transcrições AWS para Qdrant")
    parser.add_argument("file", help="Caminho para o arquivo JSON do AWS Transcribe")
    parser.add_argument("--url", default=DEFAULT_QDRANT_URL, help="URL do Qdrant")
    parser.add_argument("--collection", default=DEFAULT_COLLECTION_NAME, help="Nome da collection")
    
    args = parser.parse_args()
    
    print("=" * 80)
    print("🎥 PROCESSADOR DE TRANSCRIÇÕES DE VÍDEO")
    print("=" * 80)
    
    uploader = VideoTranscribeUploader(args.url, args.collection)
    
    if uploader.create_collection():
        uploader.upload_transcription(args.file)
        
        # Teste rápido
        print("\n" + "=" * 80)
        print("🧪 TESTE AUTOMÁTICO")
        uploader.test_search("incisão abdominal")

if __name__ == "__main__":
    main()
