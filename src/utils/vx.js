var SIGN_REGEXP = /([yMdhsm])(\1*)/g;
var DEFAULT_PATTERN = "yyyy-MM-dd";

var vx = { version: "1.0" };


export const sexObj = { 0: '未知', 1: '男', 2: '女' }
export const sexArr = [{ label: '未知', value: 0 }, { label: '男', value: 1 }, { label: '女', value: 2 }]

export function indexMethod(index) {
  return (index + 1) + (this.pageSize * (this.pageNum));
}

// 是否有属性
vx.hasProp = function (obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};
// 删除属性
vx.deleteProp = function (obj, prop) {
  if (vx.hasProp(obj, prop)) {
    delete obj[prop];
  }
};
// 拷贝属性
vx.copyProps = function (target, source, isCopyAll) {
  isCopyAll = isCopyAll || false;
  if (target && source) {
    for (var p in source) {
      // p is method
      if (typeof source[p] === "function") {
        // do nothing
      } else {
        if (isCopyAll) {
          target[p] = source[p];
        } else {
          if (vx.hasProp(target, p)) {
            target[p] = source[p];
          }
        }
      }
    }
  }
};
// 对比删除属性
vx.compareAndRemoveProps = function (target, source) {
  var newDict = {};
  if (target && source) {
    for (var p in source) {
      // p is method
      if (typeof source[p] === "function") {
        // do nothing
      } else {
        if (vx.hasProp(target, p)) {
          newDict[p] = source[p];
        }
      }
    }
  }
  return newDict;
};
// 获取属性值列表
vx.getPropertyValueList = function (sources, propName) {
  var results = [];
  if (sources) {
    for (var k in sources) {
      var v = sources[k][propName];
      if (v) {
        results.push(v);
      }
    }
  }
  return results;
};
// 判断是否是手机端
vx.isMobile = function () {
  if (!navigator) throw "Not Supported!";
  var sUserAgent = navigator.userAgent.toLowerCase();
  var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
  var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
  var bIsMidp = sUserAgent.match(/midp/i) == "midp";
  var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
  var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
  var bIsAndroid = sUserAgent.match(/android/i) == "android";
  var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
  var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";

  if (
    bIsIpad ||
    bIsIphoneOs ||
    bIsMidp ||
    bIsUc7 ||
    bIsUc ||
    bIsAndroid ||
    bIsCE ||
    bIsWM
  ) {
    return true;
  } else {
    return false;
  }
};

// 是否是图片文件
vx.isImageFile = function (fileName) {
  var regex = new RegExp("(jpeg|png|gif|jpg)$", "i");
  return regex.test(fileName);
};
// 是否是字符串
vx.isString = function (str) {
  return typeof str === "string" && str.constructor === String;
};
// 是否是数字
vx.isNumber = function (obj) {
  return typeof obj === "number" && obj.constructor === Number;
};
// 是否是时间
vx.isDate = function (obj) {
  return typeof obj === "object" && obj.constructor === Date;
};
// 是否是函数
vx.isFunction = function (obj) {
  return typeof obj === "function" && obj.constructor === Function;
};
// 是否是对象
vx.isObject = function (obj) {
  return typeof obj === "object" && obj.constructor === Object;
};


// 获取时间
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}
// 取整时间
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}
// 模板时间
export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

// class添加
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

export function filterParams(params){
  let obj = {}
  for(let key in params){
    if (params[key] && params[key] != 0 && params[key] != '' && params[key] != null) {
      obj[key] = params[key]
    }
  }
  return obj
}

// 可以填写0
export function filterParams2(params){
  let obj = {}
  for(let key in params){
    if (params[key]!=undefined  && params[key] !== '' && params[key] != null) {
      obj[key] = params[key]
    }
  }
  return obj
}

export const ViewerOptions = {
  url: 'data-original',
  toolbar: {
    zoomIn: 4,
    zoomOut: 4,
    oneToOne: 4,
    reset: false,
    prev: 4,
    play: false,
    next: 4,
    rotateLeft: 4,
    rotateRight: 4,
    flipHorizontal: false,
    flipVertical: false,
  },
  zIndex: 9999,
  navbar:false
}
// element-ui里的DateTimePicker组件带快捷选项参数
export const pickerOptions = [
{
  text: '今天',
  onClick(picker) {
    const end = new Date()
    const start = new Date(new Date().toDateString())
    end.setTime(start.getTime())
    picker.$emit('pick', [start, end])
  }
}, {
  text: '最近一周',
  onClick(picker) {
    const end = new Date(new Date().toDateString())
    const start = new Date()
    start.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
    picker.$emit('pick', [start, end])
  }
}, {
  text: '最近一个月',
  onClick(picker) {
    const end = new Date(new Date().toDateString())
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
    picker.$emit('pick', [start, end])
  }
}, {
  text: '最近三个月',
  onClick(picker) {
    const end = new Date(new Date().toDateString())
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
    picker.$emit('pick', [start, end])
  }
}]

// 弹性
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

// 深度拷贝
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  for (const keys in source) {
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = source[keys].constructor === Array ? [] : {}
        targetObj[keys] = deepClone(source[keys])
      } else {
        targetObj[keys] = source[keys]
      }
    }
  }
  return targetObj
}

// 验证手机号码
export function regPhone(phone) {
  return (/^1[3456789]\d{9}$/.test(phone))
}
// 验证邮箱
export function regEmail(email) {
  return (/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(email))
}
// 验证身份证
export function regCard(ID) {
  return (/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(ID))
}

export function getBtnPower(metaValue, btnPower){
  let meta = metaValue;
  if (meta && Object.keys(meta).length) {
    function getArrDifference(arr1, arr2) {
      return arr1.concat(arr2).filter(function (v, i, arr) {
        return arr.indexOf(v) === arr.lastIndexOf(v);
      });
    }
    let arr = getArrDifference(meta.authorizationBtns, meta.needAuthorizationBtns)
    arr.forEach(ele => {
      btnPower[ele] = false
    })
  }
}

// localStorage存储
vx.localStorage = {
  setItem: function (key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  },

  getItem: function (key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      return null;
    }
  },

  removeItem: function (key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  }
};

vx.sessionStorage = {
  setItem: function (key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  },

  getItem: function (key) {
    try {
      return JSON.parse(sessionStorage.getItem(key));
    } catch (e) {
      return null;
    }
  },

  removeItem: function (key) {
    try {
      sessionStorage.removeItem(key);
    } catch (e) {}
  }
};

export default vx;