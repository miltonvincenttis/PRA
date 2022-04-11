package appdev;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAccessor;
import java.util.Date;

/**
 * Essa classe agrega metodos staticos utilitários.
 *
 */
public class Utils {
    public static LocalDateTime convertePraLocalDateTime(String dataISO){
        TemporalAccessor ta = DateTimeFormatter.ISO_INSTANT.parse(dataISO);
        Instant i = Instant.from(ta);
        Date d = Date.from(i);

        return d.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
    }

    public static void main(String[] args) {
        LocalDateTime ldt = Utils.convertePraLocalDateTime("2022-04-08T03:14:47.362Z");
        System.out.println(ldt);
    }
}
