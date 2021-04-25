import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton,AtTextarea, AtImagePicker,AtInput } from 'taro-ui'
import {setGlobalData,getGlobalData} from '../globalData'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './feedback.scss'

export default class Index extends Component {
  constructor(){
    super(...arguments);
    this.state={
      content:'',
      pictures:[],
      licensePlate:'',
      phoneNumber:'',
      images:[]
    }
  }
  contentChange(e){
    this.setState({
      content:e
    });
  }
  submit(){
    if(this.state.content==''){
      wx.showModal({
        title:'提示',
        content:'请填写反馈内容！',
        showCancel:false
      });
    }else{
      // pic
      let promiseArr=[];
      this.state.pictures.forEach(item=>{
        let p=new Promise((resolve,reject)=>{
          wx.uploadFile({
            url:'https://qizong007.top/picture/upload',
            filePath:item.url,
            name:'picture',
            success:res=>{
              console.log(res);
              this.state.images.push(JSON.parse(res.data).data.url);
              resolve();
            }
          })
        })
        promiseArr.push(p);
      })
      Promise.all(promiseArr).then(()=>{
        wx.request({
          url:'https://qizong007.top/feedback/publish',
          method:'POST',
          data:{
            userId:getGlobalData('userid'),
            schedule:0,
            licensePlate:this.state.licensePlate,
            phoneNumber:this.state.phoneNumber,
            content:this.state.content,
            pictures:this.state.images,
          },
          success:res=>{
            console.log(res);
            if(res.data.code==0){
              wx.showModal({
                title:'提示',
                content:'感谢您的反馈',
                showCancel:false,
                success:res=>{
                  if(res.confirm){
                    wx.navigateBack();
                  }
                }
              });
            }else{
              wx.showModal({
                title:"提示",
                content:'提交反馈失败！',
                showCancel:false
              });
            }
          }
        })              
      })
    }
  }
  licensePlatechange(e){
    this.setState({
      licensePlate:e
    });
  }
  phonechange(e){
    this.setState({
      phoneNumber:e
    });
  }
  picchange (files) {
    this.setState({
      pictures:files
    });
  }
  onFail (mes) {
    console.log(mes)
  }
  onImageClick (index, file) {
    console.log(index, file)
  }
  render () {
    return (
      <View className='index'>
        <AtTextarea
          placeholder='请填写反馈内容'
          value={this.state.content}
          onChange={this.contentChange.bind(this)}
        />
        <AtInput
          name='licensePlate'
          title='车牌号'
          placeholder='需要核实的车牌号'
          type='text'
          value={this.state.licensePlate}
          onChange={this.licensePlatechange.bind(this)}
        />
        <AtInput
          name='phoneNumber'
          title='电话号码'
          type='text'
          placeholder='方便我们与您联系'
          value={this.state.phoneNumber}
          onChange={this.phonechange.bind(this)}
        />
          <AtImagePicker
            multiple
            count={3}
            files={this.state.pictures}
            onChange={this.picchange.bind(this)}
            onFail={this.onFail.bind(this)}
            onImageClick={this.onImageClick.bind(this)}
          />
        <AtButton type='primary' onClick={this.submit.bind(this)}>提交反馈</AtButton>
      </View>
    )
  }
}
