package com.ss.govauditsys.usermanager.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Version;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;
import lombok.ToString;

@Data
@ToString(exclude = "password")
@Entity
public class SysUser {
	public static final PasswordEncoder PASSWORD_ENCODER = new BCryptPasswordEncoder();

	private @Id @GeneratedValue Long id;

	private String name;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String[] getRoles() {
		return roles;
	}

	public void setRoles(String[] roles) {
		this.roles = roles;
	}

	public String getPassword() {
		return password;
	}

	private String password;

	private String[] roles;

	public void setPassword(String password) {
		if (!password.startsWith("cafecafemagicmagic")) {
			this.password = PASSWORD_ENCODER.encode(password);
		} else {
			this.password = password.substring(18, password.length());
		}
	}

	protected SysUser() {}

	public SysUser(String name, String password, String... roles) {
		this.name = name;
		this.setPassword(password);
		this.roles = roles;
	}
	
	public SysUser(String name, String password, String[] roles, String accountName, String workPlace,
			String position) {
		this.name = name;
		this.setPassword(password);
		this.roles = roles;
		this.accountName = accountName;
		this.workPlace = workPlace;
		this.position = position;
	}

	private String accountName;
	private String workPlace;
	private String position;

	public String getAccountName() {
		return accountName;
	}

	public void setAccountName(String accountName) {
		this.accountName = accountName;
	}

	public String getWorkPlace() {
		return workPlace;
	}

	public void setWorkPlace(String workPlace) {
		this.workPlace = workPlace;
	}

	public String getPosition() {
		return position;
	}

	public void setPosition(String position) {
		this.position = position;
	}
}
