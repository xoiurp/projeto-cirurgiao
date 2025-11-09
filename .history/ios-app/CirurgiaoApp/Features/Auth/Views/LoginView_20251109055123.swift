//
//  LoginView.swift
//  CirurgiaoApp
//
//  Created by Lucas - iOS Senior Developer
//  Projeto Cirurgião - Semana 2
//

import SwiftUI

struct LoginView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    @State private var email = ""
    @State private var password = ""
    @State private var showPassword = false
    @State private var navigateToRegister = false
    @State private var navigateToForgotPassword = false
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Logo e Título
                    VStack(spacing: 16) {
                        Image(systemName: "cross.case.fill")
                            .font(.system(size: 80))
                            .foregroundColor(.blue)
                        
                        Text("Projeto Cirurgião")
                            .font(.title)
                            .fontWeight(.bold)
                        
                        Text("Faça login para continuar")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                    .padding(.top, 40)
                    .padding(.bottom, 20)
                    
                    // Formulário
                    VStack(spacing: 16) {
                        // Email
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Email")
                                .font(.subheadline)
                                .fontWeight(.medium)
                            
                            TextField("seu@email.com", text: $email)
                                .textFieldStyle(.roundedBorder)
                                .textContentType(.emailAddress)
                                .autocapitalization(.none)
                                .keyboardType(.emailAddress)
                        }
                        
                        // Senha
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Senha")
                                .font(.subheadline)
                                .fontWeight(.medium)
                            
                            HStack {
                                if showPassword {
                                    TextField("Sua senha", text: $password)
                                        .textContentType(.password)
                                } else {
                                    SecureField("Sua senha", text: $password)
                                        .textContentType(.password)
                                }
                                
                                Button {
                                    showPassword.toggle()
                                } label: {
                                    Image(systemName: showPassword ? "eye.slash" : "eye")
                                        .foregroundColor(.secondary)
                                }
                            }
                            .padding(12)
                            .background(Color(.systemGray6))
                            .cornerRadius(8)
                        }
                        
                        // Esqueci a senha
                        HStack {
                            Spacer()
                            Button {
                                navigateToForgotPassword = true
                            } label: {
                                Text("Esqueci minha senha")
                                    .font(.subheadline)
                                    .foregroundColor(.blue)
                            }
                        }
                    }
                    .padding(.horizontal, 24)
                    
                    // Mensagem de erro
                    if let errorMessage = authViewModel.errorMessage {
                        Text(errorMessage)
                            .font(.caption)
                            .foregroundColor(.red)
                            .padding(.horizontal, 24)
                    }
                    
                    // Botão de Login
                    Button {
                        Task {
                            await authViewModel.login(email: email, password: password)
                        }
                    } label: {
                        HStack {
                            if authViewModel.isLoading {
                                ProgressView()
                                    .progressViewStyle(CircularProgressViewStyle(tint: .white))
                            } else {
                                Text("Entrar")
                                    .fontWeight(.semibold)
                            }
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(12)
                    }
                    .disabled(authViewModel.isLoading || email.isEmpty || password.isEmpty)
                    .padding(.horizontal, 24)
                    
                    // Divider
                    HStack {
                        Rectangle()
                            .frame(height: 1)
                            .foregroundColor(.secondary.opacity(0.3))
                        
                        Text("ou")
                            .font(.caption)
                            .foregroundColor(.secondary)
                            .padding(.horizontal, 8)
                        
                        Rectangle()
                            .frame(height: 1)
                            .foregroundColor(.secondary.opacity(0.3))
                    }
                    .padding(.horizontal, 24)
                    
                    // Botão de Registro
                    Button {
                        navigateToRegister = true
                    } label: {
                        Text("Criar nova conta")
                            .fontWeight(.semibold)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color(.systemGray6))
                            .foregroundColor(.blue)
                            .cornerRadius(12)
                    }
                    .padding(.horizontal, 24)
                    
                    Spacer()
                }
            }
            .navigationDestination(isPresented: $navigateToRegister) {
                RegisterView()
            }
            .navigationDestination(isPresented: $navigateToForgotPassword) {
                ForgotPasswordView()
            }
        }
    }
}

#Preview {
    LoginView()
        .environmentObject(AuthViewModel())
}
