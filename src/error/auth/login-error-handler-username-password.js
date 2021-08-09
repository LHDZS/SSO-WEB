import innerErrorHandler from "@/error/common/inner-error-handler";
import defaultErrorHandler from "@/error/common/default-error-handler";
import userDisabledErrorHandler from "@/error/common/user-disabled-error-handler";
import commonData from "@/config/common-data";

export default function loginErrorHandlerUsernamePassword(err){
    if (err && err.response && err.response.status) {
        switch (err.response.status) {
            case 401:
                commonData.system_alert_modal.open({
                    title: "用户名不存在或密码错误",
                    content: "用户名不存在或密码错误"
                });
                break;
            case 603:
                userDisabledErrorHandler()
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