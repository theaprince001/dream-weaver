package com.dreamweaver.service;


import com.dreamweaver.model.DreamAnalysis;
import com.dreamweaver.prompts.Prompts;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class DreamAnalysisService {

    private final ChatClient chatClient;
    public DreamAnalysisService(ChatClient dreamChatClient) {
        this.chatClient = dreamChatClient;
    }

    public DreamAnalysis analyze(String dreamText){
        try {
            return chatClient.prompt()
                    .user(u -> u.text(Prompts.ANALYSIS_USER_TEMPLATE)
                            .param("dream", dreamText))
                    .call()
                    .entity(DreamAnalysis.class);
        } catch (org.springframework.web.client.HttpServerErrorException e) {
            // This will print the exact JSON error from Groq
            System.err.println("=== GROQ ERROR BODY ===");
            System.err.println(e.getResponseBodyAsString());
            throw e;
        }


    }
}
