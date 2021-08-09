import commonData from "@/config/common-data";

export default function SSOAdminCanNotCtrlErrorHandler(){
    commonData.system_alert_modal.open({
        title: "无权限操作",
        content: "您操作的用户是管理员，您无权为其修改权限(需要超级管理员权限)"
    });
}