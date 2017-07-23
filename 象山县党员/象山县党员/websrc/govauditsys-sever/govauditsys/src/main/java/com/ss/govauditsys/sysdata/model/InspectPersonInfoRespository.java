package com.ss.govauditsys.sysdata.model;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface InspectPersonInfoRespository extends PagingAndSortingRepository<InspectPersonInfo, Long>, QueryDslPredicateExecutor<InspectPersonInfo>{

	@Override
	InspectPersonInfo save(InspectPersonInfo inspectPersonInfo);

	@Override
	void delete(Long id);

	@Override
	void delete(InspectPersonInfo inspectPersonInfo);
	
	InspectPersonInfo findByIdNumber(String idNumber);
	
	Page<InspectPersonInfo> findByName(@Param("name") String name, Pageable pageable);
	
	@Query("select inspectPersonInfo from InspectPersonInfo inspectPersonInfo "
			+ "where (inspectPersonInfo.name like %?1% or inspectPersonInfo.idNumber like %?1%) "
			+ "and inspectPersonInfo.workPlace like %?2% and inspectPersonInfo.disciplinaryInspection in (?3)")
	Page<InspectPersonInfo> findByNameContaining(
		@Param("name") String name, @Param("workPlace") String workPlace, Pageable pageable,
		@Param("disciplinaryInspectDepartment") List<String> disciplinaryInspectDepartment
	);
	
	@Transactional
	@Modifying(clearAutomatically = true)
	@Query("update InspectPersonInfo inspectPersonInfo set inspectPersonInfo.name = ?1, inspectPersonInfo.idNumber = ?2, inspectPersonInfo.gender = ?3, "
			+ "inspectPersonInfo.education = ?4, inspectPersonInfo.workPlace = ?5 where inspectPersonInfo.id = ?6")
	int setInspectPersonInfoFor(
		String name, String idNumber, String gender, String education,
		String workPlace, long id
	);
	
	@Query("select inspectPersonInfo.disciplinaryInspection "
			+ "from InspectPersonInfo inspectPersonInfo group by inspectPersonInfo.disciplinaryInspection")
	List<String> findDisciplinaryInspectionGroup();
}
