<template>
  <el-main>
    <el-form ref="searchForm" :inline="true" size="small" label-width="80px">
      <el-form-item>
        <el-input v-model="searchModel.departmentName" placeholder="请输入部门名称"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        <el-button icon="el-icon-refresh-right">重置</el-button>
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
            icon="el-icon-edit-outline"
            type="primary"
            size="small"
            @click="handleEdit(scope.row)"
          >编辑
          </el-button
          >
          <el-button
            icon="el-icon-close"
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
      @onConfrim="onParentConfirm"
    >
      <div slot="content">选择所属部门窗口</div>
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
        height: 170
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
        width: 300,
        height: 400
      },
      treeList: []
    }
  },
  methods: {
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
      this.deptDialog.visible = false
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

    },
    /**
     *  删除部门
     *  @param row
     */
    handleDelete(row) {

    }

  },
  /**
   * 初始化时 查询所有部门列表
   */
  created() {
    this.search()
  }
}
</script>

<style scoped>

</style>
