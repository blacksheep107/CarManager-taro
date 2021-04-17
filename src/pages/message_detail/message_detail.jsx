import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import {setGlobalData,getGlobalData} from '../globalData'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './message_detail.scss'

export default class Index extends Component {
  constructor(){
    super(...arguments);
    this.state={
      receiverId:0,
    }
  }
  onLoad(options){
    this.setState({
      receiverId:Number(options.receiverId)
    });
    wx.request({
      url:'https://qizong007.top/message/records',
      method:'GET',
      data:{
        userId:getGlobalData('userid'),
        receiverId:this.state.receiverId,
      },
      success:res=>{
        console.log(res);
      },
    })
  }
  render () {
    return (
      <View className='index'>
        <Text>{this.state.receiverId}</Text>
      </View>
    )
  }
}
