package com.ss.govauditsys.sysdata.model;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface LawcaseInfoRepository  extends PagingAndSortingRepository<LawcaseInfo, Long>  {
	@Override
	LawcaseInfo save(LawcaseInfo lawcaseInfo);

	@Override
	void delete(Long id);

	@Override
	void delete(LawcaseInfo lawcaseInfo);
	
	Page<LawcaseInfo> findByRespondentName(@Param("respondentName") String respondentName, Pageable pageable);
}
