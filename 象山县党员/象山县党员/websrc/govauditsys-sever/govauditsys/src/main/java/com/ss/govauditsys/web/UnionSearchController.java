package com.ss.govauditsys.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.ss.govauditsys.sysdata.model.CommunistInfoRespository;
import com.ss.govauditsys.sysdata.model.InspectPersonInfoRespository;
import com.ss.govauditsys.sysdata.model.LawcaseInfoRepository;

@RestController
public class UnionSearchController {
	@Autowired
	LawcaseInfoRepository lawcaseInfoRepository;
	
	@Autowired
	CommunistInfoRespository communistInfoRespository;
	
	@Autowired
	InspectPersonInfoRespository inspectPersonInfoRespository;
	
	@RequestMapping(
		value = "/unionops/getdisciplinaryinspections",
		method = RequestMethod.GET
	)
	@ResponseBody
	List<String> getDisciplinaryInspections() {
		List<String> disciplinaryInspections1 = communistInfoRespository.findDisciplinaryInspectionGroup();
		List<String> disciplinaryInspections2 = inspectPersonInfoRespository.findDisciplinaryInspectionGroup();
		List<String> disciplinaryInspections3 = lawcaseInfoRepository.findDisciplinaryInspectionGroup();
		
		for (String str : disciplinaryInspections2) {
			if (!disciplinaryInspections1.contains(str)) {
				disciplinaryInspections1.add(str);
			}
		}
		
		for (String str : disciplinaryInspections3) {
			if (!disciplinaryInspections1.contains(str)) {
				disciplinaryInspections1.add(str);
			}
		}
		
		return disciplinaryInspections1;
	}
}
