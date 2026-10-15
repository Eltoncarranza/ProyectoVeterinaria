package com.veterinaria.service;

import com.veterinaria.client.MascotaClient;
import com.veterinaria.dto.CitaRequest;
import com.veterinaria.dto.MascotaDTO;
import com.veterinaria.entity.Cita;
import com.veterinaria.repository.CitaRepository;
import feign.FeignException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.AmqpException;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class CitaServiceImpl implements CitaService {

    private static final Logger log = LoggerFactory.getLogger(CitaServiceImpl.class);

    private static final String ESTADO_PENDIENTE = "PENDIENTE";
    private static final Set<String> ESTADOS_VALIDOS = Set.of("PENDIENTE", "CUMPLIDA", "COMPLETADA", "CANCELADA");
    private static final String COLA_CITAS = "cita.queue";

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
        return citaRepository.findByEstado(ESTADO_PENDIENTE);
    }

    @Override
    public Cita crear(CitaRequest request) {
        if (request.mascotaId() == null || request.fechaHora() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La mascota y la fecha son obligatorias.");
        }
        validarMascota(request.mascotaId());

        Cita cita = new Cita();
        cita.setClienteId(request.clienteId());
        cita.setMascotaId(request.mascotaId());
        cita.setFechaHora(request.fechaHora());
        cita.setMotivo(request.motivo());
        cita.setEstado(request.estado() == null || request.estado().isBlank()
                ? ESTADO_PENDIENTE
                : validarEstado(request.estado()));

        Cita guardada = citaRepository.save(cita);
        notificarCreacion(guardada);
        return guardada;
    }

    @Override
    public Cita actualizar(Long id, CitaRequest request) {
        Cita existente = citaRepository.findById(id)
                .orElseThrow(() -> noEncontrada(id));

        if (request.mascotaId() != null) {
            validarMascota(request.mascotaId());
            existente.setMascotaId(request.mascotaId());
        }
        if (request.clienteId() != null) {
            existente.setClienteId(request.clienteId());
        }
        if (request.fechaHora() != null) {
            existente.setFechaHora(request.fechaHora());
        }
        if (request.motivo() != null) {
            existente.setMotivo(request.motivo());
        }
        if (request.estado() != null) {
            existente.setEstado(validarEstado(request.estado()));
        }

        return citaRepository.save(existente);
    }

    @Override
    public void eliminar(Long id) {
        if (!citaRepository.existsById(id)) {
            throw noEncontrada(id);
        }
        citaRepository.deleteById(id);
    }

    private void validarMascota(Long mascotaId) {
        try {
            MascotaDTO mascota = mascotaClient.obtenerMascotaPorId(mascotaId);
            if (mascota == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "La mascota con ID " + mascotaId + " no existe.");
            }
        } catch (FeignException e) {
            if (e.status() == HttpStatus.NOT_FOUND.value()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "La mascota con ID " + mascotaId + " no existe.");
            }
            log.error("Error consultando MASCOTA-SERVICE para la mascota {}", mascotaId, e);
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "No se pudo verificar la mascota. Intenta más tarde.");
        }
    }

    private String validarEstado(String estado) {
        if (!ESTADOS_VALIDOS.contains(estado)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Estado no válido: " + estado);
        }
        return estado;
    }

    private void notificarCreacion(Cita cita) {
        String mensaje = "Cita creada exitosamente para la mascota ID: " + cita.getMascotaId();
        try {
            rabbitTemplate.convertAndSend(COLA_CITAS, mensaje);
        } catch (AmqpException e) {
            log.warn("La cita {} se guardó, pero no se pudo enviar la notificación", cita.getId(), e);
        }
    }

    private ResponseStatusException noEncontrada(Long id) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, "No existe la cita con ID " + id);
    }
}