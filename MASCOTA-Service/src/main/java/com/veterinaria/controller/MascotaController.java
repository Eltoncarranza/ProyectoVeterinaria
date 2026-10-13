package com.veterinaria.controller;

import com.veterinaria.entity.Mascota;
import com.veterinaria.service.MascotaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity; // IMPORTANTE
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

    @GetMapping("/{id}")
    public ResponseEntity<Mascota> obtenerMascotaPorId(@PathVariable Long id) {
        return mascotaService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Mascota registrarMascota(@RequestBody Mascota mascota) {
        return mascotaService.guardar(mascota);
    }
}