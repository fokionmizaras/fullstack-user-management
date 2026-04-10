package com.example.usermanagement;

import com.example.usermanagement.repository.UserRepository;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor //instantiates the empty constructor for spring
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "First name can not be empty", groups = {UserRepository.OnCreate.class, UserRepository.OnUpdate.class})
    @Column(nullable = false)
    private String firstName;

    @NotBlank(message = "Last name can not be empty", groups = {UserRepository.OnCreate.class, UserRepository.OnUpdate.class})
    @Column(nullable = false)
    private String lastName;

    @NotBlank(groups = {UserRepository.OnCreate.class, UserRepository.OnUpdate.class}, message = "Email can not be empty")
    @Email(message = "Invalid email format", groups = {UserRepository.OnCreate.class, UserRepository.OnUpdate.class})
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    @NotBlank(groups = UserRepository.OnCreate.class, message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long", groups = UserRepository.OnCreate.class)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    public User(String firstName, String lastName, String email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

}
