package com.veterinaria.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // Define el nombre exacto de la cola que mencionaste en tu diseño
    @Bean
    public Queue citaQueue() {
        return new Queue("cita.queue", true); // true = durable
    }
}