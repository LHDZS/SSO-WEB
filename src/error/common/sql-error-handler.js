import commonData from "@/config/common-data";

export default function sqlErrorHandler(){
    commonData.system_alert_modal.open({
        title: "数据提交冲突",
        content: "请稍后重试"
    });
}