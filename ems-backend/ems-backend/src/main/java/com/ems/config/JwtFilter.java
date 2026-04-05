
package com.ems.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.web.filter.OncePerRequestFilter;
import io.jsonwebtoken.Claims;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain chain)
                                    throws ServletException, IOException {

        String path = req.getRequestURI();

        // Skip login API
        if (path.contains("/api/auth")) {
            chain.doFilter(req, res);
            return;
        }

        //  Skip reset password
        if (path.contains("/api/employees/reset-password")) {
            chain.doFilter(req, res);
            return;
        }

        String header = req.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(req, res);
            return;
        }

        try {
            String token = header.substring(7);

            // Validate token format
            if (token.split("\\.").length == 3) {

                Claims claims = jwtUtil.extractClaims(token);

                String email = claims.getSubject();
                String role = claims.get("role", String.class);

               
                role = role.trim().toUpperCase();

                if (!role.startsWith("ROLE_")) {
                    role = "ROLE_" + role;
                }

                System.out.println("FINAL ROLE >>> " + role);

                //  CREATE AUTH OBJECT
                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                Collections.singletonList(new SimpleGrantedAuthority(role))
                        );

                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));

                
                SecurityContextHolder.getContext().setAuthentication(auth);
            }

        } catch (Exception e) {
            e.printStackTrace(); 
        }


        chain.doFilter(req, res);
    }
}



