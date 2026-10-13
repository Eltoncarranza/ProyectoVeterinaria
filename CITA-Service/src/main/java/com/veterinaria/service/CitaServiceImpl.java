package com.veterinaria.service;

import com.veterinaria.client.MascotaClient;
import com.veterinaria.dto.MascotaDTO;
import com.veterinaria.entity.Cita;
import com.veterinaria.repository.CitaRepository;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CitaServiceImpl implements CitaService {

    @Autowired
    private CitaRepository citaRepository;

    @Autowired
    private MascotaClient mascotaClient;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Override
    public List<Cita> obtenerTodas() {
        return citaRepository.findAll();
    }

    @Override
    public Optional<Cita> obtenerPorId(Long id) {
        return citaRepository.findById(id);
    }

    @Override
    public List<Cita> obtenerPorClienteId(Long clienteId) {
        return citaRepository.findByClienteId(clienteId);
    }

    @Override
    public List<Cita> obtenerPorMascotaId(Long mascotaId) {
        return citaRepository.findByMascotaId(mascotaId);
    }

    @Override
    public List<Cita> obtenerPendientes() {
        return citaRepository.findByEstado("PENDIENTE");
    }

    @Override
    public Cita guardar(Cita cita) {

        try {
            MascotaDTO mascota = mascotaClient.obtenerMascotaPorId(cita.getMascotaId());
            if (mascota == null) {
                throw new RuntimeException("La mascota con ID " + cita.getMascotaId() + " no existe.");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al verificar la mascota: " + e.getMessage());
        }

        if (cita.getEstado() == null || cita.getEstado().isEmpty()) {
            cita.setEstado("PENDIENTE");
        }

        Cita citaGuardada = citaRepository.save(cita);

        String mensaje = "Cita creada exitosamente para la mascota ID: " + cita.getMascotaId();
        rabbitTemplate.convertAndSend("cita.queue", mensaje);

        return citaGuardada;
    }

    @Override
    public Cita actualizarEstado(Long id, String nuevoEstado) {
        return citaRepository.findById(id).map(cita -> {
            cita.setEstado(nuevoEstado);
            return citaRepository.save(cita);
        }).orElse(null);
    }

    @Override
    public void eliminar(Long id) {
        citaRepository.deleteById(id);
    }
}