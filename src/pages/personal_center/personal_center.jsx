import { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtDivider,AtTabBar,AtIcon } from 'taro-ui'
import "taro-ui/dist/style/components/button.scss" // 按需引入
import './personal_center.scss'
import {setGlobalData,getGlobalData} from '../globalData'
import carmanagement from "/images/carmanagement.png"

export default class Index extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      current: 2,
      userInfo: {},
      hasUserInfo: false,
      canIUseGetUserProfile: false,
    }
  }
  handleClick (value) {
    this.setState({
      current: value
    });
    if(value===0){
      // message
      wx.redirectTo({
        url:'../message/message',
      })
    }else if(value===1){
      // forum
      wx.redirectTo({
        url:'../forum/forum',
      })
    }else if(value===2){
      // mine
      wx.redirectTo({
        url:'../personal_center/personal_center',
      })
    }
  }
  carManage() {
    wx.navigateTo({
      url: '../car_manage/car_manage',
      success:function(res){
        console.log("跳转到车辆管理页面，成功！");
      },
      fail:res=>{
        console.log(res);
      }
    });
  }
  codePostServer(res){
    return new Promise((resolve,reject)=>{
      wx.request({
        url: 'https://qizong007.top/user/login',
        method:"POST",
        data:{
          code:res.code
        },
        success:res=>{
          setGlobalData('userid',res.data.data.userId);
          resolve(res);
        }
      });      
    })
  }
  codeGetDetailInfo(res){
    // get openid, relatives, vehicles
    wx.request({
      url: 'https://qizong007.top/user/getInfo',
      method: 'GET',
      data: {
        userId: getGlobalData('userid')
      },
      success:res=>{
        setGlobalData('openid',res.data.data.openId);
        setGlobalData('relatives',res.data.data.relatives);
        setGlobalData('vehicles',res.data.data.vehicles);
        this.getCarInfo();
        console.log('get openid');
        console.log(res);
      }
    })
  }
  onLoad (e) {
    let that=this;
    wx.setEnableDebug({
      enableDebug:true
    })
    wx.login({
      success(res){
        if(res.code){
          console.log(res.code);
          that.codePostServer(res).then((res)=>{
            console.log(res);
            that.codeGetDetailInfo(res);
          });
        }
      }
    });
    wx.getStorage({
      key: 'userInfo',
      success:function(res){
        that.setState({
          userInfo:res.data,
          hasUserInfo:true
        });
        console.log("Get storage success, store infomation:");
        console.log(res.data);
        setGlobalData('userInfo',res.data);
      },
      fail:function(res){
        // 没缓存
        console.log(res);
        if (wx.getUserProfile) {
          that.setState({
            canIUseGetUserProfile: true
          })
        }
      }
    });
  }
  getCarInfo(){
    let that=this;
    let vehicles=getGlobalData('vehicles');
    vehicles.forEach(function(item){
      wx.request({
        url: 'https://qizong007.top/vehicle/findById',
        method: 'GET',
        data: {
          vehicleId: item
        },
        success:res=>{
          let type="汽车";
          if(res.data.data.type==="1")  type="电动车";
          let carInfo=getGlobalData('carInfo');
          carInfo.push({
            "vehicleid":item,
            "type":type,
            "licensePlate":res.data.data.licensePlate,
            "color":res.data.data.color,
            "brand":res.data.data.brand,
            "pictures":res.data.data.pictures
          });
          setGlobalData('carInfo',carInfo);
          // console.log(res);
        },
        fail:res=>{
          console.log('getCarInfo fail');
          console.log(res);
        }
      })
    });
  }
  getInfo(e){
    console.log(this.state.hasUserInfo);
    if(!this.state.hasUserInfo){
      this.getUserProfile(e);
    }
    this.carManage();
  }
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善用户体验', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        wx.request({
          url: 'https://qizong007.top/user/updateInfo',
          method: 'POST',
          data: {
            userId:getGlobalData('userid'),
            userName:res.userInfo.nickName,
            avatarUrl:res.userInfo.avatarUrl,
            relatives:[],
          },
          success:res=>{
            console.log(res);
          }
        })
        console.log(res.userInfo);
        this.setState({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
        // 存储到本地
        wx.setStorage({
          data: res.userInfo,
          key: 'userInfo',
        })
        setGlobalData('userInfo',res.userInfo);
      }
    })
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='at-col'>
        <View class="user_information">
          <View class="avator">
            <open-data type="userAvatarUrl"></open-data>
          </View>
          <View class="user_text">
            <View class="namemessage">
              <open-data type="userNickName"></open-data>      
            </View>
          </View>
          <AtIcon className="inpic" value='chevron-right' size='50' color='#78A4FA'></AtIcon>
        </View>
        <AtDivider />
        
        <View class="user_information" onClick={this.getInfo.bind(this)}>
          <Image class="avator" src={carmanagement}></Image>
          <View class="user_text">
            <Text class="namemessage">车辆管理</Text>
            <Text class="id">嘟嘟嘟——</Text>
          </View>
          <AtIcon className="inpic" value='chevron-right' size='50' color='#78A4FA'></AtIcon>
        </View>
        <AtDivider />
        <AtTabBar
          fixed
          tabList={[
            { title: '消息', iconType: 'message'},
            { title: '论坛', iconType: 'streaming' },
            { title: '我的', iconType: 'user'}
          ]}
          onClick={this.handleClick.bind(this)}
          current={this.state.current}
        />
      </View>
    )
  }
}
