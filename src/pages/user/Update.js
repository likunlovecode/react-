import React, {Component} from 'react';
import {Breadcrumb, Button, Checkbox, Col, Icon, Input, message, Radio, Row, Select} from 'antd';
import {mainStore} from '../../stores';
import UploadQiniu from '../../helpers/UploadQiniu';
import {CODEID, PICTYPE} from '../../constants/constans';
import '../../css/details.scss';
import {Http} from "../../helpers/Http";
import CordovaPlugin from '../../helpers/CordovaPlugin';
import {QINIU} from '../../constants/oauth-constants';
import {putb64} from '../../helpers/Media';

const Option = Select.Option;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;

class Details extends Component {
  state = {
    url:'',
    token:'',
    lasttime:1,
    kgswitch: false,
    resources: [],
    restaurantSeats: mainStore.enterpriseDetails.restaurantSeats,
    companyName: mainStore.enterpriseDetails.companyName,
    legalRepresentative: mainStore.enterpriseDetails.legalRepresentative,
    restaurantName: mainStore.enterpriseDetails.restaurantName,
    socialCreditCode: mainStore.enterpriseDetails.socialCreditCode,
    censusCellCode: mainStore.enterpriseDetails.censusCellCode,
    organizationCode: mainStore.enterpriseDetails.organizationCode,
    operatingStatus: mainStore.enterpriseDetails.operatingStatus,
    menuId: '',
    address: mainStore.enterpriseDetails.address,
    contactName: mainStore.enterpriseDetails.contactName,
    contactPhone: mainStore.enterpriseDetails.contactPhone ? (mainStore.enterpriseDetails.contactPhone.includes('021-') ? mainStore.enterpriseDetails.contactPhone.substring(4) : mainStore.enterpriseDetails.contactPhone) : '',
    phoneType: mainStore.enterpriseDetails.contactPhone ? (mainStore.enterpriseDetails.contactPhone.includes('021-') ? 2 : 1) : '',
    environmentalCode: mainStore.enterpriseDetails.environmentalCode,
    equalsAddress: mainStore.enterpriseDetails.equalsAddress || 0,
    restaurantAddress: mainStore.enterpriseDetails.restaurantAddress || '',
    environmentalProcedures: mainStore.enterpriseDetails.environmentalProcedures,
    yearOperation: mainStore.enterpriseDetails.yearOperation,
    averageDailyPassengerFlow: mainStore.enterpriseDetails.averageDailyPassengerFlow,
    averageMonthlyConsumptionOfEdibleOil: mainStore.enterpriseDetails.averageMonthlyConsumptionOfEdibleOil,
    kitchenStove: mainStore.enterpriseDetails.kitchenStove,
    businessHours: mainStore.enterpriseDetails.businessHours ? mainStore.enterpriseDetails.businessHours.split(',') : [],
    gasStoves: mainStore.enterpriseDetails.gasStoves,
    inductionCooker: mainStore.enterpriseDetails.inductionCooker,
    charcoalStove: mainStore.enterpriseDetails.charcoalStove,
    alcoholStove: mainStore.enterpriseDetails.alcoholStove,
    other: mainStore.enterpriseDetails.other,
    result: 0,
    menuList: [],
    purificationFacilities: mainStore.enterpriseDetails.purificationFacilities,
    onlineMonitoring: mainStore.enterpriseDetails.onlineMonitoring || '',
    onlineMonitoringValue: mainStore.enterpriseDetails.onlineMonitoring ? 1 : 0,
    onlineMonitoringDisabled: mainStore.enterpriseDetails.onlineMonitoring ? false : true,
    purificationFileList: [],
    restaurantNameFileList: [],
    countyList: [],
    streetList: [],
    defaultCountyValue: '',
    defaultStreetValue: '',
    defaultCommitValue: '',
    quarters: '',
    defaultValue: Number(mainStore.enterpriseDetails.areaId),
    area: mainStore.enterpriseDetails.area || '',
    areaId: '',
    restaurantArea: mainStore.enterpriseDetails.restaurantArea || '',
    defaultRestaurantValue: mainStore.enterpriseDetails.restaurantAareId,
    addressSwitch:false,
    restaurantAareId: '',
    defaultRestaurantStreetValue: '',
    defaultRestaurantCountyValue: '',
    defaultRestaurantCommitteeValue: '',
    countRestaurantList: [],
    streetRestaurantList: [],
    committeeList: [],
    committeeNextList: [],
    companyId: mainStore.enterpriseDetails.id,
    neighborhoodNumber: mainStore.enterpriseDetails.neighborhoodNumber,
    location: mainStore.enterpriseDetails.location,
    size: 'large',
    monthlyUsageFuel: mainStore.enterpriseDetails.monthlyUsageFuel,
    fuelType: mainStore.enterpriseDetails.fuelType,
    windSwitch: true,
    brands: mainStore.enterpriseDetails.brands,
    waterSeparator: mainStore.enterpriseDetails.waterSeparator,
    greaseTrapSetting: mainStore.enterpriseDetails.greaseTrapSetting,
    model: mainStore.enterpriseDetails.model,
    processingEfficiency: mainStore.enterpriseDetails.processingEfficiency,
    supportingFanAirVolume: mainStore.enterpriseDetails.supportingFanAirVolume,
    monthlyAverageWaterConsumption: mainStore.enterpriseDetails.monthlyAverageWaterConsumption,
    dailyCookingTime: mainStore.enterpriseDetails.dailyCookingTime,
    businessArea: mainStore.enterpriseDetails.businessArea,
    dayOperation: mainStore.enterpriseDetails.dayOperation,
    pathname: this.props.location.pathname.split('/')[this.props.location.pathname.split('/').length - 3]
  };

