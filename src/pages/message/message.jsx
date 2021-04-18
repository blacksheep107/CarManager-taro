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
  jumpToDetail(e){
    wx.navigateTo({
      url:'../message_detail/message_detail?receiverId='+this.props.item.receiverId,
    });
  }
  render(){
    return(
      <View>
        <AtListItem
          title={this.props.item.userName}
          thumb={this.props.item.avatarUrl}
          onClick={this.jumpToDetail.bind(this)}
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
    let a=[];
    let count=0;
    let allcount=0;
    wx.request({
      url:'https://qizong007.top/message/receivers',
      method:'GET',
      data:{
        userId:getGlobalData('userid'),
      },
      success:res=>{
        allcount=res.data.data.length;
        console.log(res);
        new Promise((resolve,reject)=>{
          res.data.data.forEach((item)=>{
            wx.request({
              url:'https://qizong007.top/user/getInfo',
              method:'GET',
              data:{
                userId:item.receiverId
              },
              success:res=>{
                count++;
                a.push({
                  receiverId:res.data.data.userId,
                  avatarUrl:res.data.data.avatarUrl,
                  userName:res.data.data.userName,
                });
                if(count===allcount)  resolve();
              }
            })          
          })
          // resolve();
        }).then(()=>{
            this.setState({
              contactList:a
            })          
        }
        )
      }
    })
  }
  handleClick (value) {
    this.setState({
      current: value
    });
    if(value===0){
      wx.redirectTo({
        url:'../camera/camera',
      })
    }else if(value===1){
      // message
      wx.redirectTo({
        url:'../message/message',
      })
    }else if(value===2){
      // forum
      wx.redirectTo({
        url:'../forum/forum',
      })
    }else if(value===3){
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
        <View className='nothing'></View>
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
