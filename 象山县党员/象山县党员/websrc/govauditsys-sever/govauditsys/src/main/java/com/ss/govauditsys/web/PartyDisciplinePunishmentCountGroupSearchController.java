package com.ss.govauditsys.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.ss.govauditsys.converter.StringToCalendar;
import com.ss.govauditsys.sysdata.model.CommunistInfo;
import com.ss.govauditsys.sysdata.model.LawcaseInfoRepository;
import com.ss.govauditsys.sysdata.model.QCommunistInfo;
import com.ss.govauditsys.sysdata.search.DisciplinePunishmentCountGroup;

@RestController
public class PartyDisciplinePunishmentCountGroupSearchController {
	@Autowired
	LawcaseInfoRepository lawcaseInfoRepository;

	@RequestMapping(
		value = "/lawcaseinfo/getpartydisciplinepunishmentcountgroupbyyear",
		method = RequestMethod.GET
	)
	@ResponseBody
	public List<DisciplinePunishmentCountGroup> getPartyDisciplinePunishmentGroupsByYear(@RequestParam("year") String year) {
		List<DisciplinePunishmentCountGroup> partyDisciplinePunishmentCountGroups = null;
		
		partyDisciplinePunishmentCountGroups = lawcaseInfoRepository.findPartyDisciplinePunishmentCountGroupByPeriod(
			new StringToCalendar().convert(year + "-01-01 00:00:00"),
			new StringToCalendar().convert(year + "-12-31 23:59:59")
		);
		
		return partyDisciplinePunishmentCountGroups;
	}
	
	@RequestMapping(
			value = "/lawcaseinfo/getpoliticaldisciplinepunishmentcountgroupbyyear",
			method = RequestMethod.GET
		)
		@ResponseBody
		public List<DisciplinePunishmentCountGroup> getPoliticalDisciplinePunishmentGroupsByYear(@RequestParam("year") String year) {
			List<DisciplinePunishmentCountGroup> partyDisciplinePunishmentCountGroups = null;
			
			partyDisciplinePunishmentCountGroups = lawcaseInfoRepository.findPoliticalDisciplinePunishmentCountGroupByPeriod(
				new StringToCalendar().convert(year + "-01-01 00:00:00"),
				new StringToCalendar().convert(year + "-12-31 23:59:59")
			);
			
			return partyDisciplinePunishmentCountGroups;
		}
	
	@RequestMapping(
			value = "/lawcaseinfo/getpartydisciplinepunishmentcountgroup",
			method = RequestMethod.GET
		)
		@ResponseBody
		public List<DisciplinePunishmentCountGroup> getPartyDisciplinePunishmentGroups() {
			List<DisciplinePunishmentCountGroup> partyDisciplinePunishmentCountGroups = null;
			
			partyDisciplinePunishmentCountGroups = lawcaseInfoRepository.findPartyDisciplinePunishmentCountGroup();
			
			return partyDisciplinePunishmentCountGroups;
		}
}
