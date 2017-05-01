package com.ss.govauditsys.aop;

import java.util.Arrays;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.ss.govauditsys.GlobalInfo;
import com.ss.govauditsys.usermanager.model.UserOperationLogging;
import com.ss.govauditsys.usermanager.model.UserOperationLoggingRepository;

@Aspect
@Component
public class WebRequestAspect {
	@Autowired
	UserOperationLoggingRepository userOperationLoggingRepository;
	
	private Logger logger = Logger.getLogger(getClass());
	
    @Pointcut("execution(public * com.ss.govauditsys.sysdata.model..*.*(..)) "
    		+ "|| execution(public * com.ss.govauditsys.web..*.*(..)) ")
    public void webLog(){}
    @Before("webLog()")
    public void doBefore(JoinPoint joinPoint) throws Throwable {
        // 接收到请求，记录请求内容
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();
//        // 记录下请求内容
//        logger.info("URI : " + request.getRequestURI().toString());
//        logger.info("HTTP_METHOD : " + request.getMethod());
//        for(Map.Entry<String, String[]> entry : request.getParameterMap().entrySet()) {
//        	logger.info("HTTP Parameter: " + entry.getKey() + " -> " + entry.getValue());
//        }
//        logger.info("IP : " + request.getRemoteAddr());
//        logger.info("CLASS_METHOD : " + joinPoint.getSignature().getDeclaringTypeName() + "." + joinPoint.getSignature().getName());
//        logger.info("ARGS : " + Arrays.toString(joinPoint.getArgs()));
        
        String uri = request.getRequestURI().toString();
        
        if (GlobalInfo.getGlobalInfo().logMap.containsKey(uri)) {
        	String userName = (String)joinPoint.getArgs()[0];
        	Calendar calendar = Calendar.getInstance();
        	userOperationLoggingRepository.save(new UserOperationLogging(
        		((UserDetails) SecurityContextHolder.getContext()
    				.getAuthentication().getPrincipal()).getUsername(),
        		userName,
        		GlobalInfo.getGlobalInfo().logMap.get(uri),
        		calendar
        	));
        }
    }
//    @AfterReturning(returning = "ret", pointcut = "webLog()")
//    public void doAfterReturning(Object ret) throws Throwable {
//        // 处理完请求，返回内容
////        logger.info("RESPONSE : " + ret);
//    }
}
