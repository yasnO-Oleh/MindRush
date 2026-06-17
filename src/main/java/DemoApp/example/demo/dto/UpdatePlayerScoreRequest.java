package DemoApp.example.demo.dto;

import jakarta.validation.constraints.NotNull;

public record UpdatePlayerScoreRequest(
        @NotNull(message = "Score change is required")
        Integer scoreChange
) {
}
