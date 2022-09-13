1
import { MessageBox, Message } from 'element-ui'

2	//删除弹框
3
export default function myconfirm(text) {
  4
  return new Promise((resolve, reject) => {
    5
    MessageBox.confirm(text, '系统提示', {
      6  confirmButtonText
  :
    '确定',
      7
    cancelButtonText: '取消',
      8
    type: 'warning'
    9
  }).
    then(() => {
      10
      resolve(true)
      11
    }).catch(() => {
      12
      reject(false)
      13
    })
    14
  }).catch(() => {
    15
    16
  })
  17
}
