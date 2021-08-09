import redirectToIndex from "@/error/common/redirect-to-index";
import commonData from "@/config/common-data";

export default function emailTokenErrorHandler(){
    commonData.system_alert_modal.open({
        title: '链接已失效',
        content: '您邮件的链接已失效，请重新发送找回密码邮件',
        onOk: () => {
            redirectToIndex();
        },
    });
}