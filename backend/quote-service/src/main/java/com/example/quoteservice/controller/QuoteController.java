package com.example.quoteservice.controller;

import com.example.quoteservice.model.Quote;
import com.example.quoteservice.service.QuoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/quotes")
@Tag(name = "Quotes", description = "Quote management endpoints")
public class QuoteController {

    private final QuoteService quoteService;

    public QuoteController(QuoteService quoteService) {
        this.quoteService = quoteService;
    }

    @GetMapping
    @Operation(summary = "Get all quotes")
    public List<Quote> getAllQuotes() {
        return quoteService.getAllQuotes();
    }

    @GetMapping("/random")
    @Operation(summary = "Get a random quote")
    public Quote getRandomQuote() {
        return quoteService.getRandomQuote();
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "Get quotes by category")
    public List<Quote> getQuotesByCategory(@PathVariable String category) {
        return quoteService.getQuotesByCategory(category);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a quote by ID")
    public ResponseEntity<Quote> getQuoteById(@PathVariable Long id) {
        return quoteService.getQuoteById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Add a new quote")
    public Quote addQuote(@RequestBody Quote quote) {
        return quoteService.addNewQuote(quote);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a quote by ID")
    public ResponseEntity<Void> deleteQuote(@PathVariable Long id) {
        if (quoteService.deleteQuote(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
