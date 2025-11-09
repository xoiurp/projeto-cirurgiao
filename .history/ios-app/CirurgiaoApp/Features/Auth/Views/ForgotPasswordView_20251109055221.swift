//
//  ForgotPasswordView.swift
//  CirurgiaoApp
//
//  Created by Lucas - iOS Senior Developer
//  Projeto Cirurgião - Semana 2
//

import SwiftUI

struct ForgotPasswordView: View {
    @Environment(\.dismiss) var dismiss
    @State private var email = ""
    @State private var isLoading = false
    @State private var showSuccessMessage = false
    @State private var errorMessage: String?
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Ícone e Título
                VStack(spacing: 16) {
                    Image(systemName: "lock.rotation")
                        .font(.system(size: 60))
                        .foregroundColor(.blue)
                    
                    Text("Esqueceu a Senha?")
                        .font(.title)
                        .fontWeight(.bold)
                    
                    Text("Digite seu email para receber instruções de recuperação")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 24)
                }
                .padding(.top, 40)
                .padding(.bottom, 20)
                
                // Formulário
                VStack(spacing: 16) {
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
                }
                .padding(.horizontal, 24)
                
                // Mensagem de sucesso
                if showSuccessMessage {
                    VStack(spacing: 8) {
                        HStack {
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundColor(.green)
                            Text("Email enviado com sucesso!")
                                .font(.subheadline)
                                .foregroundColor(.green)
                        }
                        
                        Text("Verifique sua caixa de entrada")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    .padding()
                    .background(Color.green.opacity(0.1))
                    .cornerRadius(8)
                    .padding(.horizontal, 24)
                }
                
                // Mensagem de erro
                if let errorMessage = errorMessage {
                    Text(errorMessage)
                        .font(.caption)
                        .foregroundColor(.red)
                        .padding(.horizontal, 24)
                }
                
                // Botão de Enviar
                Button {
                    sendResetEmail()
                } label: {
                    HStack {
                        if isLoading {
                            ProgressView()
                                .progressViewStyle(CircularProgressViewStyle(tint: .white))
                        } else {
                            Text("Enviar Email")
                                .fontWeight(.semibold)
                        }
                    }
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(12)
                }
                .disabled(isLoading || email.isEmpty)
                .padding(.horizontal, 24)
                
                // Botão Voltar
                Button {
                    dismiss()
                } label: {
                    Text("Voltar para o login")
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
    
    // MARK: - Send Reset Email
    private func sendResetEmail() {
        // Validar email
        guard email.contains("@") && email.contains(".") else {
            errorMessage = "Email inválido"
            return
        }
        
        isLoading = true
        errorMessage = nil
        showSuccessMessage = false
        
        // Simular envio de email (implementar integração real depois)
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            isLoading = false
            showSuccessMessage = true
            
            // Voltar para login após 3 segundos
            DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
                dismiss()
            }
        }
        
        print("📧 Email de recuperação enviado para: \(email)")
    }
}

#Preview {
    NavigationStack {
        ForgotPasswordView()
    }
}
