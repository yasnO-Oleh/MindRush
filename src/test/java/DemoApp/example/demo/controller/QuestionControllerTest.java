package DemoApp.example.demo.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class QuestionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getQuestionsReturnsDefaultQuestion() throws Exception {
        mockMvc.perform(get("/questions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].text").value("Capital of France?"))
                .andExpect(jsonPath("$[0].displayOrder").value(1));
    }

    @Test
    void postQuestionCreatesNewQuestion() throws Exception {
        mockMvc.perform(post("/questions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "text": "Largest planet?",
                                  "answer": "Jupiter",
                                  "price": 200,
                                  "displayOrder": 2
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.text").value("Largest planet?"))
                .andExpect(jsonPath("$.answer").value("Jupiter"))
                .andExpect(jsonPath("$.price").value(200))
                .andExpect(jsonPath("$.displayOrder").value(2));
    }

    @Test
    void postQuestionRejectsInvalidPayload() throws Exception {
        mockMvc.perform(post("/questions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "text": "",
                                  "answer": "",
                                  "price": 0
                                }
                                """))
                .andExpect(status().isBadRequest());
    }
}
