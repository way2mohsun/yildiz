package panel.tajmi;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebResult;
import javax.jws.WebService;
import javax.jws.soap.SOAPBinding;
import javax.jws.soap.SOAPBinding.Style;

@SOAPBinding(style = Style.RPC)
@WebService(name = "panel-tajmi", targetNamespace = "http://maatel.ir/")
public interface Maatel {

    @WebMethod
    @WebResult(name = "getActiveServices")
    public String[] getActiveServices(
            @WebParam(name = "username", partName = "username") String username, 
            @WebParam(name = "password", partName = "password") String password, 
            @WebParam(name = "mobileNum", partName = "mobileNum") String mobileNum);
    
    @WebMethod
    @WebResult(name = "unsubscribe")
    public Long unsubscribe(
            @WebParam(name = "username", partName = "username") String username, 
            @WebParam(name = "password", partName = "password") String password, 
            @WebParam(name = "mobileNum", partName = "mobileNum") String mobileNum,
            @WebParam(name = "serviceId", partName = "serviceId") String service);
    
    @WebMethod
    @WebResult(name = "getHistoryServicesAll")
    public String[] getHistoryServicesAll(
            @WebParam(name = "username", partName = "username") String username, 
            @WebParam(name = "password", partName = "password") String password, 
            @WebParam(name = "mobileNum", partName = "mobileNum") String mobileNum,
            @WebParam(name = "serviceId", partName = "serviceId") String service,
            @WebParam(name = "FromDate", partName = "FromDate") String FromDate,
            @WebParam(name = "ToDate", partName = "ToDate") String ToDate);
    
}
