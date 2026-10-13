package com.Veterinaria.controller;

import com.Veterinaria.Entity.Mascota;
import com.Veterinaria.service.MascotaService;
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
        return mascotaService.obtenerTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Mascota> obtenerMascota(@PathVariable Long id) {
        return mascotaService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Mascota>> listarMascotasPorCliente(@PathVariable Long clienteId) {
        List<Mascota> mascotas = mascotaService.obtenerPorClienteId(clienteId);
        if(mascotas.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(mascotas);
    }

    @PostMapping
    public Mascota crearMascota(@RequestBody Mascota mascota) {
        return mascotaService.guardar(mascota);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarMascota(@PathVariable Long id) {
        if (mascotaService.obtenerPorId(id).isPresent()) {
            mascotaService.eliminar(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}