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

@Controller
public class Export {
	@Autowired
	CommunistInfoRespository communistInfoRespository;
	
	@Autowired
	InspectPersonInfoRespository inspectPersonInfoRespository;
	
	@Autowired
	LawcaseInfoRepository lawcaseInfoRepository;
	
	private Iterable<CommunistInfo> multiIdNumberSearchCommunistinfo(List<String> payload) {
		QCommunistInfo communistInfo = QCommunistInfo.communistInfo;
		BooleanExpression expression = null;
		
		if (payload.size() > 0) {
			expression = communistInfo.idNumber.contains(payload.get(1));

			for (int index = 2; index < payload.size(); index += 2) {
				expression = expression.or(communistInfo.idNumber.contains(payload.get(index + 1)));
			}
		} else {
			expression = communistInfo.idNumber.contains("!@#$%^&*()_+=-~`\"':;<>?/,.");
		}
		
		return communistInfoRespository.findAll(
			expression
		);
	}
	
	private Iterable<InspectPersonInfo> multiIdNumberSearchInspectPersonInfo(List<String> payload) {
		QInspectPersonInfo inspectPersonInfo = QInspectPersonInfo.inspectPersonInfo;
		BooleanExpression expression = null;
		
		if (payload.size() > 0) {
			expression = inspectPersonInfo.idNumber.contains(payload.get(1));

			for (int index = 2; index < payload.size(); index += 2) {
				expression = expression.or(inspectPersonInfo.idNumber.contains(payload.get(index + 1)));
			}
		} else {
			expression = inspectPersonInfo.idNumber.contains("!@#$%^&*()_+=-~`\"':;<>?/,.");
		}
		
		return inspectPersonInfoRespository.findAll(
			expression
		);
	}
	
	public Iterable<LawcaseInfo> multiRespondentNamePluasBirthDateSearchLawcaseInfo(List<String> payload) {
		QLawcaseInfo lawcaseInfo = QLawcaseInfo.lawcaseInfo;
		BooleanExpression expression = null;
		BooleanExpression subExpression = null;
		
		if (payload.size() > 0) {
			subExpression = lawcaseInfo.respondentName.contains(payload.get(0));
			subExpression = subExpression.and(lawcaseInfo.strFmtBirthDate.contains(payload.get(1).substring(6, 12)));
			expression = subExpression;

			for (int index = 2; index < payload.size(); index = index + 2) {
				subExpression = lawcaseInfo.respondentName.contains(payload.get(index));
				subExpression = subExpression.and(lawcaseInfo.strFmtBirthDate.contains(payload.get(index + 1).substring(6, 12)));
				
				expression = expression.or(subExpression);
			}
		} else {
			expression = lawcaseInfo.respondentName.contains("!@#$%^&*()_+=-~`\"':;<>?/,.");
		}
		
		return lawcaseInfoRepository.findAll(
			expression
		);
	}
	
	@RequestMapping(value="/downloadcomparisoninfo", method = RequestMethod.GET)
	public String downloadComparisonInfo(Model model, HttpSession session) {
		List<String> payload = (List<String>)session.getAttribute("payloadComparison");
		
		Iterable<CommunistInfo> communistInfoes = multiIdNumberSearchCommunistinfo(payload);
		
		List<CommunistInfo> listCommunistInfoes = new ArrayList<>();
		communistInfoes.forEach(elem -> {listCommunistInfoes.add(elem);});
		model.addAttribute("communistInfoes", listCommunistInfoes);
		
		Iterable<InspectPersonInfo> inspectPersonInfoes = multiIdNumberSearchInspectPersonInfo(payload);
		
		List<InspectPersonInfo> listinspectPersonInfoes = new ArrayList<>();
		inspectPersonInfoes.forEach(elem -> {listinspectPersonInfoes.add(elem);});
		model.addAttribute("inspectPersonInfoes", listinspectPersonInfoes);
		
		Iterable<LawcaseInfo> lawcaseInfoes = multiRespondentNamePluasBirthDateSearchLawcaseInfo(payload);
		
		List<LawcaseInfo> listLawcaseInfoes = new ArrayList<>();
		lawcaseInfoes.forEach(elem -> {listLawcaseInfoes.add(elem);});
		model.addAttribute("lawcaseInfoes", listLawcaseInfoes);
		
		return "downloadcomparisoninfo";
	}
}
