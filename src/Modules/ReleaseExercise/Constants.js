import _ from 'lodash';


const COLUMNS = [
{
  title: '发布地区',
  width: '30%',
  align: 'center',
  dataIndex: 'area_id'
}, {
  title: '发布次数(可排序)',
  width: '30%',
  align: 'center',
  dataIndex: 'publish_count',
  sorter: (a, b) => a.publish_count - b.publish_count
}, {
  title: '发布日期',
  width: '30%',
  align: 'center',
  dataIndex: 'rec_date',
  sorter: (a, b) => a.rec_date - b.rec_date,
  render: (text) => {
    const lmpText = text.toString();
    const year = lmpText.substring(0,4);
    const month = lmpText.substring(5,6) < 10 ? `0${lmpText.substring(5,6)}` : lmpText.substring(5,6);
    const day = lmpText.substring(7,8) < 10 ? `0${lmpText.substring(7,8)}` : lmpText.substring(7,8);
    return `${year}-${month}-${day}`;
  }
}];

export const GET_COLUMNS = (keyvalue) => {
  return COLUMNS.map(col => {
    if (col.dataIndex === 'area_id') {
      col.render = (text, row, index) => {
        return keyvalue[text];
      }
    }
    return col;
  })
}


export const lineOption = {
  tooltip: {
    show: true,
    confine:true,
    trigger: 'axis'
  },
  legend: {
    left: 'center',
    data:[],
    selected: {}
  },
  grid: {
    left: '1%',
    right: '1%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    axisLabel: {
      rotate: 35,
      interval: 0
    },
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: []
};



/** 获取七天以前的日期 */
export const getBeforeDay = (day) => {
  const today = new Date();
  const targetday_milliseconds = today.getTime() + 1000*60*60*24*day;
  today.setTime(targetday_milliseconds); //注意，这行是关键代码
  const tYear = today.getFullYear();
  let tMonth = today.getMonth();
  let tDate = today.getDate();
  tMonth = doHandleMonth(tMonth + 1);
  tDate = doHandleMonth(tDate);
  return `${tYear}-${tMonth}-${tDate}`;
}
const doHandleMonth = (month) => {
  let m = month;
  if (month.toString().length === 1) {
   m = `0${month}`;
  }
  return m;
}
const now = new Date(); //当前日期
var nowMonth = now.getMonth(); //当前月
let nowYear = now.getYear(); //当前年
nowYear += (nowYear < 2000) ? 1900 : 0;

const lastMonthDate = new Date(); //上月日期
lastMonthDate.setDate(1);
lastMonthDate.setMonth(lastMonthDate.getMonth()-1);
const lastMonth = lastMonthDate.getMonth();


const formatDate = (date) => {
  const myyear = date.getFullYear();
  let mymonth = date.getMonth() + 1;
  let myweekday = date.getDate();

  if(mymonth < 10) {
    mymonth = `0${mymonth}`;
  }
  if(myweekday < 10) {
    myweekday = `0${myweekday}`;
  }
  return `${myyear}-${mymonth}-${myweekday}`;
}
//获得某月的天数
const getMonthDays = (myMonth) => {
  const monthStartDate = new Date(nowYear, myMonth, 1);
  const monthEndDate = new Date(nowYear, myMonth + 1, 1);
  const days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
  return days;
}
//获得上月开始时间
export const getLastMonthStartDate = () => {
  const lastMonthStartDate = new Date(nowYear, lastMonth, 1);
  return formatDate(lastMonthStartDate);
}
//获得上月结束时间
export const getLastMonthEndDate = () => {
  const lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
  return formatDate(lastMonthEndDate);
}
//获得本月的开始日期
export const getMonthStartDate = () => {
  const monthStartDate = new Date(nowYear, nowMonth, 1);
  return formatDate(monthStartDate);
}

/**获取X轴数据 */
export const getXAxisData = (data = []) => {
  const length = data.length;
  const retArray = [];
  for (let x = 0; x < length; x++) {
    if (retArray.indexOf(data[x].rec_date) === -1) {
      retArray.push(data[x].rec_date);
    }
  }
  console.log('get xAxis data:', retArray);
  return retArray;
}

/**获取图标数据 */
export const getSeries = (data = [], keyvalue = {}) => {
  /* 先将所有的数据转换为某个区县下的对象，*/
  const length = data.length;
  const seriesData = {};
  for (let x = 0; x < length; x++) {
    if (seriesData[data[x].area_id]) {
      seriesData[data[x].area_id].data.push(data[x].publish_count);
    } else {
      seriesData[data[x].area_id] = {
        name: keyvalue.get(data[x].area_id.toString()),
        area_id: data[x].area_id,
        type: 'line',
        data: [data[x].publish_count]
      }
    }
  }

  // 对象转数组
  console.log('get Series data:', seriesData);
  return seriesData;
}

/**获取图例 */
export const getLegend = (data = [], keyvalue = {}) => {
  const seriesObjectData = getSeries(data, keyvalue);
  const legend = Object.keys(seriesObjectData).map(item => keyvalue.get(item.toString()));
  console.log('get legend:', legend);
  return legend && legend.map(leg => {
    return { name: leg, icon:'rect' }
  });
}

/**统计全国的数据 */
export const getAllQG = (data = []) => {
  const qgData = _.groupBy(data, 'rec_date');
  const retData = Object.keys(qgData).map(key => {
    return {
      [key]: _.sumBy(qgData[key], item => item.publish_count)
    }
  })
  return retData;
}
