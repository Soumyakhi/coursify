package com.course.major.utils;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
@Component
public class JwtUtil {
    private final Map<String, String> validTokens = new ConcurrentHashMap<>();
    private SecretKey key;
    @PostConstruct
    private void init() {
        this.key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    }
    public String generateToken(String userId) {
        String jwt = Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(new Date())
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
        validTokens.put(userId, jwt);
        return jwt;
    }
    public String extractUserId(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (Exception e) {
            return "invalid";
        }
    }
    public boolean validateToken(String token, String id) {
        String extractedUserId = extractUserId(token);
        return validTokens.containsKey(extractedUserId)
                && extractedUserId.equals(id)
                && validTokens.get(extractedUserId).equals(token);
    }
    public void removeToken(String id) {
        validTokens.remove(id);
    }
    public String extractUserIdFromRequest(HttpServletRequest request) {
        String requestHeader = request.getHeader("Authorization");
        if (requestHeader == null || !requestHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid Authorization header");
        }
        String token = requestHeader.substring(7);
        return extractUserId(token);
    }
}
