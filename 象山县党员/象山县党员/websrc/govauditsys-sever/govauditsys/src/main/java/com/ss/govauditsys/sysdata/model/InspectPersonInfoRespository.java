package com.ss.govauditsys.sysdata.model;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface InspectPersonInfoRespository extends PagingAndSortingRepository<InspectPersonInfo, Long> {

	@Override
	InspectPersonInfo save(InspectPersonInfo inspectPersonInfo);

	@Override
	void delete(Long id);

	@Override
	void delete(InspectPersonInfo inspectPersonInfo);

}
