package com.projetocirurgiao.app.features.auth.presentation.forgot

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Email
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.projetocirurgiao.app.R
import org.koin.androidx.compose.koinViewModel
import com.projetocirurgiao.app.core.components.CirurgiaoButton
import com.projetocirurgiao.app.core.components.CirurgiaoTextField

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ForgotPasswordScreen(
    viewModel: ForgotPasswordViewModel = koinViewModel(),
    onNavigateBack: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    var email by remember { mutableStateOf("") }
    
    val snackbarHostState = remember { SnackbarHostState() }
    
    LaunchedEffect(uiState.error) {
        uiState.error?.let { error ->
            snackbarHostState.showSnackbar(error)
            viewModel.clearError()
        }
    }
    
    LaunchedEffect(uiState.message) {
        uiState.message?.let { message ->
            snackbarHostState.showSnackbar(message)
        }
    }
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(stringResource(R.string.forgot_password_title)) },
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
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = stringResource(R.string.forgot_password_description),
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center
            )
            
            Spacer(modifier = Modifier.height(32.dp))
            
            CirurgiaoTextField(
                value = email,
                onValueChange = { email = it },
                label = stringResource(R.string.email),
                placeholder = stringResource(R.string.email_placeholder),
                leadingIcon = { Icon(Icons.Default.Email, null) },
                keyboardType = KeyboardType.Email,
                imeAction = ImeAction.Done,
                onImeAction = {
                    if (email.isNotBlank()) {
                        viewModel.forgotPassword(email)
                    }
                },
                enabled = !uiState.isLoading
            )
            
            Spacer(modifier = Modifier.height(24.dp))
            
            CirurgiaoButton(
                text = stringResource(R.string.send_reset_link),
                onClick = { viewModel.forgotPassword(email) },
                enabled = email.isNotBlank(),
                isLoading = uiState.isLoading
            )
            
            if (uiState.isSuccess) {
                Spacer(modifier = Modifier.height(16.dp))
                
                TextButton(onClick = onNavigateBack) {
                    Text(stringResource(R.string.back_to_login))
                }
            }
        }
    }
}
