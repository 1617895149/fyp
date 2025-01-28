package com.fyp.fyp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.fyp.fyp.Repository.UserRepository;


//import com.fyp.fyp.model.User;
import org.springframework.security.core.userdetails.User;

@Service
public class dbUserDetailService implements UserDetailsService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    BCryptPasswordEncoder passwordEncoder;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var user = userRepository.findByUsername(username).get(); 
        return new User(username, user.getPassword(), AuthorityUtils.createAuthorityList(user.getRole().name()));
    }
}

