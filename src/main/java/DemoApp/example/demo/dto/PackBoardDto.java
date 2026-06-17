package DemoApp.example.demo.dto;

import java.util.List;

public record PackBoardDto(
        Long id,
        String name,
        String description,
        Long roundId,
        String roundName,
        Integer roundDisplayOrder,
        String roundType,
        List<PackRoundDto> rounds,
        List<BoardCategoryDto> categories,
        List<BoardQuestionDto> questions
) {
}
