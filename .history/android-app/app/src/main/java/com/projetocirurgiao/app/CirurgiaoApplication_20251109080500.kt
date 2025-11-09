package com.projetocirurgiao.app

import android.app.Application
import com.google.firebase.FirebaseApp
import com.google.firebase.crashlytics.FirebaseCrashlytics
import com.projetocirurgiao.app.core.di.appModule
import org.koin.android.ext.koin.androidContext
import org.koin.android.ext.koin.androidLogger
import org.koin.core.context.startKoin
import org.koin.core.logger.Level

/**
 * Classe principal da aplicação Cirurgião
 * Configurada com Koin para Dependency Injection
 */
class CirurgiaoApplication : Application() {
    
    override fun onCreate() {
        super.onCreate()
        
        // Inicializa Koin
        startKoin {
            androidLogger(if (BuildConfig.DEBUG) Level.ERROR else Level.NONE)
            androidContext(this@CirurgiaoApplication)
            modules(appModule)
        }
        
        // Inicializa Firebase
        FirebaseApp.initializeApp(this)
        
        // Configura Crashlytics (desabilitado em debug)
        FirebaseCrashlytics.getInstance().apply {
            setCrashlyticsCollectionEnabled(!BuildConfig.DEBUG)
        }
        
        // Log de inicialização
        if (BuildConfig.DEBUG) {
            android.util.Log.d("CirurgiaoApp", "Aplicação inicializada em modo DEBUG")
        }
    }
}
