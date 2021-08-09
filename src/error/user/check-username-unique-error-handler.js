import authenticationErrorHandler from "@/error/common/authentication-error-handler";

export default function checkUsernameUniqueErrorHandler(err,callback){
    if (err && err.response && err.response.status) {
        switch (err.response.status) {
            case 401:
                authenticationErrorHandler();
                break;
            case 604:
                callback(new Error('用户名已存在，不能注册'));
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