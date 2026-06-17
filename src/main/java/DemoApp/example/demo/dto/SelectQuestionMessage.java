package DemoApp.example.demo.dto;

public class SelectQuestionMessage {
    private Long questionId;
    private String by;
    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }
    public String getBy() { return by; }
    public void setBy(String by) { this.by = by; }
}
