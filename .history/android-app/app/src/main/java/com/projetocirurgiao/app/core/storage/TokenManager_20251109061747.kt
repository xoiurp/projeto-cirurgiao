package com.projetocirurgiao.app.core.storage

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Extension para criar DataStore
 */
private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "auth_prefs")

/**
 * Gerenciador de tokens de autenticação
 * Usa DataStore para armazenamento seguro
 */
@Singleton
class TokenManager @Inject constructor(
    @ApplicationContext private val context: Context
) {
    
    private val dataStore = context.dataStore
    
    companion object {
        private val ACCESS_TOKEN_KEY = stringPreferencesKey("access_token")
        private val REFRESH_TOKEN_KEY = stringPreferencesKey("refresh_token")
        private val USER_ID_KEY = stringPreferencesKey("user_id")
        private val USER_EMAIL_KEY = stringPreferencesKey("user_email")
        private val USER_NAME_KEY = stringPreferencesKey("user_name")
    }
    
    /**
     * Salva os tokens de autenticação
     */
    suspend fun saveTokens(accessToken: String, refreshToken: String) {
        dataStore.edit { preferences ->
            preferences[ACCESS_TOKEN_KEY] = accessToken
            preferences[REFRESH_TOKEN_KEY] = refreshToken
        }
    }
    
    /**
     * Obtém o access token
     */
    suspend fun getAccessToken(): String? {
        return dataStore.data.map { preferences ->
            preferences[ACCESS_TOKEN_KEY]
        }.first()
    }
    
    /**
     * Obtém o refresh token
     */
    suspend fun getRefreshToken(): String? {
        return dataStore.data.map { preferences ->
            preferences[REFRESH_TOKEN_KEY]
        }.first()
    }
    
    /**
     * Flow do access token
     */
    fun getAccessTokenFlow(): Flow<String?> {
        return dataStore.data.map { preferences ->
            preferences[ACCESS_TOKEN_KEY]
        }
    }
    
    /**
     * Salva informações básicas do usuário
     */
    suspend fun saveUserInfo(userId: String, email: String, name: String) {
        dataStore.edit { preferences ->
            preferences[USER_ID_KEY] = userId
            preferences[USER_EMAIL_KEY] = email
            preferences[USER_NAME_KEY] = name
        }
    }
    
    /**
     * Obtém o ID do usuário
     */
    suspend fun getUserId(): String? {
        return dataStore.data.map { preferences ->
            preferences[USER_ID_KEY]
        }.first()
    }
    
    /**
     * Obtém o email do usuário
     */
    suspend fun getUserEmail(): String? {
        return dataStore.data.map { preferences ->
            preferences[USER_EMAIL_KEY]
        }.first()
    }
    
    /**
     * Obtém o nome do usuário
     */
    suspend fun getUserName(): String? {
        return dataStore.data.map { preferences ->
            preferences[USER_NAME_KEY]
        }.first()
    }
    
    /**
     * Verifica se o usuário está autenticado
     */
    suspend fun isAuthenticated(): Boolean {
        return getAccessToken() != null
    }
    
    /**
     * Flow que indica se o usuário está autenticado
     */
    fun isAuthenticatedFlow(): Flow<Boolean> {
        return dataStore.data.map { preferences ->
            preferences[ACCESS_TOKEN_KEY] != null
        }
    }
    
    /**
     * Limpa todos os dados de autenticação
     */
    suspend fun clearTokens() {
        dataStore.edit { preferences ->
            preferences.clear()
        }
    }
    
    /**
     * Atualiza apenas o access token (usado no refresh)
     */
    suspend fun updateAccessToken(accessToken: String) {
        dataStore.edit { preferences ->
            preferences[ACCESS_TOKEN_KEY] = accessToken
        }
    }
}
