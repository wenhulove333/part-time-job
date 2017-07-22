package com.ss.govauditsys.web;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ss.govauditsys.GlobalInfo;
import com.ss.govauditsys.sysdata.model.CommunistInfoRespository;
import com.ss.govauditsys.usermanager.model.SysUser;
import com.ss.govauditsys.usermanager.model.SysUserRepository;

@RestController
public class UserDetailsController {
	@Autowired
	SysUserRepository sysUserRepository;
	
	@RequestMapping(value="/userdetails")
	public UserDetails userdetails() {
		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal();
		
		return userDetails;
	}
	
	@RequestMapping(value="/columnshowstatus")
	public ArrayList<ArrayList<String>> getColumnShowStatus(
		@RequestParam("accountName") String accountName,
		@RequestParam("infoType") String infoType
	) {
		SysUser sysUser = sysUserRepository.findByAccountName(accountName);
		ArrayList<ArrayList<String>> columnShowStatus
			= new ArrayList<>();
		
		if (infoType.equals("communist")) {
			Integer communistInfoFrontEndShowStatus = sysUser.getCommunistInfoFrontEndShowStatus();
			
			for (int bitPos = 0; bitPos < GlobalInfo.getGlobalInfo().communistInfoColumnMap.size(); bitPos++) {
				if (1 == ((communistInfoFrontEndShowStatus >> bitPos) & 1)) {
					columnShowStatus.add(GlobalInfo.getGlobalInfo().communistInfoColumnMap.get(bitPos));
				}
			}
		} else if (infoType.equals("inspectpersoninfo")) {
			Integer inspectPersonInfoFrontEndShowStatus = sysUser.getInspectPersonInfoFrontEndShowStatus();
			
			for (int bitPos = 0; bitPos < GlobalInfo.getGlobalInfo().inspectPersonInfoColumnMap.size(); bitPos++) {
				if (1 == ((inspectPersonInfoFrontEndShowStatus >> bitPos) & 1)) {
					columnShowStatus.add(GlobalInfo.getGlobalInfo().inspectPersonInfoColumnMap.get(bitPos));
				}
			}
		} else {
			Integer lawcaseInfoFrontEndShowStatus = sysUser.getLawcaseInfoFrontEndShowStatus();
			
			for (int bitPos = 0; bitPos < GlobalInfo.getGlobalInfo().lawcaseInfoColumnMap.size(); bitPos++) {
				if (1 == ((lawcaseInfoFrontEndShowStatus >> bitPos) & 1)) {
					columnShowStatus.add(GlobalInfo.getGlobalInfo().lawcaseInfoColumnMap.get(bitPos));
				}
			}
		}
		
		return columnShowStatus;
	}
}
