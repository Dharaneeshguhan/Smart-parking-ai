import java.io.File;
import javax.tools.JavaCompiler;
import javax.tools.ToolProvider;

public class CompilerCheck {
    public static void main(String[] args) {
        JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
        if (compiler == null) {
            System.out.println("Java Compiler not found. Make sure JDK is installed.");
            return;
        }

        System.out.println("Compiling backend files...");
        int result = compiler.run(null, null, null, 
            "src/main/java/com/example/backend/entity/ParkingSlot.java",
            "src/main/java/com/example/backend/entity/Booking.java",
            "src/main/java/com/example/backend/dto/BookingRequest.java",
            "src/main/java/com/example/backend/dto/BookingDto.java",
            "src/main/java/com/example/backend/dto/AddSlotRequest.java",
            "src/main/java/com/example/backend/dto/OwnerEarningsDto.java",
            "src/main/java/com/example/backend/repository/BookingRepository.java",
            "src/main/java/com/example/backend/repository/ParkingSlotRepository.java",
            "src/main/java/com/example/backend/controller/BookingController.java",
            "src/main/java/com/example/backend/controller/OwnerController.java"
        );
        
        if (result == 0) {
            System.out.println("Compilation successful - no syntax errors in the new generic classes!");
        } else {
            System.out.println("Compilation failed with errors.");
        }
    }
}
