package com.projetocirurgiao.app.core.di

import com.projetocirurgiao.app.core.network.ApiClient
import com.projetocirurgiao.app.core.storage.TokenManager
import com.projetocirurgiao.app.features.auth.data.repository.AuthRepository
import com.projetocirurgiao.app.features.auth.presentation.forgot.ForgotPasswordViewModel
import com.projetocirurgiao.app.features.auth.presentation.login.LoginViewModel
import com.projetocirurgiao.app.features.auth.presentation.register.RegisterViewModel
import org.koin.androidx.viewmodel.dsl.viewModel
import org.koin.dsl.module

/**
 * Módulo Koin para prover dependências da aplicação
 */
val appModule = module {
    
    // Storage
    single { TokenManager(get()) }
    
    // Network
    single { ApiClient(get()) }
    single { get<ApiClient>().createService() }
    
    // Repositories
    single { AuthRepository(get(), get()) }
    
    // ViewModels
    viewModel { LoginViewModel(get()) }
    viewModel { RegisterViewModel(get()) }
    viewModel { ForgotPasswordViewModel(get()) }
}
