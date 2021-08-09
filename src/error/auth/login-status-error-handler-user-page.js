import innerErrorHandler from "@/error/common/inner-error-handler";
import defaultErrorHandler from "@/error/common/default-error-handler";
import reloadErrorHandler from "@/error/common/reload-error-handler";
import authenticationErrorHandler from "@/error/common/authentication-error-handler";

export default function loginStatusErrorHandlerUserPage(err){
    if (err && err.response && err.response.status) {
        switch (err.response.status) {
            case 401:
                authenticationErrorHandler()
                break;
            case 601:
                reloadErrorHandler();
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