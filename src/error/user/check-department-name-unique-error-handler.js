import authenticationErrorHandler from "@/error/common/authentication-error-handler";

export default function checkDepartmentNameUniqueErrorHandler(err,callback){
    if (err && err.response && err.response.status) {
        switch (err.response.status) {
            case 401:
                authenticationErrorHandler();
                break;
            case 612:
                callback(new Error('部门名称已存在'));
                break;
            default:
                callback(new Error('服务器内部错误，请联系运维人员'));
                break;
        }
    }
    if (callback) {
        callback();
    }
}