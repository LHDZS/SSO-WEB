import authenticationErrorHandler from "@/error/common/authentication-error-handler";
import notSSOAdminErrorHandler from "@/error/common/not-sso-admin-error-handler";
import sqlErrorHandler from "@/error/common/sql-error-handler";
import defaultErrorHandler from "@/error/common/default-error-handler";
import commonData from "@/config/common-data";

export default function insertUserErrorHandler(err) {
    if (err && err.response && err.response.status) {
        switch (err.response.status) {
            case 404:
                commonData.system_alert_modal.open({
                    title: '修改失败',
                    content: '没有管理员权限'
                });
                break;
            case 403:
                commonData.system_alert_modal.open({
                    title: '修改失败',
                    content: '用户ID不存在或部门ID不存在'
                });
                break;
            case 400:
                commonData.system_alert_modal.open({
                    title: '修改失败',
                    content: '存在没有能力操作的权限（超级管理员可以操作所有权限，普通管理员不能操作CEO,HRVP,普通管理员等等的权限）'
                });
                break;
            default:
                defaultErrorHandler(err);
                break;
        }
    }
}