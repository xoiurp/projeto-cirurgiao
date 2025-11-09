//
//  APIClient.swift
//  CirurgiaoApp
//
//  Created by Lucas - iOS Senior Developer
//  Projeto Cirurgião - Semana 2
//

import Foundation

// MARK: - API Client
final class APIClient {
    static let shared = APIClient()
    
    private let baseURL: String
    private let session: URLSession
    private let decoder: JSONDecoder
    private let encoder: JSONEncoder
    
    private init() {
        // Configurar base URL (pode ser alterado para produção)
        self.baseURL = "http://localhost:3000"
        
        // Configurar URLSession
        let configuration = URLSessionConfiguration.default
        configuration.timeoutIntervalForRequest = 30
        configuration.timeoutIntervalForResource = 60
        self.session = URLSession(configuration: configuration)
        
        // Configurar JSON Decoder
        self.decoder = JSONDecoder()
        self.decoder.dateDecodingStrategy = .iso8601
        
        // Configurar JSON Encoder
        self.encoder = JSONEncoder()
        self.encoder.dateEncodingStrategy = .iso8601
    }
    
    // MARK: - Request Methods
    func request<T: Decodable>(
        endpoint: APIEndpoint,
        method: HTTPMethod = .get,
        body: Encodable? = nil,
        requiresAuth: Bool = false
    ) async throws -> T {
        let request = try buildRequest(
            endpoint: endpoint,
            method: method,
            body: body,
            requiresAuth: requiresAuth
        )
        
        let (data, response) = try await session.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }
        
        // Verificar status code
        guard (200...299).contains(httpResponse.statusCode) else {
            // Tentar decodificar erro do backend
            if let errorResponse = try? decoder.decode(ErrorResponse.self, from: data) {
                throw APIError.serverError(errorResponse.message)
            }
            throw APIError.httpError(httpResponse.statusCode)
        }
        
        // Decodificar resposta
        do {
            let decodedData = try decoder.decode(T.self, from: data)
            return decodedData
        } catch {
            print("❌ Erro ao decodificar: \(error)")
            throw APIError.decodingError(error)
        }
    }
    
    // MARK: - Build Request
    private func buildRequest(
        endpoint: APIEndpoint,
        method: HTTPMethod,
        body: Encodable?,
        requiresAuth: Bool
    ) throws -> URLRequest {
        guard let url = URL(string: baseURL + endpoint.path) else {
            throw APIError.invalidURL
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = method.rawValue
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        // Adicionar token de autenticação se necessário
        if requiresAuth {
            guard let token = KeychainManager.shared.getAccessToken() else {
                throw APIError.unauthorized
            }
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        
        // Adicionar body se necessário
        if let body = body {
            request.httpBody = try encoder.encode(body)
        }
        
        return request
    }
}

// MARK: - HTTP Method
enum HTTPMethod: String {
    case get = "GET"
    case post = "POST"
    case put = "PUT"
    case patch = "PATCH"
    case delete = "DELETE"
}

// MARK: - API Endpoint
enum APIEndpoint {
    case login
    case register
    case me
    case refreshToken
    case logout
    
    var path: String {
        switch self {
        case .login:
            return "/auth/login"
        case .register:
            return "/auth/register"
        case .me:
            return "/auth/me"
        case .refreshToken:
            return "/auth/refresh"
        case .logout:
            return "/auth/logout"
        }
    }
}

// MARK: - API Error
enum APIError: LocalizedError {
    case invalidURL
    case invalidResponse
    case unauthorized
    case httpError(Int)
    case serverError(String)
    case decodingError(Error)
    case networkError(Error)
    
    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "URL inválida"
        case .invalidResponse:
            return "Resposta inválida do servidor"
        case .unauthorized:
            return "Não autorizado. Faça login novamente."
        case .httpError(let code):
            return "Erro HTTP: \(code)"
        case .serverError(let message):
            return message
        case .decodingError(let error):
            return "Erro ao processar dados: \(error.localizedDescription)"
        case .networkError(let error):
            return "Erro de rede: \(error.localizedDescription)"
        }
    }
}
