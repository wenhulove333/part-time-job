package com.ss.govauditsys.utils;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.ss.govauditsys.converter.StringToCalendar;
import com.ss.govauditsys.exception.ExcelImportException;
import com.ss.govauditsys.sysdata.model.CommunistInfo;
import com.ss.govauditsys.sysdata.model.InspectPersonInfo;
import com.ss.govauditsys.sysdata.model.LawcaseInfo;

public class ExcelReader {
	private boolean isOldFormat;
	
    private POIFSFileSystem fs;

    private HSSFWorkbook wb;

    private HSSFSheet sheet;

    private HSSFRow row;
    
    private XSSFWorkbook xwb;
    
    private XSSFSheet xsheet;
    
    private XSSFRow xrow;

    public ExcelReader(String fileName) {
		if (fileName.contains(".xlsx")) {
			isOldFormat = false;
		} else {
			isOldFormat = true;
		}
	}
    
    private String getCellValueByIndex(HSSFRow row, int columIndex) {
    	if (null == row.getCell(columIndex)) {
    		return "";
    	}
    	
    	switch (row.getCell(columIndex).getCellType()) {
	    	case HSSFCell.CELL_TYPE_STRING:  
	    		return row.getCell(columIndex).getStringCellValue();  
	        case HSSFCell.CELL_TYPE_NUMERIC:  
	            return Double.toString(row.getCell(columIndex).getNumericCellValue());
	        default:  
	            return "";
    	}
    }
    
    private String getCellValueByIndex(XSSFRow row, int columIndex) {
    	if (null == row.getCell(columIndex)) {
    		return "";
    	}
    	
    	switch (row.getCell(columIndex).getCellType()) {
	    	case XSSFCell.CELL_TYPE_STRING:  
	    		return row.getCell(columIndex).getStringCellValue();  
	        case XSSFCell.CELL_TYPE_NUMERIC:  
	            return Double.toString(row.getCell(columIndex).getNumericCellValue());
	        default:  
	            return "";
        }
    }
    
    private void openFirstSheetInWorkBook(InputStream is) {
    	try
        {
	    	if (isOldFormat) {
	            fs = new POIFSFileSystem( is );
	            wb = new HSSFWorkbook( fs );
	            sheet = wb.getSheetAt(0);
	            
	    	} else {
	    		xwb = new XSSFWorkbook(is);
	    		xsheet = xwb.getSheetAt(0);
	    	}
        } catch( IOException e )
        {
            e.printStackTrace();
        }
    }

    /**
     * read the content of excel
     * @param is
     * @return
     */
    public List<String> readSearchUserName( InputStream is ) throws ExcelImportException
    {
        List<String> content = new ArrayList<String>();
        openFirstSheetInWorkBook(is);

        int rowNum = (isOldFormat ? sheet : xsheet).getLastRowNum();
        
        for( int i = 1; i <= rowNum; i++ )
        {
            String name = isOldFormat ? getCellValueByIndex(sheet.getRow(i), 0) : getCellValueByIndex(xsheet.getRow(i), 0);
            String idNumer = isOldFormat ? getCellValueByIndex(sheet.getRow(i), 1) : getCellValueByIndex(xsheet.getRow(i), 1);
            if (!name.equals("")) {
            	content.add(name);
//            	if (idNumer.equals("")) {
//            		throw new ExcelImportException("第" + (i + 1) + "行" + "身份证号码为空" + "或不支持的数据格式");
//            	}
            	content.add(idNumer);
            }
        }
        
        if (content.size() > 3000) {
        	throw new ExcelImportException("由于查询速度和系统的限制，比对人员数量不允许超过1500。");
        }
        
        return content;
    }
    
