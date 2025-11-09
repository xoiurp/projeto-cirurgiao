# 📱 Cirurgião App - Android

Aplicativo Android nativo do Projeto Cirurgião desenvolvido com Kotlin, Jetpack Compose e arquitetura MVVM.

## 📋 Índice

- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Configuração](#configuração)
- [Desenvolvimento](#desenvolvimento)
- [Testes](#testes)
- [Build e Deploy](#build-e-deploy)

## 🚀 Tecnologias

### Core
- **Kotlin 1.9.20** - Linguagem de programação
- **Jetpack Compose 1.5.4** - UI moderna e declarativa
- **Android SDK 34** - API Level 34 (Android 14)
- **Min SDK 24** - Suporte a Android 7.0+

### Arquitetura e Padrões
- **MVVM** - Model-View-ViewModel
- **Clean Architecture** - Separação em camadas
- **Repository Pattern** - Abstração de dados
- **Dependency Injection** - Hilt/Dagger

### Networking
- **Retrofit 2.9.0** - Cliente HTTP
- **OkHttp 4.12.0** - Interceptors e logging
- **Gson** - Serialização JSON

### Storage
- **DataStore** - Armazenamento de preferências
- **Encrypted SharedPreferences** - Dados sensíveis

### Firebase
- **Firebase Analytics** - Análise de uso
- **Firebase Crashlytics** - Relatórios de crash
- **Firebase Cloud Messaging** - Notificações push

### Testing
- **JUnit 4** - Testes unitários
- **Mockk** - Mocking para Kotlin
- **Turbine** - Testes de Flow
- **Espresso** - Testes de UI

## 🏗️ Arquitetura

O projeto segue Clean Architecture com MVVM:

```
app/
├── features/           # Features do app
│   └── auth/          # Feature de autenticação
│       ├── domain/    # Regras de negócio
│       │   └── model/ # Modelos de domínio
│       ├── data/      # Camada de dados
│       │   ├── remote/    # API
│       │   └── repository/ # Repositórios
│       └── presentation/  # UI
│           ├── login/     # Tela de login
│           ├── register/  # Tela de registro
│           └── forgot/    # Recuperação de senha
└── core/              # Funcionalidades compartilhadas
    ├── network/       # Configuração de rede
    ├── storage/       # Armazenamento local
    └── di/            # Dependency Injection
```

## 📁 Estrutura do Projeto

### ✅ Arquivos Implementados

#### Configuração
- `build.gradle` - Configuração do projeto
- `app/build.gradle` - Configuração do módulo
- `settings.gradle` - Configuração de módulos
- `gradle.properties` - Propriedades do Gradle
- `proguard-rules.pro` - Regras de ofuscação

#### Recursos
- `res/values/strings.xml` - Strings do app
- `res/values/colors.xml` - Cores do tema
- `res/values/themes.xml` - Temas
- `res/xml/backup_rules.xml` - Regras de backup
- `res/xml/data_extraction_rules.xml` - Regras de extração

#### Domínio
- `features/auth/domain/model/User.kt` - Modelo de usuário
- `features/auth/domain/model/UserRole.kt` - Enum de papéis

#### Data Layer
- `features/auth/data/remote/dto/AuthDto.kt` - DTOs de autenticação
- `features/auth/data/remote/AuthApi.kt` - Interface da API
- `features/auth/data/repository/AuthRepository.kt` - Repositório

#### Core
- `core/network/ApiClient.kt` - Cliente HTTP
- `core/storage/TokenManager.kt` - Gerenciador de tokens

#### Presentation
- `features/auth/presentation/login/LoginViewModel.kt` - ViewModel de login

### 📝 Arquivos a Implementar

#### 1. Dependency Injection (Hilt)

**`core/di/AppModule.kt`**
```kotlin
@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    
    @Provides
    @Singleton
    fun provideApiClient(tokenManager: TokenManager): ApiClient {
        return ApiClient(tokenManager)
    }
    
    @Provides
    @Singleton
    fun provideAuthApi(apiClient: ApiClient): AuthApi {
        return apiClient.createService()
    }
}
```

**`CirurgiaoApplication.kt`**
```kotlin
@HiltAndroidApp
class CirurgiaoApplication : Application() {
    
    override fun onCreate() {
        super.onCreate()
        
        // Inicializa Firebase
        FirebaseApp.initializeApp(this)
        
        // Configura Crashlytics
        FirebaseCrashlytics.getInstance().setCrashlyticsCollectionEnabled(!BuildConfig.DEBUG)
    }
}
```

#### 2. ViewModels

**`features/auth/presentation/register/RegisterViewModel.kt`**
```kotlin
@HiltViewModel
class RegisterViewModel @Inject constructor(
    private val authRepository: AuthRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(RegisterUiState())
    val uiState: StateFlow<RegisterUiState> = _uiState.asStateFlow()
    
    fun register(email: String, password: String, name: String, cpf: String?, phone: String?) {
        viewModelScope.launch {
            authRepository.register(email, password, name, cpf, phone).collect { result ->
                // Handle result
            }
        }
    }
}
```

**`features/auth/presentation/forgot/ForgotPasswordViewModel.kt`**
```kotlin
@HiltViewModel
class ForgotPasswordViewModel @Inject constructor(
    private val authRepository: AuthRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(ForgotPasswordUiState())
    val uiState: StateFlow<ForgotPasswordUiState> = _uiState.asStateFlow()
    
    fun forgotPassword(email: String) {
        viewModelScope.launch {
            authRepository.forgotPassword(email).collect { result ->
                // Handle result
            }
        }
    }
}
```

#### 3. Compose Screens

**`features/auth/presentation/login/LoginScreen.kt`**
```kotlin
@Composable
fun LoginScreen(
    viewModel: LoginViewModel = hiltViewModel(),
    onNavigateToRegister: () -> Unit,
    onNavigateToForgotPassword: () -> Unit,
    onLoginSuccess: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    
    // UI implementation with Compose
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        // Email field
        // Password field
        // Login button
        // Register link
        // Forgot password link
    }
}
```

**`features/auth/presentation/register/RegisterScreen.kt`**
**`features/auth/presentation/forgot/ForgotPasswordScreen.kt`**
**`features/dashboard/DashboardScreen.kt`**

#### 4. Navigation

**`core/navigation/NavGraph.kt`**
```kotlin
@Composable
fun NavGraph(
    navController: NavHostController,
    startDestination: String
) {
    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        composable(Screen.Login.route) {
            LoginScreen(
                onNavigateToRegister = { navController.navigate(Screen.Register.route) },
                onNavigateToForgotPassword = { navController.navigate(Screen.ForgotPassword.route) },
                onLoginSuccess = { navController.navigate(Screen.Dashboard.route) }
            )
        }
        
        composable(Screen.Register.route) {
            RegisterScreen(
                onNavigateBack = { navController.popBackStack() },
                onRegisterSuccess = { navController.navigate(Screen.Dashboard.route) }
            )
        }
        
        composable(Screen.ForgotPassword.route) {
            ForgotPasswordScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }
        
        composable(Screen.Dashboard.route) {
            DashboardScreen(
                onLogout = { 
                    navController.navigate(Screen.Login.route) {
                        popUpTo(0) { inclusive = true }
                    }
                }
            )
        }
    }
}

sealed class Screen(val route: String) {
    object Login : Screen("login")
    object Register : Screen("register")
    object ForgotPassword : Screen("forgot_password")
    object Dashboard : Screen("dashboard")
}
```

#### 5. MainActivity

**`MainActivity.kt`**
```kotlin
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
                
                LaunchedEffect(Unit) {
                    startDestination = if (authRepository.isAuthenticated()) {
                        Screen.Dashboard.route
                    } else {
                        Screen.Login.route
                    }
                }
                
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
```

#### 6. Theme

**`core/theme/Theme.kt`**
```kotlin
private val LightColorScheme = lightColorScheme(
    primary = Color(0xFF1976D2),
    secondary = Color(0xFFFF6F00),
    background = Color(0xFFFFFFFF),
    surface = Color(0xFFFFFFFF),
    error = Color(0xFFF44336)
)

@Composable
fun CirurgiaoAppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        typography = Typography,
        content = content
    )
}
```

#### 7. Componentes Reutilizáveis

**`core/components/CirurgiaoTextField.kt`**
**`core/components/CirurgiaoButton.kt`**
**`core/components/LoadingIndicator.kt`**
**`core/components/ErrorMessage.kt`**

#### 8. Testes

**`test/features/auth/presentation/login/LoginViewModelTest.kt`**
```kotlin
class LoginViewModelTest {
    
    @get:Rule
    val instantExecutorRule = InstantTaskExecutorRule()
    
    private lateinit var viewModel: LoginViewModel
    private lateinit var authRepository: AuthRepository
    
    @Before
    fun setup() {
        authRepository = mockk()
        viewModel = LoginViewModel(authRepository)
    }
    
    @Test
    fun `login success updates state correctly`() = runTest {
        // Test implementation
    }
}
```

## ⚙️ Configuração

### Pré-requisitos

- Android Studio Hedgehog | 2023.1.1 ou superior
- JDK 17
- Android SDK 34
- Gradle 8.1.4

### Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd android-app
```

2. Abra o projeto no Android Studio

3. Sincronize o Gradle:
```bash
./gradlew sync
```

4. Configure o arquivo `local.properties` (se necessário):
```properties
sdk.dir=/path/to/android/sdk
```

5. Configure a URL da API em `app/build.gradle`:
```gradle
buildConfigField "String", "API_BASE_URL", "\"http://10.0.2.2:3000/\""
```

### Firebase

O arquivo `google-services.json` já está configurado. Para produção:

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione o projeto "projeto-cirurgiao"
3. Baixe o `google-services.json` atualizado
4. Substitua em `app/google-services.json`

## 🔧 Desenvolvimento

### Executar o App

```bash
# Debug
./gradlew installDebug

# Release
./gradlew installRelease
```

### Lint e Code Style

```bash
# Executar lint
./gradlew lint

# Formatar código
./gradlew ktlintFormat
```

### Build

```bash
# Debug APK
./gradlew assembleDebug

# Release APK
./gradlew assembleRelease

# Bundle (AAB)
./gradlew bundleRelease
```

## 🧪 Testes

### Testes Unitários

```bash
./gradlew test
```

### Testes de Instrumentação

```bash
./gradlew connectedAndroidTest
```

### Cobertura de Testes

```bash
./gradlew jacocoTestReport
```

## 📦 Build e Deploy

### Gerar APK Assinado

1. Crie um keystore:
```bash
keytool -genkey -v -keystore cirurgiao.keystore -alias cirurgiao -keyalg RSA -keysize 2048 -validity 10000
```

2. Configure em `app/build.gradle`:
```gradle
android {
    signingConfigs {
        release {
            storeFile file("cirurgiao.keystore")
            storePassword "your-password"
            keyAlias "cirurgiao"
            keyPassword "your-password"
        }
    }
}
```

3. Gere o APK:
```bash
./gradlew assembleRelease
```

### Deploy na Play Store

1. Gere o Bundle:
```bash
./gradlew bundleRelease
```

2. Faça upload no [Google Play Console](https://play.google.com/console)

## 📚 Documentação Adicional

- [Kotlin Coding Conventions](https://kotlinlang.org/docs/coding-conventions.html)
- [Jetpack Compose](https://developer.android.com/jetpack/compose)
- [Android Architecture Components](https://developer.android.com/topic/architecture)
- [Hilt Dependency Injection](https://developer.android.com/training/dependency-injection/hilt-android)

## 🤝 Contribuindo

1. Siga os padrões de código definidos em `docs/standards/coding-standards.md`
2. Escreva testes para novas funcionalidades
3. Documente mudanças significativas
4. Faça commits seguindo Conventional Commits

## 📝 Licença

Propriedade do Projeto Cirurgião - Todos os direitos reservados

## 👥 Equipe

- **ANDROID-SENIOR-01 (Marina)** - Android Developer
- **BACKEND-SENIOR-01** - Backend API
- **IOS-SENIOR-01** - iOS Developer

---

**Versão**: 1.0.0  
**Última Atualização**: 09/11/2025
