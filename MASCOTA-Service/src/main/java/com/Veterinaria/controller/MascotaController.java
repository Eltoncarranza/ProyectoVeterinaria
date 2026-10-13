package com.Veterinaria.controller;

import com.Veterinaria.entity.Mascota;
import com.Veterinaria.service.MascotaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mascotas")
public class MascotaController {

    @Autowired
    private MascotaService mascotaService;

    @GetMapping
    public List<Mascota> listarMascotas() {
        return mascotaService.listarTodas();
    }

    @PostMapping
    public Mascota registrarMascota(@RequestBody Mascota mascota) {
        return mascotaService.guardar(mascota);
    }
}