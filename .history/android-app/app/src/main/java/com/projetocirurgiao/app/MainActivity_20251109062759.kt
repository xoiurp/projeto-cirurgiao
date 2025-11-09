package com.projetocirurgiao.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.*
import androidx.navigation.compose.rememberNavController
import com.projetocirurgiao.app.core.navigation.NavGraph
import com.projetocirurgiao.app.core.navigation.Screen
import com.projetocirurgiao.app.core.theme.CirurgiaoAppTheme
import com.projetocirurgiao.app.features.auth.data.repository.AuthRepository
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * Activity principal do aplicativo
 */
@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    
    @Inject
    lateinit var authRepository: AuthRepository
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        setContent {
            CirurgiaoAppTheme {
                val navController = rememberNavController()
                var startDestination by remember { mutableStateOf<String?>(null) }
                val scope = rememberCoroutineScope()
                
                // Verifica se o usuário está autenticado
                LaunchedEffect(Unit) {
                    scope.launch {
                        startDestination = if (authRepository.isAuthenticated()) {
                            Screen.Dashboard.route
                        } else {
                            Screen.Login.route
                        }
                    }
                }
                
                // Aguarda a verificação de autenticação
                startDestination?.let { destination ->
                    NavGraph(
                        navController = navController,
                        startDestination = destination
                    )
                }
            }
        }
    }
}
