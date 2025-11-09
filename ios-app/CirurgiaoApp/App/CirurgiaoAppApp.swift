//
//  CirurgiaoAppApp.swift
//  CirurgiaoApp
//
//  Created by Lucas - iOS Senior Developer
//  Projeto Cirurgião - Semana 2
//

import SwiftUI
import FirebaseCore

@main
struct CirurgiaoAppApp: App {
    @StateObject private var authViewModel = AuthViewModel()
    
    init() {
        // Configurar Firebase
        FirebaseApp.configure()
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(authViewModel)
        }
    }
}
