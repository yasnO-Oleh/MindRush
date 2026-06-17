package DemoApp.example.demo.controller;

import DemoApp.example.demo.dto.BuzzMessage;
import DemoApp.example.demo.dto.ScoreUpdateMessage;
import DemoApp.example.demo.dto.SelectQuestionMessage;
import DemoApp.example.demo.model.Game;
import DemoApp.example.demo.service.GameService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class GameWebSocketController {

    private final SimpMessagingTemplate simp;
    private final GameService gameService;

    public GameWebSocketController(SimpMessagingTemplate simp, GameService gameService) {
        this.simp = simp;
        this.gameService = gameService;
    }

    @MessageMapping("/game/{gameId}/select")
    public void selectQuestion(@DestinationVariable String gameId, SelectQuestionMessage msg, Principal principal) {
        msg.setBy(principal != null ? principal.getName() : null);
        simp.convertAndSend("/topic/game/" + gameId + "/select", msg);
    }

    @MessageMapping("/game/{gameId}/buzz")
    public void buzz(@DestinationVariable String gameId, BuzzMessage msg, Principal principal) {
        msg.setBy(principal != null ? principal.getName() : null);
        Game game = gameService.claimBuzz(Long.valueOf(gameId), msg.getPlayerId());
        if (game.getActivePlayer() != null) {
            msg.setPlayerId(game.getActivePlayer().getId());
        }
        simp.convertAndSend("/topic/game/" + gameId + "/buzz", msg);
    }

    @MessageMapping("/game/{gameId}/score")
    public void updateScore(@DestinationVariable String gameId, ScoreUpdateMessage msg, Principal principal) {
        msg.setBy(principal != null ? principal.getName() : null);
        simp.convertAndSend("/topic/game/" + gameId + "/score", msg);
    }
}
