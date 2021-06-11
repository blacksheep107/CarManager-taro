import { Component } from 'react'
import { View, Text,Image,Button } from '@tarojs/components'
import { AtButton,AtCard,AtList, AtListItem } from 'taro-ui'
import VirtualList from '@tarojs/components/virtual-list'
import {setGlobalData,getGlobalData} from '../globalData'
import nocar from '/images/nocar.png'
import cartype from '/images/car_type.png'
import ebike from '/images/e_bike.png'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './car_manage.scss'
import React from 'react'
export default class Index extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      carInfo:[],
    }
  }
  onLoad() {
    // this.setState({carInfo:getGlobalData('carInfo')});
  }
  componentDidShow(){
    this.setState({carInfo:getGlobalData('carInfo')});
  }
  addCar(){
    // go to addCar page
    wx.navigateTo({
      url: '../add_car/add_car',
      success:res=>{
        console.log(res);
      },
      fail:res=>{
        console.log(res);
      }
    })
  }
  updateCar(item){
    wx.navigateTo({
      url:'../update_car/update_car?vehicleid='+item.vehicleid,
    })
  }
  deleteCar(item){
    console.log(item);
    wx.showModal({
      title:'确认删除车辆？',
      showCancel:true,
      success:res=>{
        if(res.confirm){
          wx.request({
            url:'https://qizong007.top/vehicle/delete',
            method:'POST',
            data:{
              vehicleId:item.vehicleid,
            },
            success:res=>{
              // repaint
              let that=this;
              new Promise(
                function(resolve,reject){
                  let newinfo=[];
                  that.state.carInfo.forEach(function(i){
                    if(i.vehicleid!==item.vehicleid){
                      newinfo.push(i);
                    }
                  })
                  setGlobalData('carInfo',newinfo);
                  that.setState({
                    carInfo:newinfo
                  });
                  // that.state.carInfo=newinfo;
                  resolve();
                }
              ).then(
                (res)=>{
                  //this.componentDidShow();
                }
              )
            },
            fail:res=>{
              console.log(res);
            }
          })
        }
      }
    })
  }
  render () {
    const data=this.state.carInfo;
    const datalength=data.length;
    console.log(data);
    return (
      <View>
        <View>
          {
            datalength==0?
            <Image src={nocar}></Image> :
            <View>
              {data.map((item)=>{
                return (
                  <View className='card'>
                    <View className='header'>
                      <Image className='type'
                      src={
                        item.type=='汽车'?cartype:ebike
                      } />
                      <Text>{item.licensePlate}</Text>
                      <Text className='rightinfo'>{item.brand+'-'+item.color}</Text>
                    </View>
                    <View className='line'></View>
                    <View className='content'>
                      {
                      JSON.stringify(item.pictures)==='[]'?
                        <Text>暂无图片</Text> :
                        <View className="cars">
                        {
                          item.pictures.map((carpic)=>{
                            return (
                              <Image className="onecar" src={carpic.picture} />
                            )
                          })
                        }
                        </View>
                      }
                    </View>
                    <View className='bottom'>
                      <View className='button' hoverClass='hoverbutton' onClick={this.updateCar.bind(this,item)}>修改</View>
                      <View className='verticalline'></View>
                      <View className='button' hoverClass='hoverbutton' onClick={this.deleteCar.bind(this,item)}>删除</View>
                    </View>
                  </View>
                )
              })}
            </View>
          }
          <AtButton type="primary" size="small" className='myButton' onClick={this.addCar.bind(this)}>添加车辆</AtButton>
        </View>
      </View>
    )
  }
}
