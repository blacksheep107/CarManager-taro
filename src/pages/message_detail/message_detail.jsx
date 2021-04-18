import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton,AtAvatar } from 'taro-ui'
import {setGlobalData,getGlobalData} from '../globalData'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './message_detail.scss'
class Message extends Component{
  constructor(props){
    super(props);
    this.state={
      
    }
  }
  render(){
    console.log(this.props.item);
    return(
      <View>
        {
          this.props.item.receiverId===getGlobalData('userid')?
          <View className='leftmessage'>
            <AtAvatar circle image={this.props.item.avatarUrl} className="avatar" />
            <View className='nameAndContent'>
              <Text>{this.props.item.userName}</Text>
              {/* <Text>{this.props.item.postTime}</Text> */}
              <View className='leftcontentContainer'>
                <Text className='content'>
                  {this.props.item.content}
                </Text>
              </View>              
            </View>
          </View>
          :
          <View className='rightmessage'>
          <View className='nameAndContent'>
            <Text>{this.props.item.userName}</Text>
            <View className='rightcontentContainer'>
              <Text className='content'>
                {this.props.item.content}
              </Text>
            </View>              
          </View>
          <AtAvatar circle image={this.props.item.avatarUrl} className="avatar" />
        </View>
        }
      </View>
    )
  }
}
export default class Index extends Component {
  constructor(){
    super(...arguments);
    this.state={
      receiverId:0,
      messages:[],
    }
  }
  onLoad(options){
    this.setState({
      receiverId:Number(options.receiverId)
    });
    let temp=[];
    wx.request({
      url:'https://qizong007.top/user/getInfo',
      method:'GET',
      data:{
        userId:Number(options.receiverId)
      },
      success:res=>{
        // 设置头
        wx.setNavigationBarTitle({
          title:res.data.data.userName
        });
      }
    })
    wx.request({
      url:'https://qizong007.top/message/records',
      method:'GET',
      data:{
        userId:getGlobalData('userid'),
        receiverId:Number(options.receiverId),
      },
      success:res=>{
        // console.log(res);
        temp=res.data.data;
        wx.request({
          url:'https://qizong007.top/message/records',
          method:'GET',
          data:{
            receiverId:getGlobalData('userid'),
            userId:Number(options.receiverId),
          },
          success:res=>{
            temp=temp.concat(res.data.data);
            temp.sort((a,b)=>{
              // sort by date desc
              return Date.parse(a.postTime)-Date.parse(b.postTime);
            });
            console.log(temp);
            this.setState({
              messages:temp
            });
          }
        })
      },
    })
  }
  render () {
    return (
      <View className='index'>
        {
          this.state.messages.map((item)=>{
            return (
              <Message item={item} />
            )
          })
        }
      </View>
    )
  }
}
