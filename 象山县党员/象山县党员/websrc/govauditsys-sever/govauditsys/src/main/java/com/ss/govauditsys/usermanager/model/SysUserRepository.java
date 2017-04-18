package com.ss.govauditsys.usermanager.model;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.ss.govauditsys.sysdata.model.LawcaseInfo;


public interface SysUserRepository extends PagingAndSortingRepository<SysUser, Long> {
	@Override
	SysUser save(SysUser sysUser);
	
	Page<SysUser> findByAccountName(@Param("accountName") String accountName, Pageable pageable);
}
