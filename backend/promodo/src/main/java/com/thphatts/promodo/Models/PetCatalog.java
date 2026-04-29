package com.thphatts.promodo.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "pet_catalogs")
@Data
public class PetCatalog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String rarity; // Độ hiếm: COMMON, RARE, EPIC, LEGENDARY
    private String imageUrl; // Link ảnh

    // Tỉ lệ rớt (Trọng số). Càng cao rớt càng dễ.
    private double dropWeight;
}