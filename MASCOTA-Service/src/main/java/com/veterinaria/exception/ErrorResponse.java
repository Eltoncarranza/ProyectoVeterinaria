package com.veterinaria.exception;

import java.time.LocalDateTime;

public class ErrorResponse {
    private LocalDateTime fechaHora;
    private String mensaje;
    private String detalles;
    private int estadoHttp;

    public ErrorResponse(LocalDateTime fechaHora, String mensaje, String detalles, int estadoHttp) {
        this.fechaHora = fechaHora;
        this.mensaje = mensaje;
        this.detalles = detalles;
        this.estadoHttp = estadoHttp;
    }

    public LocalDateTime getFechaHora() { return fechaHora; }
    public String getMensaje() { return mensaje; }
    public String getDetalles() { return detalles; }
    public int getEstadoHttp() { return estadoHttp; }
}