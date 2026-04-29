package com.thphatts.promodo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thphatts.promodo.models.UserPet;

public interface UserPetRepository extends JpaRepository<UserPet, Long> {

}
