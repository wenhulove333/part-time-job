package com.ss.govauditsys.sysdata.model;

import java.util.Calendar;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.ss.govauditsys.sysdata.search.PartyDisciplinePunishmentCountGroup;

public interface LawcaseInfoRepository  extends PagingAndSortingRepository<LawcaseInfo, Long>, QueryDslPredicateExecutor<LawcaseInfo>  {
	@Override
	LawcaseInfo save(LawcaseInfo lawcaseInfo);

	@Override
	void delete(Long id);

	@Override
	void delete(LawcaseInfo lawcaseInfo);
	
	Page<LawcaseInfo> findByRespondentName(@Param("respondentName") String respondentName, Pageable pageable);
	
	@Query("select lawcaseInfo from LawcaseInfo lawcaseInfo "
			+ "where lawcaseInfo.respondentName like %?1% and "
			+ "(lawcaseInfo.partyDisciplinePunishment like %?2% or lawcaseInfo.politicalDisciplinePunishment like %?2%) "
			+ "and lawcaseInfo.caseFilingDate >= ?3 and lawcaseInfo.caseFilingDate <= ?4 ")
	Page<LawcaseInfo> findByRespondentNameContaining(
		@Param("respondentName") String respondentName,
		@Param("punishmentContent") String punishmentContent,
		@Param("startTime") Calendar startTime,
		@Param("endTime") Calendar endTime,
		Pageable pageable
	);

	@Transactional
	@Modifying(clearAutomatically = true)
	@Query("update LawcaseInfo lawcaseInfo set lawcaseInfo.respondentName = ?1, lawcaseInfo.birthDate = ?2, lawcaseInfo.joinDate = ?3, "
			+ "lawcaseInfo.workPlaceAndPosition = ?4, lawcaseInfo.caseFilingDate = ?5, lawcaseInfo.caseCloseDate = ?6, lawcaseInfo.partyDisciplinePunishment = ?7, "
			+ "lawcaseInfo.politicalDisciplinePunishment = ?8 where lawcaseInfo.id = ?9")
	int setLawcaseInfoFor(
		String respondentName, String birthDate, String joinDate, String workPlaceAndPosition,
		String caseFilingDate, String caseCloseDate, String partyDisciplinePunishment, String politicalDisciplinePunishment, long id
	);

	@Query("select new com.ss.govauditsys.sysdata.search.PartyDisciplinePunishmentCountGroup(lawcaseInfo.partyDisciplinePunishment, count(lawcaseInfo.partyDisciplinePunishment)) "
			+ "from LawcaseInfo lawcaseInfo where lawcaseInfo.caseFilingDate >= ?1 and lawcaseInfo.caseFilingDate <= ?2 "
			+ "group by lawcaseInfo.partyDisciplinePunishment")
	List<PartyDisciplinePunishmentCountGroup> findPartyDisciplinePunishmentCountGroup(
		@Param("startTime") Calendar startTime,
		@Param("endTime") Calendar endTime
	);
}
