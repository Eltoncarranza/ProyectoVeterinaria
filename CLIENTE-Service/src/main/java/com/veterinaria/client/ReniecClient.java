package com.veterinaria.client;

import com.veterinaria.dto.ReniecResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

@Component
public class ReniecClient {

    private static final Logger log = LoggerFactory.getLogger(ReniecClient.class);

    private final RestClient restClient = RestClient.create();
    private final String urlTemplate;
    private final String token;

    public ReniecClient(@Value("${reniec.url}") String urlTemplate,
                        @Value("${reniec.token:}") String token) {
        this.urlTemplate = urlTemplate;
        this.token = token;
    }

    public ReniecResponse consultarDni(String dni) {
        try {
            ReniecResponse respuesta = restClient.get()
                    .uri(urlTemplate + "?token={token}", dni, token)
                    .retrieve()
                    .body(ReniecResponse.class);

            if (respuesta == null || respuesta.nombres() == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No se encontró el DNI.");
            }
            return respuesta;
        } catch (HttpClientErrorException.NotFound e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No se encontró el DNI.");
        } catch (RestClientException e) {
            log.error("Error consultando RENIEC para el DNI {}: {}", dni, e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "RENIEC no disponible.");
        }
    }
}