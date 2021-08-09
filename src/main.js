import Vue from 'vue';
import ViewUI from 'view-design';
import VueRouter from 'vue-router';
import Routers from './router';
import App from './app.vue';
import 'view-design/dist/styles/iview.css';
import axios from './config/axios-config'
import VueClipboard from 'vue-clipboard2'
import "babel-polyfill"
import VueCookies from 'vue-cookies'
import calculateAddress from "@/config/address";
import Pagination from '@/component/pagination';
import VueCropper from 'vue-cropper';

Vue.use(VueCropper);
Vue.component('Pagination', Pagination);
Vue.use(VueRouter);
Vue.use(ViewUI);
Vue.use(VueClipboard);
Vue.use(VueCookies)
Vue.prototype.$axios = axios;
Vue.prototype.$server_address = calculateAddress(9000);
Vue.prototype.$app_address = calculateAddress(80);
Vue.prototype.$app_pes_address = process.env.VUE_APP_APP_PES;
Vue.prototype.$app_epc_address = process.env.VUE_APP_APP_EPC;
Vue.prototype.$app_okr_address = process.env.VUE_APP_APP_OKR;
Vue.prototype.$app_talk_address = process.env.VUE_APP_APP_TALK;
Vue.prototype.$app_home_address = process.env.VUE_APP_APP_HOME;
Vue.prototype.$app_jira_address = process.env.VUE_APP_APP_JIRA;
Vue.prototype.$app_wiki_address = process.env.VUE_APP_APP_WIKI;
Vue.prototype.$ding_app_secret = process.env.VUE_APP_DING_APP_ID;

import { accountAccess, filtrateDepartment } from './filters/textTransform.js';
Vue.filter('accountAccess', accountAccess);
Vue.filter('filtrateDepartment', filtrateDepartment);

const RouterConfig = {
    mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    ViewUI.LoadingBar.start();
    next();
});

router.afterEach(() => {
    ViewUI.LoadingBar.finish();
    window.scrollTo(0, 0);
});

new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
});
