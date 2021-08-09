import innerErrorHandler from "@/error/common/inner-error-handler";
import defaultErrorHandler from "@/error/common/default-error-handler";
import userDisabledErrorHandler from "@/error/common/user-disabled-error-handler";
import sqlErrorHandler from "@/error/common/sql-error-handler";
import commonData from "@/config/common-data";

export default function resetPasswordByEmailStep1ErrorHandler(err){
    if (err && err.response && err.response.status) {
        switch (err.response.status) {
            case 406:
                commonData.system_alert_modal.open({
                    title: "您的账户无法发送邮件",
                    content: "系统管理员没有登记您的邮件地址或者真实姓名，请联系系统管理员"
                });
                break;
            case 404:
                commonData.system_alert_modal.open({
                    title: "用户名不存在",
                    content: "用户名不存在"
                });
                break;
            case 602:
                sqlErrorHandler();
                break;
            case 503:
                commonData.system_alert_modal.open({
                    title: "邮件发送频率过高",
                    content: "请一分钟后重试"
                });
                break;
            case 603:
                userDisabledErrorHandler();
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