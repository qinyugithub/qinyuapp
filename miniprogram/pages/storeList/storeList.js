const db = wx.cloud.database();
const goods = db.collection('goods');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeKey: 0,
    show: false,
    fruitList: []
  },
  pageData: {
    exc: true, //动画是否执行
    fruitList: {} //缓存池
  },
  initTopSearch: function () {
    this.setData({
      search: this.search.bind(this)
    });
  },
  onChange(event) {
    this.searchByIndex(event.detail);
  },
  /**
   * 通过类别查询
   */
  searchByIndex: function (typeIndex) {
    var fl = this.pageData.fruitList[typeIndex];
    if (!(fl === undefined)) {
      this.setData({
        fruitList: fl
      })
      return;
    }
    wx.showLoading({
      title: '加载中',
    })
    goods.where({
      key: typeIndex
    }).get().then(res => {
      wx.hideLoading();
      this.setData({
        fruitList: res.data
      })
      this.pageData.fruitList[typeIndex] = res.data; //加入缓存池
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initTopSearch();
    this.initFruitList(options.index); //初始化水果列表
  },

  initFruitList: function (index) {
    var currentIndex = index || 0;
    if (currentIndex) {
      this.setData({
        activeKey: currentIndex
      })
    }
    this.searchByIndex(parseInt(currentIndex));
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

  onChangeCount(e) {
    console.log(e.detail);
    if (e.detail.currentType === "add") {
      this.cartAnimate();
    }
  },

  /**
   * 购物车摇动动画
   */
  cartAnimate: function () {
    if (this.pageData.exc) {
      this.pageData.exc = false;
      this.animate('#cartImg', [{
          rotateZ: 0
        },
        {
          rotateZ: 20
        },
        {
          rotateZ: -20
        },
        {
          rotateZ: 20
        },
        {
          rotateZ: -20
        },
        {
          rotateZ: 20
        },
        {
          rotateZ: 0
        }
      ], 500, function () {
        this.clearAnimation('#cartImg', {
          rotate: true
        }, function () {});
        this.pageData.exc = true;
      }.bind(this));
    }
  },
  showPopup() {
    this.setData({
      show: true
    });
  },
  onClose() {
    this.setData({
      show: false
    });
  }

})