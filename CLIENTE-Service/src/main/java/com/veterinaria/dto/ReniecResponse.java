package com.veterinaria.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ReniecResponse(String nombres, String apellidoPaterno, String apellidoMaterno) {
}