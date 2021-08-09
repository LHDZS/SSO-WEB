import innerErrorHandler from "@/error/common/inner-error-handler";
import defaultErrorHandler from "@/error/common/default-error-handler";
import authenticationErrorHandler from "@/error/common/authentication-error-handler";
import commonData from "@/config/common-data";

export default function selectDepartmentTreeErrorHandler(err,vue){
    if (err && err.response && err.response.status) {
        switch (err.response.status) {
            case 401:
                authenticationErrorHandler(vue);
                break;
            case 404:
                commonData.system_alert_modal.open({
                    title:'查询公司部门结构失败',
                    content: "找不到云畅游戏节点，请联系系统管理员",
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