import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton,AtTextarea, AtImagePicker } from 'taro-ui'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './feedback.scss'

export default class Index extends Component {
  constructor(){
    super(...arguments);
    this.state={
      content:'',
    }
  }
  contentChange(e){
    this.setState({
      content:e
    });
  }
  submit(){
    wx.request({
      url:'https://qizong007.top/feedback/publish',
      method:'POST',
      data:{
        // userId:getGlobalData('userid'),
        // schedule:0,
        // licensePlate:,
        // phoneNumber:,
        // content:this.state.content,
        // pictures:,
      }
    })
  }
  render () {
    return (
      <View className='index'>
        <AtTextarea
          placeholder='请填写反馈内容'
          value={this.state.content}
          onChange={this.contentChange}
        />
        <AtImagePicker />
        <AtButton onClick={this.submit.bind(this)}>提交反馈</AtButton>
      </View>
    )
  }
}
