package com.ss.govauditsys.usermanager.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ss.govauditsys.usermanager.model.SysUser;
import com.ss.govauditsys.usermanager.model.SysUserRepository;

@RestController
@EnableAutoConfiguration
@RequestMapping("/sysuser")
public class SysUserController {

	@Autowired
	SysUserRepository repository;
	
	@RequestMapping("/{id}")  
    public SysUser view(@PathVariable("id") Long id) {   
        return new SysUser("wenhu", "123", "test");
    }
}
