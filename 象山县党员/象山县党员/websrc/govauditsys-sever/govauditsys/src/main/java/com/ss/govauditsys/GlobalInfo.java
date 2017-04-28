package com.ss.govauditsys;

import java.util.HashMap;

public class GlobalInfo {
	private String currentUser;
	
	public static final HashMap<String, String> logMap = new HashMap<String, String>();
	
	static {
			logMap.put("/api/communistInfoes/search/findByNameContaining", "查看党员信息");
			logMap.put("／api/inspectPersonInfoes/search/findByNameContaining", "查看监察对象信息");
			logMap.put("/api/lawcaseInfoes/search/findByRespondentNameContaining", "查看案件信息");
	};
	
	private GlobalInfo() {
		
	}
	
	public String getCurrentUser() {
		return currentUser;
	}

	public void setCurrentUser(String currentUser) {
		this.currentUser = currentUser;
	}

	private static final GlobalInfo globalInfo = new GlobalInfo();
	
	public static GlobalInfo getGlobalInfo() {
		return globalInfo;
	}
}
