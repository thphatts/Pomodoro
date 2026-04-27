package com.thphatts.promodo.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "user_pets")
@Data
public class UserPet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // người sở hữu pet

    @ManyToOne
    @JoinColumn(name = "pet_catalog_id")
    private PetCatalog petCatalog;

    private int level = 1; // Pet nở ra luôn ở Level 1
}