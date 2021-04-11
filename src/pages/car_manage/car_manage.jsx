import { Component } from 'react'
import { View, Text,Image } from '@tarojs/components'
import { AtButton,AtCard,AtList, AtListItem } from 'taro-ui'
import VirtualList from '@tarojs/components/virtual-list'
import {setGlobalData,getGlobalData} from '../globalData'
import nocar from '/images/nocar.png'
import car from '/images/car.png'
import ebike from '/images/ebike.png'

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
    console.log('onShow');
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
                  that.state.carInfo=newinfo;
                  resolve();
                }
              ).then(
                (res)=>{
                  this.componentDidShow();
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
            <AtList>
              {data.map((item)=>{
                return (
                  <AtCard
                    note={item.type}
                    extra={item.brand+'-'+item.color}
                    title={item.licensePlate}
                  >
                    {
                      JSON.stringify(item.pictures)==='[]'?
                      <Text>没图</Text> :
                      <Image src={car}></Image>
                    }
                    <View className="at-row">
                      <AtButton size="small" onClick={this.updateCar.bind(this,item)}>修改车辆</AtButton>
                      <AtButton size="small" onClick={this.deleteCar.bind(this,item)}>删除车辆</AtButton>                      
                    </View>
                  </AtCard>
                )
              })}
            </AtList>
          }
          <AtButton type="primary" size="small" className='myButton' onClick={this.addCar.bind(this)}>添加车辆</AtButton>
        </View>
      </View>
    )
  }
}