package DemoApp.example.demo.repository;

import DemoApp.example.demo.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long> {
}
