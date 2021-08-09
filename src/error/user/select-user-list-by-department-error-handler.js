import innerErrorHandler from "@/error/common/inner-error-handler";
import defaultErrorHandler from "@/error/common/default-error-handler";
import authenticationErrorHandler from "@/error/common/authentication-error-handler";
import commonData from "@/config/common-data";

export default function selectUserListByDepartmentErrorHandler(err){
    if (err && err.response && err.response.status) {
        switch (err.response.status) {
            case 401:
                authenticationErrorHandler();
                break;
            case 404:
                commonData.system_alert_modal.open({
                    title: "部门不存在",
                    content: "部门信息不存在，无法进行查询",
                    onOk(){
                        window.location.reload();
                    }
                });
                break;
            case 500:
                innerErrorHandler();
                break;
            default:
                defaultErrorHandler(err)
                break;
        }
    }
}