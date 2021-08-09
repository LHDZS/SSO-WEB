import authenticationErrorHandler from "@/error/common/authentication-error-handler";
import defaultErrorHandler from "@/error/common/default-error-handler";
import innerErrorHandler from "@/error/common/inner-error-handler";

export default function getTokenErrorHandler(err) {
    if (err && err.response && err.response.status) {
        switch (err.response.status) {
            case 401:
                authenticationErrorHandler();
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