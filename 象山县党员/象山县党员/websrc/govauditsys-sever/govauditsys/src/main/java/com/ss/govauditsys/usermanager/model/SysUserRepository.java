package com.ss.govauditsys.usermanager.model;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.Repository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;


public interface SysUserRepository extends PagingAndSortingRepository<SysUser, Long> {
	@Override
	SysUser save(SysUser sysUser);
	
	SysUser findByAccountName(String accountName);
}
