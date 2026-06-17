package DemoApp.example.demo.controller;

import DemoApp.example.demo.dto.CreateGameRequest;
import DemoApp.example.demo.dto.CreatePlayerRequest;
import DemoApp.example.demo.dto.FinalRoundEventMessage;
import DemoApp.example.demo.dto.FinalRoundSubmissionDto;
import DemoApp.example.demo.dto.FinalRoundSubmitRequest;
import DemoApp.example.demo.dto.GameStateEventMessage;
import DemoApp.example.demo.dto.JudgeActiveAnswerRequest;
import DemoApp.example.demo.dto.JudgeFinalSubmissionRequest;
import DemoApp.example.demo.dto.JoinGameResponse;
import DemoApp.example.demo.dto.PackBoardDto;
import DemoApp.example.demo.dto.ScoreUpdateMessage;
import DemoApp.example.demo.dto.SelectQuestionMessage;
import DemoApp.example.demo.dto.UpdatePlayerAvatarRequest;
import DemoApp.example.demo.dto.UpdatePlayerScoreRequest;
import DemoApp.example.demo.model.Game;
import DemoApp.example.demo.model.PackRound;
import DemoApp.example.demo.model.Player;
import DemoApp.example.demo.service.GameService;
import jakarta.validation.Valid;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/games")
public class GameController {
    private static final String ROUND_TYPE_FINAL = "FINAL";

