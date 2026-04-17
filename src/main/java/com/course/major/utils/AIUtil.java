package com.course.major.utils;

import com.course.major.dto.GroqDTO;
import com.course.major.pojo.GroqMsg;
import io.github.sashirestela.openai.SimpleOpenAI;
import io.github.sashirestela.openai.domain.chat.ChatRequest;
import io.github.sashirestela.openai.domain.chat.message.ChatMsgSystem;
import io.github.sashirestela.openai.domain.chat.message.ChatMsgUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import tools.jackson.databind.JsonNode;

import java.util.List;

@Component
public class AIUtil {

    /*private final SimpleOpenAI openAI;

    public AIUtil(SimpleOpenAI openAI) {
        this.openAI = openAI;
    }
    public String ask(String prompt) {
        ChatMsgSystem system = new ChatMsgSystem(
                "your job is to provide the json in a proper format"
        );
        ChatMsgUser user = new ChatMsgUser(prompt);

        ChatRequest request = ChatRequest.builder()
                .model("gpt-3.5-turbo")
                .messages(List.of(system, user))
                .build();

        try {
            var response = openAI.chatCompletions()
                    .create(request)
                    .join();
            return response.getChoices()
                    .getFirst()
                    .getMessage()
                    .getContent();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error communicating with OpenAI: " + e.getMessage();
        }

    }*/
    @Autowired
    @Qualifier("groqWebClient")
    private WebClient webClient;
    public String askGroq(String prompt) {
        GroqDTO request = new GroqDTO();
        request.setModel("llama-3.3-70b-versatile");
        GroqMsg message = new GroqMsg();
        message.setContent(prompt);
        message.setRole("user");
        request.setMessages(List.of(message));
        return webClient.post()
                .uri("/chat/completions")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(node -> node.get("choices")
                        .get(0)
                        .get("message")
                        .get("content")
                        .asString())
                .block();
    }
}
