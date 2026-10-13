package com.veterinaria.repository;


import com.veterinaria.entity.Mascota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MascotaRepository extends JpaRepository<Mascota, Long> {
    // Nos servirá para que el Gateway o la vista traiga las mascotas de 1 solo dueño
    List<Mascota> findByClienteId(Long clienteId);
}