package DemoApp.example.demo.dto;

public class ScoreUpdateMessage {
    private Long playerId;
    private Integer delta;
    private String by;
    public Long getPlayerId() { return playerId; }
    public void setPlayerId(Long playerId) { this.playerId = playerId; }
    public Integer getDelta() { return delta; }
    public void setDelta(Integer delta) { this.delta = delta; }
    public String getBy() { return by; }
    public void setBy(String by) { this.by = by; }
}
