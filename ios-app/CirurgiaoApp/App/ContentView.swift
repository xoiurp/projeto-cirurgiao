//
//  ContentView.swift
//  CirurgiaoApp
//
//  Created by Lucas - iOS Senior Developer
//  Projeto Cirurgião - Semana 2
//

import SwiftUI

struct ContentView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    
    var body: some View {
        Group {
            if authViewModel.isLoading {
                // Tela de loading
                LoadingView()
            } else if authViewModel.isAuthenticated {
                // Usuário autenticado - mostrar dashboard
                DashboardView()
            } else {
                // Usuário não autenticado - mostrar login
                LoginView()
            }
        }
    }
}

// MARK: - Loading View
struct LoadingView: View {
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "cross.case.fill")
                .font(.system(size: 80))
                .foregroundColor(.blue)
            
            Text("Projeto Cirurgião")
                .font(.title)
                .fontWeight(.bold)
            
            ProgressView()
                .progressViewStyle(CircularProgressViewStyle(tint: .blue))
                .scaleEffect(1.5)
        }
    }
}

#Preview {
    ContentView()
        .environmentObject(AuthViewModel())
}
