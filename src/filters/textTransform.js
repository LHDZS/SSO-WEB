
export function accountAccess(value) {
    const types = {
        'OKR-ADMIN': "OKR系统管理员",
        'SSO-SUPER-ADMIN': "超级系统管理员",
        'EPC-ADMIN': "文化系统管理员",
        'QUESTIONNAIRE-ADMIN': "文化之星管理员",
        'PES-ADMIN': "绩效系统管理员",
        'HOME-ADMIN': "内部官网管理员",
        'ASSETS-ADMIN': "资产系统管理员",
        'TALK-ADMIN': "面谈系统管理员",
        'SSO-ADMIN': "SSO系统管理员",
        'CEO': "首席执行官",
        'HR_VP': "人力资源副总裁",
        'HR_BP_LEADER': "HRBP HEAD",
    };
    return types[value] || '';
}

export function filtrateDepartment(array) {
    let name = '';
    let key = array.length - 1;
    if (key >= 0) {
        name = array[key].fullName  
    }
    return name;
}

