package com.ss.govauditsys.sysdata.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import lombok.Data;

@Data
@Entity
public class InspectPersonInfo {
	private @Id @GeneratedValue Long id;
	
}
