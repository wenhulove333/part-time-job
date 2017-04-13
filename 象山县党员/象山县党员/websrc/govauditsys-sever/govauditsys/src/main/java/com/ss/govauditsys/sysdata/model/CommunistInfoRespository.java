package com.ss.govauditsys.sysdata.model;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.security.access.prepost.PreAuthorize;

import com.ss.govauditsys.Employee;

public interface CommunistInfoRespository extends PagingAndSortingRepository<CommunistInfo, Long> {
	@Override
	CommunistInfo save(CommunistInfo communistInfo);

	@Override
	void delete(Long id);

	@Override
	void delete(CommunistInfo communistInfo);
}
