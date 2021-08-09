import authenticationErrorHandler from "@/error/common/authentication-error-handler";
import notSSOAdminErrorHandler from "@/error/common/not-sso-admin-error-handler";
import sqlErrorHandler from "@/error/common/sql-error-handler";
import defaultErrorHandler from "@/error/common/default-error-handler";
import commonData from "@/config/common-data";

export default function insertDepartmentErrorHandler(err) {
    if (err && err.response && err.response.status) {
        switch (err.response.status) {
            case 401:
                authenticationErrorHandler();
                break;
            case 403:
                notSSOAdminErrorHandler();
                break;
            case 611:
                commonData.system_alert_modal.open({
                    title: '注册失败',
                    content: '部门代码已存在'
                });
                break;
            case 612:
                commonData.system_alert_modal.open({
                    title: '注册失败',
                    content: '部门名称已存在'
                });
                break;
            case 404:
                commonData.system_alert_modal.open({
                    title: '注册失败',
                    content: '父部门不存在'
                });
                break;
            default:
                defaultErrorHandler(err);
                break;
        }
    }
}