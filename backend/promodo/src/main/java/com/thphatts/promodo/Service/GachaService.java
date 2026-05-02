package com.thphatts.promodo.service;

import com.thphatts.promodo.models.PetCatalog;
import com.thphatts.promodo.repository.PetCatalogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thphatts.promodo.exception.BusinessException;
import java.util.List;

@Service
public class GachaService {

    @Autowired
    private PetCatalogRepository petCatalogRepository;

    // Giá của 1 lần mở trứng
    public static final int GACHA_PRICE = 200;

    // Thuật toán: Random theo trọng số (Weighted Random)
    public PetCatalog rollGacha() {
        // 1. Lấy toàn bộ danh sách Pet có trong Game
        List<PetCatalog> allPets = petCatalogRepository.findAll();

        // 2. Tính tổng trọng số (Tổng tỉ lệ)
        double totalWeight = allPets.stream().mapToDouble(PetCatalog::getDropWeight).sum();

        // 3. Quay một con số ngẫu nhiên từ 0 đến Tổng trọng số
        double randomValue = Math.random() * totalWeight;

        // 4. Dò xem con số đó rơi vào "mảnh đất" của con Pet nào
        double countWeight = 0.0;
        for (PetCatalog pet : allPets) {
            countWeight += pet.getDropWeight();
            if (randomValue <= countWeight) {
                return pet; // BÙM! Trúng con này!
            }
        }

        // This should ideally not be reached if totalWeight > 0. Handle as an exception
        // or default.
        throw new BusinessException("No pets available to roll or invalid gacha configuration.");
    }
}
