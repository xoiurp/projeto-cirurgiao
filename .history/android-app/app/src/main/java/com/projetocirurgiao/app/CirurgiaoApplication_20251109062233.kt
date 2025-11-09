package com.projetocirurgiao.app

import android.app.Application
import com.google.firebase.FirebaseApp
import com.google.firebase.crashlytics.FirebaseCrashlytics
import dagger.hilt.android.HiltAndroidApp

/**
 * Classe principal da aplicação Cirurgião
 * Configurada com Hilt para Dependency Injection
 */
@HiltAndroidApp
class CirurgiaoApplication : Application() {
    
    override fun onCreate() {
        super.onCreate()
        
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
