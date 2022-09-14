<template>
  <el-main>
    <el-form ref="searchForm" :inline="true" size="small" label-width="80px">
      <el-form-item>
        <el-input v-model="searchModel.departmentName" placeholder="请输入部门名称"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
        <el-button type="success" icon="el-icon-plus" @click="openAddWindow">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      border
      stripe
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      default-expand-all
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="departmentName" label="部门名称"/>
      <el-table-column prop="parentName" label="所属部门"/>
      <el-table-column prop="phone" label="部门电话"/>
      <el-table-column prop="address" label="部门地址"/>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            type="primary"
            size="small"
            @click="handleEdit(scope.row)"
          >编辑
          </el-button
          >
          <el-button
            icon="el-icon-delete"
            type="danger"
            size="small"
            @click="handleDelete(scope.row)"
          >删除
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <system-dialog :title="deptDialog.title"
                   :visible="deptDialog.visible"
                   :width="deptDialog.width"
                   :height="deptDialog.height"
                   @onClose="onClose"
                   @onConfirm="onConfirm"
    >
      <div slot="content">
        <el-form
          :model="dept"
          ref="deptForm"
          :rules="rules"
          label-width="80px"
          :inline="true"
          size="small"
        >
          <el-form-item label="所属部门" prop="parentName">
            <el-input
              v-model="dept.parentName" @click.native="openSelectDeptWindow()"
              :readonly="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="部门名称" prop="departmentName">
            <el-input v-model="dept.departmentName"></el-input>
          </el-form-item>
          <el-form-item label="部门电话">
            <el-input v-model="dept.phone"></el-input>
          </el-form-item>
          <el-form-item label="部门地址">
            <el-input v-model="dept.address"></el-input>
          </el-form-item>
          <el-form-item label="序号">
            <el-input v-model="dept.orderNum"></el-input>
          </el-form-item>

        </el-form>
      </div>
    </system-dialog>
    <system-dialog
      :title="parentDialog.title"
      :visible="parentDialog.visible"
      :width="parentDialog.width"
      :height="parentDialog.height"
      @onClose="onParentClose"
      @onConfirm="onParentConfirm"
    >
      <div slot="content">
        <el-tree ref="parentTree"
                 :data="treeList"
                 node-key="id"
                 :props="defaultProps"
                 empty-text="暂无数据"
                 :highlight-current="true"
                 :default-expand-all="true"
                 :expand-on-click-node="false"
                 @node-click="handleNodeClick"
        >
          <div class="customer-tree-node" slot-scope="{ node, data }">
              <span v-if="data.children.length === 0">
              <i class="el-icon-document"></i>
              </span>
            <span v-else @click="openBtn(data)">
                <svg-icon v-if="data.open" icon-class="add"/>
                <svg-icon v-else icon-class="sub"/>
              </span>
            <span style="margin-left: 3px">{{ node.label }}</span>
          </div>

        </el-tree>
      </div>
    </system-dialog>
  </el-main>
</template>

<script>
import department from '@/api/department'
import SystemDialog from '@/components/system/SystemDialog'

