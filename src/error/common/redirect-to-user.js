import commonData from "@/config/common-data";

export default function redirectToUser() {
    commonData.system_alert_modal.$router.push({
        path: "/user",
    })
}