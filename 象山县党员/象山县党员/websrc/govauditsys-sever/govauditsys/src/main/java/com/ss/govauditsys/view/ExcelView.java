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

import com.ss.govauditsys.sysdata.model.CommunistInfo;
import com.ss.govauditsys.sysdata.model.InspectPersonInfo;
import com.ss.govauditsys.sysdata.model.LawcaseInfo;

@SuppressWarnings("deprecation")
public class ExcelView extends AbstractExcelView {

	@Override
	protected void buildExcelDocument(Map<String, Object> model, HSSFWorkbook workbook, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		response.setHeader("Content-Disposition", "attachment; filename=\"" + URLEncoder.encode("信息比对") + ".xls\"");

		List<CommunistInfo> communistInfoes = (List<CommunistInfo>) model.get("communistInfoes");
		
		HSSFSheet communistInfoSheet = workbook.createSheet("党员信息");
		
		HSSFRow communistInfoHeader = communistInfoSheet.createRow(0);
		communistInfoHeader.createCell(0).setCellValue("党员姓名");
		communistInfoHeader.createCell(1).setCellValue("身份证号");
		communistInfoHeader.createCell(2).setCellValue("性别");
		communistInfoHeader.createCell(3).setCellValue("入党日期");
		communistInfoHeader.createCell(4).setCellValue("学历");
		communistInfoHeader.createCell(5).setCellValue("党支部");
		communistInfoHeader.createCell(6).setCellValue("上级组织");
		communistInfoHeader.createCell(7).setCellValue("籍贯");
		communistInfoHeader.createCell(8).setCellValue("民族");
		communistInfoHeader.createCell(9).setCellValue("个人身份");
		
		int rowCount = 1;
		
		for(CommunistInfo communistInfo : communistInfoes) {
			HSSFRow communistInfoRow = communistInfoSheet.createRow(rowCount++);
			communistInfoRow.createCell(0).setCellValue(communistInfo.getName());
			communistInfoRow.createCell(1).setCellValue(communistInfo.getIdNumber());
			communistInfoRow.createCell(2).setCellValue(communistInfo.getGender());
			communistInfoRow.createCell(3).setCellValue(communistInfo.getJoinDate());
			communistInfoRow.createCell(4).setCellValue(communistInfo.getEducation());
			communistInfoRow.createCell(5).setCellValue(communistInfo.getPartyBranch());
			communistInfoRow.createCell(6).setCellValue(communistInfo.getSuperiorOrg());
			communistInfoRow.createCell(7).setCellValue(communistInfo.getNativePlace());
			communistInfoRow.createCell(8).setCellValue(communistInfo.getNation());
			communistInfoRow.createCell(9).setCellValue(communistInfo.getIndividualStatus());
		}
		
		List<InspectPersonInfo> inspectPersonInfoes = (List<InspectPersonInfo>) model.get("inspectPersonInfoes");
		
		HSSFSheet inspectPersonInfoSheet = workbook.createSheet("监察对象信息");
		
		HSSFRow inspectPersonInfoHeader = inspectPersonInfoSheet.createRow(0);
		inspectPersonInfoHeader.createCell(0).setCellValue("姓名");
		inspectPersonInfoHeader.createCell(1).setCellValue("身份证号");
		inspectPersonInfoHeader.createCell(2).setCellValue("性别");
		inspectPersonInfoHeader.createCell(3).setCellValue("学历");
		inspectPersonInfoHeader.createCell(4).setCellValue("工作单位");
		
		rowCount = 1;
		
		for(InspectPersonInfo inspectPersonInfo : inspectPersonInfoes) {
			HSSFRow inspectPersonInfoRow = inspectPersonInfoSheet.createRow(rowCount++);
			inspectPersonInfoRow.createCell(0).setCellValue(inspectPersonInfo.getName());
			inspectPersonInfoRow.createCell(1).setCellValue(inspectPersonInfo.getIdNumber());
			inspectPersonInfoRow.createCell(2).setCellValue(inspectPersonInfo.getGender());
			inspectPersonInfoRow.createCell(3).setCellValue(inspectPersonInfo.getEducation());
			inspectPersonInfoRow.createCell(4).setCellValue(inspectPersonInfo.getWorkPlace());
		}
		
		List<LawcaseInfo> lawcaseInfoes = (List<LawcaseInfo>) model.get("lawcaseInfoes");
		
		HSSFSheet lawcaseInfoSheet = workbook.createSheet("处分人员信息");
		
		HSSFRow lawcaseInfoHeader = lawcaseInfoSheet.createRow(0);
		lawcaseInfoHeader.createCell(0).setCellValue("被调查人");
		//lawcaseInfoHeader.createCell(1).setCellValue("出生年月");
		lawcaseInfoHeader.createCell(1).setCellValue("入党日期");
		lawcaseInfoHeader.createCell(2).setCellValue("工作单位及职务");
		lawcaseInfoHeader.createCell(3).setCellValue("立案机关");
		lawcaseInfoHeader.createCell(4).setCellValue("立案时间");
		lawcaseInfoHeader.createCell(5).setCellValue("结案时间");
		lawcaseInfoHeader.createCell(6).setCellValue("党纪处分");
		lawcaseInfoHeader.createCell(7).setCellValue("政纪处分");
		
		rowCount = 1;
		
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
		
		for(LawcaseInfo lawcaseInfo : lawcaseInfoes) {
			HSSFRow lawcaseInfoRow = lawcaseInfoSheet.createRow(rowCount++);
			lawcaseInfoRow.createCell(0).setCellValue(lawcaseInfo.getRespondentName());
			//lawcaseInfoRow.createCell(1).setCellValue(simpleDateFormat.format(lawcaseInfo.getBirthDate().getTime()));
			lawcaseInfoRow.createCell(1).setCellValue(simpleDateFormat.format(lawcaseInfo.getJoinDate().getTime()));
			lawcaseInfoRow.createCell(2).setCellValue(lawcaseInfo.getWorkPlaceAndPosition());
			lawcaseInfoRow.createCell(3).setCellValue(lawcaseInfo.getFilingOffice());
			lawcaseInfoRow.createCell(4).setCellValue(simpleDateFormat.format(lawcaseInfo.getCaseFilingDate().getTime()));
			lawcaseInfoRow.createCell(5).setCellValue(simpleDateFormat.format(lawcaseInfo.getCaseCloseDate().getTime()));
			lawcaseInfoRow.createCell(6).setCellValue(lawcaseInfo.getPartyDisciplinePunishment());
			lawcaseInfoRow.createCell(7).setCellValue(lawcaseInfo.getPoliticalDisciplinePunishment());
		}
		
	}

}
