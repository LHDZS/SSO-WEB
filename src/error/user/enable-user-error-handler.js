import authenticationErrorHandler from "@/error/common/authentication-error-handler";
import notSSOAdminErrorHandler from "@/error/common/not-sso-admin-error-handler";
import SSOAdminCanNotCtrlErrorHandler from "@/error/common/sso-admin-can-not-ctrl-error-handler";
import defaultErrorHandler from "@/error/common/default-error-handler";

export default function enableUserErrorHandler(err){
    if (err && err.response && err.response.status) {
        switch (err.response.status) {
            case 401:
                authenticationErrorHandler();
                break;
            case 403:
                notSSOAdminErrorHandler();
                break;
            case 606:
                SSOAdminCanNotCtrlErrorHandler();
                break;
            default:
                defaultErrorHandler(err);
                break;
        }
    }
}