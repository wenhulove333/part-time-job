package com.ss.govauditsys.usermanager.model;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface UserOperationLoggingRepository extends PagingAndSortingRepository<UserOperationLogging, Long> {
	@Override
	UserOperationLogging save(UserOperationLogging userOperationLogging);
	
	Page<UserOperationLogging> findByUserNameContaining(@Param("userName") String userName, Pageable pageable);
}
