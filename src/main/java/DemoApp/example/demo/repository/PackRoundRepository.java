package DemoApp.example.demo.repository;

import DemoApp.example.demo.model.PackRound;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PackRoundRepository extends JpaRepository<PackRound, Long> {
    List<PackRound> findByPackIdOrderByDisplayOrderAscIdAsc(Long packId);

    Optional<PackRound> findFirstByPackIdOrderByDisplayOrderAscIdAsc(Long packId);
}
