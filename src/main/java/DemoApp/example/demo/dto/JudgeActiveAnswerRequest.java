package DemoApp.example.demo.dto;

import jakarta.validation.constraints.NotNull;

public record JudgeActiveAnswerRequest(
        @NotNull(message = "Correct flag is required")
        Boolean correct
) {
}
