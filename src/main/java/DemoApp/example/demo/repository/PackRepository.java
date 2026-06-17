package DemoApp.example.demo.repository;

import DemoApp.example.demo.model.Pack;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PackRepository extends JpaRepository<Pack, Long> {
}
