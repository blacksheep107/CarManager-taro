import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton,AtInput,AtTextarea, AtIcon } from 'taro-ui'
import {setGlobalData,getGlobalData} from '../globalData'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './findcar.scss'

export default class Index extends Component {
  constructor(props){
    super(props);
    this.state={
      carnum:'',
      owner:0,// 车主
      content:'',
      address:'',
    }
  }
  onLoad(options){
    this.setState({
      carnum:options.carnum
    });
  }
  carnumChange(carnum){
    this.setState({
      carnum
    })
  }
  postUser(carOwnerId,isRelative){
    wx.request({
      url:'https://qizong007.top/message/send',
      method:'POST',
      data:{
        userId:getGlobalData('userid'),
        receiverId:carOwnerId,
        userName:getGlobalData('userInfo').nickName,
        avatarUrl:getGlobalData('userInfo').avatarUrl,
        content:this.state.content,
        isRelative:isRelative,
        licensePlate:this.state.carnum,
        position:this.state.address,
      },
      success:res=>{
        console.log(res);
        console.log(getGlobalData('userInfo').avatarUrl)
        if(res.data.code==0){
          wx.showModal({
            title:'发送成功',
            content:'已给车主及其好友发送订阅消息',
            showCancel:false,
          })
          if(!isRelative){
            wx.navigateBack();
          }
        }else if(!isRelative){
          wx.showModal({
            title:'发送失败',
            content:'该车车主可能未授权订阅消息',
            showCancel:false,
          })
        }
      },
      fail:res=>{
        console.log(res);
      }
    });
  }
  findCar(){
    if(this.state.carnum==''){
      wx.showModal({
        title:'提示',
        content:'请填写车牌号！',
        showCancel:false,
      });
    }else if(this.state.address==''){
      wx.showModal({
        title:'提示',
        content:'请填写地址!',
        showCancel:false
      })
    }else if(this.state.content==''){
      wx.showModal({
        title:'提示',
        content:'请填写消息内容！',
        showCancel:false
      })
    }
    wx.request({
      url:'https://qizong007.top/vehicle/search',
      method:'GET',
      data:{
        licensePlate:this.state.carnum,
      },
      success:res=>{
        console.log(res);
        // 订阅消息
        if(res.data.code===0){
          // 有这个车牌
          this.setState({
            owner:res.data.data.carOwnerId
          });
          this.postUser(res.data.data.carOwnerId,false);
          let rel=getGlobalData('relatives');
          rel.forEach((item)=>{
            wx.request({
              url:'https://qizong007.top/user/getInfo',
              method:'GET',
              data:{
                userId:item
              },
              success:res=>{
                console.log(res);
                this.postUser(res.data.data.userId,true);
              }
            })
          })
        }else{
          wx.showModal({
            title:'提示',
            content:'该车车主未注册小程序！',
            showCancel:false,
          })
        }

      },
    })
  }
  contentChange(e){
    this.setState({
      content:e
    });
  }
  choosePos(e){
    wx.chooseLocation({
      success:res=>{
        console.log(res);
        this.setState({
          address:res.name
        });
      }
    })
  }
  render () {
    return (
      <View className='index'>
        <AtInput
          title='车牌号'
          name='carnum'
          className='carnum'
          placeholder='请填写车牌号'
          value={this.state.carnum}
          onChange={this.carnumChange.bind(this)}
        />
        <View className='choosepos'>
          <AtIcon className='icon' value='map-pin' size='30' color='#78A4FA' onClick={this.choosePos.bind(this)}></AtIcon>
          <AtInput className='input' name='address' placeholder='点击图标定位'
          value={this.state.address} />          
        </View>
        {/* <Text>{this.state.address}</Text> */}
        <View className='line'></View>
        <AtTextarea
          className='tarea'
          value={this.state.content}
          onChange={this.contentChange.bind(this)}
          placeholder='填写车辆问题'
        />
        <AtButton className='button' type='primary' onClick={this.findCar.bind(this)}>发送消息</AtButton>
      </View>
    )
  }
}
