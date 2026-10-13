package com.veterinaria.dto;

// Usamos este objeto para recibir la respuesta de Mascotas sin copiar toda la Entidad
public class MascotaDTO {
    private Long id;
    private String nombre;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
}