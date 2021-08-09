<template>
  <div style="padding:15px 0 15px 15px;height: 100%">
    <div class="sso-row" style="height: 100%">
      <div class="sso-col-250 sso-department-border sso-department-selector">
        <Tree :data="allDepartmentTree" @on-select-change="changeTree"/>
      </div>
      <div class="sso-col-275-surplus sso-department-border" style="margin-left: 15px">
        <div v-if="selectNode&&selectNode.type==='department'">
          <h3 style="margin-bottom: 15px">{{ selectNode.baseInfo.fullName }}</h3>
          <Tabs :animated="false" type="card">
            <TabPane label="部门详情">
              <admin-department-detail :node="selectNode" @on-insert-department="selectAllDepartment"
                                       @on-update-department="selectAllDepartment"
                                       @on-remove-department="selectAllDepartment"/>
            </TabPane>
            <TabPane label="人员详情">
              <admin-department-user :node="selectNode"/>
            </TabPane>
          </Tabs>
        </div>
        <div v-else-if="selectNode&&selectNode.type==='company'">
          <admin-company-detail :node="selectNode" @on-insert-department="selectAllDepartment"
                                @on-refresh-department="selectAllDepartment"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import searchUserPageErrorHandler from "@/error/user/search-user-page-error-handler";
import selectDepartmentTreeErrorHandler from "@/error/user/select-department-tree-error-handler";
import AdminDepartmentDetail from "@/component/admin/adminDepartmentDetail";
import AdminCompanyDetail from "@/component/admin/adminCompanyDetail";
import AdminDepartmentUser from "@/component/admin/adminDepartmentUser";

let timeOutInstance = null;

export default {
  name: "adminDepartmentManager",
  data() {
    return {
      allDepartmentTree: [],
      selectNode: null,
      link: {
        userId: null,
        departmentFullName: '',
        companyId: 1
      },
      searchUserConfig: {
        searchStr: "",
        page: 1,
        pageSize: 20
      },
      user_loading: false,
      user_list: [],
      columns: [
        {title: '用户名', key: 'username'},
        {title: '用户姓名', key: 'name'},
        {title: '部门', key: 'departmentFullName'},
      ],
      insertLinkFormRule: {
        userId: [
          {required: true, message: '请选择用户', trigger: 'change'},
        ],
        departmentFullName: [
          {required: true, message: '请设置部门全称', trigger: 'blur'},
        ]
      },
    }
  },
  methods: {
    changeTree(array, element) {
      this.$data.selectNode = element;
    },
    selectAllDepartment(selected = this.$data.selectNode) {
      this.$data.selectNode = null;
      this.$axios({
        url: this.$server_address + '/user/selectDepartmentTree/1',
        method: 'post',
      }).then(res => {
        this.loadCompanyTree(res.data, selected)
        this.$data.allDepartmentTree = [res.data];
      }).catch(err => {
        selectDepartmentTreeErrorHandler(err);
      })
    },
    loadCompanyTree(company, selected) {
      company.expand = true;
      for (let i = 0; i < company.children.length; i++) {
        company.children[i].expand = true;
        this.loadDepartmentTreeNode(company.children[i], selected)
      }
    },
    loadDepartmentTreeNode(node, selected) {
      if (selected && selected.id === node.id) {
        node.selected = true;
        this.$data.selectNode = node;
        if (node.children.length > 0) {
          node.expand = true;
        }
      }
      node.render = (h) => {
        return this.$createElement('span', {
          ref: "department-" + node.id,
          style: {
            display: 'inline-block',
            width: '100%'
          }
        }, [
          h('span', [h('span', node.title)]),
        ])
      };
      for (let i = 0; i < node.children.length; i++) {
        this.loadDepartmentTreeNode(node.children[i], selected);
        if (node.children[i].selected||node.children[i].expand) {
          node.expand = true;
        }
      }
    },
    searchUser(query) {
      if (query) {
        this.$data.user_loading = true;
        this.$data.searchUserConfig.searchStr = query;
        if (timeOutInstance) {
          clearTimeout(timeOutInstance);
        }
        timeOutInstance = setTimeout(() => {
          this.$axios({
            url: this.$server_address + '/user/searchUserPage',
            method: 'post',
            data: this.$data.searchUserConfig,
            'hide-spin': true
          }).then(res => {
            this.$data.user_loading = false;
            this.$data.user_list = res.data.content
          }).catch(err => {
            this.$data.user_loading = false;
            searchUserPageErrorHandler(err)
          })
        }, 500)
      } else {
        this.$data.userList = [];
      }
    },
  },
  created() {
    this.selectAllDepartment();
  },
  components: {
    AdminDepartmentDetail, AdminDepartmentUser, AdminCompanyDetail
  }
}
</script>

<style scoped>
@import "../../styles/grid.css";

.sso-department-border {
  border: 1px solid #AAAAAA;
  padding: 15px;
  height: 100%;
}

.sso-department-selector {
  overflow-x: scroll;
}

.sso-department-selector::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

.sso-department-selector::-webkit-scrollbar-thumb {
  background: #808695;
}

.sso-department-selector::-webkit-scrollbar-track {
  background: #FFFFFF;
}
</style>