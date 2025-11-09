//
//  AuthViewModel.swift
//  CirurgiaoApp
//
//  Created by Lucas - iOS Senior Developer
//  Projeto Cirurgião - Semana 2
//

import Foundation
import Combine

// MARK: - Auth View Model
@MainActor
final class AuthViewModel: ObservableObject {
    @Published var isAuthenticated = false
    @Published var currentUser: User?
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private let apiClient = APIClient.shared
    private let keychainManager = KeychainManager.shared
    
    init() {
        checkAuthStatus()
    }
    
    // MARK: - Check Auth Status
    func checkAuthStatus() {
        // Verificar se existe token salvo
        if keychainManager.getAccessToken() != nil {
            Task {
                await fetchCurrentUser()
            }
        }
    }
    
    // MARK: - Login
    func login(email: String, password: String) async {
        isLoading = true
        errorMessage = nil
        
        do {
            let request = LoginRequest(email: email, password: password)
            let response: AuthResponse = try await apiClient.request(
                endpoint: .login,
                method: .post,
                body: request
            )
            
            // Salvar tokens no Keychain
            try keychainManager.saveAccessToken(response.accessToken)
            try keychainManager.saveRefreshToken(response.refreshToken)
            
            // Atualizar estado
            currentUser = response.user
            isAuthenticated = true
            
            print("✅ Login realizado com sucesso: \(response.user.name)")
        } catch {
            errorMessage = error.localizedDescription
            print("❌ Erro no login: \(error)")
        }
        
        isLoading = false
    }
    
    // MARK: - Register
    func register(email: String, password: String, name: String, role: UserRole) async {
        isLoading = true
        errorMessage = nil
        
        do {
            let request = RegisterRequest(
                email: email,
                password: password,
                name: name,
                role: role
            )
            
            let response: AuthResponse = try await apiClient.request(
                endpoint: .register,
                method: .post,
                body: request
            )
            
            // Salvar tokens no Keychain
            try keychainManager.saveAccessToken(response.accessToken)
            try keychainManager.saveRefreshToken(response.refreshToken)
            
            // Atualizar estado
            currentUser = response.user
            isAuthenticated = true
            
            print("✅ Registro realizado com sucesso: \(response.user.name)")
        } catch {
            errorMessage = error.localizedDescription
            print("❌ Erro no registro: \(error)")
        }
        
        isLoading = false
    }
    
    // MARK: - Fetch Current User
    func fetchCurrentUser() async {
        isLoading = true
        errorMessage = nil
        
        do {
            let user: User = try await apiClient.request(
                endpoint: .me,
                requiresAuth: true
            )
            
            currentUser = user
            isAuthenticated = true
            
            print("✅ Usuário carregado: \(user.name)")
        } catch {
            // Se falhar, limpar tokens
            try? keychainManager.deleteAllTokens()
            isAuthenticated = false
            currentUser = nil
            
            print("❌ Erro ao carregar usuário: \(error)")
        }
        
        isLoading = false
    }
    
    // MARK: - Logout
    func logout() async {
        isLoading = true
        
        do {
            // Chamar endpoint de logout (opcional)
            let _: EmptyResponse? = try? await apiClient.request(
                endpoint: .logout,
                method: .post,
                requiresAuth: true
            )
            
            // Limpar tokens
            try keychainManager.deleteAllTokens()
            
            // Atualizar estado
            isAuthenticated = false
            currentUser = nil
            
            print("✅ Logout realizado com sucesso")
        } catch {
            print("❌ Erro no logout: \(error)")
        }
        
        isLoading = false
    }
    
    // MARK: - Refresh Token
    func refreshToken() async -> Bool {
        guard let refreshToken = keychainManager.getRefreshToken() else {
            return false
        }
        
        do {
            let request = RefreshTokenRequest(refreshToken: refreshToken)
            let response: AuthResponse = try await apiClient.request(
                endpoint: .refreshToken,
                method: .post,
                body: request
            )
            
            // Salvar novos tokens
            try keychainManager.saveAccessToken(response.accessToken)
            try keychainManager.saveRefreshToken(response.refreshToken)
            
            print("✅ Token renovado com sucesso")
            return true
        } catch {
            print("❌ Erro ao renovar token: \(error)")
            return false
        }
    }
}

// MARK: - Empty Response
struct EmptyResponse: Codable {}
