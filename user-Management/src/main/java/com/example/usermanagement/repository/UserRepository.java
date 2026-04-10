package com.example.usermanagement.repository;

import com.example.usermanagement.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    List<User> findAllByOrderByIdAsc();

    public interface OnCreate {

    }
    public interface OnUpdate {

    }


}
