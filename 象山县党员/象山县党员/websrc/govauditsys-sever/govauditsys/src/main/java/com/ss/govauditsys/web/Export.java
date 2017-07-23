package com.ss.govauditsys.web;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.ss.govauditsys.sysdata.model.CommunistInfo;
import com.ss.govauditsys.sysdata.model.CommunistInfoRespository;
import com.ss.govauditsys.sysdata.model.InspectPersonInfo;
import com.ss.govauditsys.sysdata.model.InspectPersonInfoRespository;
import com.ss.govauditsys.sysdata.model.LawcaseInfo;
import com.ss.govauditsys.sysdata.model.LawcaseInfoRepository;
import com.ss.govauditsys.sysdata.model.QCommunistInfo;
import com.ss.govauditsys.sysdata.model.QInspectPersonInfo;
import com.ss.govauditsys.sysdata.model.QLawcaseInfo;
import com.ss.govauditsys.usermanager.model.SysUserRepository;

@Controller
public class Export {
	@Autowired
	CommunistInfoRespository communistInfoRespository;
	
	@Autowired
	InspectPersonInfoRespository inspectPersonInfoRespository;
	
	@Autowired
	LawcaseInfoRepository lawcaseInfoRepository;
	
	@Autowired
	SysUserRepository sysUserRepository;
	
	private Iterable<CommunistInfo> multiNamesPlusIdNumberSearchCommunistinfo(
		List<String> payload,
		List<String> disciplinaryInspectDepartment
	) {
		QCommunistInfo communistInfo = QCommunistInfo.communistInfo;
		BooleanExpression expression = null;
		
		if (payload.size() > 0) {
			if (payload.get(1).equals("")) {
				expression = communistInfo.name.contains(payload.get(0));
			} else {
				expression = communistInfo.idNumber.contains(payload.get(1));
			}

			for (int index = 2; index < payload.size(); index += 2) {
				if (payload.get(index + 1).equals("")) {
					expression = expression.or(communistInfo.name.contains(payload.get(index)));
				} else {
					expression = expression.or(communistInfo.idNumber.contains(payload.get(index + 1)));
				}
			}
			
			expression = expression.and(communistInfo.disciplinaryInspection.in(disciplinaryInspectDepartment));
		} else {
			expression = communistInfo.idNumber.contains("!@#$%^&*()_+=-~`\"':;<>?/,.");
		}
		
		return communistInfoRespository.findAll(
			expression
		);
	}
	
	private Iterable<InspectPersonInfo> multiNamesPlusIdNumberSearchInspectPersonInfo(
		List<String> payload,
		List<String> disciplinaryInspectDepartment
	) {
		QInspectPersonInfo inspectPersonInfo = QInspectPersonInfo.inspectPersonInfo;
		BooleanExpression expression = null;
		
		if (payload.size() > 0) {
			if (payload.get(1).equals("")) {
				expression = inspectPersonInfo.name.contains(payload.get(0));
			} else {
				expression = inspectPersonInfo.idNumber.contains(payload.get(1));
			}

			for (int index = 2; index < payload.size(); index += 2) {
				if (payload.get(index + 1).equals("")) {
					expression = expression.or(inspectPersonInfo.name.contains(payload.get(index)));
				} else {
					expression = expression.or(inspectPersonInfo.idNumber.contains(payload.get(index + 1)));
				}
			}
			
			expression = expression.and(inspectPersonInfo.disciplinaryInspection.in(disciplinaryInspectDepartment));
		} else {
			expression = inspectPersonInfo.idNumber.contains("!@#$%^&*()_+=-~`\"':;<>?/,.");
		}
		
		return inspectPersonInfoRespository.findAll(
			expression
		);
	}
	
	public Iterable<LawcaseInfo> multiRespondentNamePluasBirthDateSearchLawcaseInfo(
		List<String> payload,
		List<String> disciplinaryInspectDepartment
	) {
		QLawcaseInfo lawcaseInfo = QLawcaseInfo.lawcaseInfo;
		BooleanExpression expression = null;
		BooleanExpression subExpression = null;
		
		if (payload.size() > 0) {
			subExpression = lawcaseInfo.respondentName.contains(payload.get(0));
//			if (!payload.get(1).equals("")) {
//				subExpression = subExpression.and(lawcaseInfo.strFmtBirthDate.contains(payload.get(1).substring(6, 12)));
//			}
			expression = subExpression;

			for (int index = 2; index < payload.size(); index = index + 2) {
				subExpression = lawcaseInfo.respondentName.contains(payload.get(index));
//				if (!payload.get(index + 1).equals("")) {
//					subExpression = subExpression.and(lawcaseInfo.strFmtBirthDate.contains(payload.get(index + 1).substring(6, 12)));
//				}
				
				expression = expression.or(subExpression);
			}
			
			expression = expression.and(lawcaseInfo.disciplinaryInspection.in(disciplinaryInspectDepartment));
		} else {
			expression = lawcaseInfo.respondentName.contains("!@#$%^&*()_+=-~`\"':;<>?/,.");
		}
		
		return lawcaseInfoRepository.findAll(
			expression
		);
	}
	
	@RequestMapping(value="/downloadcomparisoninfo", method = RequestMethod.GET)
	public String downloadComparisonInfo(
		Model model, HttpSession session
	) {
		List<String> payload = (List<String>)session.getAttribute("payloadComparison");
		List<String> disciplinaryInspectDepartment = (List<String>)session.getAttribute("disciplinaryInspections");
		String accountName = (String)session.getAttribute("accountName");
		model.addAttribute("accountInfo", sysUserRepository.findByAccountName(accountName));
		
		Iterable<CommunistInfo> communistInfoes = multiNamesPlusIdNumberSearchCommunistinfo(payload, disciplinaryInspectDepartment);
		
		List<CommunistInfo> listCommunistInfoes = new ArrayList<>();
		communistInfoes.forEach(elem -> {listCommunistInfoes.add(elem);});
		model.addAttribute("communistInfoes", listCommunistInfoes);
		
		Iterable<InspectPersonInfo> inspectPersonInfoes = multiNamesPlusIdNumberSearchInspectPersonInfo(payload, disciplinaryInspectDepartment);
		
		List<InspectPersonInfo> listinspectPersonInfoes = new ArrayList<>();
		inspectPersonInfoes.forEach(elem -> {listinspectPersonInfoes.add(elem);});
		model.addAttribute("inspectPersonInfoes", listinspectPersonInfoes);
		
		Iterable<LawcaseInfo> lawcaseInfoes = multiRespondentNamePluasBirthDateSearchLawcaseInfo(payload, disciplinaryInspectDepartment);
		
		List<LawcaseInfo> listLawcaseInfoes = new ArrayList<>();
		lawcaseInfoes.forEach(elem -> {listLawcaseInfoes.add(elem);});
		model.addAttribute("lawcaseInfoes", listLawcaseInfoes);
		
		return "downloadcomparisoninfo";
	}
}
