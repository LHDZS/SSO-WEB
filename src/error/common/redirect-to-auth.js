import commonData from "@/config/common-data";

export default function redirectToAuth(){
    commonData.system_alert_modal.$router.push({
        path: "/auth",
        query: {callback: commonData.system_alert_modal.$route.query.callback}
    })
}