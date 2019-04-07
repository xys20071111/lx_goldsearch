
const COLUMNS = [
{
  title: '发布地区',
  width: '10%',
  align: 'center',
  dataIndex: 'area_id'
}, {
  title: '发布日期',
  width: '70%',
  align: 'left',
  dataIndex: 'rec_date'
}, {
  title: '发布次数',
  width: '20%',
  align: 'center',
  dataIndex: 'publish_count'
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
    data:[]
  },
  noDataLoadingOption: {
    text: '暂无数据',
    effect: 'bubble',
    effectOption: {
      effect: {
        n: 0
      }
    }
  },
  axisLabel: {  
   interval:0,  
   rotate:40  
  },
  grid: {
    left: '1%',
    right: '1%',
    bottom: '3%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
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
        stack: '总量',
        data: [data[x].publish_count]
      }
    }
  }

  // 对象转数组
  console.log('get Series data:', seriesData);
  return seriesData;
}


export const getLegend = (data = [], keyvalue = {}) => {
  const seriesObjectData = getSeries(data, keyvalue);
  const legend = Object.keys(seriesObjectData).map(item => keyvalue.get(item.toString()));
  console.log('get legend:', legend);
  return legend && legend.map(leg => {
    return { name: leg, icon:'rect' }
  });
}

