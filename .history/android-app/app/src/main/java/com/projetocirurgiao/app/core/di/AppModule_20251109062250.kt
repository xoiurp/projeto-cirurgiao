package com.projetocirurgiao.app.core.di

import android.content.Context
import com.projetocirurgiao.app.core.network.ApiClient
import com.projetocirurgiao.app.core.storage.TokenManager
import com.projetocirurgiao.app.features.auth.data.remote.AuthApi
import com.projetocirurgiao.app.features.auth.data.repository.AuthRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

/**
 * Módulo Hilt para prover dependências da aplicação
 */
@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    
    /**
     * Provê o TokenManager como singleton
     */
    @Provides
    @Singleton
    fun provideTokenManager(
        @ApplicationContext context: Context
    ): TokenManager {
        return TokenManager(context)
    }
    
    /**
     * Provê o ApiClient como singleton
     */
    @Provides
    @Singleton
    fun provideApiClient(
        tokenManager: TokenManager
    ): ApiClient {
        return ApiClient(tokenManager)
    }
    
    /**
     * Provê a interface AuthApi
     */
    @Provides
    @Singleton
    fun provideAuthApi(
        apiClient: ApiClient
    ): AuthApi {
        return apiClient.createService()
    }
    
    /**
     * Provê o AuthRepository
     */
    @Provides
    @Singleton
    fun provideAuthRepository(
        authApi: AuthApi,
        tokenManager: TokenManager
    ): AuthRepository {
        return AuthRepository(authApi, tokenManager)
    }
}
