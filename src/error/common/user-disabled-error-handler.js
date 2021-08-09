import commonData from "@/config/common-data";
import redirectToIndex from "@/error/common/redirect-to-index";

export default function userDisabledErrorHandler(){
    commonData.system_alert_modal.open({
        title: "系统管理员禁止了您的登录和密码找回",
        content: "请联系系统管理员解决您的问题",
        onOk: () => {
            redirectToIndex();
        }
    });
}