// pages/storeList/storeList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeKey: 0,
    show :false
  },
  pageData:{
    exc:true //动画是否执行
  },
  onChange(event) {
    wx.showToast({
      icon: 'none',
      title: `切换至第${event.detail}项`
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      search: this.search.bind(this)
    });
  },

  search: function (value) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([{
          text: '搜索结果',
          value: 1
        }, {
          text: '搜索结果2',
          value: 2
        }])
      }, 200)
    })
  },
  selectResult: function (e) {
    console.log('select result', e.detail)
  },

  onChangeCount (e) {
    console.log(e.detail);
    if(e.detail.currentType === "add"){
      this.cartAnimate();
    }
  },

  /**
   * 购物车摇动动画
   */
  cartAnimate:function(){
    if(this.pageData.exc){
      this.pageData.exc=false;
      this.animate('#cartImg', [
        {rotateZ: 0},
        {rotateZ: 20},
        {rotateZ: -20},
        {rotateZ: 20},
        {rotateZ: -20},
        {rotateZ: 20},
        {rotateZ: 0}
        ], 500, function () {
          this.clearAnimation('#cartImg', { rotate: true }, function () {});
          this.pageData.exc=true;
      }.bind(this));
    }
  },
  showPopup() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  }

})