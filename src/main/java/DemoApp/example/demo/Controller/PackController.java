package DemoApp.example.demo.controller;

import DemoApp.example.demo.dto.CreatePackRequest;
import DemoApp.example.demo.dto.CreateRoundRequest;
import DemoApp.example.demo.dto.PackBoardDto;
import DemoApp.example.demo.model.Pack;
import DemoApp.example.demo.model.PackRound;
import DemoApp.example.demo.service.PackService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/packs")
public class PackController {

    private final PackService packService;

    public PackController(PackService packService) {
        this.packService = packService;
    }

    @GetMapping
    public List<Pack> getPacks() {
        return packService.getAllPacks();
    }

    @GetMapping("/{id}")
    public Pack getPackById(@PathVariable Long id) {
        return packService.getPackById(id);
    }

    @GetMapping("/{id}/board")
    public PackBoardDto getPackBoard(@PathVariable Long id) {
        return packService.getPackBoard(id);
    }

    @GetMapping("/{id}/rounds")
    public List<DemoApp.example.demo.dto.PackRoundDto> getPackRounds(@PathVariable Long id) {
        return packService.getRounds(id);
    }

    @GetMapping("/{packId}/rounds/{roundId}/board")
    public PackBoardDto getPackRoundBoard(@PathVariable Long packId, @PathVariable Long roundId) {
        return packService.getPackRoundBoard(packId, roundId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Pack addPack(@Valid @RequestBody CreatePackRequest request) {
        return packService.addPack(request);
    }

    @PostMapping("/{packId}/rounds")
    @ResponseStatus(HttpStatus.CREATED)
    public PackRound addRound(@PathVariable Long packId, @Valid @RequestBody CreateRoundRequest request) {
        return packService.addRound(packId, request);
    }

    @PostMapping("/{packId}/questions/{questionId}")
    public Pack addQuestionToPack(@PathVariable Long packId, @PathVariable Long questionId) {
        return packService.addQuestionToPack(packId, questionId);
    }

    @PostMapping("/{packId}/rounds/{roundId}/questions/{questionId}")
    public Pack addQuestionToPackRound(@PathVariable Long packId, @PathVariable Long roundId, @PathVariable Long questionId) {
        return packService.addQuestionToPackRound(packId, roundId, questionId);
    }

    @DeleteMapping("/{packId}/rounds/{roundId}/questions/{questionId}")
    public Pack deleteQuestionFromPackRound(@PathVariable Long packId, @PathVariable Long roundId, @PathVariable Long questionId) {
        return packService.deleteQuestionFromPackRound(packId, roundId, questionId);
    }

    @PostMapping("/{packId}/categories/{categoryId}")
    public Pack addCategoryToPack(@PathVariable Long packId, @PathVariable Long categoryId) {
        return packService.addCategoryToPack(packId, categoryId);
    }

    @PostMapping("/{packId}/rounds/{roundId}/categories/{categoryId}")
    public Pack addCategoryToPackRound(@PathVariable Long packId, @PathVariable Long roundId, @PathVariable Long categoryId) {
        return packService.addCategoryToPackRound(packId, roundId, categoryId);
    }
}
