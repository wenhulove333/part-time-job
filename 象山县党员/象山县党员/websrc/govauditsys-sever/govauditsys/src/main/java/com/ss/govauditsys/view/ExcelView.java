package com.ss.govauditsys.view;

import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.web.servlet.view.document.AbstractExcelView;

import com.ss.govauditsys.GlobalInfo;
import com.ss.govauditsys.sysdata.model.CommunistInfo;
import com.ss.govauditsys.sysdata.model.InspectPersonInfo;
import com.ss.govauditsys.sysdata.model.LawcaseInfo;
import com.ss.govauditsys.usermanager.model.SysUser;
import com.ss.govauditsys.usermanager.model.SysUserRepository;

@SuppressWarnings("deprecation")
public class ExcelView extends AbstractExcelView {

	@Override
	protected void buildExcelDocument(Map<String, Object> model, HSSFWorkbook workbook, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		response.setHeader("Content-Disposition", "attachment; filename=\"" + URLEncoder.encode("信息比对") + ".xls\"");

		List<CommunistInfo> communistInfoes = (List<CommunistInfo>) model.get("communistInfoes");
		
		SysUser sysUser = (SysUser) model.get("accountInfo");
		
		HSSFSheet communistInfoSheet = workbook.createSheet("党员信息");
		
		HSSFRow communistInfoHeader = communistInfoSheet.createRow(0);
		int pos = 0;
		Integer communistInfoFrontEndShowStatus = sysUser.getCommunistInfoFrontEndShowStatus();
		
		for (int bitPos = 0; bitPos < GlobalInfo.getGlobalInfo().communistInfoColumnMap.size(); bitPos++) {
			if (1 == ((communistInfoFrontEndShowStatus >> bitPos) & 1)) {
				communistInfoHeader.createCell(pos).setCellValue(
					GlobalInfo.getGlobalInfo().communistInfoColumnMap.get(bitPos).get(1)
				);
				pos++;
			}
		}
		
		int rowCount = 1;
		pos = 0;
		
		for(CommunistInfo communistInfo : communistInfoes) {
			HSSFRow communistInfoRow = communistInfoSheet.createRow(rowCount++);
			for (int bitPos = 0; bitPos < GlobalInfo.getGlobalInfo().communistInfoColumnMap.size(); bitPos++) {
				if (1 == ((communistInfoFrontEndShowStatus >> bitPos) & 1)) {
					switch (GlobalInfo.getGlobalInfo().communistInfoColumnMap.get(bitPos).get(0)) {
					case "name":
						communistInfoRow.createCell(pos).setCellValue(communistInfo.getName());
						break;
					case "idNumber":
						communistInfoRow.createCell(pos).setCellValue(communistInfo.getIdNumber());
						break;
					case "gender":
						communistInfoRow.createCell(pos).setCellValue(communistInfo.getGender());
						break;
					case "joinDate":
						communistInfoRow.createCell(pos).setCellValue(communistInfo.getJoinDate());
						break;
					case "education":
						communistInfoRow.createCell(pos).setCellValue(communistInfo.getEducation());
						break;
					case "partyBranch":
						communistInfoRow.createCell(pos).setCellValue(communistInfo.getPartyBranch());
						break;
					case "superiorOrg":
						communistInfoRow.createCell(pos).setCellValue(communistInfo.getSuperiorOrg());
						break;
					case "nativePlace":
						communistInfoRow.createCell(pos).setCellValue(communistInfo.getNativePlace());
						break;
					case "nation":
						communistInfoRow.createCell(pos).setCellValue(communistInfo.getNation());
						break;
					case "individualStatus":
						communistInfoRow.createCell(pos).setCellValue(communistInfo.getIndividualStatus());
						break;
					case "disciplinaryInspection":
						communistInfoRow.createCell(pos).setCellValue(communistInfo.getDisciplinaryInspection());
						break;
					}
					
					pos++;
				}
			}
		}
		
		pos = 0;
		
		List<InspectPersonInfo> inspectPersonInfoes = (List<InspectPersonInfo>) model.get("inspectPersonInfoes");
		
		HSSFSheet inspectPersonInfoSheet = workbook.createSheet("监察对象信息");
		HSSFRow inspectPersonInfoHeader = inspectPersonInfoSheet.createRow(0);
		Integer inspectPersonInfoFrontEndShowStatus = sysUser.getInspectPersonInfoFrontEndShowStatus();
		
		for (int bitPos = 0; bitPos < GlobalInfo.getGlobalInfo().inspectPersonInfoColumnMap.size(); bitPos++) {
			if (1 == ((inspectPersonInfoFrontEndShowStatus >> bitPos) & 1)) {
				inspectPersonInfoHeader.createCell(pos).setCellValue(
					GlobalInfo.getGlobalInfo().inspectPersonInfoColumnMap.get(bitPos).get(1)
				);
				pos++;
			}
		}
		
		rowCount = 1;
		pos = 0;
		
		for(InspectPersonInfo inspectPersonInfo : inspectPersonInfoes) {
			HSSFRow inspectPersonInfoRow = inspectPersonInfoSheet.createRow(rowCount++);
			for (int bitPos = 0; bitPos < GlobalInfo.getGlobalInfo().inspectPersonInfoColumnMap.size(); bitPos++) {
				if (1 == ((inspectPersonInfoFrontEndShowStatus >> bitPos) & 1)) {
					switch (GlobalInfo.getGlobalInfo().inspectPersonInfoColumnMap.get(bitPos).get(0)) {
					case "name":
						inspectPersonInfoRow.createCell(pos).setCellValue(inspectPersonInfo.getName());
						break;
					case "idNumber":
						inspectPersonInfoRow.createCell(pos).setCellValue(inspectPersonInfo.getIdNumber());
						break;
					case "gender":
						inspectPersonInfoRow.createCell(pos).setCellValue(inspectPersonInfo.getGender());
						break;
					case "education":
						inspectPersonInfoRow.createCell(pos).setCellValue(inspectPersonInfo.getEducation());
						break;
					case "workPlace":
						inspectPersonInfoRow.createCell(pos).setCellValue(inspectPersonInfo.getWorkPlace());
						break;
					case "disciplinaryInspection":
						inspectPersonInfoRow.createCell(pos).setCellValue(inspectPersonInfo.getDisciplinaryInspection());
						break;
					}
					
					pos++;
				}
			}
		}
		
		pos = 0;
		
		List<LawcaseInfo> lawcaseInfoes = (List<LawcaseInfo>) model.get("lawcaseInfoes");
		
		HSSFSheet lawcaseInfoSheet = workbook.createSheet("处分人员信息");
		
		HSSFRow lawcaseInfoHeader = lawcaseInfoSheet.createRow(0);
		Integer lawcaseInfoFrontEndShowStatus = sysUser.getLawcaseInfoFrontEndShowStatus();
		
		for (int bitPos = 0; bitPos < GlobalInfo.getGlobalInfo().lawcaseInfoColumnMap.size(); bitPos++) {
			if (1 == ((lawcaseInfoFrontEndShowStatus >> bitPos) & 1)) {
				lawcaseInfoHeader.createCell(pos).setCellValue(
					GlobalInfo.getGlobalInfo().lawcaseInfoColumnMap.get(bitPos).get(1)
				);
				pos++;
			}
		}
		
		rowCount = 1;
		pos = 0;
		
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
		
		for(LawcaseInfo lawcaseInfo : lawcaseInfoes) {
			HSSFRow lawcaseInfoRow = lawcaseInfoSheet.createRow(rowCount++);
			for (int bitPos = 0; bitPos < GlobalInfo.getGlobalInfo().lawcaseInfoColumnMap.size(); bitPos++) {
				if (1 == ((lawcaseInfoFrontEndShowStatus >> bitPos) & 1)) {
					switch (GlobalInfo.getGlobalInfo().lawcaseInfoColumnMap.get(bitPos).get(0)) {
					case "respondentName":
						lawcaseInfoRow.createCell(pos).setCellValue(lawcaseInfo.getRespondentName());
						break;
					case "joinDate":
						lawcaseInfoRow.createCell(pos).setCellValue(simpleDateFormat.format(lawcaseInfo.getJoinDate().getTime()));
						break;
					case "workPlaceAndPosition":
						lawcaseInfoRow.createCell(pos).setCellValue(lawcaseInfo.getWorkPlaceAndPosition());
						break;
					case "filingOffice":
						lawcaseInfoRow.createCell(pos).setCellValue(lawcaseInfo.getFilingOffice());
						break;
					case "caseFilingDate":
						lawcaseInfoRow.createCell(pos).setCellValue(simpleDateFormat.format(lawcaseInfo.getCaseFilingDate().getTime()));
						break;
					case "caseCloseDate":
						lawcaseInfoRow.createCell(pos).setCellValue(simpleDateFormat.format(lawcaseInfo.getCaseCloseDate().getTime()));
						break;
					case "partyDisciplinePunishment":
						lawcaseInfoRow.createCell(pos).setCellValue(lawcaseInfo.getPartyDisciplinePunishment());
						break;
					case "politicalDisciplinePunishment":
						lawcaseInfoRow.createCell(pos).setCellValue(lawcaseInfo.getPoliticalDisciplinePunishment());
						break;
					case "disciplinaryInspection":
						lawcaseInfoRow.createCell(pos).setCellValue(lawcaseInfo.getDisciplinaryInspection());
						break;
					}
					
					pos++;
				}
			}
		}
		
	}

}
