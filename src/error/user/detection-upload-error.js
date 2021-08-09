import authenticationErrorHandler from "@/error/common/authentication-error-handler";
import notSSOAdminErrorHandler from "@/error/common/not-sso-admin-error-handler";
import sqlErrorHandler from "@/error/common/sql-error-handler";
import defaultErrorHandler from "@/error/common/default-error-handler";
import commonData from "@/config/common-data";

export default function insertUserErrorHandler(err) {
    if (err && err.status) {
        switch (err.status) {
            case 401:
                authenticationErrorHandler();
                break;
            case 400:
                notSSOAdminErrorHandler();
                break;
            case 409:
                commonData.system_alert_modal.open({
                    title: '添加失败',
                    content: '后缀不符合规定，必须为xls，xlsx'
                });
                break;
            case 500:
                commonData.system_alert_modal.open({
                    title: '添加失败',
                    content: '文件解析错误'
                });
                break;
            case 605:
                commonData.system_alert_modal.open({
                    title: '添加失败',
                    content: 'JIRA账号已注册，请选择另一个账号名进行注册'
                });
                break;
            case 608:
                commonData.system_alert_modal.open({
                    title: '添加失败',
                    content: '系统JIRA管理员配置出错，请联系JIRA开发人员'
                });
                break;
            case 607:
                commonData.system_alert_modal.open({
                    title: '添加失败',
                    content: 'JIRA同步注册失败，请联系JIRA开发人员'
                });
                break;
            default:
                defaultErrorHandler(err);
                break;
        }
    }
}