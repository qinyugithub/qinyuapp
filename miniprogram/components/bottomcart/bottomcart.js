
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    fruitItem:{
      type: Object,  // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: {}
    }
  },
  lifetimes: {
    // attached: function() {
    //   this.initBottomCart();
    // }
  },

  /**
   * 组件的初始数据
   */
  data: {
    goodsList:[]
  },

  /**
   * 组件的方法列表
   */
  methods: { 
    initBottomCart(currentNum){
      //去除组件残留
      if(currentNum === 0){
        this.setData({
          goodsList:[]
        })
      };
      var StorageGoods = wx.getStorageSync('goods'),
          keyList = Object.keys(StorageGoods),
          len = keyList.length,
          res = [];
      if(len === 0){
        return;
      }else{
        for(var i = 0;i<len;i++){
          var item = StorageGoods[keyList[i]];
          if(typeof(item) === "object"){
            //计算出单个总价
            let total = item.num * item.price,
                numStr = total.toFixed(4).toString(),
                index = numStr.indexOf('.'),
                result = Number( numStr.slice(0, index + 3) );
            item.goodTotal=result;
            res.push(item);
          }
        }
        this.setData({
          goodsList:res
        })
      }
    },
    onChangeCount:function(e){
     this.initBottomCart(e.detail.currentNum);
     this.triggerEvent('updateOuter', e.detail);  //向最外层组件传达信息
    }

  }
})