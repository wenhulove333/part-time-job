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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.ss.govauditsys.usermanager.model.SysUser;
import com.ss.govauditsys.usermanager.model.SysUserRepository;

/**
 * @author Zhang Wenhu
 */
// tag::code[]
@Component
public class DatabaseLoader implements CommandLineRunner {

	private final SysUserRepository sysUserRepository;

	@Autowired
	public DatabaseLoader(SysUserRepository sysUserRepository) {
		this.sysUserRepository = sysUserRepository;
	}

	@Override
	public void run(String... strings) throws Exception {
		if (sysUserRepository.findByAccountName("administrator") == null) {
			sysUserRepository.save(new SysUser(
				"系统管理员",
				"123456",
				new String[]{"管理员"},
				"administrator",
				"后台系统",
				"内置账户",
				"县纪委",
				2047, 63, 511));
		}
		if (sysUserRepository.findByAccountName("wenhuzha") == null) {
			sysUserRepository.save(new SysUser(
				"普通用户",
				"123456",
				new String[]{"普通用户"},
				"wenhuzha",
				"后台系统",
				"内置账户",
				"县纪委",
				2045, 63, 511));
		}
	}
}
// end::code[]