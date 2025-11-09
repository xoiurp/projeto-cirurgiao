package com.projetocirurgiao.app.features.auth.data.repository

import com.google.gson.Gson
import com.projetocirurgiao.app.core.network.ApiClient
import com.projetocirurgiao.app.core.storage.TokenManager
import com.projetocirurgiao.app.features.auth.data.remote.AuthApi
import com.projetocirurgiao.app.features.auth.data.remote.dto.*
import com.projetocirurgiao.app.features.auth.domain.model.User
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import retrofit2.Response
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Resultado de operações
 */
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val message: String, val code: Int? = null) : Result<Nothing>()
    object Loading : Result<Nothing>()
}

/**
 * Repositório de autenticação
 * Gerencia todas as operações relacionadas à autenticação
 */
@Singleton
class AuthRepository @Inject constructor(
    private val apiClient: ApiClient,
    private val tokenManager: TokenManager
) {
    
    private val authApi: AuthApi = apiClient.createService()
    private val gson = Gson()
    
    /**
     * Realiza login
     */
    fun login(email: String, password: String): Flow<Result<User>> = flow {
        emit(Result.Loading)
        
        try {
            val request = LoginRequest(email, password)
            val response = authApi.login(request)
            
            if (response.isSuccessful && response.body() != null) {
                val authResponse = response.body()!!
                
                // Salva tokens
                tokenManager.saveTokens(
                    authResponse.accessToken,
                    authResponse.refreshToken
                )
                
                // Salva informações do usuário
                val user = authResponse.user.toDomain()
                tokenManager.saveUserInfo(user.id, user.email, user.name)
                
                emit(Result.Success(user))
            } else {
                val errorMessage = parseErrorMessage(response)
                emit(Result.Error(errorMessage, response.code()))
            }
        } catch (e: Exception) {
            emit(Result.Error(e.message ?: "Erro desconhecido"))
        }
    }
    
    /**
     * Realiza registro
     */
    fun register(
        email: String,
        password: String,
        name: String,
        cpf: String? = null,
        phone: String? = null
    ): Flow<Result<User>> = flow {
        emit(Result.Loading)
        
        try {
            val request = RegisterRequest(
                email = email,
                password = password,
                name = name,
                cpf = cpf,
                phone = phone
            )
            val response = authApi.register(request)
            
            if (response.isSuccessful && response.body() != null) {
                val authResponse = response.body()!!
                
                // Salva tokens
                tokenManager.saveTokens(
                    authResponse.accessToken,
                    authResponse.refreshToken
                )
                
                // Salva informações do usuário
                val user = authResponse.user.toDomain()
                tokenManager.saveUserInfo(user.id, user.email, user.name)
                
                emit(Result.Success(user))
            } else {
                val errorMessage = parseErrorMessage(response)
                emit(Result.Error(errorMessage, response.code()))
            }
        } catch (e: Exception) {
            emit(Result.Error(e.message ?: "Erro desconhecido"))
        }
    }
    
    /**
     * Solicita recuperação de senha
     */
    fun forgotPassword(email: String): Flow<Result<Unit>> = flow {
        emit(Result.Loading)
        
        try {
            val request = ForgotPasswordRequest(email)
            val response = authApi.forgotPassword(request)
            
            if (response.isSuccessful) {
                emit(Result.Success(Unit))
            } else {
                val errorMessage = parseErrorMessage(response)
                emit(Result.Error(errorMessage, response.code()))
            }
        } catch (e: Exception) {
            emit(Result.Error(e.message ?: "Erro desconhecido"))
        }
    }
    
    /**
     * Atualiza o access token usando refresh token
     */
    suspend fun refreshToken(): Result<Unit> {
        return try {
            val refreshToken = tokenManager.getRefreshToken()
            
            if (refreshToken == null) {
                return Result.Error("Refresh token não encontrado")
            }
            
            val request = RefreshTokenRequest(refreshToken)
            val response = authApi.refreshToken(request)
            
            if (response.isSuccessful && response.body() != null) {
                val authResponse = response.body()!!
                
                // Atualiza tokens
                tokenManager.saveTokens(
                    authResponse.accessToken,
                    authResponse.refreshToken
                )
                
                Result.Success(Unit)
            } else {
                val errorMessage = parseErrorMessage(response)
                Result.Error(errorMessage, response.code())
            }
        } catch (e: Exception) {
            Result.Error(e.message ?: "Erro desconhecido")
        }
    }
    
    /**
     * Obtém dados do usuário autenticado
     */
    fun getCurrentUser(): Flow<Result<User>> = flow {
        emit(Result.Loading)
        
        try {
            val token = tokenManager.getAccessToken()
            
            if (token == null) {
                emit(Result.Error("Token não encontrado"))
                return@flow
            }
            
            val response = authApi.getCurrentUser("Bearer $token")
            
            if (response.isSuccessful && response.body() != null) {
                val user = response.body()!!.toDomain()
                
                // Atualiza informações do usuário
                tokenManager.saveUserInfo(user.id, user.email, user.name)
                
                emit(Result.Success(user))
            } else {
                val errorMessage = parseErrorMessage(response)
                emit(Result.Error(errorMessage, response.code()))
            }
        } catch (e: Exception) {
            emit(Result.Error(e.message ?: "Erro desconhecido"))
        }
    }
    
    /**
     * Realiza logout
     */
    suspend fun logout(): Result<Unit> {
        return try {
            val token = tokenManager.getAccessToken()
            
            if (token != null) {
                authApi.logout("Bearer $token")
            }
            
            // Limpa tokens localmente independente da resposta da API
            tokenManager.clearTokens()
            
            Result.Success(Unit)
        } catch (e: Exception) {
            // Mesmo com erro, limpa tokens localmente
            tokenManager.clearTokens()
            Result.Success(Unit)
        }
    }
    
    /**
     * Verifica se o usuário está autenticado
     */
    suspend fun isAuthenticated(): Boolean {
        return tokenManager.isAuthenticated()
    }
    
    /**
     * Flow que indica se o usuário está autenticado
     */
    fun isAuthenticatedFlow(): Flow<Boolean> {
        return tokenManager.isAuthenticatedFlow()
    }
    
    /**
     * Extrai mensagem de erro da resposta
     */
    private fun <T> parseErrorMessage(response: Response<T>): String {
        return try {
            val errorBody = response.errorBody()?.string()
            if (errorBody != null) {
                val errorResponse = gson.fromJson(errorBody, ErrorResponse::class.java)
                errorResponse.message
            } else {
                "Erro desconhecido"
            }
        } catch (e: Exception) {
            "Erro ao processar resposta"
        }
    }
}
