package appdev.recursos;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAccessor;
import java.util.Date;

public class Tester {
    public static void main(String[] args) {
        String s = "2022-04-08T02:35:26.902Z";
        TemporalAccessor ta = DateTimeFormatter.ISO_INSTANT.parse(s);
        Instant i = Instant.from(ta);
        Date d = Date.from(i);

        System.out.println(d.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime());
    }
}
