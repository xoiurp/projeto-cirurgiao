package com.projetocirurgiao.app.features.auth.data.remote

import com.projetocirurgiao.app.features.auth.data.remote.dto.*
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST

/**
 * Interface da API de autenticação
 */
interface AuthApi {
    
    /**
     * Realiza login
     */
    @POST("auth/login")
    suspend fun login(
        @Body request: LoginRequest
    ): Response<AuthResponse>
    
    /**
     * Realiza registro
     */
    @POST("auth/register")
    suspend fun register(
        @Body request: RegisterRequest
    ): Response<AuthResponse>
    
    /**
     * Solicita recuperação de senha
     */
    @POST("auth/forgot-password")
    suspend fun forgotPassword(
        @Body request: ForgotPasswordRequest
    ): Response<Unit>
    
    /**
     * Atualiza o access token usando refresh token
     */
    @POST("auth/refresh")
    suspend fun refreshToken(
        @Body request: RefreshTokenRequest
    ): Response<AuthResponse>
    
    /**
     * Obtém dados do usuário autenticado
     */
    @GET("auth/me")
    suspend fun getCurrentUser(
        @Header("Authorization") token: String
    ): Response<UserDto>
    
    /**
     * Realiza logout
     */
    @POST("auth/logout")
    suspend fun logout(
        @Header("Authorization") token: String
    ): Response<Unit>
}
