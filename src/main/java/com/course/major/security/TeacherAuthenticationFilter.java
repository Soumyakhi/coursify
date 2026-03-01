package com.course.major.security;

import com.course.major.entity.StudentEntity;
import com.course.major.entity.TeacherEntity;
import com.course.major.services.StudentService;
import com.course.major.services.TeacherService;
import com.course.major.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collection;
import java.util.Collections;
@Component
public class TeacherAuthenticationFilter extends OncePerRequestFilter {
        @Autowired
        private JwtUtil jwtUtil;
        @Autowired
        private TeacherService teacherService;
        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
                throws ServletException, IOException {
            String authorizationHeader = request.getHeader("Authorization");
            String token = null;
            String id = null;
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                token = authorizationHeader.substring(7);
                id = jwtUtil.extractUserId(token);
            }
            Collection<GrantedAuthority> authorities = Collections.singleton(new SimpleGrantedAuthority("ROLE_USER"));
            if (id != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                try{
                    TeacherEntity teacherEntity=teacherService.getTeacher(id);
                    if (teacherEntity!=null && jwtUtil.validateToken(token, teacherEntity.getId())) {
                        UsernamePasswordAuthenticationToken authToken =
                                new UsernamePasswordAuthenticationToken(teacherEntity, null, authorities);
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }}
                catch (Exception e){
                    System.out.println("invalid");
                }
            }

            filterChain.doFilter(request, response);
        }
    }


