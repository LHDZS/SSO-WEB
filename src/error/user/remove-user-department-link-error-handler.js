import authenticationErrorHandler from "@/error/common/authentication-error-handler";
import notSSOAdminErrorHandler from "@/error/common/not-sso-admin-error-handler";
import defaultErrorHandler from "@/error/common/default-error-handler";
import commonData from "@/config/common-data";

export default function removeUserDepartmentLinkErrorHandler(err) {
    if (err && err.response && err.response.status) {
        switch (err.response.status) {
            case 401:
                authenticationErrorHandler();
                break;
            case 403:
                notSSOAdminErrorHandler();
                break;
            case 404:
                commonData.system_alert_modal.open({
                    title: '用户不存在或部门不存在',
                    content: '系统内查找不到此用户或部门',
                    onOk(){
                        window.location.reload()
                    }
                });
                break;
            case 603:
                commonData.system_alert_modal.open({
                    title: '用户被禁用',
                    content: '您选择的用户被禁止登录，无法关联'
                });
                break;
            default:
                defaultErrorHandler(err);
                break;
        }
    }
}