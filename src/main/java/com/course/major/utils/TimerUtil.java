package com.course.major.utils;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
public class TimerUtil {
    private static final Map<String, String> examKey = new ConcurrentHashMap<>();
    private static final ScheduledExecutorService scheduler =
            Executors.newSingleThreadScheduledExecutor();
    private static final long EXAM_DURATION_SECONDS = 15;
    private TimerUtil() {}
    public static String startExam(String id) {
        String examVal = UUID.randomUUID().toString();
        String val=examKey.putIfAbsent(id, examVal);
        if(val!=null) {
            throw new RuntimeException("Exam already started");
        }
        scheduler.schedule(() -> {
            examKey.remove(id);
        }, EXAM_DURATION_SECONDS, TimeUnit.SECONDS);
        return examVal;
    }
    public static boolean isLegalKey(String id,String examVal) {
        if(examVal.equals(examKey.getOrDefault(id, "-1"))){
            examKey.remove(id);
            return true;
        }
        return false;
    }
}