export default {
  name: 'department',
  components: {
    SystemDialog
  },
  data() {
    return {
      searchModel: {
        departmentName: ''
      },
      tableData: [],//表格数据列表
      deptDialog: {
        title: '',
        visible: false,
        width: 560,
        height: 250
      },
      //部门对象
      dept: {
        id: '',
        pid: '',
        parentName: '',
        departmentName: '',
        address: '',
        phone: '',
        orderNum: ''
      },
      //表单验证规则
      rules: {
        parentName: [{ required: true, trigger: 'change', message: '请选择所属部门' }],
        departmentName: [{ required: true, trigger: 'blur', message: '请输入部门名' }]
      },
      parentDialog: {
        title: '选择所属部门',
        visible: false,
        width: 350,
        height: 400
      },
      treeList: [],
      //树形组件默认属性值
      defaultProps: {
        children: 'children',
        label: 'departmentName'
      }
    }
  },
  methods: {
    /**
     * 点击树节点+-号折叠展开事件
     */
    openBtn(data) {
      //修改折叠展开状态
      data.open = !data.open
      this.$refs.parentTree.store.nodesMap[data.id].expanded = !data.open
    },
    /**
     * 树节点点击事件
     */
    handleNodeClick(data) {
      //当点击树节点时，赋予选中的值
      this.dept.pid = data.id
      this.dept.parentName = data.departmentName
    },
    /**
     * 打开选择所属部门的窗口
     */
    async openSelectDeptWindow() {
      this.parentDialog.visible = true
      let res = await department.getParentTreeList()
      if (res.code === 20000) {
        console.log(res)
        this.treeList = res.data
      }
    },
    /**
     * 所属部门窗口关闭
     */
    onParentClose() {
      this.parentDialog.visible = false
    },
    /**
     * 所属部门窗口确认
     */
    onParentConfirm() {
      this.parentDialog.visible = false
    },

    /**
     * 打开添加窗口
     */
    openAddWindow() {
      //清空表单数据
      this.$resetForm('deptForm', this.dept)
      //设置窗口属性
      this.deptDialog.title = '新增部门'
      this.deptDialog.visible = true
    },

    /**
     * 窗口的关闭事件
     */
    onClose() {
      this.deptDialog.visible = false
    },

    /**
     * 窗口的确认事件
     */
    onConfirm() {
      this.$refs.deptForm.validate(async(valid) => {
        //如果验证通过
        if (valid) {
          let res = null
          if (this.dept.id === '') {
            res = await department.addDept(this.dept)
            if (res.code === 20000) {
              this.$message.success('添加成功')
              await this.search()
              this.deptDialog.visible = false
            } else {
              this.$message.error('添加失败')
            }
          } else {
            res = await department.updateDept(this.dept)
            if (res.code === 20000) {
              this.$message.success('数据更新成功')
              await this.search()
              this.deptDialog.visible = false
            } else {
              this.$message.error('数据更新失败')
            }
          }
        }
      })
    },

    /**
     * 重置按钮点击事件
     */
    reset() {
      this.searchModel.departmentName = ''
    },

    /**
     * 查询部门列表
     */
    async search() {
      let res = await department.getDepartmentList(this.searchModel)
      if (res.code === 20000) {
        this.tableData = res.data
      }
    },

    /**
     * 编辑部门
     * @param row
     */
    handleEdit(row) {
      //数据回显
      this.$objCopy(row, this.dept)
      //设置窗口标题
      this.deptDialog.title = '编辑部门'
      //显示编辑部门窗口
      this.deptDialog.visible = true
    },
    /**
     *  删除部门
     *  @param row
     */
    async handleDelete(row) {
      let res = await department.checkDepartment({ id: row.id })
      if (res.code === 50000) {
        this.$message.warning(res.message)
      } else {
        //确认是否删除
        let confirm = await this.$myconfirm('确定要删除该数据吗?')
        if (confirm) {
          //发送删除请求
          let res = await department.deleteById({ id: row.id })
          //判断是否成功
          if (res.code === 20000) {
            //成功提示
            this.$message.success(res.message)
            await this.search()
          } else {
            this.$message.error(res.message)
          }
        }
      }
    }

  }
  ,
  /**
   * 初始化时 查询所有部门列表
   */
  created() {
    this.search()
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-tree {
  .el-tree-node {
    position: relative;
    padding-left: 10px;
  }

  .el-tree-node children {
    padding-left: 20px;
  }

  .el-tree-node :last-child:before {
    height: 40px;
  }

  .el-tree > .el-tree-node:before {
    border-left: none;
  }

  .el-tree > .el-tree-node:after {
    border-top: none;
  }

  .el-tree-node:before,
  .el-tree-node:after {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .tree :first-child .el-tree-node:before {
    border-left: none;
  }

  .el-tree-node:before {
    border-left: 1px dotted #d9d9d9;
    bottom: 0px;
    height: 100%;
    top: -25px;
    width: 1px;
  }

  .el-tree-node:after {
    border-top: 1px dotted #d9d9d9;
    height: 20px;
    top: 14px;
    width: 24px;
  }

  .el-tree-node expand-icon.is-leaf {
    width: 8px;
  }

  .el-tree-node content > .el-tree-node expand-icon {
    display: none;
  }

  .el-tree-node content {
    line-height: 30px;
    height: 30px;
    padding-left: 10px !important;
  }
}

::v-deep .el-tree > div {
  &::before {
    display: none;
  }

  &::after {
    display: none;
  }
}
</style>
