import authenticationErrorHandler from "@/error/common/authentication-error-handler";
import innerErrorHandler from "@/error/common/inner-error-handler";
import defaultErrorHandler from "@/error/common/default-error-handler";
import notSSOAdminErrorHandler from "@/error/common/not-sso-admin-error-handler";

export default function selectUserByAuthorityErrorHandler(err) {
    if (err && err.response && err.response.status) {
        switch (err.response.status) {
            case 401:
                authenticationErrorHandler();
                break;
            case 403:
                notSSOAdminErrorHandler()
                break;
            case 500:
                innerErrorHandler();
                break;
            default:
                defaultErrorHandler(err)
                break;
        }
    }
}