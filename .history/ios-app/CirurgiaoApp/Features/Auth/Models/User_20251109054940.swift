//
//  User.swift
//  CirurgiaoApp
//
//  Created by Lucas - iOS Senior Developer
//  Projeto Cirurgião - Semana 2
//

import Foundation

// MARK: - User Model
struct User: Codable, Identifiable {
    let id: String
    let email: String
    let name: String
    let role: UserRole
    let createdAt: Date
    let updatedAt: Date
    
    enum CodingKeys: String, CodingKey {
        case id
        case email
        case name
        case role
        case createdAt
        case updatedAt
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decode(String.self, forKey: .id)
        email = try container.decode(String.self, forKey: .email)
        name = try container.decode(String.self, forKey: .name)
        role = try container.decode(UserRole.self, forKey: .role)
        
        // Decodificar datas ISO8601
        let dateFormatter = ISO8601DateFormatter()
        dateFormatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        
        let createdAtString = try container.decode(String.self, forKey: .createdAt)
        let updatedAtString = try container.decode(String.self, forKey: .updatedAt)
        
        guard let createdDate = dateFormatter.date(from: createdAtString),
              let updatedDate = dateFormatter.date(from: updatedAtString) else {
            throw DecodingError.dataCorruptedError(
                forKey: .createdAt,
                in: container,
                debugDescription: "Data inválida"
            )
        }
        
        createdAt = createdDate
        updatedAt = updatedDate
    }
}

// MARK: - User Role
enum UserRole: String, Codable {
    case admin = "ADMIN"
    case surgeon = "SURGEON"
    case patient = "PATIENT"
    case staff = "STAFF"
}

// MARK: - Auth Response
struct AuthResponse: Codable {
    let accessToken: String
    let refreshToken: String
    let user: User
}

// MARK: - Login Request
struct LoginRequest: Codable {
    let email: String
    let password: String
}

// MARK: - Register Request
struct RegisterRequest: Codable {
    let email: String
    let password: String
    let name: String
    let role: UserRole
}

// MARK: - Refresh Token Request
struct RefreshTokenRequest: Codable {
    let refreshToken: String
}

// MARK: - Error Response
struct ErrorResponse: Codable {
    let message: String
    let statusCode: Int
    let error: String?
}
