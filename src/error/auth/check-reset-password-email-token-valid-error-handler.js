import innerErrorHandler from "@/error/common/inner-error-handler";
import defaultErrorHandler from "@/error/common/default-error-handler";
import emailTokenErrorHandler from "@/error/common/email-token-error-handler";

export default function checkResetPasswordEmailTokenValidErrorHandler(err){
    if (err && err.response && err.response.status) {
        switch (err.response.status) {
            case 401:
                emailTokenErrorHandler();
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