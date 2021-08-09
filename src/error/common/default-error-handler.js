import commonData from "@/config/common-data";

export default function defaultErrorHandler(err) {
    commonData.system_alert_modal.open({
        title: "未知错误",
        content: "请及时告知管理人员，相关错误代码：" + err.response.status
    });
}