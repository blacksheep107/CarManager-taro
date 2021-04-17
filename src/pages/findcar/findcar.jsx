import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton,AtInput } from 'taro-ui'
import {setGlobalData,getGlobalData} from '../globalData'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './findcar.scss'

export default class Index extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }
  constructor(props){
    super(props);
    this.state={
      carnum:'',
      owner:'',// 车主
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
    console.log(this.state.carnum);
  }
  findCar(){
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
          wx.request({
            url:'https://qizong007.top/message/send',
            method:'POST',
            data:{
              // userId:getGlobalData('userid'),
              // receiverId:this.state.owner,
              // userName:getGlobalData('userInfo').nickName,
              // avatarUrl:getGlobalData('userInfo').avatarUrl,
              // content:'死数据/内容',
              // isRelative:false,
              // licensePlate:this.state.carnum,
              // position:'死数据',
              userId:8,
              receiverId:8,
              userName:'BLACKSHEEP',
              avatarUrl:getGlobalData('userInfo').avatarUrl,
              content:'死数据/内容',
              isRelative:false,
              licensePlate:'苏E05EV8',
              position:'死数据',
            },
            success:res=>{
              console.log(res);
              console.log(getGlobalData('userInfo').avatarUrl)
              if(res.data.code==0){
                wx.showModal({
                  title:'发送成功',
                  content:'已给车主发送订阅消息',
                  showCancel:false,
                })
                wx.navigateBack();
              }else{
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
  render () {
    return (
      <View className='index'>
        <AtInput
          title='车牌号'
          name='carnum'
          value={this.state.carnum}
          onChange={this.carnumChange.bind(this)}
        />
        
        <AtButton type='primary' onClick={this.findCar.bind(this)}>发送消息</AtButton>
      </View>
    )
  }
}
