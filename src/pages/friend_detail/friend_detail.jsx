import { Component } from 'react'
import { View, Text,Button,Image } from '@tarojs/components'
import { AtButton,AtCard,AtAvatar,AtInput,AtModal, AtModalHeader, AtModalContent, AtModalAction,AtTextarea, AtDivider } from 'taro-ui'
import {setGlobalData,getGlobalData} from '../globalData'
import cartype from '/images/car_type.png'
import ebike from '/images/e_bike.png'
import "taro-ui/dist/style/components/button.scss" // 按需引入
import './friend_detail.scss'
class Vehicle extends Component {
  constructor(props){
    super(props);
    this.state={
    }
  }
  render(){
    console.log(this.props);
    return(
      <View>
        <View className='card'>
          <View className='header'>
            <Image className='type'
            src={
              this.props.vehicle.type==1?cartype:ebike
            } />
            <Text>{this.props.vehicle.licensePlate}</Text>
            <Text className='rightinfo'>{this.props.vehicle.brand+'-'+this.props.vehicle.color}</Text>
          </View>
          <View className='line'></View>
          <View className='content'>
            {
            JSON.stringify(this.props.vehicle.pictures)==='[]'?
              <Text>没图</Text> :
              <View className="cars">
              {
                this.props.vehicle.pictures.map((carpic)=>{
                  return (
                    <Image className="onecar" src={carpic.picture} />
                  )
                })
              }
              </View>
            }
          </View>
        </View>
        {/* <AtCard
          note={this.props.vehicle.type==1?'电动车':'汽车'}
          extra={this.props.vehicle.brand+'-'+this.props.vehicle.color}
          title={this.props.vehicle.licensePlate}
        >
          {
            JSON.stringify(this.props.vehicle.pictures)==='[]'?
            <Text>没图</Text> :
            <View className="cars">
              {
                this.props.vehicle.pictures.map((carpic)=>{
                  return (
                    <Image className="onecar" src={carpic.picture} />
                  )
                })
              }
            </View>
          }
        </AtCard> */}
      </View>
    )
  }
}
export default class Index extends Component {
  constructor(){
    super(...arguments);
    this.state={
      receiverId:0,
      userName:'',
      avatarUrl:'',
      vehicles:[],
      vehicledetails:[],
    }
  }
  onLoad(options){
    this.setState({
      receiverId:Number(options.receiverId),
      userName:options.userName,
    });
    wx.setNavigationBarTitle({
      title:options.userName
    });
    wx.request({
      url:'https://qizong007.top/user/getInfo',
      method:'GET',
      data:{
        userId:options.receiverId
      },
      success:res=>{
        console.log(res);
        if(res.data.code==0){
          this.setState({
            avatarUrl:res.data.data.avatarUrl,
            vehicles:res.data.data.vehicles,
          });
          res.data.data.vehicles.forEach(id=>{
            wx.request({
              url:'https://qizong007.top/vehicle/findById',
              method:'GET',
              data:{
                vehicleId:id
              },
              success:res=>{
                console.log(res);
                this.setState({
                  vehicledetails:this.state.vehicledetails.concat(res.data.data)
                });
              }
            })
          })
        }
      }
    })
  }
  render () {
    return (
      <View className='index'>
        <View className='info'>
          <AtAvatar
            image={this.state.avatarUrl}
            circle
            size='large'
          />
          <Text style={'margin-top:20rpx;'}>{this.state.userName}</Text>
        </View>
        <AtDivider />
        <View className='car'>
          {
            this.state.vehicledetails.map((item)=>{
              return(
                <Vehicle vehicle={item} />
              )
            })
          }
        </View>
      </View>
    )
  }
}