    public List<CommunistInfo> readCommunistInfoes( InputStream is) throws ExcelImportException {
    	List<CommunistInfo> communistInfoes = new ArrayList<>();
    	
    	openFirstSheetInWorkBook(is);

        int rowNum = (isOldFormat ? sheet : xsheet).getLastRowNum();

        for( int i = 1; i <= rowNum; i++ )
        {
            CommunistInfo communistInfo = new CommunistInfo();
            
        	communistInfo.setName(
        		isOldFormat ? getCellValueByIndex(sheet.getRow(i), 0) : getCellValueByIndex(xsheet.getRow(i), 0)
        	);
        	if ((isOldFormat ? getCellValueByIndex(sheet.getRow(i), 1) : getCellValueByIndex(xsheet.getRow(i), 1)).equals("")) {
        		throw new ExcelImportException("第" + (i + 1) + "行" + "身份证号码为空");
        	}
        	communistInfo.setIdNumber(
            	isOldFormat ? getCellValueByIndex(sheet.getRow(i), 1) : getCellValueByIndex(xsheet.getRow(i), 1)
            );
        	communistInfo.setGender(
               	isOldFormat ? getCellValueByIndex(sheet.getRow(i), 2) : getCellValueByIndex(xsheet.getRow(i), 2)
            );
        	communistInfo.setJoinDate(
               	isOldFormat ? getCellValueByIndex(sheet.getRow(i), 3) : getCellValueByIndex(xsheet.getRow(i), 3)
            );
        	communistInfo.setEducation(
               	isOldFormat ? getCellValueByIndex(sheet.getRow(i), 4) : getCellValueByIndex(xsheet.getRow(i), 4)
            );
        	communistInfo.setPartyBranch(
               	isOldFormat ? getCellValueByIndex(sheet.getRow(i), 5) : getCellValueByIndex(xsheet.getRow(i), 5)
            );
        	communistInfo.setSuperiorOrg(
               	isOldFormat ? getCellValueByIndex(sheet.getRow(i), 6) : getCellValueByIndex(xsheet.getRow(i), 6)
            );
        	communistInfo.setNativePlace(
               	isOldFormat ? getCellValueByIndex(sheet.getRow(i), 7) : getCellValueByIndex(xsheet.getRow(i), 7)
            );
        	communistInfo.setNation(
               	isOldFormat ? getCellValueByIndex(sheet.getRow(i), 8) : getCellValueByIndex(xsheet.getRow(i), 8)
            );
        	communistInfo.setIndividualStatus(
               	isOldFormat ? getCellValueByIndex(sheet.getRow(i), 9) : getCellValueByIndex(xsheet.getRow(i), 9)
            );
        	communistInfo.setDisciplinaryInspection(
                isOldFormat ? getCellValueByIndex(sheet.getRow(i), 10) : getCellValueByIndex(xsheet.getRow(i), 9)
            );
            
            communistInfoes.add(communistInfo);
        }
        return communistInfoes;
    }
    
    public List<InspectPersonInfo> readInspectPersonInfoes( InputStream is) throws ExcelImportException {
    	List<InspectPersonInfo> inspectPersonInfoes = new ArrayList<>();
    	
    	openFirstSheetInWorkBook(is);
    	
    	int rowNum = (isOldFormat ? sheet : xsheet).getLastRowNum();

        for( int i = 1; i <= rowNum; i++ )
        {
            InspectPersonInfo inspectPersonInfo = new InspectPersonInfo();
        	
            inspectPersonInfo.setName(
        		isOldFormat ? getCellValueByIndex(sheet.getRow(i), 0) : getCellValueByIndex(xsheet.getRow(i), 0)
            );
            if ((isOldFormat ? getCellValueByIndex(sheet.getRow(i), 1) : getCellValueByIndex(xsheet.getRow(i), 1)).equals("")) {
        		throw new ExcelImportException("第" + (i + 1) + "行" + "身份证号码为空");
        	}
            inspectPersonInfo.setIdNumber(
        		isOldFormat ? getCellValueByIndex(sheet.getRow(i), 1) : getCellValueByIndex(xsheet.getRow(i), 1)
            );
            inspectPersonInfo.setGender(
        		isOldFormat ? getCellValueByIndex(sheet.getRow(i), 2) : getCellValueByIndex(xsheet.getRow(i), 2)
            );
            inspectPersonInfo.setEducation(
        		isOldFormat ? getCellValueByIndex(sheet.getRow(i), 3) : getCellValueByIndex(xsheet.getRow(i), 3)
            );
            inspectPersonInfo.setWorkPlace(
        		isOldFormat ? getCellValueByIndex(sheet.getRow(i), 4) : getCellValueByIndex(xsheet.getRow(i), 4)
            );
            inspectPersonInfo.setDisciplinaryInspection(
            	isOldFormat ? getCellValueByIndex(sheet.getRow(i), 5) : getCellValueByIndex(xsheet.getRow(i), 5)
            );
            
            inspectPersonInfoes.add(inspectPersonInfo);
        }
        return inspectPersonInfoes;
    }
    
