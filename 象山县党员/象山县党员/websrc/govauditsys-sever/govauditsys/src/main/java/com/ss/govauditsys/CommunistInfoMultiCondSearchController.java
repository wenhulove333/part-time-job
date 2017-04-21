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

import com.ss.govauditsys.sysdata.model.CommunistInfo;
import com.ss.govauditsys.sysdata.model.CommunistInfoRespository;
import com.ss.govauditsys.sysdata.model.QCommunistInfo;

@RestController
public class CommunistInfoMultiCondSearchController {
	@Autowired
	CommunistInfoRespository communistInfoRespository;
	
	
	@RequestMapping(
			value = "/communistinfo/multicondsearch",
			method = RequestMethod.POST,
			produces = {"application/json", "application/hal+json", "application/*+json;charset=UTF-8"})
	public PagedResources<CommunistInfo> multicondsearchCommunistinfo(
			Pageable pageable, PagedResourcesAssembler assembler) {
		QCommunistInfo communistInfo = QCommunistInfo.communistInfo;
		
		Page<CommunistInfo> communistInfoes = communistInfoRespository.findAll(
			communistInfo.name.contains("张三")
			.or(communistInfo.name.contains("lisi")), pageable
		);
		
		return assembler.toResource(communistInfoes);
	}
}
