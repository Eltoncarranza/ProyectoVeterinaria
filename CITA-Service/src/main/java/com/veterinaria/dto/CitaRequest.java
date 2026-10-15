package com.veterinaria.dto;

import java.time.LocalDateTime;

public record CitaRequest(
        Long clienteId,
        Long mascotaId,
        LocalDateTime fechaHora,
        String motivo,
        String estado
) {
}