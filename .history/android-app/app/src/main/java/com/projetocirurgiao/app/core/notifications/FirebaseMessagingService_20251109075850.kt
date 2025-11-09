package com.projetocirurgiao.app.core.notifications

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import com.projetocirurgiao.app.MainActivity
import com.projetocirurgiao.app.R

/**
 * Service para receber notificações push do Firebase Cloud Messaging
 */
class FirebaseMessagingService : FirebaseMessagingService() {

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)

        // Verifica se a mensagem contém dados
        if (remoteMessage.data.isNotEmpty()) {
            handleDataMessage(remoteMessage.data)
        }

        // Verifica se a mensagem contém notificação
        remoteMessage.notification?.let {
            sendNotification(it.title, it.body)
        }
    }

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        // Aqui você pode enviar o token para o seu servidor
        // para poder enviar notificações push para este dispositivo
        sendTokenToServer(token)
    }

    private fun handleDataMessage(data: Map<String, String>) {
        // Processa os dados da mensagem
        val title = data["title"]
        val body = data["body"]
        
        if (title != null && body != null) {
            sendNotification(title, body)
        }
    }

    private fun sendNotification(title: String?, message: String?) {
        val intent = Intent(this, MainActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
        }

        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            intent,
            PendingIntent.FLAG_ONE_SHOT or PendingIntent.FLAG_IMMUTABLE
        )

        val channelId = getString(R.string.default_notification_channel_id)
        val notificationBuilder = NotificationCompat.Builder(this, channelId)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle(title ?: getString(R.string.app_name))
            .setContentText(message ?: "")
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .setPriority(NotificationCompat.PRIORITY_HIGH)

        val notificationManager =
            getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        // Cria o canal de notificação para Android O+
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                getString(R.string.default_notification_channel_name),
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = getString(R.string.default_notification_channel_description)
            }
            notificationManager.createNotificationChannel(channel)
        }

        notificationManager.notify(0, notificationBuilder.build())
    }

    private fun sendTokenToServer(token: String) {
        // TODO: Implementar envio do token para o servidor
        // Exemplo: api.updateFcmToken(token)
    }
}
