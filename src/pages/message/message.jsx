import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton,AtTabBar } from 'taro-ui'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './message.scss'

export default class Index extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }
  constructor(props){
    super(props);
    this.state={
      current:0,
    }
  }
  handleClick (value) {
    this.setState({
      current: value
    });
    if(value===0){
      // message
      wx.redirectTo({
        url:'../message/message',
      })
    }else if(value===1){
      // forum
      wx.redirectTo({
        url:'../forum/forum',
      })
    }else if(value===2){
      // mine
      wx.redirectTo({
        url:'../personal_center/personal_center',
      })
    }
  }
  render () {
    return (
      <View className='index'>
        <Text>Hello world!</Text>
        <AtButton type='primary'>I need Taro UI</AtButton>
        <Text>Taro UI 支持 Vue 了吗？</Text>
        <AtButton type='primary' circle={true}>支持</AtButton>
        <Text>共建？</Text>
        <AtButton type='secondary' circle={true}>来</AtButton>
        <AtTabBar
          fixed
          tabList={[
            { title: '消息', iconType: 'message'},
            { title: '论坛', iconType: 'streaming' },
            { title: '我的', iconType: 'user'}
          ]}
          onClick={this.handleClick.bind(this)}
          current={this.state.current}
        />
      </View>
    )
  }
}
