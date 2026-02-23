package com.example.quoteservice.service;

import com.example.quoteservice.model.Quote;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class QuoteService {

    private final List<Quote> quotes = Collections.synchronizedList(new ArrayList<>());
    private final AtomicLong idCounter = new AtomicLong(0);

    @PostConstruct
    public void init() {
        addQuote("The only way to do great work is to love what you do.", "Steve Jobs", "motivation");
        addQuote("Innovation distinguishes between a leader and a follower.", "Steve Jobs", "tech");
        addQuote("The best time to plant a tree was 20 years ago. The second best time is now.", "Chinese Proverb", "wisdom");
        addQuote("Talk is cheap. Show me the code.", "Linus Torvalds", "tech");
        addQuote("A day without laughter is a day wasted.", "Charlie Chaplin", "humor");
        addQuote("It does not matter how slowly you go as long as you do not stop.", "Confucius", "motivation");
        addQuote("There are only two hard things in CS: cache invalidation and naming things.", "Phil Karlton", "tech");
        addQuote("In the middle of difficulty lies opportunity.", "Albert Einstein", "wisdom");
        addQuote("Why do programmers prefer dark mode? Because light attracts bugs.", "Unknown", "humor");
        addQuote("First, solve the problem. Then, write the code.", "John Johnson", "tech");
        addQuote("Believe you can and you're halfway there.", "Theodore Roosevelt", "motivation");
        addQuote("The greatest glory in living lies not in never falling, but in rising every time we fall.", "Nelson Mandela", "wisdom");
        addQuote("I told my wife she was drawing her eyebrows too high. She looked surprised.", "Unknown", "humor");
        addQuote("Any sufficiently advanced technology is indistinguishable from magic.", "Arthur C. Clarke", "tech");
        addQuote("Success is not final, failure is not fatal: it is the courage to continue that counts.", "Winston Churchill", "motivation");
        addQuote("The only true wisdom is in knowing you know nothing.", "Socrates", "wisdom");
        addQuote("There are 10 types of people: those who understand binary and those who don't.", "Unknown", "humor");
        addQuote("Simplicity is the soul of efficiency.", "Austin Freeman", "tech");
        addQuote("The future belongs to those who believe in the beauty of their dreams.", "Eleanor Roosevelt", "motivation");
        addQuote("Knowledge speaks, but wisdom listens.", "Jimi Hendrix", "wisdom");
        addQuote("A ship in harbor is safe, but that is not what ships are built for.", "John A. Shedd", "motivation");
        addQuote("Programming is thinking, not typing.", "Casey Patton", "tech");
        addQuote("I have not failed. I've just found 10,000 ways that won't work.", "Thomas Edison", "humor");
        addQuote("The unexamined life is not worth living.", "Socrates", "wisdom");
    }

    private void addQuote(String text, String author, String category) {
        quotes.add(new Quote(idCounter.incrementAndGet(), text, author, category));
    }

    public List<Quote> getAllQuotes() {
        return new ArrayList<>(quotes);
    }

    public Optional<Quote> getQuoteById(Long id) {
        return quotes.stream().filter(q -> q.getId().equals(id)).findFirst();
    }

    public Quote getRandomQuote() {
        Random random = new Random();
        return quotes.get(random.nextInt(quotes.size()));
    }

    public List<Quote> getQuotesByCategory(String category) {
        return quotes.stream()
                .filter(q -> q.getCategory().equalsIgnoreCase(category))
                .collect(Collectors.toList());
    }

    public Quote addNewQuote(Quote quote) {
        quote.setId(idCounter.incrementAndGet());
        quotes.add(quote);
        return quote;
    }

    public boolean deleteQuote(Long id) {
        return quotes.removeIf(q -> q.getId().equals(id));
    }
}
