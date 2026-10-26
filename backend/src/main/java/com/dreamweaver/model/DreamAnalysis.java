package com.dreamweaver.model;

import java.util.List;

public record DreamAnalysis(

        String title,
        List<Symbol> symbols,
        List<Emotion> emotions,
        List<String> archetypes,
        String interpretation,
        String advice
) {
}
