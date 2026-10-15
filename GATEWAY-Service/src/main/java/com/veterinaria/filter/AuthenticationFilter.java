package com.veterinaria.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Objects;

@Component
public class AuthenticationFilter implements GlobalFilter, Ordered {

    private static final String PREFIJO_PUBLICO = "/api/auth/";
    private static final String PREFIJO_BEARER = "Bearer ";
    private static final String CABECERA_USER_ID = "X-User-Id";
    private static final String CABECERA_USER_ROL = "X-User-Rol";
    private static final String ROL_ADMIN = "ADMIN";

    @Value("${jwt.secret}")
    private String secret;

    private SecretKey clave;

    @PostConstruct
    void inicializarClave() {
        this.clave = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();

        if (HttpMethod.OPTIONS.equals(request.getMethod()) || path.startsWith(PREFIJO_PUBLICO)) {
            return chain.filter(exchange);
        }

        String cabeceraAuth = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (cabeceraAuth == null || !cabeceraAuth.startsWith(PREFIJO_BEARER)) {
            return responder(exchange, HttpStatus.UNAUTHORIZED);
        }

        Claims claims;
        try {
            claims = Jwts.parser()
                    .verifyWith(clave)
                    .build()
                    .parseSignedClaims(cabeceraAuth.substring(PREFIJO_BEARER.length()))
                    .getPayload();
        } catch (Exception e) {
            return responder(exchange, HttpStatus.UNAUTHORIZED);
        }

        final String idUsuario = Objects.toString(claims.get("id"), "");
        final String rol = Objects.toString(claims.get("rol"), "");

        // Solo el administrador puede eliminar registros, en cualquier servicio
        if (HttpMethod.DELETE.equals(request.getMethod()) && !ROL_ADMIN.equals(rol)) {
            return responder(exchange, HttpStatus.FORBIDDEN);
        }

        ServerHttpRequest requestConUsuario = request.mutate()
                .headers(headers -> {
                    headers.remove(CABECERA_USER_ID);
                    headers.remove(CABECERA_USER_ROL);
                    headers.set(CABECERA_USER_ID, idUsuario);
                    headers.set(CABECERA_USER_ROL, rol);
                })
                .build();

        return chain.filter(exchange.mutate().request(requestConUsuario).build());
    }

    private Mono<Void> responder(ServerWebExchange exchange, HttpStatus estado) {
        exchange.getResponse().setStatusCode(estado);
        return exchange.getResponse().setComplete();
    }

    @Override
    public int getOrder() {
        return -1;
    }
}