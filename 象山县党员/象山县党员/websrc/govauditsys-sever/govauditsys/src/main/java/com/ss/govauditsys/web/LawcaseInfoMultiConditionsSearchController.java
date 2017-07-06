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
import com.ss.govauditsys.converter.StringToCalendar;
import com.ss.govauditsys.sysdata.model.LawcaseInfo;
import com.ss.govauditsys.sysdata.model.LawcaseInfoRepository;
import com.ss.govauditsys.sysdata.model.QLawcaseInfo;

@RestController
public class LawcaseInfoMultiConditionsSearchController {
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
	
	@RequestMapping(
			value = "/lawcaseinfo/multirespondentnamesplusbirthdatesearch",
			method = RequestMethod.POST,
			produces = {"application/json", "application/hal+json", "application/*+json;charset=UTF-8"})
	public PagedResources<LawcaseInfo> multiRespondentNamePluasBirthDateSearchLawcaseInfo(
			Pageable pageable, PagedResourcesAssembler assembler, @RequestBody List<String> payload) {
		QLawcaseInfo lawcaseInfo = QLawcaseInfo.lawcaseInfo;
		BooleanExpression expression = null;
		BooleanExpression subExpression = null;
		
		if (payload.size() > 0) {
			subExpression = lawcaseInfo.respondentName.contains(payload.get(0));
			//subExpression = subExpression.and(lawcaseInfo.strFmtBirthDate.contains(payload.get(1)));
			expression = subExpression;
			payload.remove(0);
			payload.remove(0);

			for (int index = 0; index < payload.size(); index = index + 2) {
				subExpression = lawcaseInfo.respondentName.contains(payload.get(index));
				//subExpression = subExpression.and(lawcaseInfo.strFmtBirthDate.contains(payload.get(index + 1)));
				
				expression = expression.or(subExpression);
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
