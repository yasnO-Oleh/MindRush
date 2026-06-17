package DemoApp.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateQuestionRequest(
        @NotBlank(message = "Question text is required")
        String text,
        @NotBlank(message = "Question answer is required")
        String answer,
        @NotNull(message = "Question price is required")
        @Positive(message = "Question price must be greater than 0")
        Integer price,
        @Positive(message = "Display order must be greater than 0")
        Integer displayOrder,
        String mediaUrl,
        String mediaType
) {
}
