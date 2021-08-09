import axios from "axios";
import {Spin, Modal} from 'view-design'

axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.interceptors.request.use(
    config => {
        if (!config['hide-spin']) {
            Spin.show();
        }
        return config
    }, error => {
        // console.log(error)
        return Promise.reject(error)
    }
);

axios.interceptors.response.use((res) => {
    Spin.hide();
    return res;
}, (error) => {
    // console.log(error)
    Spin.hide();
    if (error.response == null) {
        Modal.error({
            title: '连接服务器失败',
            content: '请确认服务器已正确连接，或稍后重试',
            closable: false,
            okText: '重新加载页面',
            onOk: () => {
                window.location.reload();
            }
        })
        return Promise.reject(error);
    }
    if (error.response.status === 601) {
        window.location.reload();
        return Promise.reject(error);
    }
    return Promise.reject(error);
});
export default axios;