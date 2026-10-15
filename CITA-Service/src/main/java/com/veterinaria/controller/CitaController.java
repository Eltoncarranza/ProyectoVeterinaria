package com.veterinaria.controller;

import com.veterinaria.entity.Cita;
import com.veterinaria.service.CitaService;
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

    @PostMapping
    public ResponseEntity<Cita> crearCita(@RequestBody Cita cita) {
        // Aseguramos un estado por defecto si viene vacío
        if (cita.getEstado() == null || cita.getEstado().isEmpty()) {
            cita.setEstado("PENDIENTE");
        }
        Cita nuevaCita = citaService.guardar(cita);
        return ResponseEntity.ok(nuevaCita);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cita> actualizarCita(@PathVariable Long id, @RequestBody Cita citaDetails) {
        return citaService.obtenerPorId(id).map(citaExistente -> {
            if (citaDetails.getEstado() != null) {
                citaExistente.setEstado(citaDetails.getEstado());
            }
            if (citaDetails.getMotivo() != null) {
                citaExistente.setMotivo(citaDetails.getMotivo());
            }
            if (citaDetails.getFechaHora() != null) {
                citaExistente.setFechaHora(citaDetails.getFechaHora());
            }
            Cita actualizada = citaService.guardar(citaExistente);
            return ResponseEntity.ok(actualizada);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCita(@PathVariable Long id) {
        citaService.eliminar(id);
        return ResponseEntity.ok().build();
    }
}