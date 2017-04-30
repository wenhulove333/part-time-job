package com.ss.govauditsys.usermanager.model;

import java.util.Calendar;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface UserOperationLoggingRepository extends PagingAndSortingRepository<UserOperationLogging, Long> {
	@Override
	UserOperationLogging save(UserOperationLogging userOperationLogging);
	
	@Query("select userOperationLogging from UserOperationLogging userOperationLogging "
			+ "where userOperationLogging.operator like %?1% and userOperationLogging.time >= ?2 and userOperationLogging.time < ?3")
	Page<UserOperationLogging> findByOperatorContaining(
		@Param("operator") String operator,
		@Param("startTime") Calendar startTime,
		@Param("endTime") Calendar endTime,
		Pageable pageable
	);
	
}
