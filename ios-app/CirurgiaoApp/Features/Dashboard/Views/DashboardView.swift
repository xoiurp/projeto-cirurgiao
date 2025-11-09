//
//  DashboardView.swift
//  CirurgiaoApp
//
//  Created by Lucas - iOS Senior Developer
//  Projeto Cirurgião - Semana 2
//

import SwiftUI

struct DashboardView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Header com informações do usuário
                    VStack(spacing: 12) {
                        Image(systemName: "person.circle.fill")
                            .font(.system(size: 80))
                            .foregroundColor(.blue)
                        
                        if let user = authViewModel.currentUser {
                            Text("Olá, \(user.name)!")
                                .font(.title2)
                                .fontWeight(.bold)
                            
                            Text(user.email)
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                            
                            // Badge do tipo de usuário
                            Text(roleText(user.role))
                                .font(.caption)
                                .fontWeight(.semibold)
                                .padding(.horizontal, 12)
                                .padding(.vertical, 6)
                                .background(roleColor(user.role).opacity(0.2))
                                .foregroundColor(roleColor(user.role))
                                .cornerRadius(12)
                        }
                    }
                    .padding(.top, 20)
                    
                    // Cards de funcionalidades
                    VStack(spacing: 16) {
                        DashboardCard(
                            icon: "calendar",
                            title: "Agendamentos",
                            description: "Gerencie suas consultas",
                            color: .blue
                        )
                        
                        DashboardCard(
                            icon: "person.2.fill",
                            title: "Pacientes",
                            description: "Lista de pacientes",
                            color: .green
                        )
                        
                        DashboardCard(
                            icon: "chart.bar.fill",
                            title: "Relatórios",
                            description: "Visualize estatísticas",
                            color: .orange
                        )
                        
                        DashboardCard(
                            icon: "gear",
                            title: "Configurações",
                            description: "Ajustes do aplicativo",
                            color: .gray
                        )
                    }
                    .padding(.horizontal, 24)
                    
                    Spacer()
                }
            }
            .navigationTitle("Dashboard")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        Task {
                            await authViewModel.logout()
                        }
                    } label: {
                        HStack {
                            Text("Sair")
                            Image(systemName: "rectangle.portrait.and.arrow.right")
                        }
                        .foregroundColor(.red)
                    }
                }
            }
        }
    }
    
    // MARK: - Helper Functions
    private func roleText(_ role: UserRole) -> String {
        switch role {
        case .admin:
            return "Administrador"
        case .surgeon:
            return "Cirurgião"
        case .patient:
            return "Paciente"
        case .staff:
            return "Equipe"
        }
    }
    
    private func roleColor(_ role: UserRole) -> Color {
        switch role {
        case .admin:
            return .purple
        case .surgeon:
            return .blue
        case .patient:
            return .green
        case .staff:
            return .orange
        }
    }
}

// MARK: - Dashboard Card
struct DashboardCard: View {
    let icon: String
    let title: String
    let description: String
    let color: Color
    
    var body: some View {
        Button {
            // Ação do card (implementar navegação depois)
            print("Card tapped: \(title)")
        } label: {
            HStack(spacing: 16) {
                Image(systemName: icon)
                    .font(.system(size: 32))
                    .foregroundColor(color)
                    .frame(width: 60, height: 60)
                    .background(color.opacity(0.1))
                    .cornerRadius(12)
                
                VStack(alignment: .leading, spacing: 4) {
                    Text(title)
                        .font(.headline)
                        .foregroundColor(.primary)
                    
                    Text(description)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                Image(systemName: "chevron.right")
                    .foregroundColor(.secondary)
            }
            .padding()
            .background(Color(.systemBackground))
            .cornerRadius(12)
            .shadow(color: .black.opacity(0.05), radius: 5, x: 0, y: 2)
        }
    }
}

#Preview {
    DashboardView()
        .environmentObject(AuthViewModel())
}
