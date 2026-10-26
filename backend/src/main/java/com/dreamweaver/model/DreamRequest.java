package com.dreamweaver.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DreamRequest(

        @NotBlank(message = "Dream text cannot be empty")
        @Size(min = 20, max = 1500 , message = "Dream must be between 20 to 1500 characters")
        String dreamText
) {
}
