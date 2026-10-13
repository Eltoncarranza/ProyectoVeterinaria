package com.veterinaria.service;


import com.veterinaria.entity.Cita;
import com.veterinaria.repository.CitaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CitaService {

    @Autowired
    private CitaRepository citaRepository;

    public List<Cita> obtenerTodas() {
        return citaRepository.findAll();
    }

    public Optional<Cita> obtenerPorId(Long id) {
        return citaRepository.findById(id);
    }

    public List<Cita> obtenerPorClienteId(Long clienteId) {
        return citaRepository.findByClienteId(clienteId);
    }

    public List<Cita> obtenerPorMascotaId(Long mascotaId) {
        return citaRepository.findByMascotaId(mascotaId);
    }

    public List<Cita> obtenerPendientes() {
        return citaRepository.findByEstado("PENDIENTE");
    }

    public Cita guardar(Cita cita) {
        // Por defecto, una cita nueva entra como PENDIENTE si no se especifica
        if(cita.getEstado() == null || cita.getEstado().isEmpty()) {
            cita.setEstado("PENDIENTE");
        }
        return citaRepository.save(cita);
    }

    public Cita actualizarEstado(Long id, String nuevoEstado) {
        return citaRepository.findById(id).map(cita -> {
            cita.setEstado(nuevoEstado);
            return citaRepository.save(cita);
        }).orElse(null);
    }

    public void eliminar(Long id) {
        citaRepository.deleteById(id);
    }
}