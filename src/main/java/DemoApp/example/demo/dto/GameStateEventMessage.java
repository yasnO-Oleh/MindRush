package DemoApp.example.demo.dto;

public class GameStateEventMessage {
    private String action;
    private Long playerId;
    private Long roundId;
    private String roundName;
    private String roundType;
    private String status;
    private String by;
    private boolean refreshBoard;
    private boolean refreshFinalSubmissions;

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public Long getPlayerId() {
        return playerId;
    }

    public void setPlayerId(Long playerId) {
        this.playerId = playerId;
    }

    public Long getRoundId() {
        return roundId;
    }

    public void setRoundId(Long roundId) {
        this.roundId = roundId;
    }

    public String getRoundName() {
        return roundName;
    }

    public void setRoundName(String roundName) {
        this.roundName = roundName;
    }

    public String getRoundType() {
        return roundType;
    }

    public void setRoundType(String roundType) {
        this.roundType = roundType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getBy() {
        return by;
    }

    public void setBy(String by) {
        this.by = by;
    }

    public boolean isRefreshBoard() {
        return refreshBoard;
    }

    public void setRefreshBoard(boolean refreshBoard) {
        this.refreshBoard = refreshBoard;
    }

    public boolean isRefreshFinalSubmissions() {
        return refreshFinalSubmissions;
    }

    public void setRefreshFinalSubmissions(boolean refreshFinalSubmissions) {
        this.refreshFinalSubmissions = refreshFinalSubmissions;
    }
}
