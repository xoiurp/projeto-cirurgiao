package com.projetocirurgiao.app.features.auth.presentation.forgot

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.projetocirurgiao.app.features.auth.data.repository.AuthRepository
import com.projetocirurgiao.app.features.auth.data.repository.Result
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/**
 * Estados da UI de recuperação de senha
 */
data class ForgotPasswordUiState(
    val isLoading: Boolean = false,
    val message: String? = null,
    val error: String? = null,
    val isSuccess: Boolean = false
)

/**
 * ViewModel para a tela de recuperação de senha
 */
class ForgotPasswordViewModel(
    private val authRepository: AuthRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(ForgotPasswordUiState())
    val uiState: StateFlow<ForgotPasswordUiState> = _uiState.asStateFlow()
    
    /**
     * Solicita recuperação de senha
     */
    fun forgotPassword(email: String) {
        viewModelScope.launch {
            _uiState.value = ForgotPasswordUiState(isLoading = true)
            
            authRepository.forgotPassword(email).collect { result ->
                when (result) {
                    is Result.Success -> {
                        _uiState.value = ForgotPasswordUiState(
                            isLoading = false,
                            message = "E-mail enviado com sucesso",
                            isSuccess = true
                        )
                    }
                    is Result.Error -> {
                        _uiState.value = ForgotPasswordUiState(
                            isLoading = false,
                            error = result.message
                        )
                    }
                    is Result.Loading -> {
                        _uiState.value = ForgotPasswordUiState(isLoading = true)
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
        _uiState.value = ForgotPasswordUiState()
    }
}
