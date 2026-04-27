package com.thphatts.promodo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thphatts.promodo.models.PetCatalog;

public interface PetCatalogRepository extends JpaRepository<PetCatalog, Long> {

}
