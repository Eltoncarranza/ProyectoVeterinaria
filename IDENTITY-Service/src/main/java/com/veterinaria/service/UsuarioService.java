package com.veterinaria.service;

import com.veterinaria.entity.Usuario;

public interface UsuarioService {
    Usuario guardarUsuario(Usuario usuario);
    String autenticarYGenerarToken(Usuario usuario);
}