package com.veterinaria.client;

import com.veterinaria.dto.MascotaDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "MASCOTA-SERVICE")
public interface MascotaClient {

    @GetMapping("/api/mascotas/{id}")
    MascotaDTO obtenerMascotaPorId(@PathVariable("id") Long id);
}