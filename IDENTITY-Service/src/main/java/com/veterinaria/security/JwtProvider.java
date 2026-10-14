package com.veterinaria.security;

import com.veterinaria.entity.Usuario;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtProvider {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private int expiration;

    public String generarToken(Usuario usuario) {
        Key key = Keys.hmacShaKeyFor(secret.getBytes());
        return Jwts.builder()
                .setSubject(usuario.getUsername())
                .claim("rol", usuario.getRol())
                .claim("id", usuario.getId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
}