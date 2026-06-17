package DemoApp.example.demo.repository;

import DemoApp.example.demo.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GameRepository extends JpaRepository<Game, Long> {
    boolean existsByJoinCode(String joinCode);

    Optional<Game> findByJoinCode(String joinCode);
}
