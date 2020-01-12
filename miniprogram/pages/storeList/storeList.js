const db = wx.cloud.database();
const goods = db.collection('goods');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeKey: 0,
    show: false,
    fruitList: [],
    settleText:""
  },
  pageData: {
    exc: true, //动画是否执行
    calculationTimer:null, //节流计时器
    fruitList: {}, //缓存池
    minPrice: 30 //满减规则
  },
  initTopSearch: function () {
    this.setData({
      search: this.search.bind(this)
    });
  },
  onChange(event) {
    if(event.detail == this.data.activeKey){
      return;
    }
    this.searchByIndex(event.detail);
  },
  /**
   * 通过类别查询
   */
  searchByIndex: function (typeIndex) {
    this.setData({ //去除组件的残留信息
      fruitList: []
    })
    var fl = this.pageData.fruitList[typeIndex];
    if (!(fl === undefined)) {
      this.setData({
        fruitList: fl,
        activeKey: typeIndex
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
        fruitList: res.data,
        activeKey: typeIndex
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
    this.caTotalPrice(); //计算总价
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
    this.doCalculation();
    if (e.detail.currentType === "add") {
      this.cartAnimate();
    };
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
  },
  /**
   * 计算总价
   */
  caTotalPrice: function () {
    var total = 0,
      goodsItem = wx.getStorageSync('goods');
      for (let key in goodsItem) {
        let item = goodsItem[key];
        //对象中过滤存在的函数
        if (typeof(item) === "object") {
          total += (item.price * item.num);
        }else{
          console.log("过滤函数");
        }
      }
      this.formatTotal(total);
  },
 
  /**
   * 处理总价格并赋值
   */
  formatTotal:function(total){
    let numStr = total.toFixed(4).toString(),
        result = Number( numStr.substring(0,numStr.indexOf(".")+3) ),
        difStr = (this.pageData.minPrice - result).toFixed(4).toString(),
        difference =  Number(difStr.substring(0,difStr.indexOf(".")+3));


    if(difference <=0){
      this.setData({
        totalPrice: result,
        settleText:"去结算"
      })
    }else{
      this.setData({
        totalPrice: result,
        settleText:"差￥"+difference+"起送"
      })
    }
  },
  /**
   * 节流
   */
  doCalculation:function(){
    clearTimeout(this.pageData.calculationTimer);
    this.pageData.calculationTimer = setTimeout(this.caTotalPrice,500)
  },
  /**
   * popup进入前初始化数据
   */
  enterPopup:function(){
    var bottomComponent = this.selectComponent("#bottomList");
    bottomComponent.initBottomCart(0);
  },
  /**
   * 购物车更新时同步外层组件
   */
  updateOuter:function(e){
    this.onChangeCount({
      detail:e.detail
    });
    this.settlement();
  },
  settlement: function () {
    var componentList = this.selectAllComponents(".goodsCount");
    for (var i = 0; i < componentList.length; i++) {
      componentList[i].initNum();
    }
  },

})