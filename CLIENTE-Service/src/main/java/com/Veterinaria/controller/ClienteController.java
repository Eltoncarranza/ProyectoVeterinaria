package com.Veterinaria.controller;


import com.Veterinaria.entity.Cliente;
import com.Veterinaria.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @GetMapping
    public List<Cliente> listarClientes() {
        return clienteService.obtenerTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> obtenerCliente(@PathVariable Long id) {
        return clienteService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Cliente crearCliente(@RequestBody Cliente cliente) {
        return clienteService.guardar(cliente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cliente> actualizarCliente(@PathVariable Long id, @RequestBody Cliente clienteDetails) {
        return clienteService.obtenerPorId(id).map(clienteExistente -> {
            clienteExistente.setNombre(clienteDetails.getNombre());
            clienteExistente.setApellidos(clienteDetails.getApellidos());
            clienteExistente.setTelefono(clienteDetails.getTelefono());
            clienteExistente.setEmail(clienteDetails.getEmail());
            clienteExistente.setDireccion(clienteDetails.getDireccion());
            return ResponseEntity.ok(clienteService.guardar(clienteExistente));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCliente(@PathVariable Long id) {
        if (clienteService.obtenerPorId(id).isPresent()) {
            clienteService.eliminar(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}