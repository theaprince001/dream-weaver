package com.dreamweaver.web;

import com.dreamweaver.config.TokenBudget;
import com.dreamweaver.model.DreamAnalysis;
import com.dreamweaver.model.DreamRequest;
import com.dreamweaver.service.DreamAnalysisService;
import com.dreamweaver.service.SynthesisService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

@RestController
@RequestMapping("/api/dreams")
public class DreamController {

    private final DreamAnalysisService analysisService;
    private final SynthesisService synthesisService;
    private final TokenBudget tokenBudget;

    public DreamController(DreamAnalysisService analysisService, SynthesisService synthesisService, TokenBudget tokenBudget) {
        this.analysisService = analysisService;
        this.synthesisService = synthesisService;
        this.tokenBudget = tokenBudget;
    }

    @PostMapping("/analyze")
    public DreamAnalysis analyze(@Valid @RequestBody DreamRequest request) {
        if (!tokenBudget.tryConsume()) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "The dreamer has retired for today.");
        }
        return analysisService.analyze(request.dreamText());
    }

    @PostMapping(value = "/synthesis", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter synthesis(@Valid @RequestBody DreamRequest request) {
        if (!tokenBudget.tryConsume()) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "The dreamer has retired for today.");
        }

        SseEmitter emitter = new SseEmitter(90_000L); // 90 second timeout

        synthesisService.streamSynthesis(request.dreamText())
                .subscribe(
                        token -> {
                            try {
                                emitter.send(SseEmitter.event().data(token));
                            } catch (IOException e) {
                                emitter.completeWithError(e);
                            }
                        },
                        emitter::completeWithError,
                        emitter::complete
                );

        return emitter;
    }
}