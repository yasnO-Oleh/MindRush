package DemoApp.example.demo.service;

import DemoApp.example.demo.dto.CreateQuestionRequest;
import DemoApp.example.demo.model.Question;
import DemoApp.example.demo.repository.QuestionRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class QuestionService {
    private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Question getQuestionById(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Question with id " + id + " not found"));
    }

    public Question addQuestion(CreateQuestionRequest request) {
        Question question = new Question();
        question.setId(null);
        question.setText(request.text());
        question.setAnswer(request.answer());
        question.setPrice(request.price());
        question.setDisplayOrder(request.displayOrder());
        if (question.getDisplayOrder() == null) {
            question.setDisplayOrder(1);
        }
        question.setMediaUrl(request.mediaUrl());
        question.setMediaType(request.mediaType());
        return questionRepository.save(question);
    }

    public Question setQuestionMedia(Long id, String mediaUrl, String mediaType) {
        Question question = getQuestionById(id);
        question.setMediaUrl(mediaUrl);
        question.setMediaType(mediaType);
        return questionRepository.save(question);
    }
}
