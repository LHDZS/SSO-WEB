import commonData from "@/config/common-data";

export default function notSSOAdminErrorHandler(){
    commonData.system_alert_modal.open({
        title: "只有系统管理员可以进行此操作",
        content: "您当前不是系统管理员，请检查您当前的权限是否被吊销",
        onOk(){
            window.location.reload();
        }
    });
}