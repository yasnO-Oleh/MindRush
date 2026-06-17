package DemoApp.example.demo.service;

import DemoApp.example.demo.dto.CreateCategoryRequest;
import DemoApp.example.demo.model.Category;
import DemoApp.example.demo.model.Question;
import DemoApp.example.demo.repository.CategoryRepository;
import DemoApp.example.demo.repository.QuestionRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class CategoryService {
    private static final int MAX_QUESTIONS_PER_CATEGORY = 5;

    private final CategoryRepository categoryRepository;
    private final QuestionRepository questionRepository;

    public CategoryService(CategoryRepository categoryRepository, QuestionRepository questionRepository) {
        this.categoryRepository = categoryRepository;
        this.questionRepository = questionRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Category with id " + id + " not found"));
    }

    public Category addCategory(CreateCategoryRequest request) {
        Category category = new Category();
        category.setId(null);
        category.setName(request.name());
        category.setDisplayOrder(request.displayOrder());
        if (category.getDisplayOrder() == null) {
            category.setDisplayOrder(1);
        }
        return categoryRepository.save(category);
    }

    public Category addQuestionToCategory(Long categoryId, Long questionId) {
        Category category = getCategoryById(categoryId);
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Question with id " + questionId + " not found"));

        if (question.getCategory() == null && category.getQuestions().size() >= MAX_QUESTIONS_PER_CATEGORY) {
            throw new ResponseStatusException(BAD_REQUEST, "A category can contain at most 5 questions");
        }

        question.setCategory(category);
        questionRepository.save(question);

        return getCategoryById(categoryId);
    }
}
