package com.projetocirurgiao.app.features.auth.presentation.login

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.projetocirurgiao.app.features.auth.data.repository.AuthRepository
import com.projetocirurgiao.app.features.auth.data.repository.Result
import com.projetocirurgiao.app.features.auth.domain.model.User
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/**
 * Estado da UI de Login
 */
data class LoginUiState(
    val isLoading: Boolean = false,
    val user: User? = null,
    val error: String? = null,
    val isSuccess: Boolean = false
)

/**
 * ViewModel para tela de Login
 */
class LoginViewModel(
    private val authRepository: AuthRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(LoginUiState())
    val uiState: StateFlow<LoginUiState> = _uiState.asStateFlow()
    
    /**
     * Realiza login
     */
    fun login(email: String, password: String) {
        viewModelScope.launch {
            authRepository.login(email, password).collect { result ->
                when (result) {
                    is Result.Loading -> {
                        _uiState.value = LoginUiState(isLoading = true)
                    }
                    is Result.Success -> {
                        _uiState.value = LoginUiState(
                            isLoading = false,
                            user = result.data,
                            isSuccess = true
                        )
                    }
                    is Result.Error -> {
                        _uiState.value = LoginUiState(
                            isLoading = false,
                            error = result.message
                        )
                    }
                }
            }
        }
    }
    
    /**
     * Limpa o erro
     */
    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }
    
    /**
     * Reseta o estado
     */
    fun resetState() {
        _uiState.value = LoginUiState()
    }
}
