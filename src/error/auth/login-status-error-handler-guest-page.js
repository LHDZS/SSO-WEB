import innerErrorHandler from "@/error/common/inner-error-handler";
import defaultErrorHandler from "@/error/common/default-error-handler";

export default function loginStatusErrorHandlerGuestPage(err){
    if (err && err.response && err.response.status) {
        switch (err.response.status) {
            case 401:
                break;
            case 601:
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