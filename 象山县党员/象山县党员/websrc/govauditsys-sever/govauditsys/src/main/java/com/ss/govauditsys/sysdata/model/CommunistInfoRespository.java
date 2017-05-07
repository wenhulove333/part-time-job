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
import org.springframework.transaction.annotation.Transactional;

public interface CommunistInfoRespository extends PagingAndSortingRepository<CommunistInfo, Long>, QueryDslPredicateExecutor<CommunistInfo> {
	@Override
	CommunistInfo save(CommunistInfo communistInfo);

	@Override
	void delete(Long id);

	@Override
	void delete(CommunistInfo communistInfo);
	
	CommunistInfo findByIdNumber(String idNumber);
	
	Page<CommunistInfo> findByName(@Param("name") String name, Pageable pageable);
	
	@Query("select communistInfo from CommunistInfo communistInfo "
			+ "where (communistInfo.name like %?1% or communistInfo.idNumber like %?1%) "
			+ "and communistInfo.partyBranch like %?2%")
	Page<CommunistInfo> findByNameContaining(@Param("name") String name, @Param("partyBranch") String partyBranch, Pageable pageable);
	
	@Transactional
	@Modifying(clearAutomatically = true)
	@Query("update CommunistInfo communistInfo set communistInfo.name = ?1, communistInfo.idNumber = ?2, communistInfo.gender = ?3, "
			+ "communistInfo.joinDate = ?4, communistInfo.education = ?5, communistInfo.partyBranch = ?6, communistInfo.superiorOrg = ?7, "
			+ "communistInfo.nativePlace = ?8, communistInfo.nation = ?9, communistInfo.individualStatus = ?10 where communistInfo.id = ?11")
	int setCommunistInfoFor(
		String name, String idNumber, String gender, String joinDate,
		String education, String partyBranch, String superiorOrg, String nativePlace,
		String nation, String individualStatus, long id
	);
}
