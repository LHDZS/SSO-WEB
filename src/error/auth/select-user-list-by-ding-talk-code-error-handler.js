import emailTokenErrorHandler from "@/error/common/email-token-error-handler";
import innerErrorHandler from "@/error/common/inner-error-handler";
import defaultErrorHandler from "@/error/common/default-error-handler";
import commonData from "@/config/common-data";
import redirectToIndex from "@/error/common/redirect-to-index";

export default function selectUserListByDingTalkCodeErrorHandler(err){
    if (err && err.response && err.response.status) {
        switch (err.response.status) {
            case 401:
                emailTokenErrorHandler()
                break;
            case 403:
                commonData.system_alert_modal.open({
                    title: "钉钉鉴权失败",
                    content: "您的鉴权请求被钉钉服务器禁止，请稍后重试",
                    onOk: () => {
                        redirectToIndex();
                    }
                });
                break;
            case 404:
                commonData.system_alert_modal.open({
                    title: "钉钉鉴权失败",
                    content: "查询不到您的数据，请检测您的钉钉是否已绑定云畅游戏",
                    onOk: () => {
                        redirectToIndex();
                    }
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