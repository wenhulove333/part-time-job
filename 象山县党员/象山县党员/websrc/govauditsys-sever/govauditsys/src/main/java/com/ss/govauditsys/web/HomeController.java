/*
 * Copyright 2015 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.ss.govauditsys.web;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.Arrays;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.common.collect.Lists;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.ss.govauditsys.exception.ExcelImportException;
import com.ss.govauditsys.sysdata.model.CommunistInfo;
import com.ss.govauditsys.sysdata.model.CommunistInfoRespository;
import com.ss.govauditsys.sysdata.model.InspectPersonInfo;
import com.ss.govauditsys.sysdata.model.InspectPersonInfoRespository;
import com.ss.govauditsys.sysdata.model.LawcaseInfo;
import com.ss.govauditsys.sysdata.model.LawcaseInfoRepository;
import com.ss.govauditsys.sysdata.model.QCommunistInfo;
import com.ss.govauditsys.usermanager.model.SysUser;
import com.ss.govauditsys.usermanager.model.SysUserManagement;
import com.ss.govauditsys.usermanager.model.SysUserRepository;
import com.ss.govauditsys.utils.ExcelReader;

/**
 * @author Zhang Wenhu
 */
// tag::code[]
@Controller
public class HomeController {
	@Autowired
	CommunistInfoRespository communistInfoRespository;
	
	@Autowired
	InspectPersonInfoRespository inspectPersonInfoRespository;
	
	@Autowired
	LawcaseInfoRepository lawcaseInfoRepository;
	
	@RequestMapping(value = "/")
	public String index() {
		return "index";
	}
	
	@RequestMapping(value = "/login")
	public String login() {	
		return "login";
	}
	
	@RequestMapping(value = "/upload/excel")
	@ResponseBody
	public List<String> uploadExcel(@RequestBody String payload, @RequestParam("action") String action) {
		String excelData = payload.substring(payload.indexOf("base64,") + 7);
		List<String> names = Lists.newArrayList(Arrays.asList("error"));
		CommunistInfo communistInfoSearchByIdNumber = null;
		InspectPersonInfo inspectPersonInfoByIdNumber = null;
		
		try{
			ByteArrayInputStream dataInputStream = new ByteArrayInputStream(
				Base64.getDecoder().decode(excelData)
			);
			
			ExcelReader reader = new ExcelReader();
			if (action.equals("namessearch")) {
				names = reader.readSearchUserName(dataInputStream);
			} else if (action.equals("uploadcommunistinfo")) {
				List<CommunistInfo> communistInfoes = reader.readCommunistInfoes(dataInputStream);
				
				for (CommunistInfo communistInfo : communistInfoes) {
					communistInfoSearchByIdNumber = communistInfoRespository.findByIdNumber(communistInfo.getIdNumber());
					if (null == communistInfoSearchByIdNumber) {
						communistInfoRespository.save(communistInfo);
					} else {
						communistInfoRespository.setCommunistInfoFor(
							communistInfo.getName(),
							communistInfo.getIdNumber(),
							communistInfo.getGender(),
							communistInfo.getJoinDate(),
							communistInfo.getEducation(),
							communistInfo.getPartyBranch(),
							communistInfo.getSuperiorOrg(),
							communistInfo.getNativePlace(),
							communistInfo.getNation(),
							communistInfo.getIndividualStatus(),
							communistInfoSearchByIdNumber.getId()
						);
						communistInfoSearchByIdNumber = null;
					}
				}
				
				names = Arrays.asList("success");
			} else if (action.equals("uploadinspectpersoninfo")) {
				List<InspectPersonInfo> inspectPersonInfoes = reader.readInspectPersonInfoes(dataInputStream);
				
				for(InspectPersonInfo inspectPersonInfo : inspectPersonInfoes) {
					inspectPersonInfoByIdNumber = inspectPersonInfoRespository.findByIdNumber(inspectPersonInfo.getIdNumber());
					if (null == inspectPersonInfoByIdNumber) {
						inspectPersonInfoRespository.save(inspectPersonInfo);
					} else {
						inspectPersonInfoRespository.setInspectPersonInfoFor(
							inspectPersonInfo.getName(),
							inspectPersonInfo.getIdNumber(),
							inspectPersonInfo.getGender(),
							inspectPersonInfo.getEducation(),
							inspectPersonInfo.getWorkPlace(),
							inspectPersonInfoByIdNumber.getId()
						);
					}
				}
				
				names = Arrays.asList("success");
			} else if (action.equals("uploadlawcaseinfo")) {
				List<LawcaseInfo> lawcaseInfoes = reader.readLawcaseInfoes(dataInputStream);
				
				for(LawcaseInfo lawcaseInfo : lawcaseInfoes) {
					lawcaseInfoRepository.save(lawcaseInfo);
				}
				
				names = Arrays.asList("success");
			}
		} catch (ExcelImportException e) {
			e.printStackTrace();
			names.add(e.getMessage());
			return names;
		} catch (Exception e) {
			e.printStackTrace();
			names.add("未知异常");
			return names;
		}
		
		
		return names;
	}
}
// end::code[]