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
import org.springframework.web.bind.annotation.RestController;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.ss.govauditsys.sysdata.model.InspectPersonInfo;
import com.ss.govauditsys.sysdata.model.InspectPersonInfoRespository;
import com.ss.govauditsys.sysdata.model.QInspectPersonInfo;

@RestController
public class InspectPersonInfoMultiConditionsSearchController {
	@Autowired
	InspectPersonInfoRespository inspectPersonInfoRespository;
	
	@RequestMapping(
			value = "/inspectpersoninfo/multinamesearch",
			method = RequestMethod.POST,
			produces = {"application/json", "application/hal+json", "application/*+json;charset=UTF-8"})
	public PagedResources<InspectPersonInfo> multinamessearchInspectPersonInfo(
			Pageable pageable, PagedResourcesAssembler assembler, @RequestBody List<String> payload,
			@RequestParam("disciplinaryInspectDepartment") List<String> disciplinaryInspectDepartment) {
		QInspectPersonInfo inspectPersonInfo = QInspectPersonInfo.inspectPersonInfo;
		BooleanExpression expression = null;
		
		if (payload.size() > 0) {
			if (payload.get(1).equals("")) {
				expression = inspectPersonInfo.name.contains(payload.get(0));
			} else {
				expression = inspectPersonInfo.idNumber.contains(payload.get(1));
			}
			
			for (int index = 2; index < payload.size(); index += 2) {
				if (payload.get(index + 1).equals("")) {
					expression = expression.or(inspectPersonInfo.name.contains(payload.get(index)));
				} else {
					expression = expression.or(inspectPersonInfo.idNumber.contains(payload.get(index + 1)));
				}
			}
			
			expression = expression.and(inspectPersonInfo.disciplinaryInspection.in(disciplinaryInspectDepartment));
		} else {
			expression = inspectPersonInfo.name.contains("!@#$%^&*()_+=-~`\"':;<>?/,.");
		}
		
		Page<InspectPersonInfo> inspectPersonInfoes = inspectPersonInfoRespository.findAll(
			expression, pageable
		);
		
		return assembler.toResource(inspectPersonInfoes);
	}
	
	@RequestMapping(
			value = "/inspectpersoninfo/multiidnumbersearch",
			method = RequestMethod.POST,
			produces = {"application/json", "application/hal+json", "application/*+json;charset=UTF-8"})
	public PagedResources<InspectPersonInfo> multiIdNumberSearchInspectPersonInfo(
			Pageable pageable, PagedResourcesAssembler assembler, @RequestBody List<String> payload) {
		QInspectPersonInfo inspectPersonInfo = QInspectPersonInfo.inspectPersonInfo;
		BooleanExpression expression = null;
		
		if (payload.size() > 0) {
			expression = inspectPersonInfo.idNumber.contains(payload.get(0));
			payload.remove(0);

			for (String idNumber : payload) {
				expression = expression.or(inspectPersonInfo.idNumber.contains(idNumber));
			}
		} else {
			expression = inspectPersonInfo.idNumber.contains("!@#$%^&*()_+=-~`\"':;<>?/,.");
		}
		
		Page<InspectPersonInfo> inspectPersonInfoes = inspectPersonInfoRespository.findAll(
			expression, pageable
		);
		
		return assembler.toResource(inspectPersonInfoes);
	}

}
