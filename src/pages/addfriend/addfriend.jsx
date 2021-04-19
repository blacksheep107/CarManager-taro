import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton,AtInput,AtAvatar } from 'taro-ui'
import {setGlobalData,getGlobalData} from '../globalData'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './addfriend.scss'

export default class Index extends Component {
  constructor(){
    super(...arguments);
    this.state={
      avatarUrl:'',
      nickName:'',
      id:undefined,
      newFriendId:undefined,
      relatives:getGlobalData('relatives'),
    }
  }
  find(id){
    wx.request({
      url:'https://qizong007.top/user/getInfoByOpenId',
      method:'GET',
      data:{
        openId:this.state.id
      },
      success:res=>{
        console.log(res);
        if(res.data.code===0){
          this.setState({
            avatarUrl:res.data.data.avatarUrl,
            nickName:res.data.data.userName,
            newFriendId:res.data.data.userId,
          });
        }else{
          wx.showModal({
            title:'错误',
            content:'您的好友还未注册小程序！',
            showCancel:false,
          });
        }
      }
    })      
  }
  findChange(id){
    this.setState({
      id:id
    });
  }
  addFriend(){
    let flag=true;
    for(let i=0;i<this.state.relatives.length;i++){
        if(this.state.relatives[i]===this.state.newFriendId){
          flag=false;
          wx.showModal({
            title:'提示',
            content:'请勿重复添加好友！',
            showCancel:false,
          });
          break;
        }
    }
    if(flag&&this.state.newFriendId===getGlobalData('userid')){
      wx.showModal({
        title:'提示',
        content:'不能添加自己为好友！',
        showCancel:false,
      })
    }else if(flag){
      let newinfo=getGlobalData('relatives');
      newinfo.push(this.state.newFriendId);
      wx.request({
        url:'https://qizong007.top/user/updateInfo',
        method:'POST',
        data:{
          userId:getGlobalData('userid'),
          userName:getGlobalData('userInfo').nickName,
          avatarUrl:getGlobalData('userInfo').avatarUrl,
          relatives:newinfo,
        },
        success:res=>{
          console.log(res);
          setGlobalData('relatives',newinfo);
          wx.showModal({
            title:'提示',
            content:'添加成功！',
            showCancel:false,
            success:res=>{
              if(res.confirm){
                wx.reLaunch({
                  url:'../friend/friend'
                });
              }
            }
          });
        },
        fail:res=>{
          console.log(res);
        }
      })      
    }

  }
  render () {
    return (
      <View className='index'>
        <View className='find'>
          <AtInput
            name='id'
            type='text'
            title='账号'
            placeholder='输入用户id'
            value={this.state.id}
            onChange={this.findChange.bind(this)}
          />
          <AtButton onClick={this.find.bind(this)}>查找</AtButton>     
        </View>
        <View className='friend'>
          <AtAvatar image={this.state.avatarUrl} size='large'/>
          <Text className='nickname'>{this.state.nickName}</Text>
        </View>
              <AtButton onClick={this.addFriend.bind(this)} className='addbutton'>确定添加</AtButton>
      </View>
    )
  }
}
