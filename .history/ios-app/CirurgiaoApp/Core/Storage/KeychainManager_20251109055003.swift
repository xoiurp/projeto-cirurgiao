//
//  KeychainManager.swift
//  CirurgiaoApp
//
//  Created by Lucas - iOS Senior Developer
//  Projeto Cirurgião - Semana 2
//

import Foundation
import Security

// MARK: - Keychain Manager
final class KeychainManager {
    static let shared = KeychainManager()
    
    private init() {}
    
    // MARK: - Keys
    private enum Keys {
        static let accessToken = "com.projeto-cirurgiao.app.accessToken"
        static let refreshToken = "com.projeto-cirurgiao.app.refreshToken"
    }
    
    // MARK: - Save Token
    func saveAccessToken(_ token: String) throws {
        try save(token, forKey: Keys.accessToken)
    }
    
    func saveRefreshToken(_ token: String) throws {
        try save(token, forKey: Keys.refreshToken)
    }
    
    // MARK: - Get Token
    func getAccessToken() -> String? {
        return get(forKey: Keys.accessToken)
    }
    
    func getRefreshToken() -> String? {
        return get(forKey: Keys.refreshToken)
    }
    
    // MARK: - Delete Token
    func deleteAccessToken() throws {
        try delete(forKey: Keys.accessToken)
    }
    
    func deleteRefreshToken() throws {
        try delete(forKey: Keys.refreshToken)
    }
    
    func deleteAllTokens() throws {
        try deleteAccessToken()
        try deleteRefreshToken()
    }
    
    // MARK: - Private Methods
    private func save(_ value: String, forKey key: String) throws {
        guard let data = value.data(using: .utf8) else {
            throw KeychainError.encodingError
        }
        
        // Deletar item existente primeiro
        try? delete(forKey: key)
        
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecValueData as String: data,
            kSecAttrAccessible as String: kSecAttrAccessibleWhenUnlockedThisDeviceOnly
        ]
        
        let status = SecItemAdd(query as CFDictionary, nil)
        
        guard status == errSecSuccess else {
            throw KeychainError.saveFailed(status)
        }
    }
    
    private func get(forKey key: String) -> String? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]
        
        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        
        guard status == errSecSuccess,
              let data = result as? Data,
              let value = String(data: data, encoding: .utf8) else {
            return nil
        }
        
        return value
    }
    
    private func delete(forKey key: String) throws {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key
        ]
        
        let status = SecItemDelete(query as CFDictionary)
        
        guard status == errSecSuccess || status == errSecItemNotFound else {
            throw KeychainError.deleteFailed(status)
        }
    }
}

// MARK: - Keychain Error
enum KeychainError: LocalizedError {
    case encodingError
    case saveFailed(OSStatus)
    case deleteFailed(OSStatus)
    
    var errorDescription: String? {
        switch self {
        case .encodingError:
            return "Erro ao codificar dados"
        case .saveFailed(let status):
            return "Erro ao salvar no Keychain: \(status)"
        case .deleteFailed(let status):
            return "Erro ao deletar do Keychain: \(status)"
        }
    }
}
