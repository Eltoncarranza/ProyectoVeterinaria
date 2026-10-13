package com.veterinaria.client;

import com.veterinaria.dto.MascotaDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

// El "name" DEBE ser idéntico al nombre con el que Mascota se registra en Eureka
@FeignClient(name = "MASCOTA-SERVICE")
public interface MascotaClient {

    // Le decimos qué endpoint debe consumir de Mascotas
    @GetMapping("/api/mascotas/{id}")
    MascotaDTO obtenerMascotaPorId(@PathVariable("id") Long id);
}