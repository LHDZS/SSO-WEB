import innerErrorHandler from "@/error/common/inner-error-handler";
import defaultErrorHandler from "@/error/common/default-error-handler";
import reloadErrorHandler from "@/error/common/reload-error-handler";
import redirectToAuth from "@/error/common/redirect-to-auth";

export default function loginStatusErrorHandlerIndex(err){
    if (err && err.response && err.response.status) {
        switch (err.response.status) {
            case 401:
                redirectToAuth();
                break;
            case 601:
                reloadErrorHandler();
                break;
            case 500:
                innerErrorHandler();
                break;
            default:
                defaultErrorHandler()
                break;
        }
    }
}