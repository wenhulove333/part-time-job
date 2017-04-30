package com.ss.govauditsys.converter;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;

import org.springframework.core.convert.converter.Converter;

public class StringToCalendar implements Converter<String, Calendar> {

	@Override
	public Calendar convert(String arg0) {
		// TODO Auto-generated method stub
		Calendar calendar = Calendar.getInstance();
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		try {
			calendar.setTime(simpleDateFormat.parse(arg0));
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return calendar;
	}

}
