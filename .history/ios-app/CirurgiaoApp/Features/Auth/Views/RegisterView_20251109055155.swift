//
//  RegisterView.swift
//  CirurgiaoApp
//
//  Created by Lucas - iOS Senior Developer
//  Projeto Cirurgião - Semana 2
//

import SwiftUI

struct RegisterView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    @Environment(\.dismiss) var dismiss
    
    @State private var name = ""
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var selectedRole: UserRole = .patient
    @State private var showPassword = false
    @State private var showConfirmPassword = false
    @State private var validationError: String?
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Título
                VStack(spacing: 8) {
                    Text("Criar Conta")
                        .font(.title)
                        .fontWeight(.bold)
                    
                    Text("Preencha os dados abaixo")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                .padding(.top, 20)
                
                // Formulário
                VStack(spacing: 16) {
                    // Nome
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Nome Completo")
                            .font(.subheadline)
                            .fontWeight(.medium)
                        
                        TextField("Seu nome", text: $name)
                            .textFieldStyle(.roundedBorder)
                            .textContentType(.name)
                    }
                    
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
                    
                    // Tipo de Usuário
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Tipo de Usuário")
                            .font(.subheadline)
                            .fontWeight(.medium)
                        
                        Picker("Tipo", selection: $selectedRole) {
                            Text("Paciente").tag(UserRole.patient)
                            Text("Cirurgião").tag(UserRole.surgeon)
                            Text("Equipe").tag(UserRole.staff)
                        }
                        .pickerStyle(.segmented)
                    }
                    
                    // Senha
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Senha")
                            .font(.subheadline)
                            .fontWeight(.medium)
                        
                        HStack {
                            if showPassword {
                                TextField("Mínimo 6 caracteres", text: $password)
                                    .textContentType(.newPassword)
                            } else {
                                SecureField("Mínimo 6 caracteres", text: $password)
                                    .textContentType(.newPassword)
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
                    
                    // Confirmar Senha
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Confirmar Senha")
                            .font(.subheadline)
                            .fontWeight(.medium)
                        
                        HStack {
                            if showConfirmPassword {
                                TextField("Digite a senha novamente", text: $confirmPassword)
                                    .textContentType(.newPassword)
                            } else {
                                SecureField("Digite a senha novamente", text: $confirmPassword)
                                    .textContentType(.newPassword)
                            }
                            
                            Button {
                                showConfirmPassword.toggle()
                            } label: {
                                Image(systemName: showConfirmPassword ? "eye.slash" : "eye")
                                    .foregroundColor(.secondary)
                            }
                        }
                        .padding(12)
                        .background(Color(.systemGray6))
                        .cornerRadius(8)
                    }
                }
                .padding(.horizontal, 24)
                
                // Mensagem de erro de validação
                if let validationError = validationError {
                    Text(validationError)
                        .font(.caption)
                        .foregroundColor(.red)
                        .padding(.horizontal, 24)
                }
                
                // Mensagem de erro da API
                if let errorMessage = authViewModel.errorMessage {
                    Text(errorMessage)
                        .font(.caption)
                        .foregroundColor(.red)
                        .padding(.horizontal, 24)
                }
                
                // Botão de Registro
                Button {
                    if validateForm() {
                        Task {
                            await authViewModel.register(
                                email: email,
                                password: password,
                                name: name,
                                role: selectedRole
                            )
                        }
                    }
                } label: {
                    HStack {
                        if authViewModel.isLoading {
                            ProgressView()
                                .progressViewStyle(CircularProgressViewStyle(tint: .white))
                        } else {
                            Text("Criar Conta")
                                .fontWeight(.semibold)
                        }
                    }
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(12)
                }
                .disabled(authViewModel.isLoading || !isFormValid)
                .padding(.horizontal, 24)
                
                // Botão Voltar
                Button {
                    dismiss()
                } label: {
                    Text("Já tenho uma conta")
                        .font(.subheadline)
                        .foregroundColor(.blue)
                }
                
                Spacer()
            }
        }
        .navigationBarBackButtonHidden(true)
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                Button {
                    dismiss()
                } label: {
                    HStack {
                        Image(systemName: "chevron.left")
                        Text("Voltar")
                    }
                }
            }
        }
    }
    
    // MARK: - Validation
    private var isFormValid: Bool {
        !name.isEmpty && !email.isEmpty && !password.isEmpty && !confirmPassword.isEmpty
    }
    
    private func validateForm() -> Bool {
        validationError = nil
        
        // Validar nome
        if name.trimmingCharacters(in: .whitespaces).isEmpty {
            validationError = "Nome é obrigatório"
            return false
        }
        
        // Validar email
        if !email.contains("@") || !email.contains(".") {
            validationError = "Email inválido"
            return false
        }
        
        // Validar senha
        if password.count < 6 {
            validationError = "Senha deve ter no mínimo 6 caracteres"
            return false
        }
        
        // Validar confirmação de senha
        if password != confirmPassword {
            validationError = "As senhas não coincidem"
            return false
        }
        
        return true
    }
}

#Preview {
    NavigationStack {
        RegisterView()
            .environmentObject(AuthViewModel())
    }
}
