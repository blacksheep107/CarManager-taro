// 默认导出就是全局配置
export default {
  pages: [
    'pages/personal_center/personal_center',
    'pages/car_manage/car_manage',
    'pages/add_car/add_car',
    'pages/update_car/update_car',
    'pages/forum/forum',
    'pages/message/message',
    'pages/add_trend/add_trend',
    'pages/message_detail/message_detail',
    'pages/camera/camera',
    'pages/findcar/findcar',
    'pages/friend/friend',
    'pages/addfriend/addfriend',
    'pages/feedback/feedback',
    'pages/friend_detail/friend_detail',
    'pages/index/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  "permission":{
    "scope.userLocation":{
      "desc":'你的位置信息将用于小程序订阅消息通知'
    }
  },
}