  componentWillMount() {
    let {
      area, restaurantArea, restaurantAareId, defaultValue, defaultRestaurantValue, addressSwitch,equalsAddress,purificationFacilities
    }
      = this.state;
    Http.get(`/api/menu/find-all`, {}, (response) => {
      let menus = [];
      for (let v of response.data.data) {
        if (v) {
          menus.push({
            key: v.id,
            value: v.id,
            label: v.name
          });
        }
      }
      this.setState({
        menuList: menus
      })
    });

    if (area) {
      if (area.level === 4) {
        this.setState({
          defaultCommitValue: '请选择居委会'
        })

      }
      if (area.level === 5) {
        Http.get(`/api/address/find-codeId?codeId=${area.codeId}`, {}, (response) => {
          let defaultCommitValue = response.data.data.parentCodeId;
          this.setState({
            defaultCommitValue: response.data.data.codeId,
            areaId: response.data.data.codeId,
            censusCellCode: response.data.data.codeId,
          })
          Http.get(`/api/address/find-codeId?codeId=${defaultCommitValue}`, {}, (response) => {
            let defaultStreetValue = response.data.data.parentCodeId;
            this.setState({
              defaultStreetValue: response.data.data.codeId
            })
            Http.get(`/api/address/find-codeId?codeId=${defaultStreetValue}`, {}, (response) => {
              let defaultCountyValue = response.data.data.parentCodeId;
              this.setState({
                defaultCountyValue: response.data.data.codeId
              })
              Http.get(`/api/address/find-pid?parentCodeId=${defaultCountyValue}`, {}, (response) => {
                this.setState({
                  countyList: response.data.data,
                })
                Http.get(`/api/address/find-pid?parentCodeId=${defaultStreetValue}`, {}, (response) => {
                  this.setState({
                    streetList: response.data.data,
                  })
                  Http.get(`/api/address/find-pid?parentCodeId=${defaultCommitValue}`, {}, (response) => {
                    this.setState({
                      committeeList: response.data.data,
                    })
                  });
                });
              });
            })
          })
        })
      }
    } else {
      Http.get(`/api/address/find-pid?parentCodeId=${CODEID.COUNTY}`, {}, (response) => {
        this.setState({
          countyList: response.data.data,
          defaultCountyValue: 310110000000,
          defaultStreetValue: '请选择街道',
          defaultCommitValue: '请选择居委会',
        })
      });
      Http.get(`/api/address/find-pid?parentCodeId=${CODEID.STREET}`, {}, (response) => {
        this.setState({
          streetList: response.data.data,
        })
      });
    }

    if (restaurantArea) {
      if (restaurantArea.level === 4) {
        this.setState({
          defaultRestaurantCommitteeValue: '请选择居委会'
        })
        let defaultRestaurantValue = restaurantArea.parentCodeId;

        Http.get(`/api/address/find-codeId?codeId=${defaultRestaurantValue}`, {}, (response) => {
          let defaultRestaurantCountyValue = response.data.data.codeId;
          this.setState({
            defaultRestaurantCountyValue: response.data.data.codeId,
          })
          Http.get(`/api/address/find-pid?parentCodeId=${CODEID.COUNTY}`, {}, (response) => {
            this.setState({
              countRestaurantList: response.data.data,
            })
            Http.get(`/api/address/find-pid?parentCodeId=${defaultRestaurantCountyValue}`, {}, (response) => {
              this.setState({
                streetRestaurantList: response.data.data
              })
              Http.get(`/api/address/find-pid?parentCodeId=${restaurantArea.codeId}`, {}, (response) => {
                this.setState({
                  committeeNextList: response.data.data
                })
              });
            });
          })

        })
      }
      if (restaurantArea.level === 5) {
        this.setState({
          defaultRestaurantCommitteeValue: restaurantArea.codeId,
          restaurantAareId: restaurantArea.codeId
        })
        Http.get(`/api/address/find-codeId?codeId=${restaurantArea.codeId}`, {}, (response) => {
          let defaultRestaurantCommitteeValue = response.data.data.parentCodeId;
          this.setState({
            defaultRestaurantCommitteeValue: response.data.data.codeId,
            censusCellCode: response.data.data.codeId
          });
          Http.get(`/api/address/find-codeId?codeId=${defaultRestaurantCommitteeValue}`, {}, (response) => {
            let defaultRestaurantValue = response.data.data.parentCodeId;
            this.setState({
              defaultRestaurantValue: response.data.data.codeId
            })
            Http.get(`/api/address/find-codeId?codeId=${defaultRestaurantValue}`, {}, (response) => {
              let defaultRestaurantCountyValue = response.data.data.parentCodeId;
              this.setState({
                defaultRestaurantCountyValue: response.data.data.codeId
              })
              Http.get(`/api/address/find-pid?parentCodeId=${defaultRestaurantCountyValue}`, {}, (response) => {
                this.setState({
                  countRestaurantList: response.data.data
                })
                Http.get(`/api/address/find-pid?parentCodeId=${defaultRestaurantValue}`, {}, (response) => {
                  this.setState({
                    streetRestaurantList: response.data.data
                  })
                  Http.get(`/api/address/find-pid?parentCodeId=${defaultRestaurantCommitteeValue}`, {}, (response) => {
                    this.setState({
                      committeeNextList: response.data.data
                    })

                  });
                });
              });
            })
          })
        })
      }
    } else {
      Http.get(`/api/address/find-pid?parentCodeId=${CODEID.COUNTY}`, {}, (response) => {
        this.setState({
          countRestaurantList: response.data.data,
          defaultRestaurantCountyValue: 310110000000,
          defaultRestaurantValue: '请选择街道',
          defaultRestaurantCommitteeValue: '请选择居委会'
        })
      })
    }

    let resourcesList = [];
    let purificationFileList = [];
    let restaurantNameFileList = [];
    let enterpriseDetails = mainStore.enterpriseDetails;

    for (let v of enterpriseDetails.resources) {
      if (v && v.type === 1) {
        purificationFileList.push({
          uid: v.id,
          url: v.url,
          type: v.type,
          id: v.id
        })
      }
    }

    this.setState({
      menuId: enterpriseDetails.menu ? enterpriseDetails.menu.id : '',
      resources: resourcesList,
      restaurantNameFileList,
      purificationFileList,
    })

    if(equalsAddress===0){
      this.setState({
        addressSwitch:true
      })
    }

    if (purificationFacilities === 0) {
      this.setState({
        windSwitch: false,
      });
    } else {
      this.setState({
        windSwitch: true
      });
    }

    Http.get('/api/v1/resource/img-token', {}, (res) => {
      if (res.status === 200) {
        this.setState({
          token: res.data.data,
          url: '',
        });
      }
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

  // censusCellCodeFn(ev) {
  //   this.setState({
  //     censusCellCode: ev.target.value
  //   });
  // }

  organizationCodeFn(ev) {
    this.setState({
      organizationCode: ev.target.value
    });
  }

  restaurant(ev) {
    this.setState({
      restaurantName: ev.target.value
    })
  }

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
        // noIpLocate: 1,
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
      message.warning('地图请求超时', 6);
    }
  }

  social(ev) {
    this.setState({
      socialCreditCode: ev.target.value
    })
  }

  contactPhoneFn(ev) {
    this.setState({
      contactPhone: ev.target.value
    })
  }

  committeeNext(value) {
    this.setState({
      defaultRestaurantCommitteeValue: value
    })
    if (value === '请选择居委会') {
      this.setState({
        restaurantAareId: '',

      })
    } else {
      Http.get(`/api/address/find-codeId?codeId=${value}`, {}, (response) => {
        this.setState({
          censusCellCode: response.data.data.codeId,
          restaurantAareId: value
        })
      });
    }
  }

  contactNameFn(ev) {
    this.setState({
      contactName: ev.target.value
    })
  }

  partFn(ev) {

    this.setState({
      censusCellCode: ev.target.value
    });

  }

  quartersFn(ev) {

    this.setState({});

  }

  phoneChange(ev) {
    this.setState({
      phoneType: ev.target.value,
      contactPhone: ''
    })
  }

  environmentalFn(ev) {
    this.setState({
      environmentalCode: ev.target.value
    })
  }

  addressFn(ev) {
    this.setState({
      address: ev.target.value
    })
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
    let arr = this.state.purificationFileList;
    const res = await putb64(this.state.dataUri, this.state.token, false);
    const url = [`${QINIU.HUADONG.DOWNLOAD_URL}${res.key}`];
    arr.push({
      url:`${QINIU.HUADONG.DOWNLOAD_URL}${res.key}`,
      type: PICTYPE.TYPE.RESTAURANT
    });
    this.setState({
      url:url,
      purificationFileList: arr
    });
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
  }

  lastaddress(ev) {
    if (ev.target.value === 0) {
      this.setState({
        kgswitch: true,
      })
    } else {
      this.setState({
        kgswitch: false
      })
    }
    this.setState({
      lasttime: ev.target.value
    })
    
  };

  menusChange(ev) {
    this.setState({
      menuId: ev.target.value
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

  restaurantChange(ev) {
    if (ev.target.value < 0) {
      ev.target.value = ''
    }
    this.setState({
      restaurantSeats: ev.target.value
    })
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

  restaurantAddressChange(ev) {
    this.setState({
      restaurantAddress: ev.target.value
    })
  }

  neighborhoodChange(ev) {
    this.setState({
      neighborhoodNumber: ev.target.value
    })
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

  timeChange(checkedValues) {
    this.setState({
      businessHours: checkedValues
    })
  }

  yearOperationFn(ev) {
    if (ev.target.value < 0) {
      ev.target.value = ''
    }
    if (ev.target.value >= 366) {
      ev.target.value = 366
    }
    this.setState({
      yearOperation: ev.target.value
    })
  }

  dailyCookingTimeFn(ev) {
    if (ev.target.value < 0) {
      ev.target.value = ''
    }
    if (ev.target.value >= 24) {
      ev.target.value = 24
    }
    this.setState({
      dailyCookingTime: ev.target.value
    })
  }

  dayOperationFn(ev) {
    if (ev.target.value < 0) {
      ev.target.value = ''
    }
    if (ev.target.value >= 24) {
      ev.target.value = 24
    }
    this.setState({
      dayOperation: ev.target.value
    })
  }

  businessAreaFn(ev) {
    if (ev.target.value < 0) {
      ev.target.value = ''
    }
    this.setState({
      businessArea: ev.target.value
    })
  }

  averageFn(ev) {
    if (ev.target.value < 0) {
      ev.target.value = ''
    }
    this.setState({
      averageDailyPassengerFlow: ev.target.value
    })
  }

  averageMonthlyFn(ev) {
    if (ev.target.value < 0) {
      ev.target.value = ''
    }
    this.setState({
      averageMonthlyConsumptionOfEdibleOil: ev.target.value
    })
  }

  monthlyAverageWaterConsumptionFn(ev) {
    if (ev.target.value < 0) {
      ev.target.value = ''
    }
    this.setState({
      monthlyAverageWaterConsumption: ev.target.value
    })
  }

  kitchenStoveFn(ev) {
    if (ev.target.value < 0) {
      ev.target.value = ''
    }
    this.setState({
      kitchenStove: ev.target.value
    })
  }

  handleChange(value) {
    if(value=='天然气'){
      this.setState({
        fuelType: value,
        fuelswitch:true,
        addswitch:false,
        reswitch:false
      })
    }
    if(value=='液化气'){
      this.setState({
        fuelType: value,
        addswitch:true,
        fuelswitch:false,
        reswitch:false
      })
    }
    if(value=='其他'){
      this.setState({
        fuelType: value,
        addswitch:false,
        fuelswitch:false,
        reswitch:true
      })
    }
  }

  fuelMonthlyFn(ev) {
    if (ev.target.value < 0) {
      ev.target.value = ''
    }
    this.setState({
      monthlyUsageFuel: ev.target.value
    })
  }

  gasStovesFn(ev) {
    if (ev.target.value < 0 ) {
      ev.target.value = ''
    }
    this.setState({
      gasStoves: ev.target.value
    })
  }

  inductionCookerFn(ev) {
    if (ev.target.value < 0 ) {
      ev.target.value = ''
    }
    this.setState({
      inductionCooker: ev.target.value
    })
  }

  charcoalStoveFn(ev) {
    if (ev.target.value < 0 ) {
      ev.target.value = ''
    }
    this.setState({
      charcoalStove: ev.target.value
    })
  }

  alcoholStoveFn(ev) {
    if (ev.target.value < 0 ) {
      ev.target.value = ''
    }
    this.setState({
      alcoholStove: ev.target.value
    })
  }

  otherFn(ev) {
    if (ev.target.value < 0) {
      ev.target.value = ''
    }
    this.setState({
      other: ev.target.value
    })
  }

  urificationFacilitiesFn(ev) {
    if (ev.target.value === 0) {
      this.setState({
        windSwitch: false,
      });
    } else {
      this.setState({
        windSwitch: true
      });
    }
    this.setState({
      purificationFacilities: ev.target.value,
    });
  }


  purificationChange(ev) {
    this.setState({
      brands: ev.target.value,
    })
  }

  modelonChange(ev) {
    this.setState({
      model: ev.target.value,
    })
  }


  water(ev) {
    this.setState({
      waterSeparator: ev.target.value,
    });
  }

  setup(ev) {
    this.setState({
      greaseTrapSetting: ev.target.value,
    });
  }


  windChange(ev) {
    if (ev.target.value < 0) {
      ev.target.value = ''
    }
    this.setState({
      supportingFanAirVolume: ev.target.value,
    })
  }

  countySelect(value) {
    this.setState({
      defaultCountyValue: value
    })
    if (value === '请选择区县') {
      this.setState({
        areaId: '',
        streetList: []
      })
    } else {
      Http.get(`/api/address/find-pid?parentCodeId=${value}`, {}, (response) => {
        this.setState({
          streetList: response.data.data,
        })
      });
    }
  }

  streetSelect(value) {
    this.setState({
      defaultStreetValue: value
    })
    if (value === '请选择街道') {
      this.setState({
        areaId: '',
        committeeList: []
      })
    } else {
      Http.get(`/api/address/find-pid?parentCodeId=${value}`, {}, (response) => {
        this.setState({
          committeeList: response.data.data
        })
      });
    }
  }

  committee(value) {
    this.setState({
      defaultCommitValue: value
    });
    if (value === '请选择居委会') {
      this.setState({
        areaId: '',
      })
    } else {
      Http.get(`/api/address/find-codeId?codeId=${value}`, {}, (response) => {

        this.setState({
          censusCellCode: response.data.data.codeId,
          areaId: value
        })
      });
    }
  }


  countyRestaurantSelect(value) {
    this.setState({
      defaultRestaurantCountyValue: value,
      defaultRestaurantValue: '请选择街道'
    })
    if (value === '请选择区县') {
      this.setState({
        restaurantAareId: '',
        streetRestaurantList: [],
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
    this.setState({
      defaultRestaurantValue: value
    })
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


  uploadRestaurant(file) {
    let {purificationFileList} = this.state;
    let arr = purificationFileList;
    arr.push({
      url: file.downloadUrl,
      type: PICTYPE.TYPE.RESTAURANT
    });
    this.setState({
      purificationFileList: arr
    });
  }

  removePicture(ev) {
    let arr = this.state.purificationFileList;
    if (ev.id) {
      Http.get(`/api/v1/resource/delete-id?id=${ev.id}`, {}, (response) => {
        if (response.data.success) {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].url == ev.url) {
              arr.splice(arr.indexOf(arr[i]), 1);
              break;
            }
          }
        }
      });
    } else {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].url.split('/')[arr[i].url.split('/').length - 1] == ev.response.key) {
          arr.splice(arr.indexOf(arr[i]), 1);
          break;
        }
      }
    }
    this.setState({
      purificationFileList: arr
    })
  }

  remove(value){
    let arr = this.state.purificationFileList;
    if(value.id){
      Http.get(`/api/v1/resource/delete-id?id=${value.id}`, {}, (response) => {
        if (response.data.success) {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].url == value.url) {
              arr.splice(arr.indexOf(arr[i]), 1);
              break;
            }
          }
          this.setState({
            purificationFileList: arr
          })
        }
      });
    }else{
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].url.split('/')[arr[i].url.split('/').length - 1] == value.response.key) {
          arr.splice(arr.indexOf(arr[i]), 1);
          break;
        }
      }
      this.setState({
        purificationFileList: arr
      })
    }
    
  }

  submit() {
    console.log(mainStore.enterpriseDetails);
    let {
      companyName, legalRepresentative, restaurantName, socialCreditCode, contactName, censusCellCode, organizationCode, operatingStatus, menuId, contactPhone, equalsAddress, address, restaurantSeats, purificationFileList, restaurantNameFileList,
      yearOperation, averageDailyPassengerFlow, averageMonthlyConsumptionOfEdibleOil, kitchenStove, businessHours, neighborhoodNumber, location,
      gasStoves, inductionCooker, charcoalStove, alcoholStove, other, areaId, restaurantAareId, restaurantAddress, phoneType,
      purificationFacilities, onlineMonitoring, companyId, brands, waterSeparator, greaseTrapSetting, model, processingEfficiency, supportingFanAirVolume, monthlyUsageFuel, fuelType, monthlyAverageWaterConsumption, dailyCookingTime, businessArea, dayOperation, environmentalProcedures
      ,addressSwitch,lasttime,windSwitch,
    }
      = this.state;

      // if (!localStorage.getItem('trapeze')) {
      //   message.warning('定位失败', 4);
      //   return;
      // }
    
    let p1 = JSON.parse(localStorage.getItem('trapeze'));
    let index = '';
    let company = this.state.restaurantAddress;
    let restaurant = this.state.address;
    // console.log(addressSwitch);
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
        }
      })
    })
    let lng = localStorage.getItem('apk');
    let lat = localStorage.getItem('abk');

    if (!companyName) {
      message.warning('请输入企业名称', 4);
    } else if (!restaurantName) {
      message.warning('请输入餐厅名称', 4);
    } else if (!environmentalProcedures) {
      message.warning('请选择环保手续', 4);
    } else if (!legalRepresentative) {
      message.warning('请输入法人代表', 4);
    } else if (!organizationCode & !socialCreditCode) {
      message.warning('请输入组织机构代码或社会信用代码', 4);
    } else if (!areaId) {
      message.warning('请选择注册区县,街道', 4);
    } else if (!address) {
      message.warning('请输入注册地址', 4);
    } else if (!equalsAddress && !restaurantAareId) {
      message.warning('请选择餐厅区县,街道', 4);
    } else if (!equalsAddress && !restaurantAddress) {
      message.warning('请输入餐厅地址', 4);
    } else if (neighborhoodNumber.length !== 3) {
      message.warning('请输入三位数的街坊号', 4);
    } else if (!location) {
      message.warning('请选择所在位置', 4);
    } else if (!contactName) {
      message.warning('请输入联系人姓名', 4);
    } else if (phoneType == 1 && (!contactPhone || !(/^1[3|4|5|8][0-9]\d{4,8}$/.test(contactPhone)))) {
      message.warning('请输入正确的联系方式', 4);
    } else if (phoneType == 2 && (!contactPhone || contactPhone.length != 8)) {
      message.warning('请输入正确的联系方式', 4);
    } else if (!menuId) {
      message.warning('请选择菜系', 4);
    } else if (!restaurantSeats) {
      message.warning('请选择餐厅座位数', 4);
    } else if (!operatingStatus) {
      message.warning('请选择运行状态', 4);
    } else if (!purificationFileList || purificationFileList.length === 0) {
      message.warning('请上传餐厅外部照片', 4);
    } else if (purificationFileList.length > 3) {
      message.warning('最多只能上传1-3张图片', 4);
    } else if (!businessHours || businessHours.length === 0) {
      message.warning('请选择营业时段', 4);
    } else if (!yearOperation) {
      message.warning('请输入年运营时间', 4);
    } else if (!dayOperation) {
      message.warning('请输入日运营时间', 4);
    } else if (!monthlyAverageWaterConsumption) {
      message.warning('请输入月平均用水量', 4);
    } else if (!averageDailyPassengerFlow) {
      message.warning('请输入平均日客流', 4);
    } else if (!dailyCookingTime) {
      message.warning('请输入日集中烹饪时间', 4);
    } else if (!businessArea) {
      message.warning('请输入营业面积', 4);
    } else if (!averageMonthlyConsumptionOfEdibleOil) {
      message.warning('请输入食用油平均月使用量', 4);
    } else if (!kitchenStove) {
      message.warning('请输入厨房灶头', 4);
    } else if (!gasStoves && !inductionCooker && !charcoalStove && !alcoholStove && !other) {
      message.warning('就餐区域灶头至少输入一个', 4);
    } else {
      let params = {
        lng:lng?lng:'',
        lat:lat?lat:'',
        id: companyId,
        adminId:mainStore.enterpriseDetails.authorId? '':mainStore.authUser.id,
        role: mainStore.authUser.authorId? '':mainStore.authUser.role,
        companyName,
        legalRepresentative,
        restaurantName,
        socialCreditCode,
        address,
        contactName,
        censusCellCode,
        equalsAddress,
        restaurantSeats,
        menuId,
        neighborhoodNumber,
        location,
        yearOperation,
        averageDailyPassengerFlow,
        averageMonthlyConsumptionOfEdibleOil,
        kitchenStove,
        gasStoves:gasStoves===""?0:(gasStoves===undefined?0:gasStoves),
        inductionCooker:inductionCooker===''?0:(inductionCooker===undefined?0:inductionCooker),
        charcoalStove:charcoalStove===''?0:(charcoalStove===undefined?0:charcoalStove),
        operatingStatus,
        alcoholStove:alcoholStove===''?0:(alcoholStove===undefined?0:alcoholStove),
        organizationCode:organizationCode?organizationCode:'',
        other:other===''?0:(other===undefined?0:other),
        businessHours: businessHours.join(),
        purificationFacilities,
        onlineMonitoring,
        areaId,
        brands:windSwitch===true?(brands?brands:''):'',
        waterSeparator,
        greaseTrapSetting,
        model:windSwitch===true?(model?model:''):'',
        processingEfficiency:processingEfficiency?processingEfficiency:'',
        supportingFanAirVolume:supportingFanAirVolume===''?0:(supportingFanAirVolume===undefined?0:supportingFanAirVolume),
        monthlyUsageFuel,
        fuelType,
        monthlyAverageWaterConsumption,
        dailyCookingTime,
        businessArea,
        dayOperation,
        environmentalProcedures,
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
     console.log(params);
      Http.post(`/api/companyInfo/update-obj`, params, async (response) => {
            if (response.data.success) {
              const upload = async (obj) => {
                return new Promise((resolve) => {
                  Http.post(`/api/v1/resource/update-obj`, obj, (response) => {
                    resolve(response);
                  });
                });
              };
              const res = [];
              for (let i = 0; i < purificationFileList.length; i++) {
                purificationFileList[i].resourceId = companyId;
                res.push(await upload(purificationFileList[i]));
              }
              message.info('修改成功',4);
              localStorage.removeItem('apk');
              this.props.history.push(`/v1/${this.state.pathname}/company-list`);
            } else {
              message.error(response.data.data);
            }
          });
      // if(lasttime===1){
      //   console.log(11111);
      //   Http.post(`/api/companyInfo/update-obj`, params, async (response) => {
      //     console.log(response);
      //     if (response.data.success) {
      //       const upload = async (obj) => {
      //         return new Promise((resolve) => {
      //           Http.post(`/api/v1/resource/update-obj`, obj, (response) => {
      //             resolve(response);
      //           });
      //         });
      //       };
      //       const res = [];
      //       for (let i = 0; i < purificationFileList.length; i++) {
      //         purificationFileList[i].resourceId = companyId;
      //         res.push(await upload(purificationFileList[i]));
      //       }
      //       message.info('修改成功',4);
      //       localStorage.removeItem("trapeze");
      //       localStorage.removeItem("flag");
      //       this.props.history.push(`/v1/${this.state.pathname}/company-list`);
      //     } else {
      //       message.error(response.data.data);
      //     }
      //   });
      // }else{
      //   setTimeout(() => {
      //     if (equalsAddress === 0) {
      //       params.restaurantAddress = restaurantAddress;
      //       params.restaurantAareId = restaurantAareId;
      //     } else {
      //       params.restaurantAddress = address;
      //       params.restaurantAareId = areaId;
      //     }
    
      //     if (phoneType === 1) {
      //       params.contactPhone = contactPhone;
      //     } else {
      //       params.contactPhone = `021-${contactPhone}`;
      //     }
      //     // console.log(localStorage.getItem('flag'));
      //     if(lasttime===0 && localStorage.getItem('flag') === 'true'){
      //       console.log(22222);
      //       Http.post(`/api/companyInfo/update-obj`, params, async (response) => {
      //         console.log(response);
      //         if (response.data.success) {
      //           const upload = async (obj) => {
      //             return new Promise((resolve) => {
      //               Http.post(`/api/v1/resource/update-obj`, obj, (response) => {
      //                 resolve(response);
      //               });
      //             });
      //           };
      //           const res = [];
      //           for (let i = 0; i < purificationFileList.length; i++) {
      //             purificationFileList[i].resourceId = companyId;
      //             res.push(await upload(purificationFileList[i]));
      //           }
      //           message.info('修改成功');
      //           localStorage.removeItem("trapeze");
      //           localStorage.removeItem("flag");
      //           this.props.history.push(`/v1/${this.state.pathname}/company-list`);
      //         }
      //       });
      //     }else{
      //       message.warning('您的餐厅地址与当前位置太远，请重新填写',4);
      //     }
      //   }, 500);
      // }

    }
  }

  getBack() {
    mainStore.enterpriseDetails = null;
    this.props.history.goBack();
  }

  render() {
    let {
      companyName, legalRepresentative, restaurantName, socialCreditCode, contactName, contactPhone, menuId, menuList, equalsAddress, address, restaurantSeats, censusCellCode, organizationCode, phoneType, defaultRestaurantCommitteeValue,
      yearOperation, averageDailyPassengerFlow, averageMonthlyConsumptionOfEdibleOil, kitchenStove, businessHours, countyList, defaultCountyValue, defaultStreetValue, streetList, countRestaurantList, streetRestaurantList, operatingStatus,
      gasStoves, inductionCooker, charcoalStove, alcoholStove, other, defaultRestaurantCountyValue, defaultRestaurantValue, restaurantAddress, defaultCommitValue, location,
      purificationFacilities, purificationFileList, monthlyUsageFuel, windSwitch, brands, fuelType, model, neighborhoodNumber, supportingFanAirVolume, monthlyAverageWaterConsumption, dailyCookingTime, businessArea, dayOperation, environmentalProcedures, committeeList,
      committeeNextList, quarters, kgswitch,lasttime,addressSwitch
    }
      = this.state;
      // console.log(purificationFileList);

    const countyOptions = countyList.map(count => <Option key={count.codeId}
                                                          value={count.codeId}>{count.positionName}</Option>);


    const countRestaurantOptions = countRestaurantList.map(count => <Option key={count.codeId}
                                                                            value={count.codeId}>{count.positionName}</Option>);


    const committeeOptions = committeeList.map(committee => <Option key={committee.codeId}
                                                                    value={committee.codeId}>{committee.positionName}</Option>);

    const committeeNextOptions = committeeNextList.map(committeeNext => <Option
      key={committeeNext.codeId} value={committeeNext.codeId}>{committeeNext.positionName}</Option>);

    const streetOptions = streetList.map(street => <Option key={street.codeId}
                                                           value={street.codeId}>{street.positionName}</Option>);

    const streetRestaurantOptions = streetRestaurantList.map(street => <Option key={street.codeId}
                                                                               value={street.codeId}>{street.positionName}</Option>);


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
              <Button size={this.state.size} onClick={this.getBack.bind(this)} style={{float: 'right'}}
                      type='danger'>返回</Button>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>企业名称</Col>
            <Col span={8}>
              <Input placeholder="请输入企业名称" defaultValue={companyName} onChange={this.company.bind(this)}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>法人代表</Col>
            <Col span={8}>
              <Input placeholder="请输入法人代表" defaultValue={legalRepresentative}
                     onChange={this.legalRepresentativeFn.bind(this)}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>餐厅名称</Col>
            <Col span={8}>
              <Input placeholder="请输入餐厅名称" defaultValue={restaurantName} onChange={this.restaurant.bind(this)}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>社会信用代码</Col>
            <Col span={8}>
              <Input placeholder="请输入社会信用代码" type='number' defaultValue={socialCreditCode}
                     onChange={this.social.bind(this)}/>
            </Col>
          </Row>
          <br/>
          {/* <Row>
            <Col span={4}>普查小区代码</Col>
            <Col span={8}>
              <Input placeholder="请输入普查小区代码" type='number' defaultValue={censusCellCode}
                     onChange={this.censusCellCodeFn.bind(this)}/>
            </Col>
          </Row>
          <br/> */}
          <Row>
            <Col span={4}>组织机构代码</Col>
            <Col span={8}>
              <Input placeholder="请输入组织机构代码" type='number' defaultValue={organizationCode}
                     onChange={this.organizationCodeFn.bind(this)}/>
            </Col>
          </Row>
          <br/>
          <Row style={{position: 'relative'}}>
            <Col span={4}>注册地址</Col>
            <Col span={8}>
              <Select value={defaultCountyValue}
                      style={{width: 120, margin: '5px'}}
                      onChange={this.countySelect.bind(this)}
              >
                <Option value="请选择区县">请选择区县</Option>
                {
                  countyOptions
                }
              </Select>
              <Select value={defaultStreetValue}
                      style={{width: 120, margin: '5px'}}
                      onChange={this.streetSelect.bind(this)}
              >
                <Option value="请选择街道">请选择街道</Option>
                {
                  streetOptions
                }
              </Select>
              <Select value={defaultCommitValue}
                      style={{width: 130, margin: '5px'}}
                      onChange={this.committee.bind(this)}>
                <Option value="请选择居委会">请选择居委会</Option>
                {
                  committeeOptions
                }
              </Select>
              {/* <Input onChange={this.partFn.bind(this)} value={village} disabled={true}/> */}
            </Col>
            <Col span={7} offset={4}>
              <div id="container"
                   style={{
                     width: '100%',
                     height: '400px',
                     position: 'absolute',
                     right: 0,
                     top: 0,
                     display: kgswitch ? 'block' : 'none'
                   }}></div>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}></Col>
            <Col span={8}>
              <Input placeholder="注册地址" defaultValue={address} onChange={this.addressFn.bind(this)}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}></Col>
            <Col span={7}>
              <label htmlFor="" style={{marginRight: "10px"}}>是否使用上一次的地址</label>
              <RadioGroup onChange={this.lastaddress.bind(this)} defaultValue={lasttime}>
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </RadioGroup>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}></Col>
            <Col span={8}>
              <label htmlFor="" style={{marginRight: "10px"}}>餐厅地址是否与注册地址一致</label>
              <RadioGroup onChange={this.addressValueChange.bind(this)} defaultValue={equalsAddress}
                          style={{margin: '5px'}}>
                <Radio value={1} name={'equalsAddress'}>是</Radio>
                <Radio value={0} name={'equalsAddress'}>否</Radio>
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
                    <Select value={defaultRestaurantCountyValue}
                            style={{width: 120, margin: '5px'}}
                            onChange={this.countyRestaurantSelect.bind(this)}
                    >
                      <Option value="请选择区县">请选择区县</Option>
                      {
                        countRestaurantOptions
                      }
                    </Select>
                    <Select value={defaultRestaurantValue}
                            style={{width: 120, margin: '5px'}}
                            onChange={this.streetRestaurantSelect.bind(this)}
                    >
                      <Option value="请选择街道">请选择街道</Option>
                      {
                        streetRestaurantOptions
                      }
                    </Select>
                    <Select value={defaultRestaurantCommitteeValue} style={{width: 130, margin: '5px'}}
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
                    <Input placeholder="餐厅地址" defaultValue={restaurantAddress}
                           onChange={this.restaurantAddressChange.bind(this)}/>
                  </Col>
                </Row>
                <br/>
              </div> : ''
          }
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
              <Input placeholder="请输入街坊号" defaultValue={neighborhoodNumber}
                     onChange={this.neighborhoodChange.bind(this)}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>所在位置</Col>
            <Col span={8}>
              <Select defaultValue={location} style={{width: 150}} onChange={this.locationChange.bind(this)}>
                <Option value="请选择所在位置">请选择所在位置</Option>
                <Option value="邻近居民楼">邻近居民楼</Option>
                <Option value="商业楼宇内">商业楼宇内</Option>
                <Option value="临街独立店铺">临街独立店铺</Option>
              </Select>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>联系人姓名</Col>
            <Col span={8}>
              <Input placeholder="请输入联系人姓名" defaultValue={contactName} onChange={this.contactNameFn.bind(this)}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>联系方式</Col>
            <Col span={4}>
              <RadioGroup onChange={this.phoneChange.bind(this)} value={phoneType}>
                <Radio value={1}>移动电话</Radio>
                <Radio value={2}>固定电话</Radio>
              </RadioGroup>
            </Col>
          </Row>
          <br/>
          <Row>
            {
              phoneType == 1 ?
                <Col span={8} offset={4}>
                  <Input placeholder="请输入联系方式" defaultValue={contactPhone} onChange={this.contactPhoneFn.bind(this)}/>
                </Col> : <Col span={8} offset={4}>
                  <InputGroup compact>
                    <Input style={{width: '20%'}} value="021-" disabled/>
                    <Input style={{width: '80%'}} defaultValue={contactPhone}
                           onChange={this.contactPhoneFn.bind(this)}/>
                  </InputGroup>
                </Col>
            }

          </Row>
          <br/>
          <Row>
            <Col span={4}>餐饮类型（单选）</Col>
            <Col span={8}>
              <RadioGroup options={menuList} defaultValue={menuId} onChange={this.menusChange.bind(this)}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>环保手续</Col>
            <Col span={8}>
              <Select defaultValue={environmentalProcedures} style={{width: 150}}
                      onChange={this.environmentalProceduresFn.bind(this)}>
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
              <Input placeholder="请输入" style={{width: 100}} type="number" defaultValue={restaurantSeats}
                     onChange={this.restaurantChange.bind(this)}
              />个
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>运行状态</Col>
            <Col span={8}>
              <Select defaultValue={operatingStatus} style={{width: 120}} onChange={this.verb.bind(this)}>
                <Option value="请选择运行状态">请选择</Option>
                <Option value="运行">运行</Option>
                <Option value="停业">停业</Option>
                <Option value="关闭">关闭</Option>
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
                    <Icon type="upload"/> 图片
                  </Button>
                }
                fileList={purificationFileList}
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
          {/* <br/>
          <Row>
              {
                purificationFileList.map(value=>{
                  return(
                    <Col span={4}>
                      <img src={value.url} style={{width: '100px', height: '100px'}}/>
                      <br/>
                      <Button onClick={this.remove.bind(this,value)} size='small'>删除</Button>
                    </Col>
                  )
                })
              }
          </Row> */}
          <br/>
          <Row>
            <Col span={12}>
              {/* <img src={this.state.url} style={{width: '200px', height: '200px'}}/> */}
            </Col>
            <Col span={12}>
              {
                this.state.dataUri ?
                  <img src={this.state.dataUri}/> : ''
              }
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}><h4
              style={{fontWeight: 700, color: '#1890ff', lineHeight: '40px', fontSize: '18px'}}>生产和投入</h4></Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>营业时段（多选）</Col>
            <Col span={8}>
              <Checkbox.Group style={{width: '100%'}} defaultValue={businessHours}
                              onChange={this.timeChange.bind(this)}>
                <Row>
                  <Col span={8}><Checkbox value="24小时">24小时</Checkbox></Col>
                  <Col span={8}><Checkbox value="早市">早市</Checkbox></Col>
                  <Col span={8}><Checkbox value="午市">午市</Checkbox></Col>
                  <Col span={8}><Checkbox value="晚市">晚市</Checkbox></Col>
                  <Col span={8}><Checkbox value="宵夜">宵夜</Checkbox></Col>
                </Row>
              </Checkbox.Group>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>日运营时间/小时</Col>
            <Col span={8}>
              <Input placeholder="请输入日运营时间" type="number" defaultValue={dayOperation}
                     onChange={this.dayOperationFn.bind(this)}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>年运营时间/天</Col>
            <Col span={8}>
              <Input placeholder="请输入年运营时间" type="number" defaultValue={yearOperation}
                     onChange={this.yearOperationFn.bind(this)}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>日集中烹饪时间/小时</Col>
            <Col span={8}>
              <Input placeholder="请输入日集中烹饪" type="number" defaultValue={dailyCookingTime}
                     onChange={this.dailyCookingTimeFn.bind(this)}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>平均日客流/人</Col>
            <Col span={8}>
              <Input placeholder="请输入平均日客流" type="number" defaultValue={averageDailyPassengerFlow}
                     onChange={this.averageFn.bind(this)}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>营业面积/平方米</Col>
            <Col span={8}>
              <Input placeholder="请输入营业面积" type="number" defaultValue={businessArea}
                     onChange={this.businessAreaFn.bind(this)}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>食用油平均月使用量/kg</Col>
            <Col span={8}>
              <Input placeholder="请输入食用油平均月使用量" type="number" defaultValue={averageMonthlyConsumptionOfEdibleOil}
                     onChange={this.averageMonthlyFn.bind(this)}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>月平均用水量/吨</Col>
            <Col span={8}>
              <Input placeholder="请输入月平均用水量" type="number" defaultValue={monthlyAverageWaterConsumption}
                     onChange={this.monthlyAverageWaterConsumptionFn.bind(this)}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>厨房灶头/个</Col>
            <Col span={8}>
              <Input placeholder="请输入厨房灶头" type="number" defaultValue={kitchenStove}
                     onChange={this.kitchenStoveFn.bind(this)}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>燃料类型</Col>
            <Col span={8}>
              <Select style={{width: 200}} onChange={this.handleChange.bind(this)} value={fuelType}>
                <Option value="天然气">天然气</Option>
                <Option value="液化气">液化气</Option>
                <Option value="其他">其他</Option>
              </Select>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>燃料月使用量/m³</Col>
            <Col span={8}>
              <Input placeholder="请输入" type="number" onChange={this.fuelMonthlyFn.bind(this)} defaultValue={monthlyUsageFuel}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}><h4
              style={{fontWeight: 700, color: '#1890ff', lineHeight: '40px', fontSize: '18px'}}>就餐区域灶头/个</h4></Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>燃气灶</Col>
            <Col span={8}>
              <Input placeholder="请输入数量" defaultValue={gasStoves} style={{width: 200}} type="number"
                     onChange={this.gasStovesFn.bind(this)}/>个
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>电磁炉</Col>
            <Col span={8}>
              <Input placeholder="请输入电磁炉数量" defaultValue={inductionCooker} style={{width: 200}} type="number"
                     onChange={this.inductionCookerFn.bind(this)}/>个
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>炭火炉</Col>
            <Col span={8}>
              <Input placeholder="请输入炭火炉数量" defaultValue={charcoalStove} style={{width: 200}} type="number"
                     onChange={this.charcoalStoveFn.bind(this)}/>个
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>酒精炉</Col>
            <Col span={8}>
              <Input placeholder="请输入酒精炉数量" defaultValue={alcoholStove} style={{width: 200}} type="number"
                     onChange={this.alcoholStoveFn.bind(this)}/>个
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>其他</Col>
            <Col span={8}>
              <Input placeholder="请输入其他数量" defaultValue={other} style={{width: 200}} type="number"
                     onChange={this.otherFn.bind(this)}/>个
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}><h4
              style={{fontWeight: 700, color: '#1890ff', lineHeight: '40px', fontSize: '18px'}}>净化设施建设和运行情况</h4></Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>净化设施</Col>
            <Col span={8}>
              <RadioGroup onChange={this.urificationFacilitiesFn.bind(this)} value={purificationFacilities}>
                <Radio value={1}>已安装</Radio>
                <Radio value={0}>未安装</Radio>
              </RadioGroup>
            </Col>
          </Row>
          <br/>
          {
            windSwitch ?
              <div>
                <Row>
                  <Col span={4}></Col>
                  <Col span={6}>
                    <label style={{marginRight: '40px'}}>品牌:</label>
                    <Input placeholder="请输入品牌" style={{width: 200}}
                           onChange={this.purificationChange.bind(this)}
                           defaultValue={brands}
                    />
                  </Col>
                </Row>
                <br/>
                <Row>
                  <Col span={4}></Col>
                  <Col span={6}>
                    <label style={{marginRight: '40px'}}>型号:</label>
                    <Input placeholder="请输入型号" style={{width: 200}}
                           onChange={this.modelonChange.bind(this)}
                           defaultValue={model}
                    />
                  </Col>
                </Row>
                <br/>
                <Row>
                  <Col span={4}></Col>
                  <Col span={8}>
                    <label style={{marginRight: '10px'}}>配套风机风量:</label>
                    <Input placeholder="请输入" style={{width: 100}} type="number"
                           onChange={this.windChange.bind(this)}
                           defaultValue={supportingFanAirVolume}
                    />(m3/h)
                  </Col>
                </Row>
              </div>
              : ''
          }
          <br/>
          <Row>
            <Col span={4}>油水分离器</Col>
            <Col span={8}>
              <RadioGroup onChange={this.water.bind(this)} value={this.state.waterSeparator}>
                <Radio value={1}>已设置</Radio>
                <Radio value={0}>未设置</Radio>
              </RadioGroup>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>隔油池设置情况</Col>
            <Col span={8}>
              <RadioGroup onChange={this.setup.bind(this)} value={this.state.greaseTrapSetting}>
                <Radio value={'已设置'}>已设置</Radio>
                <Radio value={'未设置'}>未设置</Radio>
              </RadioGroup>
            </Col>
          </Row>
          <br/>
          <Row style={{marginTop: 16}}>
            <Col span={2} offset={11}>
              <Button type="primary" size={this.state.size} onClick={this.submit.bind(this)}
                      style={{float: 'left'}}>提交</Button>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}


export default Details;
