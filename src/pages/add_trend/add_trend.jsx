import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton,AtTextarea,AtImagePicker,AtToast, AtIcon } from 'taro-ui'
import {setGlobalData,getGlobalData} from '../globalData'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './add_trend.scss'

export default class Index extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }
  constructor(props){
    super(props);
    this.state={
      sendTrend:'',
      files:[],
      images:[],
      submitDisabled:true,
      errorToast:false,
      successToast:false,
      userid:getGlobalData('userid'),

    }
  }
  trendChange(e){
    this.state.sendTrend=e;
    let reg="^[ ]+$";
    let re=new RegExp(reg);
    if((re.test(this.state.sendTrend)||e=='')&&this.state.files.length==0){
      this.setState({submitDisabled:true});
    }else{
      this.setState({submitDisabled:false});
    }
  }
  onImageChange(files){
    this.setState({
      files
    })
  }
  onFail (mes) {
    console.log(mes)
  }
  onImageClick (index, file) {
    console.log(index, file)
  }
  submitTrend(e){
    let promiseArr=[];
    let info=getGlobalData('userInfo');
    this.state.files.forEach((item)=>{
      let a=new Promise((resolve,reject)=>{
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
      });
      promiseArr.push(a);
    })
    Promise.all(promiseArr).then(()=>{
      console.log(this.state.images);
      wx.request({
        url:'https://qizong007.top/post/publish',
        method:'POST',
        data:{
          userId:this.state.userid,
          avatarUrl:info.avatarUrl,
          userName:info.nickName,
          content:this.state.sendTrend,
          pictures:this.state.images,
        },
        success:res=>{
          console.log(res);
          if(res.data.code==0){
            // success,close,repaint
            this.setState({
              isFloat:false,
              successToast:true,
              sendTrend:'',
            });
            wx.redirectTo({
              url:'../forum/forum'
            });
          }else{
            // fail
            this.setState({errorToast:true})
          }
        }
      })      
    })
  }
  render () {
    return (
      <View className='index'>
        <AtTextarea
          value={this.state.sendTrend}
          onChange={this.trendChange.bind(this)}
        />
        <AtImagePicker
          multiple
          count={3}
          files={this.state.files}
          onChange={this.onImageChange.bind(this)}
          onFail={this.onFail.bind(this)}
          onImageClick={this.onImageClick.bind(this)}
        />
        <AtButton 
          className='submitbutton'
          type='primary'
          onClick={this.submitTrend.bind(this)}
          disabled={this.state.submitDisabled}
        >
          <AtIcon value='money' size='30' color='white'></AtIcon>
        </AtButton>
        <AtToast isOpened={this.state.errorToast} status="error" text="发布失败"></AtToast>
        <AtToast isOpened={this.state.successToast} status="success" text="发布成功"></AtToast>
      </View>
    )
  }
}
