package com.veterinaria.service;

import com.veterinaria.entity.Usuario;
import com.veterinaria.repository.UsuarioRepository;
import com.veterinaria.security.JwtProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtProvider jwtProvider;

    @Override
    public Usuario guardarUsuario(Usuario usuario) {
        // Encriptar la contraseña antes de guardarla en Supabase por seguridad
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        return usuarioRepository.save(usuario);
    }

    @Override
    public String autenticarYGenerarToken(Usuario usuario) {
        // Buscar el usuario en la base de datos
        Usuario usuarioDb = usuarioRepository.findByUsername(usuario.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Validar si la contraseña coincide
        if (!passwordEncoder.matches(usuario.getPassword(), usuarioDb.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }
        
        return jwtProvider.generarToken(usuarioDb);
    }
}