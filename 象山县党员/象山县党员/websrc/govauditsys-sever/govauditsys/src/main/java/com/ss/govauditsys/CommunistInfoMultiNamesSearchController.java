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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.ss.govauditsys.sysdata.model.CommunistInfo;
import com.ss.govauditsys.sysdata.model.CommunistInfoRespository;
import com.ss.govauditsys.sysdata.model.QCommunistInfo;

@RestController
public class CommunistInfoMultiNamesSearchController {
	@Autowired
	CommunistInfoRespository communistInfoRespository;
	
	@RequestMapping(
			value = "/communistinfo/multinamesearch",
			method = RequestMethod.POST,
			produces = {"application/json", "application/hal+json", "application/*+json;charset=UTF-8"})
	public PagedResources<CommunistInfo> multinamessearchCommunistinfo(
			Pageable pageable, PagedResourcesAssembler assembler, @RequestBody List<String> payload) {
		QCommunistInfo communistInfo = QCommunistInfo.communistInfo;
		BooleanExpression expression = null;
		
		if (payload.size() > 0) {
			expression = communistInfo.name.contains(payload.get(0));
			payload.remove(0);

			for (String name : payload) {
				expression = expression.or(communistInfo.name.contains(name));
			}
		} else {
			expression = communistInfo.name.contains("!@#$%^&*()_+=-~`\"':;<>?/,.");
		}
		
		Page<CommunistInfo> communistInfoes = communistInfoRespository.findAll(
			expression, pageable
		);
		
		return assembler.toResource(communistInfoes);
	}
}
