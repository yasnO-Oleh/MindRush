package DemoApp.example.demo.controller;

import DemoApp.example.demo.dto.CreateCategoryRequest;
import DemoApp.example.demo.model.Category;
import DemoApp.example.demo.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<Category> getCategories() {
        return categoryService.getAllCategories();
    }

    @GetMapping("/{id}")
    public Category getCategoryById(@PathVariable Long id) {
        return categoryService.getCategoryById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Category addCategory(@Valid @RequestBody CreateCategoryRequest request) {
        return categoryService.addCategory(request);
    }

    @PostMapping("/{categoryId}/questions/{questionId}")
    public Category addQuestionToCategory(@PathVariable Long categoryId, @PathVariable Long questionId) {
        return categoryService.addQuestionToCategory(categoryId, questionId);
    }
}
