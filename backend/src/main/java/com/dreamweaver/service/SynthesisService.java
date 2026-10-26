package com.dreamweaver.service;


import com.dreamweaver.prompts.Prompts;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
public class SynthesisService {

    private final ChatClient chatClient;
    public SynthesisService(ChatClient.Builder chatClient) {
        this.chatClient = chatClient
                .defaultSystem(Prompts.SYNTHESIS_SYSTEM)
                .build();
    }

    public Flux<String> streamSynthesis(String dreamText) {
        return chatClient.prompt()
                .user(u -> u.text(Prompts.SYNTHESIS_USER_TEMPLATE)
                .param("dream", dreamText))
                .stream()
                .content();
    }
}
