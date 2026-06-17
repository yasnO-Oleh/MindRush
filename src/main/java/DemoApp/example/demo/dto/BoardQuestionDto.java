package DemoApp.example.demo.dto;

public record BoardQuestionDto(
        Long id,
        String text,
        Integer price,
        Integer displayOrder,
        Long categoryId
) {
}
