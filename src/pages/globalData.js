const globalData={
  userInfo: null,
  userid:null,
  openid:null,
  relatives:[],
  vehicles:[],
  carInfo:[], // 车辆具体信息
}
export function setGlobalData(key,val){
  globalData[key]=val;
}
export function getGlobalData(key){
  return globalData[key];
}