package com.ss.govauditsys.sysdata.model;

import java.util.Calendar;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import lombok.Data;

@Data
@Entity
public class LawcaseInfo {
	private @Id @GeneratedValue Long id;
	private String respondentName;
	private Calendar birthDate;
	private String strFmtBirthDate;
	private Calendar joinDate;
	private String workPlaceAndPosition;
	private Calendar caseFilingDate;
	private Calendar caseCloseDate;
	private String partyDisciplinePunishment;
	private String politicalDisciplinePunishment;
	public String getRespondentName() {
		return respondentName;
	}
	public void setRespondentName(String respondentName) {
		this.respondentName = respondentName;
	}
	public Calendar getBirthDate() {
		return birthDate;
	}
	public void setBirthDate(Calendar birthDate) {
		this.birthDate = birthDate;
	}
	public String getStrFmtBirthDate() {
		return strFmtBirthDate;
	}
	public void setStrFmtBirthDate(String strFmtBirthDate) {
		this.strFmtBirthDate = strFmtBirthDate;
	}
	public Calendar getJoinDate() {
		return joinDate;
	}
	public void setJoinDate(Calendar joinDate) {
		this.joinDate = joinDate;
	}
	public String getWorkPlaceAndPosition() {
		return workPlaceAndPosition;
	}
	public void setWorkPlaceAndPosition(String workPlaceAndPosition) {
		this.workPlaceAndPosition = workPlaceAndPosition;
	}
	public Calendar getCaseFilingDate() {
		return caseFilingDate;
	}
	public void setCaseFilingDate(Calendar caseFilingDate) {
		this.caseFilingDate = caseFilingDate;
	}
	public Calendar getCaseCloseDate() {
		return caseCloseDate;
	}
	public void setCaseCloseDate(Calendar caseCloseDate) {
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
