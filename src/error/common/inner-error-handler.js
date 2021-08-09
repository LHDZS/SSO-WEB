import commonData from "@/config/common-data";

export default function innerErrorHandler(){
    commonData.system_alert_modal.open({
        title: "请求出错",
        content: "服务器内部错误,请联系运维人员"
    });
}