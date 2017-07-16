package com.ss.govauditsys.sysdata.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import lombok.Data;

@Data
@Entity
public class CommunistInfo {
	private @Id @GeneratedValue Long id;
	private String name;
	private String idNumber;
	private String gender;
	private String joinDate;
	private String education;
	private String partyBranch;
	private String superiorOrg;
	private String nativePlace;
	private String nation;
	private String individualStatus;
	private String disciplinaryInspection;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getIdNumber() {
		return idNumber;
	}
	public void setIdNumber(String idNumber) {
		this.idNumber = idNumber;
	}
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}
	public String getJoinDate() {
		return joinDate;
	}
	public void setJoinDate(String joinDate) {
		this.joinDate = joinDate;
	}
	public String getEducation() {
		return education;
	}
	public void setEducation(String education) {
		this.education = education;
	}
	public String getPartyBranch() {
		return partyBranch;
	}
	public void setPartyBranch(String partyBranch) {
		this.partyBranch = partyBranch;
	}
	public String getSuperiorOrg() {
		return superiorOrg;
	}
	public void setSuperiorOrg(String superiorOrg) {
		this.superiorOrg = superiorOrg;
	}
	public String getNativePlace() {
		return nativePlace;
	}
	public void setNativePlace(String nativePlace) {
		this.nativePlace = nativePlace;
	}
	public String getNation() {
		return nation;
	}
	public void setNation(String nation) {
		this.nation = nation;
	}
	public String getIndividualStatus() {
		return individualStatus;
	}
	public void setIndividualStatus(String individualStatus) {
		this.individualStatus = individualStatus;
	}
	public String getDisciplinaryInspection() {
		return disciplinaryInspection;
	}
	public void setDisciplinaryInspection(String disciplinaryInspection) {
		this.disciplinaryInspection = disciplinaryInspection;
	}
	public Long getId() {
		return id;
	}
	
	
}
