package com.ss.govauditsys.usermanager.model;

import org.springframework.data.repository.Repository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;


@RepositoryRestResource(exported = false)
public interface SysUserRepository extends Repository<SysUser, Long> {
	SysUser save(SysUser manager);

	SysUser findByName(String name);
}
