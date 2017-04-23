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
package com.ss.govauditsys;

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

import com.querydsl.core.types.dsl.BooleanExpression;
import com.ss.govauditsys.sysdata.model.CommunistInfo;
import com.ss.govauditsys.sysdata.model.CommunistInfoRespository;
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
		List<String> names = Arrays.asList("error");
		
		try{
			ByteArrayInputStream dataInputStream = new ByteArrayInputStream(
				Base64.getDecoder().decode(excelData)
			);
			
			ExcelReader reader = new ExcelReader();
			if (action.equals("namessearch")) {
				names = reader.readSearchUserName(dataInputStream);
			}
		} catch (Exception e) {
			return names;
		}
		
		
		return names;
	}
}
// end::code[]