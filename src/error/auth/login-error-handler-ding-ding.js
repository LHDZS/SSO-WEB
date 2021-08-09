import innerErrorHandler from "@/error/common/inner-error-handler";
import defaultErrorHandler from "@/error/common/default-error-handler";
import userDisabledErrorHandler from "@/error/common/user-disabled-error-handler";
import redirectToIndex from "@/error/common/redirect-to-index";
import commonData from "@/config/common-data";

export default function loginErrorHandlerDingDing(err){
    if (err && err.response && err.response.status) {
        switch (err.response.status) {
            case 404:
                commonData.system_alert_modal.open({
                    title: "钉钉鉴权失败",
                    content: "找不到您的钉钉绑定记录",
                    onOk: () => {
                        redirectToIndex();
                    }
                });
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
            case 603:
                userDisabledErrorHandler()
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