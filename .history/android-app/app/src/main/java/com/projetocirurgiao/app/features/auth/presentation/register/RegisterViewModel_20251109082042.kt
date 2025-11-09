package com.projetocirurgiao.app.features.auth.presentation.register

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.projetocirurgiao.app.features.auth.data.repository.AuthRepository
import com.projetocirurgiao.app.features.auth.domain.model.User
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/**
 * Estados da UI de registro
 */
data class RegisterUiState(
    val isLoading: Boolean = false,
    val user: User? = null,
    val error: String? = null,
    val isSuccess: Boolean = false
)

/**
 * ViewModel para a tela de registro
 */
class RegisterViewModel(
    private val authRepository: AuthRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(RegisterUiState())
    val uiState: StateFlow<RegisterUiState> = _uiState.asStateFlow()
    
    /**
     * Registra um novo usuário
     */
    fun register(
        email: String,
        password: String,
        name: String,
        cpf: String? = null,
        phone: String? = null
    ) {
        viewModelScope.launch {
            authRepository.register(
                email = email,
                password = password,
                name = name,
                cpf = cpf,
                phone = phone
            ).collect { result ->
                when {
                    result.isSuccess -> {
                        _uiState.value = RegisterUiState(
                            isLoading = false,
                            user = result.getOrNull(),
                            isSuccess = true
                        )
                    }
                    result.isFailure -> {
                        _uiState.value = RegisterUiState(
                            isLoading = false,
                            error = result.exceptionOrNull()?.message ?: "Erro ao registrar usuário"
                        )
                    }
                }
            }
        }
    }
    
    /**
     * Limpa o estado de erro
     */
    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }
    
    /**
     * Reseta o estado
     */
    fun resetState() {
        _uiState.value = RegisterUiState()
    }
}
