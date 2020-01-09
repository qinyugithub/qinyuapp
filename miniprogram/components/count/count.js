Component({
  /**
   * 组件的属性列表
   */
  properties: {
    num: {
      type: Number, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: 0
    }
  },



  /**
   * 组件的初始数据
   */
  data: {
    hiddenButton: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindDel() {
      let {
        num
      } = this.data;
      if (num < 2) {
        this.setData({
          hiddenButton: true,
        })
      }
      this.setData({
        num: num - 1
      })
      this.triggerEvent('changeCount', {currentNum:this.data.num,currentType:"del"})
    },

    bindAdd() {
      let {
        num,
        hiddenButton
      } = this.data;
      this.setData({
        num: num + 1
      })
      if (hiddenButton) {
        this.setData({
          hiddenButton: false
        })
      }
      this.triggerEvent('changeCount', {currentNum:this.data.num,currentType:"add"} );
    }
  }
})