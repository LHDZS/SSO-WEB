import commonData from "@/config/common-data";

export default function redirectToIndex(){
    commonData.system_alert_modal.$router.push({
        path: "/",
        query: {callback: commonData.system_alert_modal.$route.query.callback}
    })
}