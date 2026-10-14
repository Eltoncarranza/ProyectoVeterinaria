package com.veterinaria.controller;

import com.veterinaria.entity.Usuario;
import com.veterinaria.repository.UsuarioRepository;
import com.veterinaria.security.JwtProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtProvider jwtProvider;

    @PostMapping("/registrar")
    public ResponseEntity<String> registrar(@RequestBody Usuario nuevoUsuario) {
        if (usuarioRepository.findByUsername(nuevoUsuario.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("El usuario ya existe");
        }
        nuevoUsuario.setPassword(passwordEncoder.encode(nuevoUsuario.getPassword()));
        usuarioRepository.save(nuevoUsuario);
        return ResponseEntity.ok("Usuario registrado exitosamente");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AuthDto dto) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsername(dto.getUsername());

        if (usuarioOpt.isEmpty() || !passwordEncoder.matches(dto.getPassword(), usuarioOpt.get().getPassword())) {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }

        String token = jwtProvider.generarToken(usuarioOpt.get());
        return ResponseEntity.ok(token);
    }

    public static class AuthDto {
        private String username;
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}