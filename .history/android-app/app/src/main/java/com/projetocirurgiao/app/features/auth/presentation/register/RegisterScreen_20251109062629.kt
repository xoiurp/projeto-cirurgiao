package com.projetocirurgiao.app.features.auth.presentation.register

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.projetocirurgiao.app.R
import com.projetocirurgiao.app.core.components.CirurgiaoButton
import com.projetocirurgiao.app.core.components.CirurgiaoTextField

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RegisterScreen(
    viewModel: RegisterViewModel = hiltViewModel(),
    onNavigateBack: () -> Unit,
    onRegisterSuccess: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var cpf by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    
    LaunchedEffect(uiState.isSuccess) {
        if (uiState.isSuccess) {
            onRegisterSuccess()
        }
    }
    
    val snackbarHostState = remember { SnackbarHostState() }
    LaunchedEffect(uiState.error) {
        uiState.error?.let { error ->
            snackbarHostState.showSnackbar(error)
            viewModel.clearError()
        }
    }
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(stringResource(R.string.register_title)) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Voltar")
                    }
                }
            )
        },
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(24.dp)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            CirurgiaoTextField(
                value = name,
                onValueChange = { name = it },
                label = stringResource(R.string.name),
                leadingIcon = { Icon(Icons.Default.Person, null) },
                imeAction = ImeAction.Next,
                enabled = !uiState.isLoading
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            CirurgiaoTextField(
                value = email,
                onValueChange = { email = it },
                label = stringResource(R.string.email),
                leadingIcon = { Icon(Icons.Default.Email, null) },
                keyboardType = KeyboardType.Email,
                imeAction = ImeAction.Next,
                enabled = !uiState.isLoading
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            CirurgiaoTextField(
                value = password,
                onValueChange = { password = it },
                label = stringResource(R.string.password),
                isPassword = true,
                keyboardType = KeyboardType.Password,
                imeAction = ImeAction.Next,
                enabled = !uiState.isLoading
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            CirurgiaoTextField(
                value = confirmPassword,
                onValueChange = { confirmPassword = it },
                label = stringResource(R.string.confirm_password),
                isPassword = true,
                keyboardType = KeyboardType.Password,
                imeAction = ImeAction.Next,
                enabled = !uiState.isLoading
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            CirurgiaoTextField(
                value = cpf,
                onValueChange = { cpf = it },
                label = stringResource(R.string.cpf_optional),
                keyboardType = KeyboardType.Number,
                imeAction = ImeAction.Next,
                enabled = !uiState.isLoading
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            CirurgiaoTextField(
                value = phone,
                onValueChange = { phone = it },
                label = stringResource(R.string.phone_optional),
                keyboardType = KeyboardType.Phone,
                imeAction = ImeAction.Done,
                enabled = !uiState.isLoading
            )
            
            Spacer(modifier = Modifier.height(32.dp))
            
            CirurgiaoButton(
                text = stringResource(R.string.register_button),
                onClick = {
                    if (password == confirmPassword) {
                        viewModel.register(
                            email = email,
                            password = password,
                            name = name,
                            cpf = cpf.ifBlank { null },
                            phone = phone.ifBlank { null }
                        )
                    }
                },
                enabled = name.isNotBlank() && email.isNotBlank() && 
                         password.isNotBlank() && password == confirmPassword,
                isLoading = uiState.isLoading
            )
        }
    }
}
