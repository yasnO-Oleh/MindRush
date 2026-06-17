package DemoApp.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record FinalRoundSubmitRequest(
        @NotNull(message = "Player id is required")
        Long playerId,
        @NotNull(message = "Wager is required")
        @PositiveOrZero(message = "Wager cannot be negative")
        Integer wager,
        @NotBlank(message = "Answer is required")
        String answer
) {
}
