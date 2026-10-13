package com.Veterinaria.service;

import com.Veterinaria.entity.Cliente;
import java.util.List;
import java.util.Optional;

public interface ClienteService {
    List<Cliente> obtenerTodos();
    Optional<Cliente> obtenerPorId(Long id);
    Cliente guardar(Cliente cliente);
    void eliminar(Long id);
}