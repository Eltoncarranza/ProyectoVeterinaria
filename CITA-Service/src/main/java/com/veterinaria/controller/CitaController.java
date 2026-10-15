package com.veterinaria.controller;

import com.veterinaria.dto.CitaRequest;
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
    public ResponseEntity<Cita> crearCita(@RequestBody CitaRequest request) {
        return ResponseEntity.ok(citaService.crear(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cita> actualizarCita(@PathVariable Long id, @RequestBody CitaRequest request) {
        return ResponseEntity.ok(citaService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCita(@PathVariable Long id) {
        citaService.eliminar(id);
        return ResponseEntity.ok().build();
    }
}