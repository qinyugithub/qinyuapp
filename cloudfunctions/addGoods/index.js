// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  await db.collection('goods').add({
    data: {
      image:event.image,
      title:event.title,
      remarks:event.remarks,
      activity:event.activity,
      price:event.price,
      key:event.key
    }
  })
  .then(res => {
    return res;
  })
  .catch(console.error)
}