package DemoApp.example.demo.dto;

import jakarta.validation.constraints.NotBlank;

public record CreatePackRequest(
        @NotBlank(message = "Pack name is required")
        String name,
        @NotBlank(message = "Pack description is required")
        String description
) {
}
