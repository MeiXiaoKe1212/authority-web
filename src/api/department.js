import http from '@/utils/request'

export default {
  async getDepartmentList(params) {
    /**
     * 查询部门列表
     */
    return await http.get('api/department/list', params)
  },

  /**
   * 获取所属部门列表
   */
  async getParentTreeList() {
    return await http.get('/api/department/parent/list')
  }

}
