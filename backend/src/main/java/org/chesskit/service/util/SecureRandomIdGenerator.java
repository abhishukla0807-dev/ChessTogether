package org.chesskit.service.util;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

/**
 * Generates 8-character alphanumeric IDs using {@link SecureRandom}.
 * Single Responsibility: only generates IDs — no other logic.
 */
@Component
public class SecureRandomIdGenerator implements IdGenerator {

    private static final String ID_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";
    private static final int ID_LENGTH = 8;
    private final SecureRandom random = new SecureRandom();

    @Override
    public String generate() {
        StringBuilder sb = new StringBuilder(ID_LENGTH);
        for (int i = 0; i < ID_LENGTH; i++) {
            sb.append(ID_CHARS.charAt(random.nextInt(ID_CHARS.length())));
        }
        return sb.toString();
    }
}
