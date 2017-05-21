package com.ss.govauditsys.viewResolver;

import java.util.Locale;

import org.springframework.web.servlet.View;
import org.springframework.web.servlet.ViewResolver;

import com.ss.govauditsys.view.ExcelView;

public class ExcelViewResolver implements ViewResolver {

	@Override
	public View resolveViewName(String viewName, Locale locale) throws Exception {
		if (viewName.equals("downloadcomparisoninfo")) {
			ExcelView excelView = new ExcelView();
			
			return excelView;
		} else {
			return null;
		}
	}

}
