import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton,AtForm, AtInput,AtRadio,AtImagePicker,AtToast } from 'taro-ui'
import {setGlobalData,getGlobalData} from '../globalData'

import './update_car.scss'

export default class Index extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }
  constructor(){
    super(...arguments);
    this.state={
      vehicleid:0,
      licensePlate:'',
      type:0,
      brand:'',
      color:'',
      images:[],
      files:[],
      carnum:'',
    }
  }
  onLoad(options){
    // 不强转会直接把它变成string 无语
    this.state.vehicleid=Number(options.vehicleid);
    wx.request({
      url:'https://qizong007.top/vehicle/findById',
      method:'GET',
      data:{
        vehicleId:this.state.vehicleid
      },
      success:res=>{
        console.log(res);
        let img=[];
        new Promise((resolve,reject)=>{
          res.data.data.pictures.forEach((i)=>{
            img.push({
              url:i.picture
            });
          })          
        }).then(
          console.log(img),
          this.setState({
            licensePlate:res.data.data.licensePlate,
            brand:res.data.data.brand,
            color:res.data.data.color,
            type:res.data.data.type,
            files:img,
            carnum:res.data.data.licensePlate,
          })          
        )
      }
    })
  }
  onSubmit(){
    wx.showModal({
      title:'提示',
      content:'确认修改信息？',
      showCancel:true,
      success:res=>{
        if(res.confirm){
          this.updateToServer();
        }
      }
    })
  }
  updateToServer(){
    let promiseArr=[];
    let that=this;
    let info=getGlobalData('userInfo');
    for(let i=0;i<this.state.files.length;i++){
      let item=this.state.files[i];
      if(item.url.charAt(8)==='v')  continue;
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
    }
    Promise.all(promiseArr).then(()=>{
      // images里是新图片 files里是旧图片
      var temp=[];
      new Promise((resolve,reject)=>{
        // temp=this.state.images;
        this.state.files.forEach((item)=>{
          temp.push(item.url);
        })
      }).then(
        wx.request({
          url: 'https://qizong007.top/vehicle/update',
          method:'POST',
          data:{
            vehicleId:this.state.vehicleid,
            type:this.state.type,
            licensePlate:this.state.carnum,
            brand:this.state.brand,
            color:this.state.color,
            carOwnerId:getGlobalData('userid'),
            pictures:temp, 
          },
          success:res=>{
            console.log(res);
            // repaint
            wx.request({
              url:'https://qizong007.top/vehicle/findById',
              method:'GET',
              data:{
                vehicleId:this.state.vehicleid
              },
              success:res=>{
                new Promise(
                  function(resolve,reject){
                    let newinfo=getGlobalData('carInfo');
                    for(let j=0;j<newinfo.length;j++){
                      if(newinfo[j].vehicleid===that.state.vehicleid){
                        newinfo[j].vehicleid=res.data.data.vehicleId;
                        newinfo[j].type=res.data.data.type==0?'汽车':'电动车';
                        newinfo[j].licensePlate=res.data.data.licensePlate;
                        newinfo[j].color=res.data.data.color;
                        newinfo[j].brand=res.data.data.brand;
                        newinfo[j].pictures=res.data.data.pictures;
                        break;
                      }
                    }
                    // newinfo.push({
                    //   vehicleid:res.data.data.vehicleId,
                    //   type:res.data.data.type==0?'汽车':'电动车',
                    //   licensePlate:res.data.data.licensePlate,
                    //   color:res.data.data.color,
                    //   brand:res.data.data.brand,
                    //   pictures:res.data.data.pictures
                    // })
                    setGlobalData('carInfo',newinfo);
                    console.log(getGlobalData('carInfo'));
                    resolve();
                  }
                ).then(
                  (res)=>{
                    wx.navigateBack();
                  }
                )            
              }
            })
          },
          fail:res=>{
            console.log(res);
          }
        })
      )
    })

    // let that=this;
    // console.log(this.state);
    // wx.request({
    //   url:'https://qizong007.top/vehicle/update',
    //   method:'POST',
    //   header:{
    //     'content-type': 'application/json	'
    //   },
    //   data:{
    //     vehicleId:this.state.vehicleid,
    //     type:this.state.type,
    //     licensePlate:this.state.licensePlate,
    //     brand:this.state.brand,
    //     color:this.state.color,
    //     carOwnerId:getGlobalData('userid'),
    //     pictures:[], //空 图片放另一个上传
    //   },
    //   success:res=>{
    //     // uploadFiles上传图片
    //     // update global vehicles, carInfo
    //     // setGlobalData('vehicles',) 
    //     console.log(res);
    //     // repaint
    //     new Promise(
    //       function(resolve,reject){
    //         let newinfo=getGlobalData('carInfo');
    //         for(let j=0;j<newinfo.length;j++){
    //           if(newinfo[j].vehicleid===that.state.vehicleid){
    //             newinfo.splice(j,1);
    //           }
    //         }
    //         newinfo.push({
    //           vehicleid:that.state.vehicleid,
    //           type:that.state.type==0?'汽车':'电动车',
    //           licensePlate:that.state.licensePlate,
    //           color:that.state.color,
    //           brand:that.state.brand,
    //           pictures:that.state.pictures
    //         })
    //         // undefined???
    //         console.log(newinfo);
    //         setGlobalData('carInfo',newinfo);
    //         resolve();
    //       }
    //     ).then(
    //       (res)=>{
    //         wx.navigateBack();
    //       }
    //     )  
    //   },
    //   fail:res=>{
    //     console.log(res);
    //   }
    // })
  }
  colorChange(value){
    this.setState({color:value});
    return value;
  }
  brandChange(value){
    this.setState({brand:value});
    return value;
  }
  onChange (files) {
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
  render () {
    return (
      <AtForm onSubmit={this.onSubmit.bind(this)}>
        <View className='at-article'>
          <View className='at-article__h1'>
            修改车辆信息
          </View>
        </View>
          <AtInput
          name="brand"
          title="品牌"
          type="text"
          placeholder="请输入车辆品牌"
          value={this.state.brand}
          onChange={this.brandChange.bind(this)} />
          <AtInput
          name="color"
          title="颜色"
          type="text"
          placeholder="请输入车辆颜色"
          value={this.state.color}
          onChange={this.colorChange.bind(this)} />
          <AtImagePicker
            multiple
            count={3}
            files={this.state.files}
            onChange={this.onChange.bind(this)}
            onFail={this.onFail.bind(this)}
            onImageClick={this.onImageClick.bind(this)}
          />
          <AtButton type="primary" onClick={this.onSubmit.bind(this)}>提交</AtButton>
      </AtForm>
    )
  }
}
