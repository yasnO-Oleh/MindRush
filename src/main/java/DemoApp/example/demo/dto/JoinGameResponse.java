package DemoApp.example.demo.dto;

import DemoApp.example.demo.model.Game;

public record JoinGameResponse(
        Game game,
        Long playerId
) {
}
