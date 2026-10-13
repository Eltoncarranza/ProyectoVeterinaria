package com.veterinaria.service;


import com.veterinaria.entity.Mascota;

import java.util.List;
import java.util.Optional;

public interface MascotaService {
    List<Mascota> listarTodas();
    Optional<Mascota> obtenerPorId(Long id);
    Mascota guardar(Mascota mascota);
    void eliminar(Long id);
}