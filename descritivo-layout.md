Vou analisar a interface e criar prompts detalhados para cada componente. Organizarei de forma estruturada para facilitar a implementação.

## **ANÁLISE DA INTERFACE - PLATAFORMA DE CURSOS**

---

## **1. SIDEBAR DE NAVEGAÇÃO (Menu Lateral)**

**Contexto:** Menu vertical fixo no lado esquerdo da tela

**Especificações:**
- Largura fixa de aproximadamente 240px
- Fundo branco com sombra sutil à direita
- Logo da plataforma no topo (Coursera)
- Items de menu com ícones à esquerda e texto à direita
- Estado ativo com indicador visual (fundo azul claro ou borda azul)

**Items do Menu:**
1. Home (ícone de casa)
2. Course List (ícone de documento)
3. Community (ícone de pessoas)
4. Career (ícone de maleta)
5. Settings (ícone de engrenagem)

**Comportamento:**
- Hover: background cinza claro (#F5F5F5)
- Active: background azul claro ou borda esquerda azul (#0056D2)
- Ícones: 20x20px, cor cinza (#666) quando inativo, azul quando ativo
- Tipografia: fonte sans-serif, 14px, weight 500

---

## **2. HEADER (Cabeçalho Superior)**

**Contexto:** Barra horizontal fixa no topo da página

**Estrutura dividida em 3 seções:**

**Seção Esquerda:**
- Campo de busca global
- Ícone de lupa à esquerda
- Placeholder: "Find your favorite course..."
- Width: ~350px
- Background: cinza muito claro (#F8F8F8)
- Border radius: 4px

**Seção Central:**
- Vazia (espaço flexível)

**Seção Direita (da esquerda para direita):**
1. Seletor de idioma (English + dropdown)
2. Ícone de notificações (sino)
3. Ícone de grade (9 pontos - apps)
4. Avatar do usuário com nome "Serena"
5. Menu dropdown

**Especificações:**
- Altura: 64px
- Background: branco
- Border bottom: 1px solid #E0E0E0
- Padding horizontal: 24px
- Alinhamento: space-between

---

## **3. BREADCRUMBS (Navegação em Migalhas)**

**Contexto:** Caminho de navegação abaixo do header

**Estrutura:**
- "UX Design Google..." > "Introducing user..." > "The basics of user experience design"
- Separador: ">" ou ícone de seta
- Último item em negrito (página atual)

**Especificações:**
- Tipografia: 13px
- Cor dos links: azul (#0056D2)
- Cor do item atual: cinza escuro (#333)
- Hover: sublinhado
- Padding: 16px 24px
- Background: branco ou cinza muito claro

---

## **4. VIDEO PLAYER (Reprodutor de Vídeo)**

**Contexto:** Player de vídeo principal com controles

**Área do Vídeo:**
- Aspect ratio: 16:9
- Width: responsivo (preenche container)
- Thumbnail quando pausado
- Botão play centralizado (círculo branco com ícone)
- Logo "G" do Google visível

**Controles Inferiores:**
- Barra de progresso (timeline)
- Tempo atual / Tempo total (ex: "05:25")
- Botões (da esquerda para direita):
  - Play/Pause
  - Volume/Mute
  - Configurações (engrenagem)
  - Picture-in-Picture
  - Fullscreen

**Especificações:**
- Background dos controles: semi-transparente escuro
- Barra de progresso: buffer em cinza, progresso em vermelho/azul
- Ícones: 20x20px, brancos
- Padding dos controles: 12px

---

## **5. INFORMAÇÕES DO CURSO (Abaixo do vídeo)**

**Contexto:** Seção com título e descrição

**Elementos:**
- Título principal: "The basics of user experience design"
  - Font size: 24px, weight: 700
- Subtítulo: "Foundations of User Experience (UX) Design"
  - Font size: 14px, color: #666

**Badge de Likes:**
- Número de curtidas (193)
- Ícone de thumbs up
- Background: azul (#0056D2)
- Text: branco
- Border radius: 16px
- Padding: 4px 12px

---

## **6. SEÇÃO DE TRANSCRIÇÃO**

**Contexto:** Área expansível com texto da transcrição do vídeo

**Elementos:**
- Título: "Transcript" (16px, weight: 600)
- Link "Check More" (azul, sublinhado)
- Conteúdo do texto:
  - Timestamps: [00:00], [00:24], [00:26]
  - Texto corrido com parágrafos
  - Font size: 14px, line height: 1.6
  - Color: #333

**Comportamento:**
- Expansível/colapsável
- Scroll interno se necessário
- Timestamps clicáveis (navegação no vídeo)

---

## **7. SEÇÃO DE NOTAS (NOTES)**

**Contexto:** Área para anotações pessoais do aluno

**Título:**
- "Notes" (16px, weight: 600)
- Link "Make New Notes" (azul)

**Cards de Notas:**
Cada nota tem:
- Texto da anotação em formato de card
- Background: cinza muito claro (#F9F9F9)
- Border: 1px solid #E0E0E0
- Border radius: 8px
- Padding: 16px

**Botão de Ação:**
- "Add my thought" 
- Ícone de adicionar (+)
- Background: branco
- Border: azul tracejado
- Full width dentro da seção

**Especificações:**
- Grid de 2 colunas (se houver múltiplas notas)
- Gap: 16px
- Cada card com max-width

---

## **8. LISTA DE MÓDULOS (SIDEBAR DIREITA)**

**Contexto:** Barra lateral direita com lista de aulas

**Header da Seção:**
- Tabs: "Syllabus", "Info", "Q&A", "More" (ícone ⋯)
- Tab ativo com borda inferior azul
- Font size: 14px

**Informações do Curso:**
- "10 Modules"
- "Introducing user experience design"
- Autor: "Google UX Design"
- Última atualização: "2 minutes"

**Lista de Módulos:**
Cada item contém:
- Checkbox (marcado/desmarcado)
- Título do módulo
- Duração: "X minutes"
- Ícone indicador (texto, vídeo, etc)

**Exemplo de item:**
```
☑ Michael's journey in UX design - 2 minutes
☑ Introduction to Course 1: Foundations... - 5 minutes
☐ The basics of user experience de... - 4 minutes
☐ Jobs in the field of user experience - 2 minutes
```

**Especificações:**
- Width: ~320px
- Background: branco
- Border left: 1px solid #E0E0E0
- Padding: 20px
- Font size: 13px
- Line height: 1.4
- Gap entre items: 12px

---

## **9. RELATED BOOKS & ARTICLES**

**Contexto:** Seção de conteúdo relacionado

**Header:**
- "Related Books & Articles"
- Seta para ver mais (→)

**Cards:**
Grid horizontal de 3 cards:
1. "What is User Experience (UX) D..." - Interaction Design Foundation
2. "UX Basics: Study Guide" - Nielsen Norman Group
3. "An Intro..." - UXBooth

**Especificação dos Cards:**
- Ícone/logo da fonte
- Título (truncado com "...")
- Fonte/autor
- Background: branco
- Border: 1px solid #E0E0E0
- Border radius: 8px
- Padding: 12px
- Hover: sombra sutil

---

## **10. NEXT COURSE (Próximo Curso)**

**Contexto:** Card de chamada para próximo curso

**Elementos:**
- Título: "Next Course"
- Link: "Check Other Courses" (azul)
- Card com:
  - Imagem thumbnail (aspect 16:9)
  - Título: "Empathize, Define, and Ideate"
  - Duração: "21 Hours"
  - Rating: "4.83 (86k)"
  - Botão "Check" (azul, destacado)

**Especificações do Card:**
- Width: full
- Border radius: 12px
- Overflow: hidden
- Shadow: sutil
- Botão CTA: background azul (#0056D2), text branco

---

## **ESTRUTURA GERAL DE LAYOUT**

**Grid Principal:**
```
┌─────────────────────────────────────────────────────┐
│ Header (full width)                                  │
├──────┬──────────────────────────────────┬───────────┤
│      │ Breadcrumbs                      │           │
│      ├──────────────────────────────────┤           │
│ Side │ Video Player                     │  Modules  │
│ bar  ├──────────────────────────────────┤   List    │
│      │ Course Info                      │           │
│ (240)├──────────────────────────────────┤  (320px)  │
│  px  │ Transcript                       │           │
│      ├──────────────────────────────────┤           │
│      │ Notes                            │           │
│      ├──────────────────────────────────┤           │
│      │ Related Books & Articles         │           │
│      ├──────────────────────────────────┤           │
│      │ Next Course                      │           │
└──────┴──────────────────────────────────┴───────────┘
```

**Responsividade:**
- Desktop: 3 colunas (sidebar, main, modules)
- Tablet: 2 colunas (main, modules - sidebar collapse)
- Mobile: 1 coluna (stack vertical, sidebar em menu hamburger)

---

Quer que eu detalhe mais algum componente específico ou crie variações para estados diferentes (loading, error, empty, etc.)?