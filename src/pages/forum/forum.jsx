import { Component } from 'react'
import { View, Text,Image } from '@tarojs/components'
import { AtButton,AtList, AtIcon,AtCard,AtTabBar,AtFloatLayout,AtFab,AtTextarea,AtImagePicker } from 'taro-ui'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './forum.scss'
import like from '/images/like.png'
import comment from '/images/comment.png'
import deletetrend from '/images/deletetrend.png'
import {setGlobalData,getGlobalData} from '../globalData'

export default class Index extends Component {
  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }
  constructor(props){
    super(props);
    this.getTrends=this.getTrends.bind(this);
    this.state={
      count:0,
      trends:[],
      files:[],
      userid:getGlobalData('userid'),
      current:1,
      isFloat:false,
      sendTrend:''
    }
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
  sendTrendChange(e){
    // e is content
    // no empty or all space

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
  onLoad(){
    this.getTrends();
  }
  getTrends(){
    wx.request({
      url:'https://qizong007.top/post/getTen',
      method:'GET',
      data:{
        times:this.state.count
      },
      success:res=>{
        console.log(res);
        this.setState({
          trends:res.data.data,
        })
      }
    });
  }
  onDelete(e,id){
    wx.showModal({
      title:'提示',
      content:'确定删除这条动态？',
      showCancel:true,
      success:res=>{
        if(res.confirm){
          wx.request({
            url:'http://qizong007.top/post/delete',
            method:'POST',
            data:{
              postId:id
            },
            success:res=>{
              console.log('删除成功')
              console.log(res);
              // repaint
              let temp=[];
              for(let i=0;i<this.state.trends.length;i++){
                if(this.state.trends[i].postId!=id){
                  temp.push(this.state.trends[i]);
                }
              }
              this.setState({
                trends:temp,
              });
            }
          })
        }
      }
    })
  }
  callFloat(){
    this.setState({
      isFloat:true,
    });
  }
  render () {
    const list=this.state.trends;
    console.log(list);
    return (
      <View className='index'>
        <AtList>
          {list.map((item)=>{
            return (
              <AtCard
                className='card'
                // note={item.postTime}
                // renderIcon={
                //   <Image src={car} />
                // }
                extra={item.postTime}
                title={item.userName}
                thumb='https://img2020.cnblogs.com/blog/1956720/202104/1956720-20210410185237404-1071619101.png'
              >
                <View className="content">
                  {item.content}
                </View>
                <View className="bottomBar">
                  {this.state.userid==item.userId&&
                  <AtIcon value='trash' size='25' color='#78A4FA' className="delete"
                  onClick={this.onDelete.bind(this,item.postId)}
                  ></AtIcon>}
                  <AtIcon value='heart' size='25' color='#78A4FA' className="like"></AtIcon>
                  <AtIcon value='message' size='25' color='#78A4FA' className="comment"></AtIcon>
                </View>
              </AtCard>
            )
          })}
        </AtList>
        <View className="fab">
          <AtFab onClick={this.callFloat.bind(this)}>
            <Text className='at-fab__icon at-icon at-icon-add'></Text>
          </AtFab>          
        </View>
        <AtFloatLayout isOpened={this.state.isFloat} title="发表动态">
          <AtTextarea
            value={this.state.sendTrend}
            onChange={this.sendTrendChange.bind(this)}
            maxLength={200}
            placeholder='分享新鲜事...'
          />
            <AtImagePicker
            multiple
            count={3}
            files={this.state.files}
            onChange={this.onChange.bind(this)}
            onFail={this.onFail.bind(this)}
            onImageClick={this.onImageClick.bind(this)}
          />
          <AtButton>发布</AtButton>
        </AtFloatLayout>
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
