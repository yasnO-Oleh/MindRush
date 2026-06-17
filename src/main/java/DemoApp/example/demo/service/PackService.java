package DemoApp.example.demo.service;

import DemoApp.example.demo.dto.BoardCategoryDto;
import DemoApp.example.demo.dto.BoardQuestionDto;
import DemoApp.example.demo.dto.CreatePackRequest;
import DemoApp.example.demo.dto.CreateRoundRequest;
import DemoApp.example.demo.dto.PackBoardDto;
import DemoApp.example.demo.dto.PackRoundDto;
import DemoApp.example.demo.model.Category;
import DemoApp.example.demo.model.Pack;
import DemoApp.example.demo.model.PackRound;
import DemoApp.example.demo.model.Question;
import DemoApp.example.demo.repository.PackRepository;
import DemoApp.example.demo.repository.CategoryRepository;
import DemoApp.example.demo.repository.PackRoundRepository;
import DemoApp.example.demo.repository.QuestionRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class PackService {
    private static final int MAX_BOARD_CATEGORIES = 6;
    private static final String ROUND_TYPE_BOARD = "BOARD";
    private static final String ROUND_TYPE_FINAL = "FINAL";

    private final PackRepository packRepository;
    private final QuestionRepository questionRepository;
    private final CategoryRepository categoryRepository;
    private final PackRoundRepository packRoundRepository;

    public PackService(PackRepository packRepository, QuestionRepository questionRepository, CategoryRepository categoryRepository, PackRoundRepository packRoundRepository) {
        this.packRepository = packRepository;
        this.questionRepository = questionRepository;
        this.categoryRepository = categoryRepository;
        this.packRoundRepository = packRoundRepository;
    }

    public List<Pack> getAllPacks() {
        return packRepository.findAll();
    }

    public Pack getPackById(Long id) {
        return packRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Pack with id " + id + " not found"));
    }

    public PackBoardDto getPackBoard(Long id) {
        Pack pack = getPackById(id);
        PackRound round = getOrCreateFirstRound(pack);
        return getPackRoundBoard(pack.getId(), round.getId());
    }

    public PackBoardDto getPackRoundBoard(Long packId, Long roundId) {
        Pack pack = getPackById(packId);
        PackRound round = getRoundForPack(pack, roundId);

        List<PackRoundDto> rounds = getRounds(packId);

        List<BoardCategoryDto> categories = pack.getCategories().stream()
                .filter(category -> category.getRound() != null && category.getRound().getId().equals(round.getId()))
                .map(category -> new BoardCategoryDto(
                        category.getId(),
                        category.getName(),
                        category.getDisplayOrder()
                ))
                .toList();

        List<BoardQuestionDto> questions = pack.getQuestions().stream()
                .filter(question -> question.getRound() != null && question.getRound().getId().equals(round.getId()))
                .map(question -> new BoardQuestionDto(
                        question.getId(),
                        question.getText(),
                        question.getPrice(),
                        question.getDisplayOrder(),
                        question.getCategory() != null ? question.getCategory().getId() : null
                ))
                .toList();

        return new PackBoardDto(
                pack.getId(),
                pack.getName(),
                pack.getDescription(),
                round.getId(),
                round.getName(),
                round.getDisplayOrder(),
                round.getRoundType(),
                rounds,
                categories,
                questions
        );
    }

    public List<PackRoundDto> getRounds(Long packId) {
        Pack pack = getPackById(packId);
        getOrCreateFirstRound(pack);
        return packRoundRepository.findByPackIdOrderByDisplayOrderAscIdAsc(packId).stream()
                .map(round -> new PackRoundDto(round.getId(), round.getName(), round.getDisplayOrder(), round.getRoundType()))
                .toList();
    }

    public Pack addPack(CreatePackRequest request) {
        Pack pack = new Pack();
        pack.setId(null);
        pack.setName(request.name());
        pack.setDescription(request.description());
        Pack savedPack = packRepository.save(pack);
        createRound(savedPack, "Round 1", 1, ROUND_TYPE_BOARD);
        return getPackById(savedPack.getId());
    }

    public PackRound addRound(Long packId, CreateRoundRequest request) {
        Pack pack = getPackById(packId);
        int nextOrder = packRoundRepository.findByPackIdOrderByDisplayOrderAscIdAsc(packId).size() + 1;
        return createRound(
                pack,
                request.name(),
                request.displayOrder() == null ? nextOrder : request.displayOrder(),
                request.roundType()
        );
    }

    public Pack addQuestionToPack(Long packId, Long questionId) {
        Pack pack = getPackById(packId);
        PackRound round = getOrCreateFirstRound(pack);
        return addQuestionToPackRound(packId, round.getId(), questionId);
    }

    public Pack addQuestionToPackRound(Long packId, Long roundId, Long questionId) {
        Pack pack = getPackById(packId);
        PackRound round = getRoundForPack(pack, roundId);
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Question with id " + questionId + " not found"));

        if (ROUND_TYPE_FINAL.equals(round.getRoundType())) {
            long finalQuestions = pack.getQuestions().stream()
                    .filter(item -> item.getRound() != null && item.getRound().getId().equals(round.getId()))
                    .filter(item -> !item.getId().equals(question.getId()))
                    .count();
            if (finalQuestions >= 1) {
                throw new ResponseStatusException(BAD_REQUEST, "Final round can contain only one question");
            }
            question.setCategory(null);
        }

        question.setPack(pack);
        question.setRound(round);
        questionRepository.save(question);

        return getPackById(packId);
    }

    public Pack deleteQuestionFromPackRound(Long packId, Long roundId, Long questionId) {
        Pack pack = getPackById(packId);
        PackRound round = getRoundForPack(pack, roundId);
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Question with id " + questionId + " not found"));

        if (question.getPack() == null || !pack.getId().equals(question.getPack().getId())) {
            throw new ResponseStatusException(BAD_REQUEST, "Question does not belong to this pack");
        }

        if (question.getRound() == null || !round.getId().equals(question.getRound().getId())) {
            throw new ResponseStatusException(BAD_REQUEST, "Question does not belong to this round");
        }

        questionRepository.delete(question);
        return getPackById(packId);
    }

    public Pack addCategoryToPack(Long packId, Long categoryId) {
        Pack pack = getPackById(packId);
        PackRound round = getOrCreateFirstRound(pack);
        return addCategoryToPackRound(packId, round.getId(), categoryId);
    }

    public Pack addCategoryToPackRound(Long packId, Long roundId, Long categoryId) {
        Pack pack = getPackById(packId);
        PackRound round = getRoundForPack(pack, roundId);
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Category with id " + categoryId + " not found"));

        if (ROUND_TYPE_FINAL.equals(round.getRoundType())) {
            throw new ResponseStatusException(BAD_REQUEST, "Final round does not use categories");
        }

        long categoriesInRound = pack.getCategories().stream()
                .filter(item -> item.getRound() != null && item.getRound().getId().equals(round.getId()))
                .count();
        if (category.getRound() == null && categoriesInRound >= MAX_BOARD_CATEGORIES) {
            throw new ResponseStatusException(BAD_REQUEST, "A round can contain at most 6 categories");
        }

        category.setPack(pack);
        category.setRound(round);
        categoryRepository.save(category);

        return getPackById(packId);
    }

    public PackRound getOrCreateFirstRound(Pack pack) {
        return packRoundRepository.findFirstByPackIdOrderByDisplayOrderAscIdAsc(pack.getId())
                .orElseGet(() -> createRound(pack, "Round 1", 1, ROUND_TYPE_BOARD));
    }

    private PackRound getRoundForPack(Pack pack, Long roundId) {
        PackRound round = packRoundRepository.findById(roundId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Round with id " + roundId + " not found"));

        if (round.getPack() == null || !pack.getId().equals(round.getPack().getId())) {
            throw new ResponseStatusException(BAD_REQUEST, "Round does not belong to this pack");
        }

        return round;
    }

    private PackRound createRound(Pack pack, String name, Integer displayOrder, String roundType) {
        PackRound round = new PackRound();
        round.setName(name);
        round.setDisplayOrder(displayOrder == null ? 1 : displayOrder);
        round.setRoundType(normalizeRoundType(roundType));
        round.setPack(pack);
        return packRoundRepository.save(round);
    }

    private String normalizeRoundType(String roundType) {
        return ROUND_TYPE_FINAL.equalsIgnoreCase(roundType) ? ROUND_TYPE_FINAL : ROUND_TYPE_BOARD;
    }
}
