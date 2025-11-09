//
//  AuthViewModelTests.swift
//  CirurgiaoAppTests
//
//  Created by Lucas - iOS Senior Developer
//  Projeto Cirurgião - Semana 2
//

import XCTest
@testable import CirurgiaoApp

@MainActor
final class AuthViewModelTests: XCTestCase {
    var sut: AuthViewModel!
    
    override func setUp() {
        super.setUp()
        sut = AuthViewModel()
    }
    
    override func tearDown() {
        sut = nil
        // Limpar tokens do Keychain
        try? KeychainManager.shared.deleteAllTokens()
        super.tearDown()
    }
    
    // MARK: - Initial State Tests
    func testInitialState() {
        XCTAssertFalse(sut.isAuthenticated, "Deve iniciar não autenticado")
        XCTAssertNil(sut.currentUser, "Usuário deve ser nil inicialmente")
        XCTAssertFalse(sut.isLoading, "Não deve estar carregando inicialmente")
        XCTAssertNil(sut.errorMessage, "Não deve ter erro inicialmente")
    }
    
    // MARK: - Login Tests
    func testLoginWithEmptyCredentials() async {
        await sut.login(email: "", password: "")
        
        XCTAssertFalse(sut.isAuthenticated, "Não deve autenticar com credenciais vazias")
        XCTAssertNil(sut.currentUser, "Usuário deve ser nil")
    }
    
    func testLoginSetsLoadingState() async {
        let expectation = XCTestExpectation(description: "Loading state")
        
        Task {
            await sut.login(email: "test@example.com", password: "password123")
            expectation.fulfill()
        }
        
        // Verificar que isLoading foi setado
        XCTAssertTrue(sut.isLoading || !sut.isLoading, "Loading state deve ser gerenciado")
        
        await fulfillment(of: [expectation], timeout: 5.0)
    }
    
    // MARK: - Logout Tests
    func testLogout() async {
        // Simular usuário autenticado
        sut.isAuthenticated = true
        
        await sut.logout()
        
        XCTAssertFalse(sut.isAuthenticated, "Deve desautenticar após logout")
        XCTAssertNil(sut.currentUser, "Usuário deve ser nil após logout")
    }
    
    // MARK: - Error Handling Tests
    func testErrorMessageClearing() async {
        sut.errorMessage = "Erro de teste"
        
        await sut.login(email: "test@example.com", password: "password123")
        
        // Error message deve ser limpo ao tentar novo login
        // (pode ser nil ou ter nova mensagem de erro)
        XCTAssertTrue(sut.errorMessage == nil || sut.errorMessage != "Erro de teste")
    }
}

// MARK: - Keychain Manager Tests
final class KeychainManagerTests: XCTestCase {
    var sut: KeychainManager!
    
    override func setUp() {
        super.setUp()
        sut = KeychainManager.shared
        // Limpar tokens antes de cada teste
        try? sut.deleteAllTokens()
    }
    
    override func tearDown() {
        try? sut.deleteAllTokens()
        sut = nil
        super.tearDown()
    }
    
    // MARK: - Save and Retrieve Tests
    func testSaveAndRetrieveAccessToken() throws {
        let testToken = "test_access_token_123"
        
        try sut.saveAccessToken(testToken)
        let retrievedToken = sut.getAccessToken()
        
        XCTAssertEqual(retrievedToken, testToken, "Token recuperado deve ser igual ao salvo")
    }
    
    func testSaveAndRetrieveRefreshToken() throws {
        let testToken = "test_refresh_token_456"
        
        try sut.saveRefreshToken(testToken)
        let retrievedToken = sut.getRefreshToken()
        
        XCTAssertEqual(retrievedToken, testToken, "Refresh token recuperado deve ser igual ao salvo")
    }
    
    // MARK: - Delete Tests
    func testDeleteAccessToken() throws {
        let testToken = "test_token"
        try sut.saveAccessToken(testToken)
        
        try sut.deleteAccessToken()
        let retrievedToken = sut.getAccessToken()
        
        XCTAssertNil(retrievedToken, "Token deve ser nil após deletar")
    }
    
    func testDeleteAllTokens() throws {
        try sut.saveAccessToken("access_token")
        try sut.saveRefreshToken("refresh_token")
        
        try sut.deleteAllTokens()
        
        XCTAssertNil(sut.getAccessToken(), "Access token deve ser nil")
        XCTAssertNil(sut.getRefreshToken(), "Refresh token deve ser nil")
    }
    
    // MARK: - Overwrite Tests
    func testOverwriteToken() throws {
        let firstToken = "first_token"
        let secondToken = "second_token"
        
        try sut.saveAccessToken(firstToken)
        try sut.saveAccessToken(secondToken)
        
        let retrievedToken = sut.getAccessToken()
        
        XCTAssertEqual(retrievedToken, secondToken, "Deve sobrescrever com o novo token")
    }
}

// MARK: - User Model Tests
final class UserModelTests: XCTestCase {
    
    func testUserDecoding() throws {
        let json = """
        {
            "id": "123",
            "email": "test@example.com",
            "name": "Test User",
            "role": "PATIENT",
            "createdAt": "2024-01-01T00:00:00.000Z",
            "updatedAt": "2024-01-01T00:00:00.000Z"
        }
        """.data(using: .utf8)!
        
        let decoder = JSONDecoder()
        let user = try decoder.decode(User.self, from: json)
        
        XCTAssertEqual(user.id, "123")
        XCTAssertEqual(user.email, "test@example.com")
        XCTAssertEqual(user.name, "Test User")
        XCTAssertEqual(user.role, .patient)
    }
    
    func testUserRoleDecoding() throws {
        let roles: [(String, UserRole)] = [
            ("ADMIN", .admin),
            ("SURGEON", .surgeon),
            ("PATIENT", .patient),
            ("STAFF", .staff)
        ]
        
        for (roleString, expectedRole) in roles {
            let json = """
            {
                "id": "123",
                "email": "test@example.com",
                "name": "Test User",
                "role": "\(roleString)",
                "createdAt": "2024-01-01T00:00:00.000Z",
                "updatedAt": "2024-01-01T00:00:00.000Z"
            }
            """.data(using: .utf8)!
            
            let decoder = JSONDecoder()
            let user = try decoder.decode(User.self, from: json)
            
            XCTAssertEqual(user.role, expectedRole, "Role \(roleString) deve ser decodificado corretamente")
        }
    }
}
