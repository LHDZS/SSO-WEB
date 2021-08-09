import commonData from "@/config/common-data";

export default function redirectToExit() {
    commonData.system_alert_modal.$router.push({path: "/exit",})
}