package com.ss.govauditsys.sysdata.model;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.security.access.prepost.PreAuthorize;

public interface CommunistInfoRespository extends PagingAndSortingRepository<CommunistInfo, Long>, QueryDslPredicateExecutor<CommunistInfo> {
	@Override
	CommunistInfo save(CommunistInfo communistInfo);

	@Override
	void delete(Long id);

	@Override
	void delete(CommunistInfo communistInfo);
	
	Page<CommunistInfo> findByName(@Param("name") String name, Pageable pageable);
	
	Page<CommunistInfo> findByNameContaining(@Param("name") String name, Pageable pageable);
}
