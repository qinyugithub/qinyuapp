Component({
  /**
   * 组件的属性列表
   */
  properties: {
    fruitItem:{
      type: Object,  // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: {}
    },
    inquiry:{
      type: Boolean,  
      value: false
    }
  },

  lifetimes: {
    attached: function() {
      this.initCount();
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    num:0,
    hiddenButton: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindDel() {
      this.delGoodsToLocal();
    },

    bindAdd() {
      this.addGoodsToLocal();
    },

    addGoodsToLocal:function(){
      var item = this.data.fruitItem,
          srorageList = wx.getStorageSync('goods');
        if(srorageList[item._id]){
          srorageList[item._id].num += 1;
        }else{
          item.num = 1;
          srorageList[item._id] = item;
        }
        wx.setStorageSync("goods", srorageList);//对象存储索引效率更高
        this.addAnimation();
        this.triggerEvent('changeCount', {currentNum:this.data.num,currentType:"add"} );
    },
    delGoodsToLocal:function(){
      var that = this,
          item = this.data.fruitItem,
          srorageList = wx.getStorageSync('goods');
      if(srorageList[item._id]){

         //删除最后一个商品弹出确认框
        if(this.data.inquiry && srorageList[item._id].num < 2){
          wx.showModal({
            // title: '提示',
            content: '确认删除该商品吗',
            success (res) {
              if (res.confirm) {
                srorageList[item._id].num -= 1;
                that.updateForDel(srorageList,item._id);
              } else if (res.cancel) {
                return;
              }
            }
          })
        }else{
          srorageList[item._id].num -= 1;
          that.updateForDel(srorageList,item._id);
        }

      }else{
        console.log("计算出错");
      }
    },

    updateForDel:function(srorageList,currentId){
      if(srorageList[currentId].num === 0){
        delete srorageList[currentId];
      }
      wx.setStorageSync("goods", srorageList);//对象存储索引效率更高
      this.delAnimation();
      this.triggerEvent('changeCount', {currentNum:this.data.num,currentType:"del"})
    },

    /**
     * 移除数字动效
     */
    delAnimation:function(){
      let item = this.data.fruitItem,
          num  = wx.getStorageSync('goods')[item._id] && wx.getStorageSync('goods')[item._id].num;
      if (typeof(num) === "number" && num >0)   {
        this.setData({
          num: num
        })
      }else{
        this.setData({
          hiddenButton: true,
        })
      }

    },
    /**
     * 添加数字动效
     */
    addAnimation:function(){
      let { hiddenButton} = this.data,
          item = this.data.fruitItem,
          num  = wx.getStorageSync('goods')[item._id].num;
      this.setData({
        num: num
      })
      if (hiddenButton) {
        this.setData({
          hiddenButton: false
        })
      }
    },

    initCount:function(){
      var item = this.data.fruitItem,
          goodsItem = wx.getStorageSync('goods')[item._id];
      if( goodsItem && goodsItem.num !==0){
        this.setData({
          num: goodsItem.num,
          hiddenButton: false,
        })
      }
    },

    initNum(){
      console.log("我是组件内部的方法");
    }
  }
})