import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton,AtTabBar,AtIcon,AtDivider} from 'taro-ui'
import {setGlobalData,getGlobalData} from '../globalData'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './camera.scss'

export default class Index extends Component {
  constructor(){
    super(...arguments);
    this.state={
      current:0,
      carPic:'',
      carnum:'',
    }
  }
  handleClick (value) {
    wx.requestSubscribeMessage({
      tmplIds: ['9ovqmwinU6Rhpgs4mxZtFCZxmtQ2CcPwbomgYUnqcsA'],
      success (res) { 
        console.log(res);
      },
      fail:res=>{
        console.log(res);
      }
    });
    this.setState({
      current: value
    });
    if(value===0){
      // camera
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
  cameraOcr(){
    wx.chooseImage({
      count:1,
      sizeType:['original','compressed'],
      sourceType:['camera','album'],
      success:res=>{
        wx.uploadFile({
          url:'https://qizong007.top/picture/ocr-car',
          filePath:res.tempFilePaths[0],
          name:'picture',
          success:res=>{
            console.log(JSON.parse(res.data).data.licensePlate);
            wx.navigateTo({
              url:'../findcar/findcar?carnum='+JSON.parse(res.data).data.licensePlate,
            })
          },
          fail:res=>{
            console.log(res);
          }
        })
      }
    })
  }
  jumpTo(e){
    wx.navigateTo({
      url:'../findcar/findcar',
    })
  }
  render () {
    return (
      <View className='index'>
        <View className="choice">
          <View className="up" onClick={this.jumpTo.bind(this)}>
            <AtIcon value='edit' size='100' color='#346FC2'></AtIcon>
          </View>
          <AtDivider content='选择获取车牌方式' />
          <View className="down" onClick={this.cameraOcr.bind(this)}>
            <AtIcon value='camera' size='100' color='#346FC2'></AtIcon>
          </View>
        </View>
        <AtTabBar
          fixed
          tabList={[
            { title: '找车', iconType: 'camera'},
            { title: '消息', iconType: 'message'},
            { title: '趋势', iconType: 'streaming' },
            { title: '我的', iconType: 'user'},
          ]}
          onClick={this.handleClick.bind(this)}
          current={this.state.current}
        />
      </View>
    )
  }
}
