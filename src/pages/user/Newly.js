import React, {Component} from 'react';
import {message, Input, Button, Radio, Select, Row, Col, Icon, Breadcrumb } from 'antd';
import UploadQiniu from '../../helpers/UploadQiniu';
import {mainStore} from '../../stores';
import {Http} from '../../helpers/http';
import {PICTYPE, CODEID} from '../../constants/constans';
import '../../css/details.scss';
import CordovaPlugin from '../../helpers/CordovaPlugin';
import {putb64} from '../../helpers/Media';
import {QINIU} from '../../constants/oauth-constants';

const Option = Select.Option;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;

class Newly extends Component {
  state = {
    village:'',
    pear:'',
    quarters:'',
    apple:'',
    bnana:'',
    cityList: [],
    countyList: [],
    streetList: [],
    committeeList: [],
    streetRestaurantList: [],
    committeeNextList: [],
    companyName: '',
    restaurantName: '',
    socialCreditCode: '',
    censusCellCode: '',
    organizationCode: '',
    menuId: '',
    address: '',
    location: '',
    neighborhoodNumber: '',
    addressSwitch: false,
    legalRepresentative: '',
    contactName: '',
    contactPhone: '',
    environmentalCode: '',
    equalsAddress: 1,
    environmentalProcedures: '',
    areaId: '',
    result: 0,
    menuList: [],
    picArr: [],
    size: 'large',
    token: '',
    url: '',
    restaurantAddress: '',
    restaurantAareId: '',
    operatingStatus: '',
    cityMap: null,
    phoneType: 1,
  };

  componentWillMount() {
    Http.get(`/api/menu/find-all`, {}, (response) => {
      this.setState({
        menuList: response.data.data
      })
    });
    Http.get(`/api/address/find-pid?parentCodeId=${CODEID.COUNTY}`, {}, (response) => {
      this.setState({
        countyList: response.data.data
      })
    });

    Http.get(`/api/address/find-pid?parentCodeId=${CODEID.STREET}`, {}, (response) => {
      this.setState({
        streetList: response.data.data,
        streetRestaurantList: response.data.data
      })
    });

    Http.get('/api/v1/resource/img-token', {}, (res) => {
      if (res.status === 200) {
        this.setState({
          token: res.data.data,
          url: '',
        });
      }
    });
  };

