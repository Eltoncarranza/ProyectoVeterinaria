package com.veterinaria.controller;

import com.veterinaria.client.ReniecClient;
import com.veterinaria.dto.ReniecResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/clientes/reniec")
public class ReniecController {

    @Autowired
    private ReniecClient reniecClient;

    @GetMapping("/{dni}")
    public ReniecResponse consultarDni(@PathVariable String dni) {
        if (!dni.matches("\\d{8}")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El DNI debe tener 8 dígitos.");
        }
        return reniecClient.consultarDni(dni);
    }
}