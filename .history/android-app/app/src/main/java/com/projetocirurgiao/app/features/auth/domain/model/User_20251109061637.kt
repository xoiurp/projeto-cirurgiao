package com.projetocirurgiao.app.features.auth.domain.model

/**
 * Modelo de domínio do usuário
 */
data class User(
    val id: String,
    val email: String,
    val name: String,
    val cpf: String? = null,
    val phone: String? = null,
    val role: UserRole,
    val createdAt: String? = null,
    val updatedAt: String? = null
)

/**
 * Enum de papéis do usuário
 */
enum class UserRole {
    ADMIN,
    STUDENT,
    INSTRUCTOR;

    companion object {
        fun fromString(value: String): UserRole {
            return when (value.uppercase()) {
                "ADMIN" -> ADMIN
                "STUDENT" -> STUDENT
                "INSTRUCTOR" -> INSTRUCTOR
                else -> STUDENT
            }
        }
    }
}
