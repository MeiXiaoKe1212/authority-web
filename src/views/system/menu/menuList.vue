<template>
  <el-main>
    <!-- 新增按钮 -->
    <el-button type="success" icon="el-icon-plus" @click="openAddWindow">新增</el-button>
    <!-- 数据表格 -->
    <el-table
      style="margin-top: 10px"
      :height="tableHeight"
      :data="menuList"
      row-key="id"
      default-expand-all
      :tree-props="{ children: 'children' }"
      :border="true"
      stripe
    >
      <el-table-column prop="label" label="菜单名称"></el-table-column>
      <el-table-column prop="type" label="菜单类型" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === '0'" size="normal">目录</el-tag>
          <el-tag type="success" v-else-if="scope.row.type === '1'" size="normal">
            菜单
          </el-tag>
          <el-tag type="warning" v-else-if="scope.row.type === '2'" size="normal">
            按钮
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="图标" align="center">
        <template slot-scope="scope">
          <i :class="scope.row.icon" v-if="scope.row.icon.includes('el-icons.js')">
          </i>
          <svg-icon v-else :icon-class="scope.row.icon"></svg-icon>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="路由名称"></el-table-column>
      <el-table-column prop="path" label="路由地址"></el-table-column>
      <el-table-column prop="url" label="组件路径"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click="editMenu(scope.row)"
          >编辑
          </el-button>
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="deleteMenu(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增或修改窗口 -->
    <system-dialog
      :title="menuDialog.title"
      :visible="menuDialog.visible"
      :width="menuDialog.width"
      :height="menuDialog.height"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <el-form
          :model="menu"
          ref="menuForm"
          :rules="rules"
          label-width="80px"
          :inline="true"
          size="small"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item prop="type" label="菜单类型">
                <el-radio-group v-model="menu.type" @change="radioChange">
                  <el-radio :label="0">目录</el-radio>
                  <el-radio :label="1">菜单</el-radio>
                  <el-radio :label="2">按钮</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item prop="parentName" size="small" label="所属菜单" @click.native="selectParentMenu">
            <el-input
              @click.native="selectParentMenu"
              v-model="menu.parentName"
              :readonly="true"
            ></el-input>
          </el-form-item>
          <el-form-item prop="label" size="small" label="菜单名称">
            <el-input v-model="menu.label"></el-input>
          </el-form-item>
          <el-form-item
            prop="name"
            v-if="menu.type === 1"
            size="small"
            label="路由名称"
          >
            <el-input v-model="menu.name"></el-input>
          </el-form-item>
          <el-form-item
            prop="path"
            v-if="menu.type !== 2"
            size="small"
            label="路由地址"
          >
            <el-input v-model="menu.path"></el-input>
          </el-form-item>
          <el-form-item
            prop="url"
            v-if="menu.type === 1"
            size="small"
            label="组件路径"
          >
            <el-input v-model="menu.url"></el-input>
          </el-form-item>
          <el-form-item prop="code" size="small" label="权限字段">
            <el-input v-model="menu.code"></el-input>
          </el-form-item>
          <el-form-item size="small" label="菜单图标">
            <div class="chooseIcons">
              <el-popover placement="bottom" width="450" trigger="click">
            <span
              slot="reference"
              style="
              display: inline-block;
              width: 200px;
              height: 33px;
              line-height: 33px;"
            >
            <i :class="userChooseIcon"></i>
            {{ userChooseIcon }}
            </span>
                <div class="iconList">
                  <i v-for="item in iconList" :key="item"
                     :class="item"
                     @click="setIcon(item)"
                     style="font-size: 20px"
                  ></i>
                </div>
              </el-popover>
            </div>
          </el-form-item>
          <el-form-item size="small" label="菜单序号">
            <el-input v-model="menu.orderNum"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </system-dialog>
    <!-- 选择所属菜单弹框 -->
    <system-dialog
      :title="parentDialog.title"
      :width="parentDialog.width"
      :height="parentDialog.height"
      :visible="parentDialog.visible"
      @onClose="onParentClose"
      @onConfirm="onParentConfirm"
    >
      <div slot="content">
        <el-tree
          style="font-size: 14px"
          ref="parentTree"
          :data="parentMenuList"
          node-key="id"
          :props="defaultProps"
          empty-text="暂无数据"
          :show-checkbox="false"
          default-expand-all
          :highlight-current="true"
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
        >
          <div class="customer-tree-node" slot-scope="{ node, data }">
            <!-- 长度为0说明没有下级 -->
            <span v-if="data.children.length == 0">
              <i class="el-icon-document" style="color: #8c8c8c; font-size: 18px"/>
              </span>
            <span v-else @click.stop="openBtn(data)">
              <svg-icon v-if="data.open" icon-class="add-s"/>
              <svg-icon v-else icon-class="sub-s"/>
              </span>
            <span style="margin-left: 3px">{{ node.label }}</span>
          </div>
        </el-tree>
      </div>
    </system-dialog>


  </el-main>


