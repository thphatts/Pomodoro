package com.thphatts.promodo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thphatts.promodo.Models.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}