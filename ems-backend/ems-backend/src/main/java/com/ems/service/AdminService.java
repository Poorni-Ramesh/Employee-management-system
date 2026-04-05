package com.ems.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ems.entity.Admin;
import com.ems.repository.AdminRepository;
@Service
public class AdminService {
	  @Autowired
	    private AdminRepository repo;

	    public Admin getByEmail(String email) {
	        return repo.findByEmail(email);
	    }

}
