package DemoApp.example.demo.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateGameRequest(
        @NotNull(message = "Pack id is required")
        @Positive(message = "Pack id must be greater than 0")
        Long packId,
        String hostAvatarUrl
) {
}
