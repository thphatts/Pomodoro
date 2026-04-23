package com.thphatts.promodo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thphatts.promodo.models.*;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}