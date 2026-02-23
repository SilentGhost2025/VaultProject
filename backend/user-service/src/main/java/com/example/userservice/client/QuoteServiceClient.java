package com.example.userservice.client;

import com.example.userservice.model.Quote;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "quote-service", url = "${quote-service.url}")
public interface QuoteServiceClient {

    @GetMapping("/quotes/category/{category}")
    List<Quote> getQuotesByCategory(@PathVariable("category") String category);
}
