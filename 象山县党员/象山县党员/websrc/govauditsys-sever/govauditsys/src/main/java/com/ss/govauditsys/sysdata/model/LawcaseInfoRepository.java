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

import com.ss.govauditsys.sysdata.search.DisciplinePunishmentCountGroup;

public interface LawcaseInfoRepository  extends PagingAndSortingRepository<LawcaseInfo, Long>, QueryDslPredicateExecutor<LawcaseInfo>  {
	@Override
	LawcaseInfo save(LawcaseInfo lawcaseInfo);

	@Override
	void delete(Long id);

	@Override
	void delete(LawcaseInfo lawcaseInfo);
	
	Page<LawcaseInfo> findByRespondentName(@Param("respondentName") String respondentName, Pageable pageable);
	
	@Query("select lawcaseInfo from LawcaseInfo lawcaseInfo "
			+ "where lawcaseInfo.respondentName like %?1% and lawcaseInfo.filingOffice like %?2% and "
			+ "(lawcaseInfo.partyDisciplinePunishment like %?3% or lawcaseInfo.politicalDisciplinePunishment like %?3%) "
			+ "and lawcaseInfo.caseCloseDate >= ?4 and lawcaseInfo.caseCloseDate <= ?5 and lawcaseInfo.disciplinaryInspection in (?6)")
	Page<LawcaseInfo> findByRespondentNameContaining(
		@Param("respondentName") String respondentName,
		@Param("filingOffice") String filingOffice,
		@Param("punishmentContent") String punishmentContent,
		@Param("startTime") Calendar startTime,
		@Param("endTime") Calendar endTime,
		@Param("disciplinaryInspectDepartment") List<String> disciplinaryInspectDepartment,
		Pageable pageable
	);

	@Transactional
	@Modifying(clearAutomatically = true)
	@Query("update LawcaseInfo lawcaseInfo set lawcaseInfo.respondentName = ?1, lawcaseInfo.joinDate = ?3, "
			+ "lawcaseInfo.workPlaceAndPosition = ?4, lawcaseInfo.caseFilingDate = ?5, lawcaseInfo.caseCloseDate = ?6, lawcaseInfo.partyDisciplinePunishment = ?7, "
			+ "lawcaseInfo.politicalDisciplinePunishment = ?8 where lawcaseInfo.id = ?9")
	int setLawcaseInfoFor(
		String respondentName, String joinDate, String workPlaceAndPosition,
		String caseFilingDate, String caseCloseDate, String partyDisciplinePunishment, String politicalDisciplinePunishment, long id
	);

	@Query("select new com.ss.govauditsys.sysdata.search.DisciplinePunishmentCountGroup(lawcaseInfo.partyDisciplinePunishment, count(lawcaseInfo.partyDisciplinePunishment)) "
			+ "from LawcaseInfo lawcaseInfo where lawcaseInfo.caseCloseDate >= ?1 and lawcaseInfo.caseCloseDate <= ?2 "
			+ "and lawcaseInfo.disciplinaryInspection in (?3) and lawcaseInfo.partyDisciplinePunishment <> '' group by lawcaseInfo.partyDisciplinePunishment")
	List<DisciplinePunishmentCountGroup> findPartyDisciplinePunishmentCountGroupByPeriod(
		@Param("startTime") Calendar startTime,
		@Param("endTime") Calendar endTime,
		@Param("disciplinaryInspectDepartment") List<String> disciplinaryInspectDepartment
	);
	
	@Query("select new com.ss.govauditsys.sysdata.search.DisciplinePunishmentCountGroup(lawcaseInfo.politicalDisciplinePunishment, count(lawcaseInfo.politicalDisciplinePunishment)) "
			+ "from LawcaseInfo lawcaseInfo where lawcaseInfo.caseCloseDate >= ?1 and lawcaseInfo.caseCloseDate <= ?2 "
			+ "and lawcaseInfo.disciplinaryInspection in (?3) and lawcaseInfo.politicalDisciplinePunishment <> '' group by lawcaseInfo.politicalDisciplinePunishment")
	List<DisciplinePunishmentCountGroup> findPoliticalDisciplinePunishmentCountGroupByPeriod(
		@Param("startTime") Calendar startTime,
		@Param("endTime") Calendar endTime,
		@Param("disciplinaryInspectDepartment") List<String> disciplinaryInspectDepartment
	);
	
	@Query("select new com.ss.govauditsys.sysdata.search.DisciplinePunishmentCountGroup(lawcaseInfo.partyDisciplinePunishment, count(lawcaseInfo.partyDisciplinePunishment)) "
			+ "from LawcaseInfo lawcaseInfo group by lawcaseInfo.partyDisciplinePunishment")
	List<DisciplinePunishmentCountGroup> findPartyDisciplinePunishmentCountGroup();
	
	@Query("select lawcaseInfo.disciplinaryInspection "
			+ "from LawcaseInfo lawcaseInfo group by lawcaseInfo.disciplinaryInspection")
	List<String> findDisciplinaryInspectionGroup();
}
