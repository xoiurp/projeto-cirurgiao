package com.projetocirurgiao.app.core.network

import com.projetocirurgiao.app.BuildConfig
import com.projetocirurgiao.app.core.storage.TokenManager
import kotlinx.coroutines.runBlocking
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Cliente HTTP configurado com Retrofit e OkHttp
 */
@Singleton
class ApiClient @Inject constructor(
    private val tokenManager: TokenManager
) {
    
    companion object {
        private const val TIMEOUT_SECONDS = 30L
    }
    
    /**
     * Interceptor para adicionar token de autenticação
     */
    private val authInterceptor = Interceptor { chain ->
        val originalRequest = chain.request()
        
        // Não adiciona token para endpoints de autenticação
        val isAuthEndpoint = originalRequest.url.encodedPath.contains("/auth/")
        
        if (isAuthEndpoint) {
            return@Interceptor chain.proceed(originalRequest)
        }
        
        // Adiciona token Bearer
        val token = runBlocking { tokenManager.getAccessToken() }
        
        val newRequest = if (token != null) {
            originalRequest.newBuilder()
                .header("Authorization", "Bearer $token")
                .build()
        } else {
            originalRequest
        }
        
        chain.proceed(newRequest)
    }
    
    /**
     * Interceptor para logging (apenas em debug)
     */
    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = if (BuildConfig.DEBUG) {
            HttpLoggingInterceptor.Level.BODY
        } else {
            HttpLoggingInterceptor.Level.NONE
        }
    }
    
    /**
     * Cliente OkHttp configurado
     */
    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(authInterceptor)
        .addInterceptor(loggingInterceptor)
        .connectTimeout(TIMEOUT_SECONDS, TimeUnit.SECONDS)
        .readTimeout(TIMEOUT_SECONDS, TimeUnit.SECONDS)
        .writeTimeout(TIMEOUT_SECONDS, TimeUnit.SECONDS)
        .build()
    
    /**
     * Instância do Retrofit
     */
    val retrofit: Retrofit = Retrofit.Builder()
        .baseUrl(BuildConfig.API_BASE_URL)
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
    
    /**
     * Cria uma instância de serviço da API
     */
    inline fun <reified T> createService(): T {
        return retrofit.create(T::class.java)
    }
}
