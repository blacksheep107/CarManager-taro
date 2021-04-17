import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton,AtTabBar,AtList,AtListItem } from 'taro-ui'
import {setGlobalData,getGlobalData} from '../globalData'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './message.scss'
class MessageBox extends Component{
  constructor(props){
    super(props);
    this.state={

    }
  }
  render(){
    console.log(this.props);
    return(
      <View>
        <AtListItem
          title={this.props.item.receiverId}
        />
      </View>
    )
  }
}
export default class Index extends Component {
  constructor(props){
    super(props);
    this.state={
      current:1,
      contactList:[],
    }
  }
  onLoad(){
    wx.request({
      url:'https://qizong007.top/message/receivers',
      method:'GET',
      data:{
        userId:getGlobalData('userid'),
      },
      success:res=>{
        console.log(res);

        this.setState({
          contactList:res.data.data
        });
      }
    })
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
        <AtList>
          {
            this.state.contactList.map((item)=>{
              return (
                <MessageBox item={item} />
              )
            })
          }
        </AtList>
        <AtTabBar
          fixed
          tabList={[
            { title: '找车', iconType: 'camera'},
            { title: '消息', iconType: 'message'},
            { title: '论坛', iconType: 'streaming' },
            { title: '我的', iconType: 'user'},
          ]}
          onClick={this.handleClick.bind(this)}
          current={this.state.current}
        />
      </View>
    )
  }
}
