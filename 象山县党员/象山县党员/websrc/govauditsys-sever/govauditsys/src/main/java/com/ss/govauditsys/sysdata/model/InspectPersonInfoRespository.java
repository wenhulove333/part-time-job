package com.ss.govauditsys.sysdata.model;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface InspectPersonInfoRespository extends PagingAndSortingRepository<InspectPersonInfo, Long>, QueryDslPredicateExecutor<InspectPersonInfo>{

	@Override
	InspectPersonInfo save(InspectPersonInfo inspectPersonInfo);

	@Override
	void delete(Long id);

	@Override
	void delete(InspectPersonInfo inspectPersonInfo);
	
	Page<InspectPersonInfo> findByName(@Param("name") String name, Pageable pageable);
	
	Page<InspectPersonInfo> findByNameContaining(@Param("name") String name, Pageable pageable);
}