</template>

<script>
import menu from '@/api/menu'
import SystemDialog from '@/components/system/SystemDialog'
//导入自定义的icon图标库
import { elementIcons } from '@/utils/icons'

export default {
  name: 'menuList',
  components: {
    SystemDialog
  },
  data() {
    return {
      iconList: [],//图标列表
      userChooseIcon: '',//用户选中的图标
      menuList: [],
      tableHeight: 0,
      menuDialog: {
        title: '新增菜单',
        visible: false,
        width: 630,
        height: 270
      },
      //菜单属性
      menu: {
        id: '',
        type: '',
        parentId: '',
        parentName: '',
        label: '',
        icon: '',
        name: '',
        path: '',
        url: '',
        code: '',
        orderNum: ''
      },
      rules: {
        type: [{ required: true, trigger: 'change', message: '请选择菜单类型' }],
        parentName: [{ required: true, trigger: 'change', message: '请选择所属菜单' }],
        label: [{ required: true, trigger: 'blur', message: '请输入菜单名称' }],
        name: [{ required: true, trigger: 'blur', message: '请输入路由名称' }],
        path: [{ required: true, trigger: 'blur', message: '请输入路由路径' }],
        url: [{ required: true, trigger: 'blur', message: '请输入组件路径' }],
        code: [{ required: true, trigger: 'blur', message: '请输入权限字段' }]
      },
      parentDialog: {
        title: '选择所属菜单',
        visible: false,
        width: 280,
        height: 450
      },
      //树属性定义
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      parentMenuList: [] //所属菜单列表

    }
  }
  ,
  methods: {
    //给icon绑定的点击事件
    setIcon(icon) {
      this.userChooseIcon = icon //将i的样式设为选中的样式el-icon-xxx
      this.menu.icon = icon
    },

    /**
     * 获取图标列表
     */
    getIconList() {
      this.iconList = elementIcons
    },

    /**
     * 复选框改变
     */
    radioChange(data) {
      this.$resetForm('menuForm', this.menu)
      this.menu.type = data
    },
    /**
     * 选择所属菜单取消事件
     */
    onParentClose() {
      this.parentDialog.visible = false //关闭窗口
    },

    /**
     * 选择所属菜单确认事件
     */
    onParentConfirm() {
      this.parentDialog.visible = false //关闭窗口
    },

    /**
     * 点击树节点+-号折叠展开事件
     */
    openBtn(data) {
      //修改折叠展开状态
      data.open = !data.open
      this.$refs.parentTree.store.nodesMap[data.id].expanded = !data.open
    }
    ,
    /**
     * 选择所属菜单
     */
    async selectParentMenu() {
      this.parentDialog.visible = true
      let res = await menu.getParentMenuList()
      if (res.code === 20000) {
        this.parentMenuList = res.data
      }
    }
    ,

    /**
     * 所属菜单节点点击事件
     */
    handleNodeClick(data) {
      //所属父级菜单ID
      this.menu.parentId = data.id
      //所属父级菜单名称
      this.menu.parentName = data.label
    }
    ,

    /**
     * 查询菜单列表
     * @returns {Promise<void>}
     */
    async search() {
      let res = await menu.getMenuList()
      if (res.code === 20000) {
        this.menuList = res.data
      }
    },

    /**
     * 点击新增按钮事件
     */
    openAddWindow() {
      this.$resetForm('menuForm', this.menu)
      // 默认选中第一个复选框
      this.menu.type = 0
      this.menuDialog.title = '新增菜单'
      this.menuDialog.visible = true
      this.userChooseIcon = ''//清空菜单图标
    }
    ,

    /**
     * 关闭取消按钮点击事件
     */
    onClose() {
      this.menuDialog.visible = false
    }
    ,

    /**
     * 点击确认按钮事件
     */
    onConfirm() {
      // 表单验证
      this.$refs.menuForm.validate((valid) => {
        if (valid) {
          this.menuDialog.visible = false
        }
      })
    }

  }
  ,
  created() {
    this.search()
    this.getIconList()
  }
  ,
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 180
    })
  }
}
</script>

<style scoped lang="scss">
.iconList {
  width: 400px;
  height: 300px;
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  justify-content: space-around;

  flex-wrap: wrap;

  i {
    display: inline-block;
    width: 60px;
    height: 45px;
    color: #000000;
    font-size: 20px;
    border: 1px solid #e6e6e6;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    line-height: 45px;
    margin: 5px;

    &:hover {
      color: orange;
      border-color: orange;
    }
  }
}

.chooseIcons {
  width: 175px;
  background-color: #FFFFFF;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 33px;
  line-height: 25px;
  outline: none;
  padding: 0 15px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}

</style>
