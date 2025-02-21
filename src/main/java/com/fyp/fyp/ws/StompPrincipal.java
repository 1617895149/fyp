package com.fyp.fyp.ws;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.security.Principal;

@Getter
@AllArgsConstructor
public class StompPrincipal implements Principal {
    private final String userId;
    private final String userRole;

    @Override
    public String getName() {
        return userId;
    }
} 