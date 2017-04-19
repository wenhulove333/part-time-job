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
            String name = row.getCell( 0 ).getStringCellValue();
            content.add(name);
        }
        return content;
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
