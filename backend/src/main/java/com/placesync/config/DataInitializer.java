package com.placesync.config;

import com.placesync.entity.User;
import com.placesync.enums.Role;
import com.placesync.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {

            if (!userRepository.existsByEmail("admin@placesync.com")) {

                User admin = User.builder()
                        .name("PlaceSync Admin")
                        .email("admin@placesync.com")
                        .password(
                                passwordEncoder.encode("admin12345")
                        )
                        .role(Role.ADMIN)
                        .build();

                userRepository.save(admin);

                System.out.println(
                        "Default admin account created."
                );
            }
        };
    }
}