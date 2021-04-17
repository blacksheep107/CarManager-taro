import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton,AtAvatar } from 'taro-ui'
import {setGlobalData,getGlobalData} from '../globalData'

import './friend.scss'
class Friend extends Component{
  constructor(){
    super(...arguments);
    this.state={
      userName:'',
      avatarUrl:'',
    }
  }
  onLoad(){
    wx.request({
      url:'https://qizong007.top/user/getInfo',
      method:'GET',
      data:{
        userId:this.props.id,
      },
      success:res=>{
        console.log(res);
        this.setState({
          userName:res.data.data.userName,
          avatarUrl:re.sdata.data.avatarUrl,
        });
      }
    })
  }
  render(){
    return(
      <View>
        <AtAvatar circle image={this.state.avatarUrl}></AtAvatar>
        <Text>{this.state.userName}</Text>
      </View>
    )
  }
}
export default class Index extends Component {
  constructor(){
    super(...arguments);
    this.state={
      relatives:getGlobalData('relatives'),
    }
  }
  onLoad(){

  }
  addFriend(){
    wx.navigateTo({
      url:'../addfriend/addfriend',
    })
  }
  render () {
    return (
      <View className='index'>
        {
          this.state.relatives.map((id)=>{
            return (
              <Friend id={id} />
            )
          })
        }
        <AtButton type='primary' onClick={this.addFriend.bind(this)}>添加好友</AtButton>
      </View>
    )
  }
}
