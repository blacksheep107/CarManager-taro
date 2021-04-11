import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton,AtForm, AtInput,AtRadio,AtImagePicker,AtToast } from 'taro-ui'
import Taro from '@tarojs/taro'
import {setGlobalData,getGlobalData} from '../globalData'


import "taro-ui/dist/style/components/button.scss" // 按需引入
import './add_car.scss'

export default class Index extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }
  constructor(){
    super(...arguments)
    this.state={
      carnum:'',
      type:0,
      brand:'',
      color:'',
      imgs:[],
      files: [],
    }
  }
  chooseImageTap(e){
    let that=this;
    wx.showActionSheet({
      itemList: ['从相册中选择','拍照'],
      itemColor:'#00000',
      success:res=>{
        if(res.tapIndex==0){
          // choose from album
          that.chooseWXImage('album');
        }else if(res.tapIndex==1){
          // camera
          that.chooseWXImage('camera');
        }
      }
    })
  }
  chooseWXImage(type){
    let that=this;
    wx.chooseImage({
      count:9,
      sizeType:['original','compressed'],
      sourceType:[type],
      success:res=>{
        console.log(res.tempFilePaths[0]);
        that.setState({
          imgs:res.tempFilePaths
        });
      }
    })
  }
  upImgs(imgurl,index){
    let that=this;
    // wx.uploadFile({
    //   filePath: 'imgurl',
    //   name: 'file',
    //   url: 'url',
    //   success:res=>{
    //     console.log(res);
    //     let data=JSON.parse(res.data);
    //   }
    // })
  }
  typeChange(value){
    this.setState({type:value})
  }
  colorChange(value){
    this.setState({color:value});
    return value;
  }
  brandChange(value){
    this.setState({brand:value});
    return value;
  }
  carnumchange(value){
    this.setState({carnum:value});
    return value;
  }
  onSubmit(event){
    console.log(this.state);
    if(this.state.carnum===''){
      wx.showModal({
        title:'提示',
        content:'请填写车牌号！',
        showCancel:false,
      });
    }else{
      wx.showModal({
        title:'确认添加车辆？',
        showCancel:true,
        success:res=>{
          if(res.confirm){
            this.addToServer();
          }
        }
      })
    }
  }
  addToServer(){
    wx.request({
      url: 'https://qizong007.top/vehicle/create',
      method:'POST',
      data:{
        type:this.state.type,
        licensePlate:this.state.carnum,
        brand:this.state.brand,
        color:this.state.color,
        carOwnerId:getGlobalData('userid'),
        pictures:[], //空 图片放另一个上传
      },
      success:res=>{
        // uploadFiles上传图片
        
        // update global vehicles, carInfo
        // setGlobalData('vehicles',) 
        // 渲染有问题，要重新进才会有，因为放到login里去了，等后端更新返回数据增加vehicleId
        console.log(res);
        // repaint
        let that=this;
        wx.request({
          url:'https://qizong007.top/vehicle/findById',
          method:'GET',
          data:{
            vehicleId:res.data.data.vehicleId
          },
          success:res=>{
            new Promise(
              function(resolve,reject){
                let newinfo=getGlobalData('carInfo');
                newinfo.push({
                  vehicleid:res.data.data.vehicleId,
                  type:res.data.data.type==0?'汽车':'电动车',
                  licensePlate:res.data.data.licensePlate,
                  color:res.data.data.color,
                  brand:res.data.data.brand,
                  pictures:res.data.data.pictures
                })
                setGlobalData('carInfo',newinfo);
                resolve();
              }
            ).then(
              (res)=>{
                wx.navigateBack();
                // wx.navigateTo({
                //   url:'../car_manage/car_manage'
                // })
              }
            )            
          }
        })
      },
      fail:res=>{
        console.log(res);
      }
    });  
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
            选择车辆类型
          </View>
        </View>
        <AtRadio
          options={[
            {label:'汽车',value:0},
            {label:'电动车',value:1}
          ]}
          value={this.state.type}
          required="required"
          onClick={this.typeChange.bind(this)} />
          <View className='at-article'>
            <View className='at-article__h1'>
              填写车辆信息
            </View>
          </View>
        <AtInput
          name="carnum"
          title="车牌号"
          type="text"
          placeholder="请输入车牌号"
          value={this.state.carnum}
          required="required"
          onChange={this.carnumchange.bind(this)} />
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
          {/* <View class="form-control">
            <AtButton onClick={this.chooseImageTap.bind(this)}>上传图片</AtButton>
          </View> */}
          <AtButton type="primary" onClick={this.onSubmit.bind(this)}>提交</AtButton>
      </AtForm>
    )
  }
}
