package com.ss.govauditsys.sysdata.model;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
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
	
	CommunistInfo findByIdNumber(String idNumber);
	
	Page<CommunistInfo> findByName(@Param("name") String name, Pageable pageable);
	
	Page<CommunistInfo> findByNameContaining(@Param("name") String name, Pageable pageable);
	
	@Modifying
	@Query("update CommunistInfo u set u.name = ?1, set u.idNumber = ?2, set u.gender = ?3, "
			+ "set u.joinDate = ?4, set u.education = ?5, set u.partyBranch = ?6, set u.superiorOrg = ?7, "
			+ "set u.nativePlace = ?8, set u.nation = ?9, set u.individualStatus = ?10 where u.id = ?11")
	int setCommunistInfoFor(
		String name, String idNumber, String gender, String joinDate,
		String education, String partyBranch, String superiorOrg, String nativePlace,
		String nation, String individualStatus, long id
	);
}
