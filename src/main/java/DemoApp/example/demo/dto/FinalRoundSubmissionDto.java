package DemoApp.example.demo.dto;

public record FinalRoundSubmissionDto(
        Long id,
        Long playerId,
        String playerName,
        Integer wager,
        String answer,
        Boolean judged,
        Boolean correct
) {
}