    public List<LawcaseInfo> readLawcaseInfoes( InputStream is) {
    	List<LawcaseInfo> lawcaseInfoes = new ArrayList<>();
    	openFirstSheetInWorkBook(is);
    	
    	int rowNum = (isOldFormat ? sheet : xsheet).getLastRowNum();

        for( int i = 1; i <= rowNum; i++ )
        {
            LawcaseInfo lawcaseInfo = new LawcaseInfo();

            lawcaseInfo.setRespondentName(
        		isOldFormat ? getCellValueByIndex(sheet.getRow(i), 0) : getCellValueByIndex(xsheet.getRow(i), 0)
            );
//            lawcaseInfo.setBirthDate(new StringToCalendar().convertAsSpeicificFmt(
//            	isOldFormat ? getCellValueByIndex(sheet.getRow(i), 1) : getCellValueByIndex(xsheet.getRow(i), 1),
//            	"yyyy.MM.dd"
//            ));
//            String birthDate = isOldFormat ? getCellValueByIndex(sheet.getRow(i), 1) : getCellValueByIndex(xsheet.getRow(i), 1);
//            birthDate = birthDate.replace(".", "");
//            birthDate = birthDate.replace("-", "");
//            lawcaseInfo.setStrFmtBirthDate(birthDate);
            lawcaseInfo.setJoinDate(new StringToCalendar().convertAsSpeicificFmt(
            	isOldFormat ? getCellValueByIndex(sheet.getRow(i), 1) : getCellValueByIndex(xsheet.getRow(i), 1),
            	"yyyy.MM.dd"
            ));
            lawcaseInfo.setWorkPlaceAndPosition(
            	isOldFormat ? getCellValueByIndex(sheet.getRow(i), 2) : getCellValueByIndex(xsheet.getRow(i), 2)
            );
            lawcaseInfo.setFilingOffice(
            	isOldFormat ? getCellValueByIndex(sheet.getRow(i), 3) : getCellValueByIndex(xsheet.getRow(i), 3)
            );
            lawcaseInfo.setCaseFilingDate(new StringToCalendar().convertAsSpeicificFmt(
            	isOldFormat ? getCellValueByIndex(sheet.getRow(i), 4) : getCellValueByIndex(xsheet.getRow(i), 4),
            	"yyyy.MM.dd"
            ));
            lawcaseInfo.setCaseCloseDate(new StringToCalendar().convertAsSpeicificFmt(
            	isOldFormat ? getCellValueByIndex(sheet.getRow(i), 5) : getCellValueByIndex(xsheet.getRow(i), 5),
            	"yyyy.MM.dd"
            ));
            lawcaseInfo.setPartyDisciplinePunishment(
        		isOldFormat ? getCellValueByIndex(sheet.getRow(i), 6) : getCellValueByIndex(xsheet.getRow(i), 6)
        	);
            lawcaseInfo.setPoliticalDisciplinePunishment(
        		isOldFormat ? getCellValueByIndex(sheet.getRow(i), 7) : getCellValueByIndex(xsheet.getRow(i), 7)
    		);
            lawcaseInfo.setDisciplinaryInspection(
            	isOldFormat ? getCellValueByIndex(sheet.getRow(i), 8) : getCellValueByIndex(xsheet.getRow(i), 8)
        	);
            
            lawcaseInfoes.add(lawcaseInfo);
        }
        return lawcaseInfoes;
    }

    private String getStringCellValue( HSSFCell cell )
    {
        String strCell = "";
        switch( cell.getCellType() )
        {
            case HSSFCell.CELL_TYPE_STRING:
                strCell = cell.getStringCellValue();
                break;
            case HSSFCell.CELL_TYPE_NUMERIC:
                strCell = String.valueOf( cell.getNumericCellValue() );
                break;
            case HSSFCell.CELL_TYPE_BOOLEAN:
                strCell = String.valueOf( cell.getBooleanCellValue() );
                break;
            case HSSFCell.CELL_TYPE_BLANK:
                strCell = "";
                break;
            default:
                strCell = "";
                break;
        }
        if( strCell.equals( "" ) || strCell == null )
        {
            return "";
        }
        if( cell == null )
        {
            return "";
        }
        return strCell;
    }
}
