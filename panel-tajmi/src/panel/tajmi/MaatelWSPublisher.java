package panel.tajmi;

import javax.xml.ws.Endpoint;

public class MaatelWSPublisher {

    static String url = "http://127.0.0.1:8091/hamrah-vas-panel-tajmiei";
    //static String url = "http://localhost:8091/hamrah-vas-panel-tajmiei";
    public static void main(String[] args) {
        try {
            Endpoint.publish(url, new Maatelmpl());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}