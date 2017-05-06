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

import com.ss.govauditsys.exception.ExcelImportException;
import com.ss.govauditsys.sysdata.model.CommunistInfo;
import com.ss.govauditsys.sysdata.model.InspectPersonInfo;
import com.ss.govauditsys.sysdata.model.LawcaseInfo;

public class ExcelReader {
    private POIFSFileSystem fs;

    private HSSFWorkbook wb;

    private HSSFSheet sheet;

    private HSSFRow row;

    public String[] readExcelTitle( InputStream is )
    {
        try
        {
            fs = new POIFSFileSystem( is );
            wb = new HSSFWorkbook( fs );
        }
        catch( IOException e )
        {
            e.printStackTrace();
        }
        sheet = wb.getSheetAt( 0 );
        row = sheet.getRow( 0 );
        //标题总列数
        int colNum = row.getPhysicalNumberOfCells();
        String[] title = new String[ colNum ];
        for( int i = 0; i < colNum; i++ )
        {
            title[i] = getStringCellValue( row.getCell( ( short ) i ) );
        }
        return title;
    }
    
    private String getCellValueByIndex(HSSFRow row, int columIndex) {
    	if (null == row.getCell(columIndex)) {
    		return "";
    	}
    	
    	return row.getCell(columIndex).getStringCellValue();
    }

    /**
     * read the content of excel
     * @param is
     * @return
     */
    public List<String> readSearchUserName( InputStream is )
    {
        List<String> content = new ArrayList<String>();
        try
        {
            fs = new POIFSFileSystem( is );
            wb = new HSSFWorkbook( fs );
        }
        catch( IOException e )
        {
            e.printStackTrace();
        }
        sheet = wb.getSheetAt( 0 );

        int rowNum = sheet.getLastRowNum();
        row = sheet.getRow( 0 );

        for( int i = 1; i <= rowNum; i++ )
        {
            row = sheet.getRow( i );
            String name = getCellValueByIndex(row, 0);
            if (!name.equals("")) {
            	content.add(name);
            }
        }
        return content;
    }
    
    public List<CommunistInfo> readCommunistInfoes( InputStream is) throws ExcelImportException {
    	List<CommunistInfo> communistInfoes = new ArrayList<>();
    	
    	List<String> content = new ArrayList<String>();
        try
        {
            fs = new POIFSFileSystem( is );
            wb = new HSSFWorkbook( fs );
        }
        catch( IOException e )
        {
            e.printStackTrace();
        }
        sheet = wb.getSheetAt( 0 );

        int rowNum = sheet.getLastRowNum();
        row = sheet.getRow( 0 );

        for( int i = 1; i <= rowNum; i++ )
        {
        	int columnIndex = 0;
        	
            row = sheet.getRow( i );
            CommunistInfo communistInfo = new CommunistInfo();
            
        	communistInfo.setName(getCellValueByIndex(row, 0));
        	if (getCellValueByIndex(row, 1).equals("")) {
        		throw new ExcelImportException("第" + (i + 1) + "行" + "身份证号码为空");
        	}
        	communistInfo.setIdNumber(getCellValueByIndex(row, 1));
        	communistInfo.setGender(getCellValueByIndex(row, 2));
        	communistInfo.setJoinDate(getCellValueByIndex(row, 3));
        	communistInfo.setEducation(getCellValueByIndex(row, 4));
        	communistInfo.setPartyBranch(getCellValueByIndex(row, 5));
        	communistInfo.setSuperiorOrg(getCellValueByIndex(row, 6));
        	communistInfo.setNativePlace(getCellValueByIndex(row, 7));
        	communistInfo.setNation(getCellValueByIndex(row, 8));
        	communistInfo.setIndividualStatus(getCellValueByIndex(row, 9));
            
            communistInfoes.add(communistInfo);
        }
        return communistInfoes;
    }
    
    public List<InspectPersonInfo> readInspectPersonInfoes( InputStream is) throws ExcelImportException {
    	List<InspectPersonInfo> inspectPersonInfoes = new ArrayList<>();
    	
    	List<String> content = new ArrayList<String>();
        try
        {
            fs = new POIFSFileSystem( is );
            wb = new HSSFWorkbook( fs );
        }
        catch( IOException e )
        {
            e.printStackTrace();
        }
        sheet = wb.getSheetAt( 0 );

        int rowNum = sheet.getLastRowNum();
        row = sheet.getRow( 0 );

        for( int i = 1; i <= rowNum; i++ )
        {
            row = sheet.getRow( i );
            InspectPersonInfo inspectPersonInfo = new InspectPersonInfo();
        	
            inspectPersonInfo.setName(getCellValueByIndex(row, 0));
            if (getCellValueByIndex(row, 1).equals("")) {
        		throw new ExcelImportException("第" + (i + 1) + "行" + "身份证号码为空");
        	}
            inspectPersonInfo.setIdNumber(getCellValueByIndex(row, 1));
            inspectPersonInfo.setGender(getCellValueByIndex(row, 2));
            inspectPersonInfo.setEducation(getCellValueByIndex(row, 3));
            inspectPersonInfo.setWorkPlace(getCellValueByIndex(row, 4));
            
            inspectPersonInfoes.add(inspectPersonInfo);
        }
        return inspectPersonInfoes;
    }
    
    public List<LawcaseInfo> readLawcaseInfoes( InputStream is) {
    	List<LawcaseInfo> lawcaseInfoes = new ArrayList<>();
    	
    	List<String> content = new ArrayList<String>();
        try
        {
            fs = new POIFSFileSystem( is );
            wb = new HSSFWorkbook( fs );
        }
        catch( IOException e )
        {
            e.printStackTrace();
        }
        sheet = wb.getSheetAt( 0 );

        int rowNum = sheet.getLastRowNum();
        row = sheet.getRow( 0 );

        for( int i = 1; i <= rowNum; i++ )
        {
            row = sheet.getRow( i );
            LawcaseInfo lawcaseInfo = new LawcaseInfo();

            lawcaseInfo.setRespondentName(getCellValueByIndex(row, 0));
            lawcaseInfo.setBirthDate(getCellValueByIndex(row, 1));
            lawcaseInfo.setJoinDate(getCellValueByIndex(row, 2));
            lawcaseInfo.setWorkPlaceAndPosition(getCellValueByIndex(row, 3));
            lawcaseInfo.setCaseFilingDate(getCellValueByIndex(row, 4));
            lawcaseInfo.setCaseCloseDate(getCellValueByIndex(row, 5));
            lawcaseInfo.setPartyDisciplinePunishment(getCellValueByIndex(row, 6));
            lawcaseInfo.setPoliticalDisciplinePunishment(getCellValueByIndex(row, 7));
            
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
