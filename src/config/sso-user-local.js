import axios from '@/config/axios-config';
import selectSSOUserByUserIdListErrorHandler from "@/error/user/select-sso-user-by-user-id-list-error-handler";
import commonData from "@/config/common-data";

export default function selectSSOUserByIdListLocal(userList, callback = () => {
}) {
    let result = {};
    let remoteList = [];
    for (let i = 0; i < userList.length; i++) {
        let userId = userList[i];
        if (userId) {
            if (commonData.sso_user_local_map[userId] != null) {
                result[userId] = commonData.sso_user_local_map[userId];
            } else {
                remoteList.push(userId);
            }
        }
    }
    if (remoteList.length > 0) {
        axios({
            url: commonData.system_alert_modal.$server_address + '/user/selectSSOUserByUserIdList',
            method: 'post',
            data: remoteList,
            'hide-spin': true,
        }).then(res => {
            for (let i = 0; i < remoteList.length; i++) {
                let remoteUserId = remoteList[i];
                if (res.data[remoteUserId]) {
                    commonData.system_alert_modal.$set(commonData.sso_user_local_map, remoteUserId, res.data[remoteUserId])
                    result[remoteUserId] = res.data[remoteUserId];
                }
            }
            callback(result);
        }).catch(err => {
            selectSSOUserByUserIdListErrorHandler(err);
        })
    } else {
        callback(result);
    }

}