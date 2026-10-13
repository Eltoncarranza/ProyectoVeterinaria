package com.Veterinaria;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MascotaServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(MascotaServiceApplication.class, args);
		System.out.println("Mascota Service Application Started");
	}

}
