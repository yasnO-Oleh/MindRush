package DemoApp.example.demo.controller;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class GameControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void postGameCreatesNewGame() throws Exception {
        mockMvc.perform(post("/games")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Friday Quiz",
                                  "packId": 1
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Friday Quiz"))
                .andExpect(jsonPath("$.status").value("NEW"))
                .andExpect(jsonPath("$.pack.id").value(1));
    }

    @Test
    void postPlayerAddsPlayerToGame() throws Exception {
        MvcResult createGameResult = mockMvc.perform(post("/games")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Friday Quiz",
                                  "packId": 1
                                }
                                """))
                .andReturn();

        Long gameId = JsonPath.read(createGameResult.getResponse().getContentAsString(), "$.id");

        mockMvc.perform(post("/games/" + gameId + "/players")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Alice"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.players[0].name").value("Alice"))
                .andExpect(jsonPath("$.players[0].score").value(0));
    }

    @Test
    void postScoreUpdatesPlayerScore() throws Exception {
        MvcResult createGameResult = mockMvc.perform(post("/games")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Friday Quiz",
                                  "packId": 1
                                }
                                """))
                .andReturn();

        Long gameId = JsonPath.read(createGameResult.getResponse().getContentAsString(), "$.id");

        MvcResult addPlayerResult = mockMvc.perform(post("/games/" + gameId + "/players")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Alice"
                                }
                                """))
                .andReturn();

        Long playerId = JsonPath.read(addPlayerResult.getResponse().getContentAsString(), "$.players[0].id");

        mockMvc.perform(post("/games/" + gameId + "/players/" + playerId + "/score")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "scoreChange": 200
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.players[0].score").value(200));
    }

    @Test
    void postGameRejectsInvalidPayload() throws Exception {
        mockMvc.perform(post("/games")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "",
                                  "packId": 0
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getGamesReturnsCreatedGame() throws Exception {
        mockMvc.perform(post("/games")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Friday Quiz",
                                  "packId": 1
                                }
                                """));

        mockMvc.perform(get("/games"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Friday Quiz"));
    }
}
