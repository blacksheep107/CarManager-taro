import { Component } from 'react'
import { View, Text,Button } from '@tarojs/components'
import { AtButton,AtAvatar,AtInput,AtModal, AtModalHeader, AtModalContent, AtModalAction,AtTextarea } from 'taro-ui'
import {setGlobalData,getGlobalData} from '../globalData'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './message_detail.scss'
class Message extends Component{
  constructor(props){
    super(props);
    this.state={
      isOpened:false,
      areacontent:'',
    }
  }
  getTime(d){
    return d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();

    // d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+
  }
  getYear(d){
    return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
  }
  closeModel(e){
    this.setState({
      isOpened:false,
    })
  }
  checkEmpty(e){
    let reg="^[ ]+$";
    let re=new RegExp(reg);
    if(re.test(e)||e==''){
      this.setState({submitDisabled:true});
    }else{
      this.setState({submitDisabled:false});
    }
  }
  submitMessage(e){
    if(this.checkEmpty(e)){
      wx.showModal({
        title:'提示',
        content:'请填写消息！',
        showCancel:false,
      });
    }else{
      console.log(getGlobalData('userInfo'));
      wx.request({
        url:'https://qizong007.top/message/send',
        method:'POST',
        data:{
          userId:getGlobalData('userid'),
          receiverId:this.props.item.receiverId,
          userName:getGlobalData('userInfo').nickName,
          avatarUrl:getGlobalData('userInfo').avatarUrl,
          content:this.state.areacontent,
          isRelative:false,
          licensePlate:'回复',
          position:'回复消息',
        },
        success:res=>{
          console.log(res);
          if(res.data.code===0){
            // let temp={
            //   messageId:res.data.data.messageId,
            //   userId:getGlobalData('userid'),
            //   receiverId:this.props.item.receiverId,
            //   userName:getGlobalData('userInfo').nickName,
            //   avatarUrl:getGlobalData('userInfo').avatarUrl,
            //   content:this.state.areacontent,
            //   isRelative:false,
            //   licensePlate:'0',
            //   position:'回复消息',
            // }
            // this.props.changeRead(temp,this.props.item.receiverId);
            wx.showModal({
              title:'提示',
              content:'发送成功',
              showCancel:false,
            });
            this.closeModel();
            // 设为已读
            wx.request({
              url:'https://qizong007.top/message/read',
              method:'POST',
              data:{
                messageId:this.props.item.messageId
              },
              success:res=>{
                console.log(res);
              }
            })
          }else{
            wx.showModal({
              title:'提示',
              content:'发送失败',
              showCancel:false,
            })
          }
        },
        fail:res=>{
          console.log(res);
          wx.showModal({
            title:'提示',
            content:'发送失败',
            showCancel:false,
          })
        }
      })
    }
    // this.closeModel(e);
    // submit    

  }
  showModel(e){
    this.setState({
      isOpened:true
    });
  }
  areaChange(e){
    this.setState({
      areacontent:e
    });
  }
  render(){
    // console.log(this.props.item);
    return(
      <View>
        <View className='centerTime'>
          <Text>{this.getYear(new Date(this.props.item.postTime))}</Text>
        </View>
        <View className='onemessage'>
          {
            this.props.item.receiverId===getGlobalData('userid')?
            <View>
              <View className='leftmessage'>
                <AtAvatar circle image={this.props.item.avatarUrl} className="avatar" />
                <View className='nameAndContent'>
                  {/* <Text>{this.props.item.userName}</Text> */}
                  <View className='leftcontentContainer' onClick={this.showModel.bind(this)}>
                    <Text className='content'>
                      {this.props.item.content}
                    </Text>
                  </View>
                  <View className='bottombar'>
                    <Text>{this.props.item.hasRead?'已处理':'未处理'}</Text>
                    <Text className='time'>{this.getTime(new Date(this.props.item.postTime))}</Text>        
                  </View>
                </View>
              </View>
              <AtModal isOpened={this.state.isOpened}>
              <AtModalHeader>回复 {this.props.item.userName}</AtModalHeader>
                <AtTextarea
                  value={this.state.areacontent}
                  onChange={this.areaChange.bind(this)}
                />
                <AtModalAction> 
                  <Button onClick={this.closeModel.bind(this)}>取消</Button>
                  <Button onClick={this.submitMessage.bind(this)}>发送</Button>
                </AtModalAction>
              </AtModal>
            </View>
            :
            <View className='rightmessage'>
            <View className='nameAndContent'>
              {/* <Text className='name'>{this.props.item.userName}</Text> */}
              <View className='rightcontentContainer'>
                <Text className='content'>
                  {this.props.item.content}
                </Text>
              </View>
              {/* <View className='bottombar'>

              </View> */}
              <Text className='righttime'>{this.getTime(new Date(this.props.item.postTime))}</Text>
            </View>
            <AtAvatar circle image={this.props.item.avatarUrl} className="avatar" />
          </View>
          }
        </View>
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
    });
    setTimeout(()=>{
      wx.pageScrollTo({
        scrollTop: 9999
      })    
    },2000);
  }
  changeRead(temp,id){
    for (let i=0;i<this.state.messages.length;i++){
      if(this.state.messages[i].messageId===id){
        this.state.messages[i].hasRead=true;
        break;
      }
    }
    this.setState({
      messages:this.state.messages.concat(temp)
    });
  }
  render () {
    return (
      <View className='index'>
        {
          this.state.messages.map((item)=>{
            return (
              <Message item={item} changeRead={this.changeRead.bind(this,item)} />
            )
          })
        }
      </View>
    )
  }
}
