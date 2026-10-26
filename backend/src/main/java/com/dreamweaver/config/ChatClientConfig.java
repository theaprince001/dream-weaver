package com.dreamweaver.config;


import com.dreamweaver.prompts.Prompts;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ChatClientConfig {

    @Bean
    public ChatClient dreamChatClient(ChatClient.Builder builder) {
        return builder.
                defaultSystem(Prompts.ANALYST_SYSTEM)
                .build();
    }
}
