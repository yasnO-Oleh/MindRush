package DemoApp.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.ElementCollection;
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
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "games")
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String status;

    @Column(name = "join_code", nullable = false, unique = true, length = 6)
    private String joinCode;

    @Column(name = "host_name", nullable = false)
    private String hostName;

    @Column(name = "host_avatar_url", columnDefinition = "TEXT")
    private String hostAvatarUrl;

    @ManyToOne
    @JoinColumn(name = "pack_id")
    @JsonIgnoreProperties({"questions", "categories", "rounds"})
    private Pack pack;

    @ManyToOne
    @JoinColumn(name = "current_round_id")
    @JsonIgnoreProperties({"pack", "questions", "categories"})
    private PackRound currentRound;

    @ManyToOne
    @JoinColumn(name = "current_question_id")
    @JsonIgnoreProperties({"pack", "category"})
    private Question currentQuestion;

    @ManyToOne
    @JoinColumn(name = "active_player_id")
    @JsonIgnoreProperties("game")
    private Player activePlayer;

    @OneToMany(mappedBy = "game", fetch = FetchType.EAGER)
    @OrderBy("id ASC")
    @JsonIgnoreProperties("game")
    private List<Player> players = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "game_used_questions", joinColumns = @JoinColumn(name = "game_id"))
    @Column(name = "question_id")
    private Set<Long> usedQuestionIds = new LinkedHashSet<>();

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getJoinCode() {
        return joinCode;
    }

    public void setJoinCode(String joinCode) {
        this.joinCode = joinCode;
    }

    public String getHostName() {
        return hostName;
    }

    public void setHostName(String hostName) {
        this.hostName = hostName;
    }

    public String getHostAvatarUrl() {
        return hostAvatarUrl;
    }

    public void setHostAvatarUrl(String hostAvatarUrl) {
        this.hostAvatarUrl = hostAvatarUrl;
    }

    public Pack getPack() {
        return pack;
    }

    public void setPack(Pack pack) {
        this.pack = pack;
    }

    public PackRound getCurrentRound() {
        return currentRound;
    }

    public void setCurrentRound(PackRound currentRound) {
        this.currentRound = currentRound;
    }

    public List<Player> getPlayers() {
        return players;
    }

    public void setPlayers(List<Player> players) {
        this.players = players;
    }

    public Question getCurrentQuestion() {
        return currentQuestion;
    }

    public void setCurrentQuestion(Question currentQuestion) {
        this.currentQuestion = currentQuestion;
    }

    public Player getActivePlayer() {
        return activePlayer;
    }

    public void setActivePlayer(Player activePlayer) {
        this.activePlayer = activePlayer;
    }

    public Set<Long> getUsedQuestionIds() {
        return usedQuestionIds;
    }

    public void setUsedQuestionIds(Set<Long> usedQuestionIds) {
        this.usedQuestionIds = usedQuestionIds;
    }
}
