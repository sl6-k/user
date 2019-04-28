// pages/commonent/navs.js
Component({
    /**
     * 组件的属性列表
     */
	properties: {
		title: {
			type: String,
			value: '飞雳士',
		},
		back:{
			type:Boolean,
			value:false
		},
		border:{
			type:Boolean,
			value:false
		}
	},
	data: {
		statusBarHeight: wx.getStorageSync('statusBarHeight'),
		titleBarHeight: wx.getStorageSync('titleBarHeight')
	}

})