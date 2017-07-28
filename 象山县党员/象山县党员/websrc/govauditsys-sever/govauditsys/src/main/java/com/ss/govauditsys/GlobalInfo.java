package com.ss.govauditsys;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;

public class GlobalInfo {
	private String currentUser;
	
	public static final HashMap<String, String> logMap = new HashMap<String, String>();
	
	static {
			logMap.put("/api/communistInfoes/search/findByNameContaining", "查看党员信息");
			logMap.put("/api/inspectPersonInfoes/search/findByNameContaining", "查看监察对象信息");
			logMap.put("/api/lawcaseInfoes/search/findByRespondentNameContaining", "查看案件信息");
	};
	
	public static final ArrayList<ArrayList<String>> communistInfoColumnMap = new ArrayList<>();
	static {
		communistInfoColumnMap.add(new ArrayList<>(Arrays.asList("name", "党员姓名")));
		communistInfoColumnMap.add(new ArrayList<>(Arrays.asList("idNumber", "身份证号")));
		communistInfoColumnMap.add(new ArrayList<>(Arrays.asList("gender", "性别")));
		communistInfoColumnMap.add(new ArrayList<>(Arrays.asList("joinDate", "入党日期")));
		communistInfoColumnMap.add(new ArrayList<>(Arrays.asList("education", "学历")));
		communistInfoColumnMap.add(new ArrayList<>(Arrays.asList("partyBranch", "党支部")));
		communistInfoColumnMap.add(new ArrayList<>(Arrays.asList("superiorOrg", "上级组织")));
		communistInfoColumnMap.add(new ArrayList<>(Arrays.asList("nativePlace", "籍贯")));
		communistInfoColumnMap.add(new ArrayList<>(Arrays.asList("nation", "民族")));
		communistInfoColumnMap.add(new ArrayList<>(Arrays.asList("individualStatus", "个人身份")));
		communistInfoColumnMap.add(new ArrayList<>(Arrays.asList("disciplinaryInspection", "所属纪检部门")));
	}
	
	public static final ArrayList<ArrayList<String>> inspectPersonInfoColumnMap = new ArrayList<>();
	static {
		inspectPersonInfoColumnMap.add(new ArrayList<>(Arrays.asList("name", "姓名")));
		inspectPersonInfoColumnMap.add(new ArrayList<>(Arrays.asList("idNumber", "身份证号")));
		inspectPersonInfoColumnMap.add(new ArrayList<>(Arrays.asList("gender", "性别")));
		inspectPersonInfoColumnMap.add(new ArrayList<>(Arrays.asList("education", "学历")));
		inspectPersonInfoColumnMap.add(new ArrayList<>(Arrays.asList("workPlace", "工作单位")));
		inspectPersonInfoColumnMap.add(new ArrayList<>(Arrays.asList("disciplinaryInspection", "所属纪检部门")));
	}
	
	public static final ArrayList<ArrayList<String>> lawcaseInfoColumnMap = new ArrayList<>();
	static {
		lawcaseInfoColumnMap.add(new ArrayList<>(Arrays.asList("respondentName", "被调查人")));
		lawcaseInfoColumnMap.add(new ArrayList<>(Arrays.asList("joinDate", "入党日期")));
		lawcaseInfoColumnMap.add(new ArrayList<>(Arrays.asList("workPlaceAndPosition", "工作单位及职务")));
		lawcaseInfoColumnMap.add(new ArrayList<>(Arrays.asList("filingOffice", "立案机关")));
		lawcaseInfoColumnMap.add(new ArrayList<>(Arrays.asList("caseFilingDate", "立案时间")));
		lawcaseInfoColumnMap.add(new ArrayList<>(Arrays.asList("caseCloseDate", "结案时间")));
		lawcaseInfoColumnMap.add(new ArrayList<>(Arrays.asList("partyDisciplinePunishment", "党纪处分")));
		lawcaseInfoColumnMap.add(new ArrayList<>(Arrays.asList("politicalDisciplinePunishment", "政纪处分")));
		lawcaseInfoColumnMap.add(new ArrayList<>(Arrays.asList("disciplinaryInspection", "所属纪检部门")));
	}
	
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
