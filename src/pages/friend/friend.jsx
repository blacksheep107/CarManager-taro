import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton,AtAvatar,AtIcon,AtTabBar } from 'taro-ui'
import {setGlobalData,getGlobalData} from '../globalData'

import './friend.scss'
class Friend extends Component{
  constructor(props){
    super(props);
    this.state={
      userName:'',
      avatarUrl:'',
      isdelete:false,
    }
  }
  deleteFriend(){
    wx.showModal({
      title:'提示',
      content:'是否删除好友？',
      success:res=>{
        if(res.confirm){
          // 删除
          let temp=getGlobalData('relatives');
          for(let i=0;i<temp.length;i++){
            if(temp[i]===this.props.item.id){
              temp.splice(i,1);
              break;
            }
          }
          wx.request({
            url:'https://qizong007.top/user/updateInfo',
            method:'POST',
            data:{
              userId:getGlobalData('userid'),
              userName:getGlobalData('userInfo').nickName,
              avatarUrl:getGlobalData('userInfo').avatarUrl,
              relatives:temp,
            },
            success:res=>{
              console.log(res);
              if(res.data.code===0){
                wx.showModal({
                  title:'提示',
                  content:'删除成功',
                  showCancel:false,
                });
                setGlobalData('relatives',temp);
                this.setState({
                  isdelete:true,
                })
              }
            },
            fail:res=>{
              console.log(res);
            }
          })
        }
      }
    })
  }
  jumpFrienddetail(){
    console.log(this.props);
    wx.navigateTo({
      url:'../friend_detail/friend_detail?receiverId='+this.props.item.id+'&userName='+this.props.item.userName,
    })
  }
  render(){
    return(
      this.state.isdelete?null:
        <View className='onefriend'>
          <View className='avatarandname' onClick={this.jumpFrienddetail.bind(this)}>
            <AtAvatar circle image={this.props.item.avatarUrl}></AtAvatar>
            <Text className='nickname'>{this.props.item.userName}</Text>            
          </View>
          <AtIcon value='close' size='25' color='#78A4FA' className='deleteicon' onClick={this.deleteFriend.bind(this)}></AtIcon>
        </View>
    )
  }
}
export default class Index extends Component {
  constructor(){
    super(...arguments);
    this.state={
      relatives:getGlobalData('relatives'), // id
      items:[], // username, avatar, id
      current:3
    }
  }
  requestRele(item){
    return new Promise(resolve=>{wx.request({
      url:'https://qizong007.top/user/getInfo',
      method:'GET',
      data:{
        userId:item,
      },
      success:res=>{
        console.log(res);
        this.setState({
          items:this.state.items.concat({
            userName:res.data.data.userName,
            avatarUrl:res.data.data.avatarUrl,
            id:res.data.data.userId,            
          })
        });
        // 异步有坑
        // if(count===this.state.relatives.length) resolve();
        resolve();
      },
      fail:res=>{
        console.log(res);
      }
    })})
  }
  componentDidShow(){
    this.setState({
      relatives:getGlobalData('relatives')
    });
    this.setState({
      items:[]
    });
    (async ()=>{
      for(let i=0;i<this.state.relatives.length;i++){
        await this.requestRele(this.state.relatives[i]);
      }
    })()
  }
  onLoad(){
    // this.state.relatives.forEach((item)=>{
    //   wx.request({
    //     url:'https://qizong007.top/user/getInfo',
    //     method:'GET',
    //     data:{
    //       userId:item,
    //     },
    //     success:res=>{
    //       console.log(res);
    //       // this.state.items.push({
    //       //   userName:res.data.data.userName,
    //       //   avatarUrl:res.data.data.avatarUrl
    //       // });
    //       let a;
    //       new Promise((resolve,reject)=>{
    //         a=this.state.items;
    //         a.push({
    //           userName:res.data.data.userName,
    //           avatarUrl:res.data.data.avatarUrl,
    //           id:res.data.data.userId,
    //         })            
    //       }).then(
    //         this.setState({
    //           items:a
    //         })
    //       )
    //       console.log(this.state.items);
    //     },
    //     fail:res=>{
    //       console.log(res);
    //     }
    //   })
    // })
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
  addFriend(){
    wx.navigateTo({
      url:'../addfriend/addfriend',
    })
  }
  render () {
    return (
      <View className='index'>
        {
          this.state.items.map((item)=>{
            return (
              <Friend item={item} />
            )
          })
        }
        <AtButton className='button' type='primary' onClick={this.addFriend.bind(this)}>添加好友</AtButton>
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
