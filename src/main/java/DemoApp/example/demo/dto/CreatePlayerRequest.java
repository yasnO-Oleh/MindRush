package DemoApp.example.demo.dto;

import jakarta.validation.constraints.NotBlank;

public record CreatePlayerRequest(
        @NotBlank(message = "Player name is required")
        String name,
        String avatarUrl
) {
}
