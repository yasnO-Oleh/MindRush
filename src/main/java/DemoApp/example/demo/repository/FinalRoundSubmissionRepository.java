package DemoApp.example.demo.repository;

import DemoApp.example.demo.model.FinalRoundSubmission;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FinalRoundSubmissionRepository extends JpaRepository<FinalRoundSubmission, Long> {
    @EntityGraph(attributePaths = {"player", "game", "round", "question"})
    List<FinalRoundSubmission> findByGameIdAndRoundIdOrderByIdAsc(Long gameId, Long roundId);

    @EntityGraph(attributePaths = {"player", "game", "round", "question"})
    Optional<FinalRoundSubmission> findByGameIdAndRoundIdAndPlayerId(Long gameId, Long roundId, Long playerId);

    @Override
    @EntityGraph(attributePaths = {"player", "game", "round", "question"})
    Optional<FinalRoundSubmission> findById(Long id);
}
