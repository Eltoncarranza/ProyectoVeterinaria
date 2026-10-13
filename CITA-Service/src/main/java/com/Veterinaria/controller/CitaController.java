package com.Veterinaria.controller;

import com.Veterinaria.entity.Cita;
import com.Veterinaria.service.CitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/citas")
public class CitaController {

    @Autowired
    private CitaService citaService;

    @GetMapping
    public List<Cita> listarCitas() {
        return citaService.obtenerTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cita> obtenerCita(@PathVariable Long id) {
        return citaService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Cita>> listarPorCliente(@PathVariable Long clienteId) {
        List<Cita> citas = citaService.obtenerPorClienteId(clienteId);
        return ResponseEntity.ok(citas);
    }

    @GetMapping("/mascota/{mascotaId}")
    public ResponseEntity<List<Cita>> listarPorMascota(@PathVariable Long mascotaId) {
        List<Cita> citas = citaService.obtenerPorMascotaId(mascotaId);
        return ResponseEntity.ok(citas);
    }

    @GetMapping("/pendientes")
    public ResponseEntity<List<Cita>> listarPendientes() {
        return ResponseEntity.ok(citaService.obtenerPendientes());
    }

    @PostMapping
    public Cita crearCita(@RequestBody Cita cita) {
        return citaService.guardar(cita);
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<Cita> cambiarEstado(@PathVariable Long id, @RequestParam String estado) {
        Cita citaActualizada = citaService.actualizarEstado(id, estado);
        if (citaActualizada != null) {
            return ResponseEntity.ok(citaActualizada);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCita(@PathVariable Long id) {
        if (citaService.obtenerPorId(id).isPresent()) {
            citaService.eliminar(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}