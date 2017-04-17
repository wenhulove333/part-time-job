package com.ss.govauditsys.usermanager.model;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;

import com.ss.govauditsys.GovAuditSys;

public class SysUserManagement {
	@Autowired
	private SysUserRepository sysUserRespository;
	
	public void createSysUser(SysUser sysUser) {
		sysUserRespository.save(sysUser);
	}
	
	public static void main(String[] args) {
		SpringApplication.run(GovAuditSys.class, args);
		SysUser sysUser = new SysUser("wenhu", "123456", "commonuser");
		
		
		SysUserManagement sysUserMgmt = new SysUserManagement();
		sysUserMgmt.createSysUser(sysUser);
	}
}
