package com.ss.govauditsys.sysdata.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import lombok.Data;

@Data
@Entity
public class LawcaseInfo {
	private @Id @GeneratedValue Long id;
	private String respondentName;
	private String joinDate;
	private String workPlaceAndPosition;
	private String caseFilingDate;
	private String caseCloseDate;
	private String partyDisciplinePunishment;
	private String politicalDisciplinePunishment;
	public String getRespondentName() {
		return respondentName;
	}
	public void setRespondentName(String respondentName) {
		this.respondentName = respondentName;
	}
	public String getJoinDate() {
		return joinDate;
	}
	public void setJoinDate(String joinDate) {
		this.joinDate = joinDate;
	}
	public String getWorkPlaceAndPosition() {
		return workPlaceAndPosition;
	}
	public void setWorkPlaceAndPosition(String workPlaceAndPosition) {
		this.workPlaceAndPosition = workPlaceAndPosition;
	}
	public String getCaseFilingDate() {
		return caseFilingDate;
	}
	public void setCaseFilingDate(String caseFilingDate) {
		this.caseFilingDate = caseFilingDate;
	}
	public String getCaseCloseDate() {
		return caseCloseDate;
	}
	public void setCaseCloseDate(String caseCloseDate) {
		this.caseCloseDate = caseCloseDate;
	}
	public String getPartyDisciplinePunishment() {
		return partyDisciplinePunishment;
	}
	public void setPartyDisciplinePunishment(String partyDisciplinePunishment) {
		this.partyDisciplinePunishment = partyDisciplinePunishment;
	}
	public String getPoliticalDisciplinePunishment() {
		return politicalDisciplinePunishment;
	}
	public void setPoliticalDisciplinePunishment(String politicalDisciplinePunishment) {
		this.politicalDisciplinePunishment = politicalDisciplinePunishment;
	}
	public Long getId() {
		return id;
	}
}