  componentDidMount() {
    let address = [];
    let map, geolocation;

    map = new AMap.Map('container', {
      resizeEnable: true,
      zoom: 15,
    });

    map.plugin(['AMap.Geolocation', 'AMap.Geocoder'], function () {
      geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,
        timeout: 10000,
        buttonOffset: new AMap.Pixel(10, 20),
        zoomToAccuracy: true,
        buttonPosition: 'RB',
        useNative: true,
        // noIpLocate: 2,
      });
      map.addControl(geolocation);
      geolocation.getCurrentPosition();
      AMap.event.addListener(geolocation, 'complete', onComplete);
      AMap.event.addListener(geolocation, 'error', onError);
    });


    function onComplete(data) {
      let str = ['定位成功'];
      str.push('经度：' + data.position.getLng());
      str.push('纬度：' + data.position.getLat());

      address = [data.position.getLng(), data.position.getLat()];
      localStorage.setItem('trapeze', JSON.stringify(address));


      let geocoder = new AMap.Geocoder({
        city: "021"
      });

      let marker = new AMap.Marker({
        map: map,
        bubble: true
      });

      marker.setPosition(address);
      geocoder.getAddress(address, function (status, result) {
        if (status == 'complete') {
          marker.setLabel({
            content: result.regeocode.formattedAddress
          });
        } else {

        }
      });


      if (data.accuracy) {
        str.push('精度：' + data.accuracy + ' 米');
      }
      str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));

    }

    function onError(data) {
      message.warning('地图请求超时',4);
    }
  }

  addressFn(ev) {
    this.setState({
      address: ev.target.value,
      // pear:this.state.apple + ev.target.value
    });
  }

  partFn(ev) {
    if(equalsAddress===1){
      this.setState({
        censusCellCode: ev.target.value
      });
    }else{
      this.setState({
        censusCellCode: ev.target.value
      });
    }
  }

  quartersFn(ev) {
    
    this.setState({
      
    });
   
  }

  company(ev) {
    this.setState({
      companyName: ev.target.value
    })
  }

  legalRepresentativeFn(ev) {
    this.setState({
      legalRepresentative: ev.target.value
    })
  }

  restaurant(ev) {
    this.setState({
      restaurantName: ev.target.value
    })
  }

  social(ev) {
    this.setState({
      socialCreditCode: ev.target.value
    })
  }

  IsPC() {
    let userAgentInfo = navigator.userAgent;
    let Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    let flag = true;
    for (let v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false;
        break;
      }
    }
    return flag;
  }

  contactNameFn(ev) {
    this.setState({
      contactName: ev.target.value
    })
  }

  phoneChange(ev) {
    this.setState({
      phoneType: ev.target.value,
      contactPhone: ''
    })
  }

  environmentalProceduresFn(value) {
    if (value === '请选择环保手续') {
      this.setState({
        environmentalProcedures: ''
      })
    } else {
      this.setState({
        environmentalProcedures: value
      })
    }
  }

  neighborhoodChange(ev) {
    this.setState({
      neighborhoodNumber: ev.target.value
    })
  }

  contactPhoneFn(ev) {
    this.setState({
      contactPhone: ev.target.value
    })
  }


  cityFn(data, index) {
    return (
      <option key={index} value={data.id}>
        {data.name}
      </option>
    );
  }

  countySelect(value) {
    if (value === '请选择区县') {
      this.setState({
        streetList: [],
        areaId: ''
      })
    } else {
      Http.get(`/api/address/find-pid?parentCodeId=${value}`, {}, (response) => {
        this.setState({
          streetList: response.data.data
        })
      });
    }
  }

  countyRestaurantSelect(value) {
    if (value === '请选择区县') {
      this.setState({
        streetRestaurantList: [],
        restaurantAareId: ''
      })
    } else {
      Http.get(`/api/address/find-pid?parentCodeId=${value}`, {}, (response) => {
        this.setState({
          streetRestaurantList: response.data.data
        })
      });
    }
  }

  streetRestaurantSelect(value) {
    if (value === '请选择街道') {
      this.setState({
        committeeNextList: [],
        restaurantAareId: ''
      })
    } else {
      Http.get(`/api/address/find-pid?parentCodeId=${value}`, {}, (response) => {
        this.setState({
          committeeNextList: response.data.data
        })
      });
    }
  }

  streetSelect(value) {
    if (value === '请选择街道') {
      this.setState({
        committeeList: [],
        areaId: ''
      })
    } else {
      Http.get(`/api/address/find-pid?parentCodeId=${value}`, {}, (response) => {
        this.setState({
          committeeList: response.data.data,
        })
      });
    }
  }

  committee(value) {
    if (value === '请选择居委会') {
      this.setState({
        areaId: ''
      })
    } else {
      Http.get(`/api/address/find-codeId?codeId=${value}`, {}, (response) => {
          this.setState({
            censusCellCode:response.data.data.codeId,
            apple:response.data.data.positionName,
            areaId: value
          }) 
      });
    }
  }

  committeeNext(value) {
    if (value === '请选择居委会') {
      this.setState({
        restaurantAareId: ''
      })
    } else {
      Http.get(`/api/address/find-codeId?codeId=${value}`, {}, (response) => {
        this.setState({
          censusCellCode:response.data.data.codeId,
          bnana:response.data.data.positionName,
          restaurantAareId: value
        }) 
    });
    }
  }

  locationChange(value) {
    if (value === '请选择所在位置') {
      this.setState({
        location: ''
      })
    } else {
      this.setState({
        location: value
      })
    }
  }

  countyFn(data, index) {
    return (
      <option key={index} value={data.id}>
        {data.name}
      </option>
    );
  }

  addressValueChange(ev) {
    if (ev.target.value === 0) {
      this.setState({
        addressSwitch: true,
      })
    } else {
      this.setState({
        addressSwitch: false
      })
    }
    this.setState({
      equalsAddress: ev.target.value
    })
  };

  

  menusChange(ev) {
    this.setState({
      menuId: ev.target.value
    })
  }

  restaurantAddressChange(ev) {
    this.setState({
      restaurantAddress:ev.target.value
    })
  }

  restaurantChange(ev) {
    if(ev.target.value < 0){
      ev.target.value = ''
    }
    this.setState({
      restaurantSeats: ev.target.value
    })
  }


  organizationCodeFn(ev) {
    if(ev.target.value <= 0){
      ev.target.value = ''
    }
    this.setState({
      organizationCode: ev.target.value
    });
  }

  verb(value) {
    if (value === '请选择运行状态') {
      this.setState({
        operatingStatus: ''
      })
    } else {
      this.setState({
        operatingStatus: value
      })
    }
  }

  album() {
    CordovaPlugin.album((base64) => {
      this.setState({
        dataUri: base64
      });
    });
  }

  camera() {
    CordovaPlugin.camera((base64) => {
      this.setState({
        dataUri: base64
      });
    });
  }

  async upload() {
    let arr = this.state.picArr;
    const res = await putb64(this.state.dataUri, this.state.token, false);
    const url = [`${QINIU.HUADONG.DOWNLOAD_URL}${res.key}`];
    arr.push({
      url:`${QINIU.HUADONG.DOWNLOAD_URL}${res.key}`,
      type: PICTYPE.TYPE.RESTAURANT
    });
    this.setState({
      url:url,
      picArr: arr
    });
  }

  uploadRestaurant(ev) {
    let arr = this.state.picArr;
    arr.push({
      url: ev.downloadUrl,
      type: PICTYPE.TYPE.RESTAURANT
    });
    this.setState({
      picArr: arr
    });
  }

  removePicture(ev) {
    let arr = this.state.picArr;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].url.split('/')[arr[i].url.split('/').length - 1] == ev.response.key) {
        arr.splice(arr.indexOf(arr[i]), 1);
        break;
      }
    }
    this.setState({
      picArr: arr
    });
  }

  getBack() {
    this.props.history.goBack();
  }

  Product() {
    
      
      let {
        companyName, restaurantName, legalRepresentative, location, socialCreditCode, menuId, neighborhoodNumber, address, restaurantAddress, restaurantAareId, censusCellCode, organizationCode, contactName, contactPhone, equalsAddress, operatingStatus, restaurantSeats, areaId, result, picArr, addressSwitch, environmentalProcedures,
        phoneType,
      }
        = this.state;
  
      // if (!localStorage.getItem('trapeze')) {
      //   message.warning('定位失败', 4);
      //   return;
      // }
  
      // let coordinate = JSON.parse(localStorage.getItem('trapeze')).join();
      
      let p1 = JSON.parse(localStorage.getItem('trapeze'));
      let index = '';
      let company = this.state.restaurantAddress;
      let restaurant = this.state.address;
      if (addressSwitch) {
        index = company;
      } else {
        index = restaurant;
      }
      AMap.plugin('AMap.Geocoder', function () {
        var geocoder = new AMap.Geocoder({
          // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
          city: '021'
        });
  
        geocoder.getLocation(index, function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            let p2 =result.geocodes[0].location.lng
            let p3 =result.geocodes[0].location.lat
            localStorage.setItem('apk', p2);
            localStorage.setItem('abk', p3);
            // console.log(JSON.stringify(p2));
            // console.log(p2);
          
           
            var dis = AMap.GeometryUtil.distance(p1, p2);
            // console.log(dis);
            if (dis < 2000) {
              localStorage.setItem('flag', 'true');
            } else {
              localStorage.setItem('flag', 'false');
            }
          }
        })
        
      })
      let lng = localStorage.getItem('apk');
      let lat = localStorage.getItem('abk');
      // let promise = new Promise(function(resolve,reject){
      //     // console.log('Promise');
      //     resolve();
      // });
      
      // promise.then(function(){
      //     // console.log('resolved');
      //     let coordinate = localStorage.getItem('apk');
      //     console.log(coordinate);
      // });
     
      if (!companyName) {
        message.warning('请输入企业名称', 4);
      } else if (!legalRepresentative) {
        message.warning('请输入法人代表', 4);
      } else if (!restaurantName) {
        message.warning('请输入餐厅名称', 4);
      } else if (!organizationCode & !socialCreditCode) {
        message.warning('请输入组织机构代码或社会信用代码', 4);
      } else if (!areaId) {
        message.warning('请选择详细地址区县,街道', 4);
      } else if (neighborhoodNumber.length !== 3) {
        message.warning('请输入三位数的街坊号', 4);
      } else if (!address) {
        message.warning('请输入详细地址', 4);
      } else if (equalsAddress === 0 && !restaurantAareId) {
        message.warning('请选择餐厅地址区县,街道', 4);
      } else if (equalsAddress === 0 && !restaurantAddress) {
        message.warning('请输入餐厅地址', 4);
      } else if (!location) {
        message.warning('请选择所在位置', 4);
      } else if (!contactName) {
        message.warning('请输入联系人姓名', 4);
      } else if (phoneType == 1 && (!contactPhone || !(/^1[3|4|5|8][0-9]\d{4,8}$/.test(contactPhone)))) {
        message.warning('请输入正确的联系电话', 4);
      } else if (phoneType == 2 && (!contactPhone || contactPhone.length != 8)) {
        message.warning('请输入正确的联系电话', 4);
      } else if (!menuId) {
        message.warning('请选择餐饮类型', 4);
      } else if (!restaurantSeats) {
        message.warning('请输入餐厅座位数', 4);
      } else if (!environmentalProcedures) {
        message.warning('请选择环保手续', 4);
      } else if (!operatingStatus) {
        message.warning('请选择运行状态', 4);
      } else if (!picArr || picArr.length === 0 && !this.state.url) {
        message.warning('请上传餐厅外部照片', 4);
      } else if (picArr.length > 3) {
        message.warning('最多只能上传1-3张图片', 4);
      } else {
        // setTimeout(() => {
        //   let params = {
        //     companyName,
        //     restaurantName,
        //     socialCreditCode,
        //     menuId,
        //     address,
        //     legalRepresentative,
        //     organizationCode,
        //     censusCellCode,
        //     contactName,
        //     equalsAddress,
        //     environmentalProcedures,
        //     restaurantSeats,
        //     location,
        //     neighborhoodNumber,
        //     areaId,
        //     operatingStatus,
        //     coordinate,
        //     result,
        //     restaurantAddress,
        //     restaurantAareId,
        //   };
  
        //   if (equalsAddress === 0) {
        //     params.restaurantAddress = restaurantAddress;
        //     params.restaurantAareId = restaurantAareId;
        //   } else {
        //     params.restaurantAddress = address;
        //     params.restaurantAareId = areaId;
        //   }
  
        //   if (phoneType === 1) {
        //     params.contactPhone = contactPhone;
        //   } else {
        //     params.contactPhone = `021-${contactPhone}`;
        //   }
        //   console.log(params);
        //   if (localStorage.getItem('flag') === 'true') {
        //     Http.post(`/api/companyInfo/create`, params, async (response) => {
        //       if (response.data.success) {
        //         mainStore.id = response.data.data.id;
        //         const upload = async (obj) => {
        //           return new Promise((resolve) => {
        //             Http.post(`/api/v1/resource/create`, obj, (response) => {
        //               resolve(response);
        //             });
        //           });
        //         };
        //         const res = [];
        //         for (let i = 0; i < picArr.length; i++) {
        //           picArr[i].resourceId = response.data.data.id;
        //           res.push(await upload(picArr[i]));
        //         }
  
        //         message.info('新增成功',4);
        //         localStorage.removeItem("trapeze");
        //         localStorage.removeItem("flag");
        //         this.props.history.push('/v1/user/product');
        //       }
        //     });
        //   } else {
        //     message.warning('您的餐厅地址与当前位置太远，请重新填写',4);
        //   }
        // }, 500)
        let params = {
              companyName,
              restaurantName,
              socialCreditCode,
              menuId,
              address,
              legalRepresentative,
              organizationCode,
              censusCellCode,
              contactName,
              equalsAddress,
              environmentalProcedures,
              restaurantSeats,
              location,
              neighborhoodNumber,
              areaId,
              operatingStatus,
              // coordinate,
              lng:lng?lng:'',
              lat:lat?lat:'',
              result,
              restaurantAddress,
              restaurantAareId,
            };
            
            if (equalsAddress === 0) {
              params.restaurantAddress = restaurantAddress;
              params.restaurantAareId = restaurantAareId;
            } else {
              params.restaurantAddress = address;
              params.restaurantAareId = areaId;
            }
    
            if (phoneType === 1) {
              params.contactPhone = contactPhone;
            } else {
              params.contactPhone = `021-${contactPhone}`;
            }
            Http.post(`/api/companyInfo/create`, params, async (response) => {
                    if (response.data.success) {
                      mainStore.id = response.data.data.id;
                      const upload = async (obj) => {
                        return new Promise((resolve) => {
                          Http.post(`/api/v1/resource/create`, obj, (response) => {
                            resolve(response);
                          });
                        });
                      };
                      const res = [];
                      for (let i = 0; i < picArr.length; i++) {
                        picArr[i].resourceId = response.data.data.id;
                        res.push(await upload(picArr[i]));
                      }
        
                      message.info('新增成功',4);
                      // localStorage.removeItem('apk');
                      this.props.history.push('/v1/user/product');
                    }
                  });
      };

    
   
  };

  render() {
    let {countyList, streetList, streetRestaurantList, committeeNextList, committeeList, addressSwitch, equalsAddress, menuList, picArr, phoneType, contactPhone,censusCellCode,quarters} = this.state;
    const countyOptions = countyList.map(county => <Option key={county.codeId}
                                                           value={county.codeId}>{county.positionName}</Option>);
    const streetOptions = streetList.map(street => <Option key={street.codeId}
                                                           value={street.codeId}>{street.positionName}</Option>);
    const committeeOptions = committeeList.map(committee => <Option key={committee.codeId}
                                                                    value={committee.codeId}>{committee.positionName}</Option>);
    const streetRestaurantOptions = streetRestaurantList.map(street => <Option
      key={street.codeId}>{street.positionName}</Option>);

    const committeeNextOptions = committeeNextList.map(committeeNext => <Option
      key={committeeNext.codeId}>{committeeNext.positionName}</Option>);

    return (
      <div>
        <div style={{fontWeight: '700', fontSize: '18px', lineHeight: '40px', color: '#11bd42'}}>
          <span className="catalog">企业目录></span>
          <span className="infomation">企业基本信息</span>
        </div>
        <div id="content">
          <br/>
          <Row>
            <Col span={4}>
              <h4 style={{fontWeight: 700, color: '#1890ff', fontSize: '18px', lineHeight: '40px'}}>企业基本信息</h4>
            </Col>
            <Col span={4} offset={14}>
              <Button type="danger" size={this.state.size} onClick={this.getBack.bind(this)}
                      style={{float: 'right'}}>返回</Button>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>企业名称</Col>
            <Col span={8}>
              <Input placeholder="请输入企业名称" onChange={this.company.bind(this)}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>法人代表</Col>
            <Col span={8}>
              <Input placeholder="请输入法人代表" onChange={this.legalRepresentativeFn.bind(this)}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>餐厅名称</Col>
            <Col span={8}>
              <Input placeholder="请输入餐厅名称" onChange={this.restaurant.bind(this)}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>社会信用代码</Col>
            <Col span={8}>
              <Input placeholder="请输入社会信用代码" type="number" onChange={this.social.bind(this)}/>
            </Col>
          </Row>
          {/* <br/>
          <Row>
            <Col span={4}>普查小区代码</Col>
            <Col span={8}>
              <Input placeholder="请输入普查小区代码" type="number" onChange={this.censusCellCodeFn.bind(this)}/>
            </Col>
          </Row> */}
          <br/>
          <Row>
            <Col span={4}>组织机构代码</Col>
            <Col span={8}>
              <Input placeholder="请输入组织机构代码" type="number" onChange={this.organizationCodeFn.bind(this)}/>
            </Col>
          </Row>
          <br/>
          <Row style={{position: 'relative'}}>
            <Col span={4}>注册地址</Col>
            <Col span={8}>
              <Select defaultValue={310110000000} style={{width: 120, margin: '5px'}}
                      onChange={this.countySelect.bind(this)}>
                <Option value="请选择区县">请选择区县</Option>
                {
                  countyOptions
                }
              </Select>
              <Select defaultValue="请选择街道" style={{width: 125, margin: '5px'}}
                      onChange={this.streetSelect.bind(this)}>
                <Option value="请选择街道">请选择街道</Option>
                {
                  streetOptions
                }
              </Select>
              <Select defaultValue="请选择居委会" style={{width: 130, margin: '5px'}}
                      onChange={this.committee.bind(this)}>
                <Option value="请选择居委会">请选择居委会</Option>
                {
                  committeeOptions
                }
              </Select>
              
            </Col>
            <Col span={7} offset={4}>
              <div id="container"
                   style={{width: '100%', height: '400px', position: 'absolute', right: 0, top: 0}}></div>
            </Col>
          </Row>
          {/* <br/>
          <Row>
            <Col span={4}>普查小区代码</Col>
            <Col span={8}>
              <Input onChange={this.partFn.bind(this)} value={censusCellCode} disabled={true}/>
            </Col>
          </Row> */}
          <br/>
          <Row>
            <Col span={4}></Col>
            <Col span={8}>
              <Input placeholder="详细地址" onChange={this.addressFn.bind(this)}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}></Col>
            <Col span={7}>
              <label htmlFor="" style={{marginRight: "10px"}}>餐厅地址是否与注册地址一致</label>
              <RadioGroup onChange={this.addressValueChange.bind(this)} defaultValue={equalsAddress} >
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </RadioGroup>
            </Col>
          </Row>
          <br/>
          {
            addressSwitch ?
              <div>
                <Row>
                  <Col span={4}>餐厅地址</Col>
                  <Col span={8}>
                    <Select defaultValue={310110000000} style={{width: 120, margin: '5px'}}
                            onChange={this.countyRestaurantSelect.bind(this)}>
                      <Option value="请选择区县">请选择区县</Option>
                      {
                        countyOptions
                      }
                    </Select>
                    <Select defaultValue="请选择街道" style={{width: 125, margin: '5px'}}
                            onChange={this.streetRestaurantSelect.bind(this)}>
                      <Option value="请选择街道">请选择街道</Option>
                      {
                        streetRestaurantOptions
                      }
                    </Select>
                    <Select defaultValue="请选择居委会" style={{width: 130, margin: '5px'}}
                            onChange={this.committeeNext.bind(this)}>
                      <Option value="请选择居委会">请选择居委会</Option>
                      {
                        committeeNextOptions
                      }
                    </Select>
                    {/* <Input onChange={this.quartersFn.bind(this)} value={quarters} disabled={true}/> */}
                  </Col>
                </Row>
                <br/>
                <Row>
                  <Col span={4}></Col>
                  <Col span={8}>
                    <Input placeholder="餐厅地址" onChange={this.restaurantAddressChange.bind(this)}/>
                  </Col>
                </Row>
                <br/>
              </div>
              : ''
          }
          <br/>
          <Row>
            <Col span={4}>普查小区代码</Col>
            <Col span={8}>
              <Input onChange={this.partFn.bind(this)} value={censusCellCode} disabled={true}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>街坊号</Col>
            <Col span={8}>
              <Input placeholder="请输入三位数的街坊号" type='number' onChange={this.neighborhoodChange.bind(this)}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>所在位置</Col>
            <Col span={8}>
              <Select defaultValue="请选择所在位置" style={{width: 200}} onChange={this.locationChange.bind(this)}>
                <Option value="请选择所在位置">请选择所在位置</Option>
                <Option value="邻近居民楼">邻近居民楼</Option>
                <Option value="商业楼宇内">商业楼宇内</Option>
                <Option value="临街独立店铺">独栋临街店铺</Option>
              </Select>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>联系人姓名</Col>
            <Col span={8}>
              <Input placeholder="请输入联系人姓名" onChange={this.contactNameFn.bind(this)}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>联系方式</Col>
            <Col span={8}>
              <RadioGroup onChange={this.phoneChange.bind(this)} value={phoneType}>
                <Radio value={1}>移动电话</Radio>
                <Radio value={2}>固定电话</Radio>
              </RadioGroup>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>联系电话</Col>
            {
              phoneType == 1 ?
                <Col span={8}>
                  <Input placeholder="请输入联系电话" value={contactPhone} onChange={this.contactPhoneFn.bind(this)}/>
                </Col>
                : <Col span={8}>
                  <InputGroup compact>
                    <Input style={{width: '20%'}} value="021-" disabled/>
                    <Input style={{width: '80%'}} placeholder="请输入联系电话" defaultValue={contactPhone}
                           onChange={this.contactPhoneFn.bind(this)}/>
                  </InputGroup>
                </Col>
            }
          </Row>
          <br/>
          <Row>
            <Col span={4}>餐饮类型（单选）</Col>
            <Col span={8}>
              <RadioGroup onChange={this.menusChange.bind(this)}>
                {
                  menuList.map((data, index) => {
                    return <Radio key={index} value={data.id}>{data.name}</Radio>
                  })
                }
              </RadioGroup>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>环保手续</Col>
            <Col span={8}>
              <Select defaultValue="请选择环保手续" style={{width: 150}} onChange={this.environmentalProceduresFn.bind(this)}>
                <Option value="请选择环保手续">请选择环保手续</Option>
                <Option value="环评报告表">环评报告表</Option>
                <Option value="环评登记表">环评登记表</Option>
                <Option value="无">无</Option>
              </Select>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>餐厅座位数</Col>
            <Col span={8}>
              <Input placeholder="请输入" style={{width: 100}} type="number"
                     onChange={this.restaurantChange.bind(this)}
              />个
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>运行状态</Col>
            <Col span={8}>
              <Select defaultValue="请选择运行状态" style={{width: 120}} onChange={this.verb.bind(this)}>
                <Option value="请选择运行状态">请选择</Option>
                <Option value={'运行'}>运行</Option>
                <Option value={'停业'}>停业</Option>
                <Option value={'关闭'}>关闭</Option>
              </Select>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>照片描述</Col>
            <Col span={8}>
              <Breadcrumb>
                <Breadcrumb.Item>含招牌在内的餐企门面照片</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>餐厅外部照片</Col>
            <Col span={4}>
              <UploadQiniu
                  dom={
                    <Button>
                      <Icon type="upload"/> 相册
                    </Button>
                  }
                  fileList={picArr}
                  callback={this.uploadRestaurant.bind(this)}
                  remove={this.removePicture.bind(this)}
                />
              {/* <Button onClick={this.album.bind(this)}>相册</Button> */}

            </Col>
            <Col span={4} offset={1}>
              {/* <Button onClick={this.camera.bind(this)}>拍照</Button> */}
            </Col>
            <Col span={4} offset={1}>
              {/* <Button onClick={this.upload.bind(this)}>上传</Button> */}
            </Col>
          </Row>
          <br/>
          {/* <Row>
              {
                picArr.map(value=>{
                  return(
                    <Col span={4}>
                      <img src={value.url} style={{width: '100px', height: '100px'}}/>
                    </Col>
                  )
                })
              }
            <Col span={12}>
              {
                this.state.dataUri ?
                  <img src={this.state.dataUri}/> : ''
              }
            </Col>
          </Row> */}
          <Row style={{marginTop: '30px'}}>
            <Col span={2} offset={11}>
              <Button type="primary" size={this.state.size} onClick={this.Product.bind(this)}
                      style={{float: 'left'}}>确认</Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}


export default Newly;
