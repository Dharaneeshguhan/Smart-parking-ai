import java.sql.*;

public class DbFix {
    public static void main(String[] args) throws Exception {
        String url = "jdbc:mysql://localhost:3306/smart_parking?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
        String user = "root";
        String pass = "root";
        
        try (Connection conn = DriverManager.getConnection(url, user, pass);
             Statement stmt = conn.createStatement()) {
            
            System.out.println("Checking columns...");
            ResultSet rs = conn.getMetaData().getColumns(null, null, "parking_slots", null);
            boolean hasAvailableSlots = false;
            boolean hasTotalSlots = false;
            while (rs.next()) {
                String col = rs.getString("COLUMN_NAME");
                if ("available_slots".equals(col)) hasAvailableSlots = true;
                if ("total_slots".equals(col)) hasTotalSlots = true;
            }
            
            if (hasAvailableSlots) {
                System.out.println("Renaming available_slots to available_spots");
                stmt.execute("ALTER TABLE parking_slots CHANGE available_slots available_spots INT NOT NULL");
            }
            if (hasTotalSlots) {
                System.out.println("Renaming total_slots to total_spots");
                stmt.execute("ALTER TABLE parking_slots CHANGE total_slots total_spots INT NOT NULL");
            }
            System.out.println("DB fix completed.");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
