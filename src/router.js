import Index from './views/index'
import Auth from './views/auth'
import Exit from './views/exit'
import User from './views/user'
import ResetPassword from './views/resetPassword'
import DingTalkAuth from './views/dingTalkAuth'
import Admin from './views/admin'
import Mine from './views/mine'
import AdminUserManager from "@/component/admin/adminUserManager";
import AdminAuthorityManager from "@/component/admin/adminAuthorityManager";
import AdminDepartmentManager from "@/component/admin/adminDepartmentManager";
import AdminJurisdictionManager from "@/component/admin/adminJurisdictionManager";
import Error from './views/error'

const routers = [
    {path: '/', component: Index},
    {path: '/auth', component: Auth},
    {path: '/exit', component: Exit},
    {path: '/user', component: User},
    {path: '/resetPassword', component: ResetPassword},
    {path: '/dingTalkAuth', component: DingTalkAuth},
    // {path: '/admin', component: Admin},
    {
        path: '/mine', 
        component: Mine,
        children: [
            {
                path: 'adminUserManager',
                component: AdminUserManager
            },
            {
                path: 'adminAuthorityManager',
                component: AdminAuthorityManager
            },
            {
                path: 'adminDepartmentManager',
                component: AdminDepartmentManager
            },
            {
                path: 'adminJurisdictionManager',
                component: AdminJurisdictionManager
            }
        ]
    },
    {path: '/error', component: Error},
    {path: '/*', component: Index},
];
export default routers;