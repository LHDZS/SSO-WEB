import authenticationErrorHandler from "@/error/common/authentication-error-handler";
import innerErrorHandler from "@/error/common/inner-error-handler";
import defaultErrorHandler from "@/error/common/default-error-handler";
import sqlErrorHandler from "@/error/common/sql-error-handler";
import commonData from "@/config/common-data";

export default function restPasswordByOldPasswordErrorHandler(err){
    if (err && err.response && err.response.status) {
        switch (err.response.status) {
            case 401:
                authenticationErrorHandler();
                break;
            case 602:
                sqlErrorHandler();
                break;
            case 409:
                commonData.system_alert_modal.open({
                    title: "修改失败",
                    content: "您输入的原密码错误！请重新输入"
                });
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