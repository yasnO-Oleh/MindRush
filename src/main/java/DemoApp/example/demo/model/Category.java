package DemoApp.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "display_order")
    private Integer displayOrder;

    @ManyToOne
    @JoinColumn(name = "pack_id")
    @JsonIgnoreProperties({"questions", "categories", "rounds"})
    private Pack pack;

    @ManyToOne
    @JoinColumn(name = "round_id")
    @JsonIgnoreProperties({"questions", "categories", "pack"})
    private PackRound round;

    @OneToMany(mappedBy = "category", fetch = FetchType.EAGER)
    @OrderBy("displayOrder ASC")
    @JsonIgnoreProperties({"category", "pack"})
    private List<Question> questions = new ArrayList<>();

    public Category() {
    }

    public Category(Long id, String name, Integer displayOrder) {
        this.id = id;
        this.name = name;
        this.displayOrder = displayOrder;
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

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public Pack getPack() {
        return pack;
    }

    public void setPack(Pack pack) {
        this.pack = pack;
    }

    public PackRound getRound() {
        return round;
    }

    public void setRound(PackRound round) {
        this.round = round;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }
}
