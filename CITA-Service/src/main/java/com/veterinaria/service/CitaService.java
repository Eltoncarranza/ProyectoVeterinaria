package com.veterinaria.service;

import com.veterinaria.entity.Cita;
import java.util.List;
import java.util.Optional;

public interface CitaService {
    List<Cita> obtenerTodas();
    Optional<Cita> obtenerPorId(Long id);
    List<Cita> obtenerPorClienteId(Long clienteId);
    List<Cita> obtenerPorMascotaId(Long mascotaId);
    List<Cita> obtenerPendientes();
    Cita guardar(Cita cita);
    Cita actualizarEstado(Long id, String nuevoEstado);
    void eliminar(Long id);
}