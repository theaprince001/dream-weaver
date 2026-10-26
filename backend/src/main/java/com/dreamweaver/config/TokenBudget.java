package com.dreamweaver.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicInteger;


@Component
public class TokenBudget {
    private static final int MAX_CALLS_PER_DAY = 500;
    private final AtomicInteger count = new AtomicInteger(0);

    public boolean tryConsume(){
        return count.incrementAndGet() <= MAX_CALLS_PER_DAY;
    }
}
