package com.veterinaria.repository;


import com.veterinaria.entity.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Long> {

    List<Cita> findByClienteId(Long clienteId);
    List<Cita> findByMascotaId(Long mascotaId);
    List<Cita> findByEstado(String estado);

}