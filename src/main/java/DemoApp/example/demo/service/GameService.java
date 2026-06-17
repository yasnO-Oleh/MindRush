package DemoApp.example.demo.service;

import DemoApp.example.demo.dto.CreateGameRequest;
import DemoApp.example.demo.dto.CreatePlayerRequest;
import DemoApp.example.demo.dto.FinalRoundSubmissionDto;
import DemoApp.example.demo.dto.FinalRoundSubmitRequest;
import DemoApp.example.demo.dto.JudgeActiveAnswerRequest;
import DemoApp.example.demo.dto.JudgeFinalSubmissionRequest;
import DemoApp.example.demo.dto.JoinGameResponse;
import DemoApp.example.demo.dto.PackBoardDto;
import DemoApp.example.demo.dto.UpdatePlayerAvatarRequest;
import DemoApp.example.demo.dto.UpdatePlayerScoreRequest;
import DemoApp.example.demo.model.FinalRoundSubmission;
import DemoApp.example.demo.model.Game;
import DemoApp.example.demo.model.Pack;
import DemoApp.example.demo.model.PackRound;
import DemoApp.example.demo.model.Player;
import DemoApp.example.demo.model.Question;
import DemoApp.example.demo.model.User;
import DemoApp.example.demo.repository.GameRepository;
import DemoApp.example.demo.repository.FinalRoundSubmissionRepository;
import DemoApp.example.demo.repository.PackRepository;
import DemoApp.example.demo.repository.PackRoundRepository;
import DemoApp.example.demo.repository.PlayerRepository;
import DemoApp.example.demo.repository.QuestionRepository;
import DemoApp.example.demo.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class GameService {
    private static final String ROUND_TYPE_FINAL = "FINAL";

    private final GameRepository gameRepository;
    private final PlayerRepository playerRepository;
    private final PackRepository packRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final PackRoundRepository packRoundRepository;
    private final FinalRoundSubmissionRepository finalRoundSubmissionRepository;
    private final PackService packService;

    public GameService(
            GameRepository gameRepository,
            PlayerRepository playerRepository,
            PackRepository packRepository,
            QuestionRepository questionRepository,
            UserRepository userRepository,
            PackRoundRepository packRoundRepository,
            FinalRoundSubmissionRepository finalRoundSubmissionRepository,
            PackService packService
    ) {
        this.gameRepository = gameRepository;
        this.playerRepository = playerRepository;
        this.packRepository = packRepository;
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
        this.packRoundRepository = packRoundRepository;
        this.finalRoundSubmissionRepository = finalRoundSubmissionRepository;
        this.packService = packService;
    }

    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }

    public Game getGameById(Long id) {
        return gameRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Game with id " + id + " not found"));
    }

    public Game getGameByJoinCode(String joinCode) {
        return gameRepository.findByJoinCode(joinCode)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Game with code " + joinCode + " not found"));
    }

    public Game createGame(CreateGameRequest request) {
        Pack pack = packRepository.findById(request.packId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Pack with id " + request.packId() + " not found"));

        String currentUsername = SecurityContextHolder.getContext().getAuthentication() != null
                ? SecurityContextHolder.getContext().getAuthentication().getName()
                : "Host";

        Game game = new Game();
        String joinCode = generateUniqueJoinCode();
        game.setName(pack.getName() + " Room");
        game.setStatus("NEW");
        game.setJoinCode(joinCode);
        game.setHostName(currentUsername == null || "anonymousUser".equals(currentUsername) ? "Host" : currentUsername);
        game.setHostAvatarUrl(normalizeAvatarUrl(request.hostAvatarUrl()));
        game.setPack(pack);
        game.setCurrentRound(packService.getOrCreateFirstRound(pack));
        return gameRepository.save(game);
    }

    public PackBoardDto getGameBoard(Long gameId) {
        Game game = getGameById(gameId);
        PackRound round = getCurrentRoundOrFirst(game);
        return packService.getPackRoundBoard(game.getPack().getId(), round.getId());
    }

    public JoinGameResponse joinGameByCode(String joinCode, CreatePlayerRequest request) {
        Game game = getGameByJoinCode(joinCode);
        String requestedName = request.name().trim();

        String currentUsername = SecurityContextHolder.getContext().getAuthentication() != null
                ? SecurityContextHolder.getContext().getAuthentication().getName()
                : null;

        Player player;
        if (currentUsername != null && !"anonymousUser".equals(currentUsername)) {
            player = playerRepository.findByGameIdAndUserUsername(game.getId(), currentUsername)
                    .orElseGet(() -> {
                        User user = userRepository.findByUsername(currentUsername)
                                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));

                        Player createdPlayer = new Player();
                        createdPlayer.setName(requestedName.isBlank() ? user.getUsername() : requestedName);
                        createdPlayer.setScore(0);
                        createdPlayer.setAvatarUrl(normalizeAvatarUrl(request.avatarUrl()));
                        createdPlayer.setGame(game);
                        createdPlayer.setUser(user);
                        return playerRepository.save(createdPlayer);
                    });
        } else {
            player = playerRepository.findByGameIdAndNameIgnoreCase(game.getId(), requestedName)
                    .orElseGet(() -> {
                        Player createdPlayer = new Player();
                        createdPlayer.setName(requestedName);
                        createdPlayer.setScore(0);
                        createdPlayer.setAvatarUrl(normalizeAvatarUrl(request.avatarUrl()));
                        createdPlayer.setGame(game);
                        return playerRepository.save(createdPlayer);
                    });
        }

        String avatarUrl = normalizeAvatarUrl(request.avatarUrl());
        if (avatarUrl != null && !avatarUrl.equals(player.getAvatarUrl())) {
            player.setAvatarUrl(avatarUrl);
            playerRepository.save(player);
        }

        return new JoinGameResponse(getGameById(game.getId()), player.getId());
    }

    public Game addPlayer(Long gameId, CreatePlayerRequest request) {
        Game game = getGameById(gameId);

        String currentUsername = SecurityContextHolder.getContext().getAuthentication() != null
                ? SecurityContextHolder.getContext().getAuthentication().getName()
                : null;

        if (currentUsername == null || "anonymousUser".equals(currentUsername)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required to add player");
        }

        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));

        Player player = new Player();
        player.setName(request.name());
        player.setScore(0);
        player.setAvatarUrl(normalizeAvatarUrl(request.avatarUrl()));
        player.setGame(game);
        player.setUser(user);
        playerRepository.save(player);

        return getGameById(gameId);
    }

    public Game updatePlayerAvatar(Long gameId, Long playerId, UpdatePlayerAvatarRequest request) {
        Game game = getGameById(gameId);
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Player with id " + playerId + " not found"));

        if (player.getGame() == null || !player.getGame().getId().equals(game.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Player does not belong to this game");
        }

        player.setAvatarUrl(normalizeAvatarUrl(request.avatarUrl()));
        playerRepository.save(player);

        return getGameById(gameId);
    }

    public Game updatePlayerScore(Long gameId, Long playerId, UpdatePlayerScoreRequest request) {
        Game game = getGameById(gameId);
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Player with id " + playerId + " not found"));

        if (player.getGame() == null || !player.getGame().getId().equals(game.getId())) {
            throw new ResponseStatusException(NOT_FOUND, "Player with id " + playerId + " is not in game " + gameId);
        }

        player.setScore(player.getScore() + request.scoreChange());
        playerRepository.save(player);

        return getGameById(gameId);
    }

    public Game claimBuzz(Long gameId, Long playerId) {
        Game game = getGameById(gameId);
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Player with id " + playerId + " not found"));

        if (player.getGame() == null || !player.getGame().getId().equals(game.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Player does not belong to this game");
        }
        if (game.getCurrentQuestion() == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "There is no active question right now");
        }
        if (game.getActivePlayer() != null) {
            return game;
        }

        game.setActivePlayer(player);
        return gameRepository.save(game);
    }

    public Game clearActivePlayer(Long gameId) {
        Game game = getGameById(gameId);
        game.setActivePlayer(null);
        return gameRepository.save(game);
    }

    public Game adjudicateActiveAnswer(Long gameId, Long questionId, JudgeActiveAnswerRequest request) {
        Game game = getGameById(gameId);
        Question question = getQuestionForGame(game, questionId);

        if (game.getCurrentQuestion() == null || !questionId.equals(game.getCurrentQuestion().getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This question is not active right now");
        }

        Player activePlayer = game.getActivePlayer();
        if (activePlayer == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "There is no active player to judge");
        }

        boolean correct = Boolean.TRUE.equals(request.correct());
        int currentScore = activePlayer.getScore() == null ? 0 : activePlayer.getScore();
        int price = question.getPrice() == null ? 0 : question.getPrice();
        activePlayer.setScore(currentScore + (correct ? price : -price));
        playerRepository.save(activePlayer);

        if (correct) {
            game.getUsedQuestionIds().add(question.getId());
            game.setCurrentQuestion(null);
            game.setActivePlayer(null);
            advanceRoundIfComplete(game);
            return gameRepository.save(game);
        }

        game.setActivePlayer(null);
        game.setStatus("QUESTION_ACTIVE");
        return gameRepository.save(game);
    }

    public Game selectQuestion(Long gameId, Long questionId) {
        Game game = getGameById(gameId);
        Question question = getQuestionForGame(game, questionId);

        if (game.getUsedQuestionIds().contains(questionId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Question already used in this game");
        }

        game.setCurrentQuestion(question);
        game.setActivePlayer(null);
        game.setStatus("QUESTION_ACTIVE");
        return gameRepository.save(game);
    }

    public Game completeQuestion(Long gameId, Long questionId) {
        Game game = getGameById(gameId);
        Question question = getQuestionForGame(game, questionId);

        if (game.getCurrentQuestion() == null || !questionId.equals(game.getCurrentQuestion().getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This question is not active right now");
        }

        game.getUsedQuestionIds().add(question.getId());
        game.setCurrentQuestion(null);
        game.setActivePlayer(null);
        advanceRoundIfComplete(game);
        return gameRepository.save(game);
    }

    public List<FinalRoundSubmissionDto> getFinalRoundSubmissions(Long gameId) {
        Game game = getGameById(gameId);
        PackRound round = getCurrentRoundOrFirst(game);
        ensureFinalRound(round);

        return finalRoundSubmissionRepository.findByGameIdAndRoundIdOrderByIdAsc(game.getId(), round.getId()).stream()
                .map(this::toFinalRoundSubmissionDto)
                .toList();
    }

    public FinalRoundSubmissionDto submitFinalAnswer(Long gameId, FinalRoundSubmitRequest request) {
        Game game = getGameById(gameId);
        PackRound round = getCurrentRoundOrFirst(game);
        ensureFinalRound(round);

        if (game.getCurrentQuestion() == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Final question is not active yet");
        }

        Player player = playerRepository.findById(request.playerId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Player with id " + request.playerId() + " not found"));
        if (player.getGame() == null || !player.getGame().getId().equals(game.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Player does not belong to this game");
        }

        int currentScore = Math.max(0, player.getScore() == null ? 0 : player.getScore());
        int wager = request.wager() == null ? 0 : request.wager();
        if (wager > currentScore) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Wager cannot be greater than player's score");
        }

        FinalRoundSubmission submission = finalRoundSubmissionRepository
                .findByGameIdAndRoundIdAndPlayerId(game.getId(), round.getId(), player.getId())
                .orElseGet(FinalRoundSubmission::new);

        if (Boolean.TRUE.equals(submission.getJudged())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This answer has already been judged");
        }

        submission.setGame(game);
        submission.setRound(round);
        submission.setPlayer(player);
        submission.setQuestion(game.getCurrentQuestion());
        submission.setWager(wager);
        submission.setAnswer(request.answer().trim());
        submission.setJudged(false);
        submission.setCorrect(null);

        return toFinalRoundSubmissionDto(finalRoundSubmissionRepository.save(submission));
    }

    public Game judgeFinalSubmission(Long gameId, Long submissionId, JudgeFinalSubmissionRequest request) {
        Game game = getGameById(gameId);
        PackRound round = getCurrentRoundOrFirst(game);
        ensureFinalRound(round);

        FinalRoundSubmission submission = finalRoundSubmissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Final answer with id " + submissionId + " not found"));
        if (submission.getGame() == null || !submission.getGame().getId().equals(game.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Final answer does not belong to this game");
        }
        if (Boolean.TRUE.equals(submission.getJudged())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This final answer has already been judged");
        }

        Player player = submission.getPlayer();
        int score = player.getScore() == null ? 0 : player.getScore();
        int wager = submission.getWager() == null ? 0 : submission.getWager();
        boolean correct = Boolean.TRUE.equals(request.correct());
        player.setScore(score + (correct ? wager : -wager));
        playerRepository.save(player);

        submission.setJudged(true);
        submission.setCorrect(correct);
        finalRoundSubmissionRepository.save(submission);

        return getGameById(gameId);
    }

    private void advanceRoundIfComplete(Game game) {
        PackRound currentRound = getCurrentRoundOrFirst(game);
        boolean allRoundQuestionsUsed = currentRound.getQuestions().stream()
                .map(Question::getId)
                .allMatch(questionId -> game.getUsedQuestionIds().contains(questionId));

        if (!allRoundQuestionsUsed) {
            game.setStatus("IN_PROGRESS");
            return;
        }

        List<PackRound> rounds = packRoundRepository.findByPackIdOrderByDisplayOrderAscIdAsc(game.getPack().getId());
        int currentIndex = -1;
        for (int index = 0; index < rounds.size(); index++) {
            if (rounds.get(index).getId().equals(currentRound.getId())) {
                currentIndex = index;
                break;
            }
        }

        if (currentIndex >= 0 && currentIndex + 1 < rounds.size()) {
            game.setCurrentRound(rounds.get(currentIndex + 1));
            game.setStatus("ROUND_ADVANCED");
            return;
        }

        game.setStatus("FINISHED");
    }

    private Question getQuestionForGame(Game game, Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Question with id " + questionId + " not found"));

        if (question.getPack() == null || game.getPack() == null || !game.getPack().getId().equals(question.getPack().getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Question does not belong to this game's pack");
        }

        PackRound currentRound = getCurrentRoundOrFirst(game);
        if (question.getRound() == null || !currentRound.getId().equals(question.getRound().getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Question does not belong to the current round");
        }

        return question;
    }

    private PackRound getCurrentRoundOrFirst(Game game) {
        if (game.getCurrentRound() != null) {
            return game.getCurrentRound();
        }

        PackRound firstRound = packRoundRepository.findFirstByPackIdOrderByDisplayOrderAscIdAsc(game.getPack().getId())
                .orElseGet(() -> packService.getOrCreateFirstRound(game.getPack()));
        game.setCurrentRound(firstRound);
        return gameRepository.save(game).getCurrentRound();
    }

    private void ensureFinalRound(PackRound round) {
        if (!ROUND_TYPE_FINAL.equals(round.getRoundType())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current round is not a final round");
        }
    }

    private FinalRoundSubmissionDto toFinalRoundSubmissionDto(FinalRoundSubmission submission) {
        Player player = submission.getPlayer();
        return new FinalRoundSubmissionDto(
                submission.getId(),
                player != null ? player.getId() : null,
                player != null ? player.getName() : "Player",
                submission.getWager(),
                submission.getAnswer(),
                submission.getJudged(),
                submission.getCorrect()
        );
    }

    private String normalizeAvatarUrl(String avatarUrl) {
        if (avatarUrl == null || avatarUrl.isBlank()) {
            return null;
        }
        String trimmed = avatarUrl.trim();
        if (!trimmed.startsWith("data:image/")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Avatar must be an image data URL");
        }
        if (trimmed.length() > 350_000) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Avatar image is too large");
        }
        return trimmed;
    }

    private String generateUniqueJoinCode() {
        for (int attempt = 0; attempt < 100; attempt++) {
            String candidate = String.format("%06d", ThreadLocalRandom.current().nextInt(1_000_000));
            if (!gameRepository.existsByJoinCode(candidate)) {
                return candidate;
            }
        }
        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not generate a unique game code");
    }
}
