import { Component } from 'react'
import { View, Text,Image, Icon,ScrollView,Button, Input,Label } from '@tarojs/components'
import { AtButton,AtList, AtIcon,AtCard,AtTabBar,AtFloatLayout,AtFab,AtTextarea,AtImagePicker,AtToast, AtInput,AtDivider } from 'taro-ui'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './forum.scss'
import like from '/images/like.png'
import comment from '/images/comment.png'
import deletetrend from '/images/deletetrend.png'
import {setGlobalData,getGlobalData} from '../globalData'
class CommentContent extends Component{
  constructor(props){
    super(props);
    this.state={
      comments:'',
    }
  }
  render(){
    let allcomment=this.props.item.comments.concat(this.props.newcomments);
    return(
      <View className='commentBlock'>
        {allcomment.length>0&&
          <View>
            {
              allcomment.map((onecomment)=>{
                return(
                  <View className="commentReal">
                    <Text className="commentname">{onecomment.name}：</Text>
                    <Text className="commentcontent">{onecomment.content}</Text> 
                    {/* <AtIcon value='trash' size='15' color='#78A4FA' onClick={this.deleteComment.bind(onecomment.commentId)}></AtIcon> */}
                    {/* 做的我心态崩了 */}
                  </View>
                )
              })
            }
          </View>
        }
      </View>
    )
  }
}
class Comment extends Component{
  constructor(props){
    super(props);
    this.state={
      isCommentFloat:false,
      sendComment:'',
      commentDisabled:true,
      newcomments:[],
    }
  }
  callCommentFloat(id){
    this.setState({
      isCommentFloat:true,
      sendComment:'',
    });
  }
  sendCommentChange(e){
    // e is content
    // console.log(e.detail.value);
    this.state.sendComment=e.detail.value;
    let reg="^[ ]+$";
    let re=new RegExp(reg);
    if(re.test(e)||e==''){
      this.setState({commentDisabled:true});
    }else{
      this.setState({commentDisabled:false});
    }
  }
  deleteComment(id){
    wx.showModal({
      title:'提示',
      content:'确定删除评论？',
      showCancel:true,
      success:res=>{
        if(res.confirm){
          wx.request({
            url:'https://qizong007.top/comment/delete',
            method:'POST',
            data:{
              commentId:id
            },
            success:res=>{
              // console.log(res);
              // repaint needs to make comment a component
            }
          })
        }
      }
    })
  }
  submitComment(id){
    console.log(id);
    let info=getGlobalData('userInfo');
    wx.request({
      url:'https://qizong007.top/comment/publish',
      method:'POST',
      data:{
        userId:getGlobalData('userid'),
        postId:this.props.item.postId, // 帖子id
        userName:info.nickName,
        content:this.state.sendComment, // 评论内容
      },
      success:res=>{
        console.log(res);
        if(res.data.code===0){
          // success,close,don't know how to repaint
          // newcomments array, repaint two array
          let temp=this.state.newcomments;
          temp.push({
            commentId:res.data.data.commentId,
            userId:getGlobalData('userid'),
            name:info.nickName,
            content:this.state.sendComment,
          });
          this.setState({
            // isCommentFloat:false,
            sendComment:'',
            commentDisabled:true,
            newcomments:temp,
          });
        }
      }
    })
  }
  render(){
    return(
      <View className='inputAndComment'>
        <CommentContent item={this.props.item} newcomments={this.state.newcomments} />
        <View className='commentView'>
          <View className='input'>
            <View className='left'>
              <Label className='label'>评论</Label>
              {/* <View className='line' style='margin-left:16rpx'></View>                */}
            </View>
            <Input style='margin-left:16rpx;' placeholder='说点什么吧...' placeholderClass='placeholder' onInput={this.sendCommentChange.bind(this)} value={this.state.sendComment}></Input>
            <View className='button' onClick={
              !this.state.commentDisabled?
              this.submitComment.bind(this,this.props.item.postId):null
              }>
              {/* <View className='line' style='margin-right:16rpx'></View>                */}
              <Text className='send'>发送</Text>
              {/* <AtIcon className='button' value='message' size='24' color='#78A4FA' className="comment"></AtIcon> */}
            </View>
          </View>
          {/* <AtInput className='commentFixed'
            name={this.props.item.postId}
            title='评论'
            type='text'
            placeholder='说点什么吧...'
            border='false'
            value={this.state.sendComment}
            onChange={this.sendCommentChange.bind(this,this.props.item.postId)}
          /> */}
        </View>        
      </View>

    )
  }
}
class Trend extends Component{
  constructor(props){
    super(props);
    this.state={
      isHide:false,
    }
  }
  onDelete(id){
    wx.showModal({
      title:'提示',
      content:'确定删除这条动态？',
      showCancel:true,
      success:res=>{
        if(res.confirm){
          wx.request({
            url:'https://qizong007.top/post/delete',
            method:'POST',
            data:{
              postId:id
            },
            success:res=>{
              console.log(res);
              // repaint , change style
              if(res.data.code==0){
                this.setState({
                  isHide:true
                });
                wx.showToast({
                  title:'删除成功！'
                })
              }
            }
          })
        }
      }
    })
  }
  previewImg(i){
    console.log(i)
    console.log(this.props);
    let that=this;
    wx.previewImage({
      current:i,
      urls:this.props.item.pictures,
    })
  }
  getTime(d){
    return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
  }
  render(){
    let that=this;
    return (
      <View>
        {!this.state.isHide&&
          <View className='card'>
            <View className='header'>
              <Image src={this.props.item.avatarUrl} className='avatar' />
              <View className='nameAndContent'>
                <Text>{this.props.item.userName}</Text>
                <Text className='time'>{this.getTime(new Date(this.props.item.postTime))}</Text>
              </View>
              <View className='trash'>
              {this.props.userid==this.props.item.userId&&
                <AtIcon value='trash' size='24' color='#78A4FA' className="delete"
                onClick={this.onDelete.bind(this,this.props.item.postId)}
                ></AtIcon>}
              </View>
            </View>
            <Text className='content'>
              {this.props.item.content}
            </Text>
            <View className="imgs">
            {
              this.props.item.pictures.map((i)=>{
                return (
                  <Image src={i} 
                  onClick={this.previewImg.bind(this,i)} 
                  data-src={i}
                  className="oneImage" />
                )
              })
            }
            </View>
            <Comment item={this.props.item} />
          </View>
        //   <AtCard
        //   className='card'
        //   extra={this.getTime(new Date(this.props.item.postTime))}
        //   color='white'
        //   extraStyle={
        //     {
        //       'color':'darkgray',
        //       'font-size':'small',
        //     }
        //   }
        //   title={this.props.item.userName}
        //   thumb={this.props.item.avatarUrl}
        // >
          // <Text className="content">
          //   {this.props.item.content}
          // </Text>
          // <View className="imgs">
          //   {
          //     this.props.item.pictures.map((i)=>{
          //       return (
          //         <Image src={i} 
          //         onClick={this.previewImg.bind(this,i)} 
          //         data-src={i}
          //         className="oneImage" />
          //       )
          //     })
          //   }
          // </View>
          // <View className="bottomBar">
          //   <View className='trash'>
          //     {this.props.userid==this.props.item.userId&&
          //       <AtIcon value='trash' size='24' color='#78A4FA' className="delete"
          //       onClick={this.onDelete.bind(that.props.item.postId)}
          //       ></AtIcon>}              
          //   </View>
          // </View>
          // <Comment item={this.props.item} />

        // </AtCard>
        }
        <View style="background:linear-gradient(to left,#FFFFFF,#b6b6b6,#FFFFFF);height:1px;"></View>
      </View>
    )
  }
}
export default class Index extends Component {
  constructor(props){
    super(props);
    this.getTrends=this.getTrends.bind(this);
    this.state={
      count:0,
      trends:[],
      files:[],
      userid:getGlobalData('userid'),
      current:2,
      isFloat:false,
      sendTrend:'',
      submitDisabled:true,
      errorToast:false,
      successToast:false,
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
    this.state.sendTrend=e;
    let reg="^[ ]+$";
    let re=new RegExp(reg);
    if(re.test(this.state.sendTrend)||e==''){
      this.setState({submitDisabled:true});
    }else{
      this.setState({submitDisabled:false});
    }
  }
  // onLoad(){
  //   this.getTrends();
  // }
  componentDidShow(){
    // this.getTrends();
  }
  componentWillMount(){
    this.getTrends();
  }
  submitTrend(e){
    // no empty or all space
    let info=getGlobalData('userInfo');
    let that=this;
    wx.request({
      url:'https://qizong007.top/post/publish',
      method:'POST',
      data:{
        userId:getGlobalData('userid'),
        avatarUrl:info.avatarUrl,
        userName:info.nickName,
        content:this.state.sendTrend,
        pictures:[]
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
        }else{
          // fail
          this.setState({errorToast:true})
        }
      }
    })
  }
  handleClick (value) {
    this.setState({
      current: value
    });
    if(value===0){
      // camera
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
  getTrends(){
    wx.request({
      url:'https://qizong007.top/post/getTen',
      method:'GET',
      data:{
        times:this.state.count
      },
      success:res=>{
        console.log(res);
        this.state.count++;
        this.setState({
          trends:res.data.data,
        })
      }
    });
  }
  callFloat(){
    this.setState({
      isFloat:true,
      isCommentFloat:false,
      successToast:false,
      errorToast:false,
      sendTrend:'',
    });
  }
  gotoAddTrend(){
    wx.navigateTo({
      url:'../add_trend/add_trend',
    })
  }
  onPullDownRefresh(){
    // 下拉刷新
    this.setState({
      count:0,
      trends:[],
    });
    this.componentWillMount();
    wx.stopPullDownRefresh();
  }
  onReachBottom(){
    // 上拉加载
    wx.request({
      url:'https://qizong007.top/post/getTen',
      method:'GET',
      data:{
        times:this.state.count
      },
      success:res=>{
        this.state.count++;
        // this.state.trends.push(res.data.data);
        this.setState({
          trends:this.state.trends.concat(res.data.data)
        })
      }
    })
  }
  render () {
    const list=this.state.trends;
    return (
      <View scrollY scrollWithAnimation className='index'>
        <AtList>
          {list.map((item)=>{
            return (
              <Trend item={item} userid={this.state.userid} />
            );
          })}
        </AtList>
        <View className="fab">
          <AtFab onClick={this.gotoAddTrend.bind(this)}>
            <Text className='at-fab__icon at-icon at-icon-add'></Text>
          </AtFab>          
        </View>
        {/* <AtFloatLayout isOpened={this.state.isFloat} title="发表动态">
          <AtTextarea
            value={this.state.sendTrend}
            onChange={this.sendTrendChange.bind(this)}
            maxLength={200}
            cursorSpacing={400}
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
          <AtButton type='primary' onClick={this.submitTrend.bind(this)}
          disabled={this.state.submitDisabled}>发表</AtButton>
        </AtFloatLayout> */}
        <AtToast isOpened={this.state.errorToast} status="error" text="发布失败"></AtToast>
        <AtToast isOpened={this.state.successToast} status="success" text="发布成功"></AtToast>
        <View className='nothing'></View>
        <AtTabBar
          fixed
          tabList={[
            { title: '找车', iconType: 'camera'},
            { title: '消息', iconType: 'message'},
            { title: '论坛', iconType: 'streaming' },
            { title: '我的', iconType: 'user'},
          ]}
          onClick={this.handleClick.bind(this)}
          current={this.state.current}
        />
      </View>
    )
  }
}
