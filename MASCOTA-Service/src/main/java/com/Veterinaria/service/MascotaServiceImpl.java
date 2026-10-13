package com.Veterinaria.service;

import com.Veterinaria.entity.Mascota;
import com.Veterinaria.repository.MascotaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MascotaServiceImpl implements MascotaService {

    @Autowired
    private MascotaRepository mascotaRepository;

    @Override
    public List<Mascota> listarTodas() {
        return mascotaRepository.findAll();
    }

    @Override
    public Optional<Mascota> obtenerPorId(Long id) {
        return mascotaRepository.findById(id);
    }

    @Override
    public Mascota guardar(Mascota mascota) {
        return mascotaRepository.save(mascota);
    }

    @Override
    public void eliminar(Long id) {
        mascotaRepository.deleteById(id);
    }
}