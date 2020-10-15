package panel.tajmi;

import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import javax.jws.WebService;
import org.json.JSONArray;
import org.json.JSONObject;

@WebService(endpointInterface = "panel.tajmi.Maatel")
public class Maatelmpl implements Maatel {

    String url = "http://localhost:9000/hamrah-vas-panel-tajmiei";

    @Override
    public String[] getActiveServices(String username, String password, String mobileNum) {
        HttpURLConnection connection = null;
        try {
            connection = (HttpURLConnection) (new URL(url).openConnection());
            connection.setReadTimeout(10000);
            connection.setDoOutput(true);
            connection.setDoInput(true);
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json;charset=UTF-8");
            try (OutputStream out = connection.getOutputStream()) {
                OutputStreamWriter wout = new OutputStreamWriter(out, "UTF-8");
                wout.write(new JSONObject()
                        .put("tel", mobileNum)
                        .put("fun", "getActiveServices")
                        .toString());
                wout.flush();
            }
            StringBuilder response = new StringBuilder();
            try (InputStream in = connection.getInputStream()) {
                int c;
                while ((c = in.read()) != -1) {
                    response.append((char) c);
                }
            }
            JSONArray o = new JSONArray(response.toString());
            if (o.length() == 0) {
                return new String[]{};
            }
            String[] out = new String[o.length()];
            for (int i = 0; i < o.length(); i++) {
                out[i] = o.getString(i);
            }
            return out;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new String[]{"-3"};
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
    }

    @Override
    public Long unsubscribe(String username, String password, String mobileNum, String service) {
        HttpURLConnection connection = null;
        try {
            connection = (HttpURLConnection) (new URL(url).openConnection());
            connection.setReadTimeout(10000);
            connection.setDoOutput(true);
            connection.setDoInput(true);
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json;charset=UTF-8");
            try (OutputStream out = connection.getOutputStream()) {
                OutputStreamWriter wout = new OutputStreamWriter(out, "UTF-8");
                wout.write(new JSONObject()
                        .put("tel", mobileNum)
                        .put("fun", "unsubscribe")
                        .put("service", service)
                        .toString());
                wout.flush();
            }
            StringBuilder response = new StringBuilder();
            try (InputStream in = connection.getInputStream()) {
                int c;
                while ((c = in.read()) != -1) {
                    response.append((char) c);
                }
            }
            return new Long(response.toString());
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return -3l;
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
    }

    @Override
    public String[] getHistoryServicesAll(
            String username,
            String password,
            String mobileNum,
            String service,
            String FromDate,
            String ToDate) {
        HttpURLConnection connection = null;
        try {
            connection = (HttpURLConnection) (new URL(url).openConnection());
            connection.setReadTimeout(10000);
            connection.setDoOutput(true);
            connection.setDoInput(true);
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json;charset=UTF-8");
            try (OutputStream out = connection.getOutputStream()) {
                OutputStreamWriter wout = new OutputStreamWriter(out, "UTF-8");
                wout.write(new JSONObject()
                        .put("tel", mobileNum)
                        .put("fun", "getHistoryServicesAll")
                        .put("service", service)
                        .put("from", FromDate)
                        .put("to", ToDate)
                        .toString());
                wout.flush();
            }
            StringBuilder response = new StringBuilder();
            try (InputStream in = connection.getInputStream()) {
                int c;
                while ((c = in.read()) != -1) {
                    response.append((char) c);
                }
            }
            JSONArray o = new JSONArray(response.toString());
            if (o.length() == 0) {
                return new String[]{};
            }
            String[] out = new String[o.length()];
            for (int i = 0; i < o.length(); i++) {
                out[i] = o.getString(i);
            }
            return out;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new String[]{"-3"};
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
    }
}