    private final GameService gameService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public GameController(GameService gameService, SimpMessagingTemplate simpMessagingTemplate) {
        this.gameService = gameService;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @GetMapping
    public List<Game> getGames() {
        return gameService.getAllGames();
    }

    @GetMapping("/{id}")
    public Game getGameById(@PathVariable Long id) {
        return gameService.getGameById(id);
    }

    @GetMapping("/{id}/board")
    public PackBoardDto getGameBoard(@PathVariable Long id) {
        return gameService.getGameBoard(id);
    }

    @GetMapping("/code/{joinCode}")
    public Game getGameByJoinCode(@PathVariable String joinCode) {
        return gameService.getGameByJoinCode(joinCode);
    }

    @PostMapping("/code/{joinCode}/join")
    public JoinGameResponse joinGameByCode(
            @PathVariable String joinCode,
            @Valid @RequestBody CreatePlayerRequest request
    ) {
        JoinGameResponse response = gameService.joinGameByCode(joinCode, request);
        simpMessagingTemplate.convertAndSend(
                "/topic/game/" + response.game().getId() + "/state",
                buildStateEvent("player_joined", response.playerId(), false, false, response.game())
        );
        return response;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Game createGame(@Valid @RequestBody CreateGameRequest request) {
        return gameService.createGame(request);
    }

    @PostMapping("/{gameId}/players")
    public Game addPlayer(@PathVariable Long gameId, @Valid @RequestBody CreatePlayerRequest request) {
        Game game = gameService.addPlayer(gameId, request);
        Long playerId = game.getPlayers().stream()
                .filter(player -> request.name().trim().equals(player.getName()))
                .map(Player::getId)
                .findFirst()
                .orElse(null);
        simpMessagingTemplate.convertAndSend(
                "/topic/game/" + gameId + "/state",
                buildStateEvent("player_joined", playerId, false, false, game)
        );
        return game;
    }

    @PostMapping("/{gameId}/players/{playerId}/score")
    public Game updatePlayerScore(
            @PathVariable Long gameId,
            @PathVariable Long playerId,
            @Valid @RequestBody UpdatePlayerScoreRequest request
    ) {
        Game game = gameService.updatePlayerScore(gameId, playerId, request);
        simpMessagingTemplate.convertAndSend(
                "/topic/game/" + gameId + "/score",
                buildScoreMessage(playerId, request.scoreChange())
        );
        return game;
    }

    @PostMapping("/{gameId}/active-player/{playerId}")
    public Game claimBuzz(@PathVariable Long gameId, @PathVariable Long playerId) {
        return gameService.claimBuzz(gameId, playerId);
    }

    @PostMapping("/{gameId}/active-player/clear")
    public Game clearActivePlayer(@PathVariable Long gameId) {
        return gameService.clearActivePlayer(gameId);
    }

    @PostMapping("/{gameId}/players/{playerId}/avatar")
    public Game updatePlayerAvatar(
            @PathVariable Long gameId,
            @PathVariable Long playerId,
            @RequestBody UpdatePlayerAvatarRequest request
    ) {
        Game game = gameService.updatePlayerAvatar(gameId, playerId, request);
        simpMessagingTemplate.convertAndSend(
                "/topic/game/" + gameId + "/state",
                buildStateEvent("avatar_updated", playerId, false, false, game)
        );
        return game;
    }

    @PostMapping("/{gameId}/questions/{questionId}/select")
    public Game selectQuestion(@PathVariable Long gameId, @PathVariable Long questionId) {
        Game before = gameService.getGameById(gameId);
        Game game = gameService.selectQuestion(gameId, questionId);
        SelectQuestionMessage message = new SelectQuestionMessage();
        message.setQuestionId(questionId);
        message.setBy(getCurrentActorName());
        simpMessagingTemplate.convertAndSend("/topic/game/" + gameId + "/select", message);
        if ("NEW".equals(before.getStatus())) {
            publishGameStateEvent(gameId, buildStateEvent("game_started", null, false, false, game));
        }
        simpMessagingTemplate.convertAndSend(
                "/topic/game/" + gameId + "/state",
                buildStateEvent("question_selected", null, false, false, game)
        );
        return game;
    }

    @PostMapping("/{gameId}/questions/{questionId}/complete")
    public Game completeQuestion(@PathVariable Long gameId, @PathVariable Long questionId) {
        Game before = gameService.getGameById(gameId);
        Game game = gameService.completeQuestion(gameId, questionId);
        simpMessagingTemplate.convertAndSend(
                "/topic/game/" + gameId + "/score",
                buildScoreMessage(null, 0)
        );
        simpMessagingTemplate.convertAndSend(
                "/topic/game/" + gameId + "/state",
                buildStateEvent("question_completed", null, true, false, game)
        );
        publishPhaseTransitionEvents(gameId, before, game);
        return game;
    }

    @PostMapping("/{gameId}/questions/{questionId}/judge")
    public Game adjudicateActiveAnswer(
            @PathVariable Long gameId,
            @PathVariable Long questionId,
            @Valid @RequestBody JudgeActiveAnswerRequest request
    ) {
        Game before = gameService.getGameById(gameId);
        Player activePlayer = before.getActivePlayer();
        Integer questionPrice = before.getCurrentQuestion() != null ? before.getCurrentQuestion().getPrice() : null;

        Game game = gameService.adjudicateActiveAnswer(gameId, questionId, request);

        boolean isCorrect = Boolean.TRUE.equals(request.correct());

        if (activePlayer != null && questionPrice != null) {
            int delta = isCorrect ? questionPrice : -questionPrice;
            simpMessagingTemplate.convertAndSend(
                    "/topic/game/" + gameId + "/score",
                    buildScoreMessage(activePlayer.getId(), delta)
            );
        }

        if (isCorrect) {
            simpMessagingTemplate.convertAndSend(
                    "/topic/game/" + gameId + "/score",
                    buildScoreMessage(null, 0)
            );
        }

        simpMessagingTemplate.convertAndSend(
                "/topic/game/" + gameId + "/state",
                buildStateEvent("answer_judged", activePlayer != null ? activePlayer.getId() : null, isCorrect, false, game)
        );
        publishPhaseTransitionEvents(gameId, before, game);

        return game;
    }

    @GetMapping("/{gameId}/final/submissions")
    public List<FinalRoundSubmissionDto> getFinalRoundSubmissions(@PathVariable Long gameId) {
        return gameService.getFinalRoundSubmissions(gameId);
    }

    @PostMapping("/{gameId}/final/submissions")
    public FinalRoundSubmissionDto submitFinalAnswer(
            @PathVariable Long gameId,
            @Valid @RequestBody FinalRoundSubmitRequest request
    ) {
        FinalRoundSubmissionDto submission = gameService.submitFinalAnswer(gameId, request);
        simpMessagingTemplate.convertAndSend(
                "/topic/game/" + gameId + "/final",
                buildFinalRoundEvent("submitted", submission.playerId())
        );
        simpMessagingTemplate.convertAndSend(
                "/topic/game/" + gameId + "/state",
                buildStateEvent("final_submitted", submission.playerId(), false, true, null)
        );
        return submission;
    }

    @PostMapping("/{gameId}/final/submissions/{submissionId}/judge")
    public Game judgeFinalSubmission(
            @PathVariable Long gameId,
            @PathVariable Long submissionId,
            @Valid @RequestBody JudgeFinalSubmissionRequest request
    ) {
        FinalRoundSubmissionDto submission = gameService.getFinalRoundSubmissions(gameId).stream()
                .filter(item -> item.id().equals(submissionId))
                .findFirst()
                .orElseThrow();

        int delta = Boolean.TRUE.equals(request.correct()) ? submission.wager() : -submission.wager();
        Game game = gameService.judgeFinalSubmission(gameId, submissionId, request);

        simpMessagingTemplate.convertAndSend(
                "/topic/game/" + gameId + "/score",
                buildScoreMessage(submission.playerId(), delta)
        );
        simpMessagingTemplate.convertAndSend(
                "/topic/game/" + gameId + "/final",
                buildFinalRoundEvent("judged", submission.playerId())
        );
        simpMessagingTemplate.convertAndSend(
                "/topic/game/" + gameId + "/state",
                buildStateEvent("final_judged", submission.playerId(), false, true, game)
        );

        return game;
    }

    private ScoreUpdateMessage buildScoreMessage(Long playerId, Integer delta) {
        ScoreUpdateMessage message = new ScoreUpdateMessage();
        message.setPlayerId(playerId);
        message.setDelta(delta);
        message.setBy(getCurrentActorName());
        return message;
    }

    private FinalRoundEventMessage buildFinalRoundEvent(String action, Long playerId) {
        FinalRoundEventMessage message = new FinalRoundEventMessage();
        message.setAction(action);
        message.setPlayerId(playerId);
        message.setBy(getCurrentActorName());
        return message;
    }

    private GameStateEventMessage buildStateEvent(String action, Long playerId, boolean refreshBoard, boolean refreshFinalSubmissions, Game game) {
        GameStateEventMessage message = new GameStateEventMessage();
        message.setAction(action);
        message.setPlayerId(playerId);
        message.setBy(getCurrentActorName());
        message.setRefreshBoard(refreshBoard);
        message.setRefreshFinalSubmissions(refreshFinalSubmissions);
        if (game != null) {
            PackRound round = game.getCurrentRound();
            message.setStatus(game.getStatus());
            message.setRoundId(round != null ? round.getId() : null);
            message.setRoundName(round != null ? round.getName() : null);
            message.setRoundType(round != null ? round.getRoundType() : null);
        }
        return message;
    }

    private void publishPhaseTransitionEvents(Long gameId, Game before, Game after) {
        Long beforeRoundId = before.getCurrentRound() != null ? before.getCurrentRound().getId() : null;
        Long afterRoundId = after.getCurrentRound() != null ? after.getCurrentRound().getId() : null;

        if (beforeRoundId != null && afterRoundId != null && !beforeRoundId.equals(afterRoundId)) {
            String action = ROUND_TYPE_FINAL.equals(after.getCurrentRound().getRoundType())
                    ? "final_round_opened"
                    : "round_changed";
            publishGameStateEvent(gameId, buildStateEvent(action, null, true, true, after));
        }

        if (!"FINISHED".equals(before.getStatus()) && "FINISHED".equals(after.getStatus())) {
            publishGameStateEvent(gameId, buildStateEvent("game_finished", null, true, true, after));
        }
    }

    private void publishGameStateEvent(Long gameId, GameStateEventMessage message) {
        simpMessagingTemplate.convertAndSend("/topic/game/" + gameId + "/state", message);
    }

    private String getCurrentActorName() {
        String name = SecurityContextHolder.getContext().getAuthentication() != null
                ? SecurityContextHolder.getContext().getAuthentication().getName()
                : null;
        return name == null || name.isBlank() ? "Host" : name;
    }
}
