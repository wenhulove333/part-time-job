package com.ss.govauditsys;

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
import com.ss.govauditsys.sysdata.model.CommunistInfo;
import com.ss.govauditsys.sysdata.model.LawcaseInfoRepository;
import com.ss.govauditsys.sysdata.model.QCommunistInfo;
import com.ss.govauditsys.sysdata.search.PartyDisciplinePunishmentCountGroup;

@RestController
public class PartyDisciplinePunishmentCountGroupSearchController {
	@Autowired
	LawcaseInfoRepository lawcaseInfoRepository;

	@RequestMapping(
		value = "/lawcaseinfo/partydisciplinepunishmentcountgroupsearch",
		method = RequestMethod.GET
	)
	@ResponseBody
	public List<PartyDisciplinePunishmentCountGroup> multinamessearchCommunistinfo(@RequestParam("year") String year) {
		List<PartyDisciplinePunishmentCountGroup> partyDisciplinePunishmentCountGroups = null;
		
		partyDisciplinePunishmentCountGroups = lawcaseInfoRepository.findPartyDisciplinePunishmentCountGroup(year);
		
		return partyDisciplinePunishmentCountGroups;
	}
}
