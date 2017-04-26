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
import org.springframework.web.bind.annotation.RestController;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.ss.govauditsys.sysdata.model.LawcaseInfo;
import com.ss.govauditsys.sysdata.model.LawcaseInfoRepository;
import com.ss.govauditsys.sysdata.model.QLawcaseInfo;

@RestController
public class LawcaseInfoMultiNamesSearchController {
	@Autowired
	LawcaseInfoRepository lawcaseInfoRepository;
	
	@RequestMapping(
			value = "/lawcaseinfo/multirespondentnamesearch",
			method = RequestMethod.POST,
			produces = {"application/json", "application/hal+json", "application/*+json;charset=UTF-8"})
	public PagedResources<LawcaseInfo> multinamessearchLawcaseInfo(
			Pageable pageable, PagedResourcesAssembler assembler, @RequestBody List<String> payload) {
		QLawcaseInfo lawcaseInfo = QLawcaseInfo.lawcaseInfo;
		BooleanExpression expression = null;
		
		if (payload.size() > 0) {
			expression = lawcaseInfo.respondentName.contains(payload.get(0));
			payload.remove(0);

			for (String name : payload) {
				expression = expression.or(lawcaseInfo.respondentName.contains(name));
			}
		} else {
			expression = lawcaseInfo.respondentName.contains("!@#$%^&*()_+=-~`\"':;<>?/,.");
		}
		
		Page<LawcaseInfo> lawcaseInfoes = lawcaseInfoRepository.findAll(
			expression, pageable
		);
		
		return assembler.toResource(lawcaseInfoes);
	}	
}
