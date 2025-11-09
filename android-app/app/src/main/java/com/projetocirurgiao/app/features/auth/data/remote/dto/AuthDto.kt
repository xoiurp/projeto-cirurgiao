package com.projetocirurgiao.app.features.auth.data.remote.dto

import com.google.gson.annotations.SerializedName
import com.projetocirurgiao.app.features.auth.domain.model.User
import com.projetocirurgiao.app.features.auth.domain.model.UserRole

/**
 * DTO para requisição de login
 */
data class LoginRequest(
    @SerializedName("email")
    val email: String,
    
    @SerializedName("password")
    val password: String
)

/**
 * DTO para requisição de registro
 */
data class RegisterRequest(
    @SerializedName("email")
    val email: String,
    
    @SerializedName("password")
    val password: String,
    
    @SerializedName("name")
    val name: String,
    
    @SerializedName("cpf")
    val cpf: String? = null,
    
    @SerializedName("phone")
    val phone: String? = null,
    
    @SerializedName("role")
    val role: String = "STUDENT"
)

/**
 * DTO para requisição de recuperação de senha
 */
data class ForgotPasswordRequest(
    @SerializedName("email")
    val email: String
)

/**
 * DTO para requisição de refresh token
 */
data class RefreshTokenRequest(
    @SerializedName("refreshToken")
    val refreshToken: String
)

/**
 * DTO para resposta de autenticação
 */
data class AuthResponse(
    @SerializedName("accessToken")
    val accessToken: String,
    
    @SerializedName("refreshToken")
    val refreshToken: String,
    
    @SerializedName("user")
    val user: UserDto
)

/**
 * DTO do usuário
 */
data class UserDto(
    @SerializedName("id")
    val id: String,
    
    @SerializedName("email")
    val email: String,
    
    @SerializedName("name")
    val name: String,
    
    @SerializedName("cpf")
    val cpf: String? = null,
    
    @SerializedName("phone")
    val phone: String? = null,
    
    @SerializedName("role")
    val role: String,
    
    @SerializedName("createdAt")
    val createdAt: String? = null,
    
    @SerializedName("updatedAt")
    val updatedAt: String? = null
) {
    /**
     * Converte DTO para modelo de domínio
     */
    fun toDomain(): User {
        return User(
            id = id,
            email = email,
            name = name,
            cpf = cpf,
            phone = phone,
            role = UserRole.fromString(role),
            createdAt = createdAt,
            updatedAt = updatedAt
        )
    }
}

/**
 * DTO para resposta de erro da API
 */
data class ErrorResponse(
    @SerializedName("message")
    val message: String,
    
    @SerializedName("statusCode")
    val statusCode: Int? = null,
    
    @SerializedName("error")
    val error: String? = null
)
