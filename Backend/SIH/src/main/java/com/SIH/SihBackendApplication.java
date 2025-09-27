package com.SIH;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling

public class SihBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(SihBackendApplication.class, args);
	}

}
