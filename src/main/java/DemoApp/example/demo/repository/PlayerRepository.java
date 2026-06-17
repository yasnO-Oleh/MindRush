package DemoApp.example.demo.repository;

import DemoApp.example.demo.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PlayerRepository extends JpaRepository<Player, Long> {
    Optional<Player> findByGameIdAndNameIgnoreCase(Long gameId, String name);

    Optional<Player> findByGameIdAndUserUsername(Long gameId, String username);
}
