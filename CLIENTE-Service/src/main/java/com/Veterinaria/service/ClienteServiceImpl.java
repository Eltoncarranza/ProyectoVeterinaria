package com.Veterinaria.service;

import com.Veterinaria.entity.Cliente;
import com.Veterinaria.repository.ClienteRepository;
import com.Veterinaria.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteServiceImpl implements ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Override
    public List<Cliente> obtenerTodos() {
        return clienteRepository.findAll(); // Consulta SELECT * FROM cliente en Supabase
    }

    @Override
    public Optional<Cliente> obtenerPorId(Long id) {
        return clienteRepository.findById(id);
    }

    @Override
    public Cliente guardar(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    @Override
    public void eliminar(Long id) {
        clienteRepository.deleteById(id);
    }
}