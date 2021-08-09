import redirectToIndex from "@/error/common/redirect-to-index";
import commonData from "@/config/common-data";

export default function authenticationErrorHandler(){
    commonData.system_alert_modal.open({
        title: "登录失效",
        content: "您当前的登录凭证被系统拒绝，请尝试重新登录",
        onOk: () => {
            redirectToIndex();
        }
    });
}