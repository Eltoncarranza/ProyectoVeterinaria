package com.veterinaria.controller;

import com.veterinaria.entity.Mascota;
import com.veterinaria.service.MascotaService;
import com.veterinaria.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public Mascota obtenerMascotaPorId(@PathVariable Long id) {
        return mascotaService.obtenerPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró ninguna mascota con el ID: " + id));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarMascota(@PathVariable Long id) {
        mascotaService.eliminar(id);
        return ResponseEntity.ok().build();
    }
    @PostMapping
    public Mascota registrarMascota(@RequestBody Mascota mascota) {
        return mascotaService.guardar(mascota);
    }
}