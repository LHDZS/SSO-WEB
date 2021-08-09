import innerErrorHandler from "@/error/common/inner-error-handler";
import defaultErrorHandler from "@/error/common/default-error-handler";
import emailTokenErrorHandler from "@/error/common/email-token-error-handler";
import sqlErrorHandler from "@/error/common/sql-error-handler";

export default function resetPasswordByEmailStep2ErrorHandler(err){
    if (err && err.response && err.response.status) {
        switch (err.response.status) {
            case 401:
                emailTokenErrorHandler()
                break;
            case 602:
                sqlErrorHandler();
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