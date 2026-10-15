package com.veterinaria.consumer;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class CitaConsumer {

    @RabbitListener(queues = "cita.queue")
    public void procesarNotificacion(String mensaje) {

        System.out.println("==================================================");
        System.out.println(" [ALERTA DE NOTIFICACIÓN ASÍNCRONA]");
        System.out.println(" Contenido: " + mensaje);
        System.out.println(" Procesamiento completado sin bloquear el sistema central.");
        System.out.println("==================================================");
    }
}