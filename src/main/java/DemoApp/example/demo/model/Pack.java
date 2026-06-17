package DemoApp.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "packs")
public class Pack {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @OneToMany(mappedBy = "pack", fetch = FetchType.EAGER)
    @OrderBy("displayOrder ASC")
    @JsonIgnoreProperties({"pack", "category", "round"})
    private List<Question> questions = new ArrayList<>();

    @OneToMany(mappedBy = "pack", fetch = FetchType.EAGER)
    @OrderBy("displayOrder ASC")
    @JsonIgnoreProperties({"pack", "questions", "round"})
    private List<Category> categories = new ArrayList<>();

    @OneToMany(mappedBy = "pack", fetch = FetchType.EAGER)
    @OrderBy("displayOrder ASC")
    @JsonIgnoreProperties({"pack", "questions", "categories"})
    private List<PackRound> rounds = new ArrayList<>();

    public Pack() {
    }

    public Pack(Long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public List<Category> getCategories() {
        return categories;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }

    public List<PackRound> getRounds() {
        return rounds;
    }

    public void setRounds(List<PackRound> rounds) {
        this.rounds = rounds;
    }
}
