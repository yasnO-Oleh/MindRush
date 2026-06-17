package DemoApp.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record CreateCategoryRequest(
        @NotBlank(message = "Category name is required")
        String name,
        @Positive(message = "Display order must be greater than 0")
        Integer displayOrder
) {
}
