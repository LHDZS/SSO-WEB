import commonData from "@/config/common-data";

export default function redirectToAdmin() {
    commonData.system_alert_modal.$router.push({
        // path: "/admin",
        path: "/mine/adminUserManager",
        query: {random: new Date().getTime() + ""}
    })
}