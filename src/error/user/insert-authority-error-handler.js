import authenticationErrorHandler from "@/error/common/authentication-error-handler";
import defaultErrorHandler from "@/error/common/default-error-handler";
import innerErrorHandler from "@/error/common/inner-error-handler";
import notSSOAdminErrorHandler from "@/error/common/not-sso-admin-error-handler";
import SSOAdminCanNotCtrlErrorHandler from "@/error/common/sso-admin-can-not-ctrl-error-handler";
import commonData from "@/config/common-data";

export default function insertAuthorityErrorHandler(err) {
    if (err && err.response && err.response.status) {
        switch (err.response.status) {
            case 401:
                authenticationErrorHandler();
                break;
            case 400:
                commonData.system_alert_modal.open({
                    title: "管理员权限不足",
                    content:"您当前不能为此权限添加或者删除用户（需要超级管理员权限）",
                });
                break;
            case 403:
                notSSOAdminErrorHandler()
                break;
            case 603:
                commonData.system_alert_modal.open({
                    title: "操作失败",
                    content:"无法为被禁止登录的用户修改权限",
                });
                break;
            case 606:
                SSOAdminCanNotCtrlErrorHandler();
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