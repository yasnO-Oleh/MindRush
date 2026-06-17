package DemoApp.example.demo.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PackControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getPacksReturnsDefaultPack() throws Exception {
        mockMvc.perform(get("/packs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Starter Pack"))
                .andExpect(jsonPath("$[0].categories[0].displayOrder").value(1))
                .andExpect(jsonPath("$[0].questions[0].displayOrder").value(1));
    }

    @Test
    void postPackCreatesNewPack() throws Exception {
        mockMvc.perform(post("/packs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Science Pack",
                                  "description": "Questions about science"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.name").value("Science Pack"))
                .andExpect(jsonPath("$.description").value("Questions about science"));
    }

    @Test
    void postPackRejectsInvalidPayload() throws Exception {
        mockMvc.perform(post("/packs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "",
                                  "description": ""
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void postPackQuestionLinkAddsQuestionToPack() throws Exception {
        mockMvc.perform(post("/packs/1/questions/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.questions[0].id").value(1))
                .andExpect(jsonPath("$.questions[0].text").value("Capital of France?"));
    }

    @Test
    void postPackCategoryLinkAddsCategoryToPack() throws Exception {
        mockMvc.perform(post("/packs/1/categories/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.categories[0].id").value(1))
                .andExpect(jsonPath("$.categories[0].name").value("Geography"));
    }

    @Test
    void getPackBoardReturnsOrderedBoard() throws Exception {
        mockMvc.perform(get("/packs/1/board"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.categories[0].name").value("Geography"))
                .andExpect(jsonPath("$.categories[0].displayOrder").value(1))
                .andExpect(jsonPath("$.questions[0].text").value("Capital of France?"))
                .andExpect(jsonPath("$.questions[0].displayOrder").value(1));
    }

    @Test
    void deletePackRoundQuestionRemovesQuestionFromBoard() throws Exception {
        mockMvc.perform(delete("/packs/1/rounds/1/questions/1"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/packs/1/rounds/1/board"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.questions").isEmpty());
    }
}
