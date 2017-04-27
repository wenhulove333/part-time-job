package com.ss.govauditsys.web;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserDetailsController {
	@RequestMapping(value="/userdetails")
	public UserDetails userdetails() {
		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal();
		
		return userDetails;
	}
}
