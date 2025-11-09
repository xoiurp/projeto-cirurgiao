package com.projetocirurgiao.app.features.auth.presentation.login

import com.projetocirurgiao.app.features.auth.data.repository.AuthRepository
import com.projetocirurgiao.app.features.auth.domain.model.User
import com.projetocirurgiao.app.features.auth.domain.model.UserRole
import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.test.*
import org.junit.After
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test

/**
 * Testes unitários para LoginViewModel
 */
@OptIn(ExperimentalCoroutinesApi::class)
class LoginViewModelTest {
    
    private lateinit var viewModel: LoginViewModel
    private lateinit var authRepository: AuthRepository
    private val testDispatcher = StandardTestDispatcher()
    
    @Before
    fun setup() {
        Dispatchers.setMain(testDispatcher)
        authRepository = mockk()
        viewModel = LoginViewModel(authRepository)
    }
    
    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }
    
    @Test
    fun `login com sucesso atualiza estado corretamente`() = runTest {
        // Arrange
        val email = "test@example.com"
        val password = "password123"
        val mockUser = User(
            id = "1",
            email = email,
            name = "Test User",
            role = UserRole.PATIENT,
            cpf = null,
            phone = null,
            createdAt = "2024-01-01T00:00:00Z",
            updatedAt = "2024-01-01T00:00:00Z"
        )
        
        coEvery { 
            authRepository.login(email, password) 
        } returns flowOf(Result.success(mockUser))
        
        // Act
        viewModel.login(email, password)
        advanceUntilIdle()
        
        // Assert
        val state = viewModel.uiState.value
        assertTrue(state.isSuccess)
        assertEquals(mockUser, state.user)
        assertNull(state.error)
        assertFalse(state.isLoading)
    }
    
    @Test
    fun `login com erro atualiza estado com mensagem de erro`() = runTest {
        // Arrange
        val email = "test@example.com"
        val password = "wrongpassword"
        val errorMessage = "Credenciais inválidas"
        
        coEvery { 
            authRepository.login(email, password) 
        } returns flowOf(Result.failure(Exception(errorMessage)))
        
        // Act
        viewModel.login(email, password)
        advanceUntilIdle()
        
        // Assert
        val state = viewModel.uiState.value
        assertFalse(state.isSuccess)
        assertNull(state.user)
        assertEquals(errorMessage, state.error)
        assertFalse(state.isLoading)
    }
    
    @Test
    fun `clearError limpa mensagem de erro`() = runTest {
        // Arrange
        val email = "test@example.com"
        val password = "wrongpassword"
        
        coEvery { 
            authRepository.login(email, password) 
        } returns flowOf(Result.failure(Exception("Erro")))
        
        viewModel.login(email, password)
        advanceUntilIdle()
        
        // Act
        viewModel.clearError()
        
        // Assert
        assertNull(viewModel.uiState.value.error)
    }
}
