package com.example.userservice.service;

import com.example.userservice.client.QuoteServiceClient;
import com.example.userservice.model.Quote;
import com.example.userservice.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final List<User> users = Collections.synchronizedList(new ArrayList<>());
    private final AtomicLong idCounter = new AtomicLong(0);
    private final QuoteServiceClient quoteServiceClient;

    public UserService(QuoteServiceClient quoteServiceClient) {
        this.quoteServiceClient = quoteServiceClient;
    }

    @PostConstruct
    public void init() {
        users.add(new User(idCounter.incrementAndGet(), "Alice Chen", "alice@example.com", "Backend Engineer", "tech"));
        users.add(new User(idCounter.incrementAndGet(), "Bob Martinez", "bob@example.com", "DevOps Lead", "motivation"));
        users.add(new User(idCounter.incrementAndGet(), "Carol Williams", "carol@example.com", "Frontend Developer", "humor"));
        users.add(new User(idCounter.incrementAndGet(), "David Kim", "david@example.com", "Platform Architect", "wisdom"));
        users.add(new User(idCounter.incrementAndGet(), "Eva Johnson", "eva@example.com", "SRE Manager", "tech"));
        users.add(new User(idCounter.incrementAndGet(), "Frank Liu", "frank@example.com", "Cloud Engineer", "motivation"));
        users.add(new User(idCounter.incrementAndGet(), "Grace Patel", "grace@example.com", "QA Engineer", "humor"));
        users.add(new User(idCounter.incrementAndGet(), "Henry Brown", "henry@example.com", "Tech Lead", "tech"));
        users.add(new User(idCounter.incrementAndGet(), "Iris Taylor", "iris@example.com", "Product Manager", "wisdom"));
        users.add(new User(idCounter.incrementAndGet(), "Jake Wilson", "jake@example.com", "Security Engineer", "motivation"));
    }

    public List<User> getAllUsers() {
        return new ArrayList<>(users);
    }

    public Optional<User> getUserById(Long id) {
        return users.stream().filter(u -> u.getId().equals(id)).findFirst();
    }

    public User addUser(User user) {
        user.setId(idCounter.incrementAndGet());
        users.add(user);
        return user;
    }

    public Optional<Quote> getQuoteForUser(Long userId) {
        return getUserById(userId).map(user -> {
            log.info("Fetching quote for user {} with category {} via Feign → quote-service", user.getName(), user.getFavoriteCategory());
            List<Quote> quotes = quoteServiceClient.getQuotesByCategory(user.getFavoriteCategory());
            if (quotes.isEmpty()) return null;
            return quotes.get(new Random().nextInt(quotes.size()));
        });
    }
}
