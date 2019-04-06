
export const COLUMNS = [{
  title: '发布日期',
  width: '80%',
  align: 'left',
  dataIndex: 'rec_date'
}, {
  title: '发布次数',
  width: '20%',
  align: 'center',
  dataIndex: 'publish_count'
}];


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



/** 获取两个日期之间的所有日期 */
const getDate = (datestr) => {
  var temp = datestr.split("-");
  if (temp[1] === '01') {
    temp[0] = parseInt(temp[0],10) - 1;
    temp[1] = '12';
  } else {
    temp[1] = parseInt(temp[1],10) - 1;
  }
  var date = new Date(temp[0], temp[1], temp[2]);
  return date;
}

export const getDiffDate = (start, end) => {
  var startTime = getDate(start);
  var endTime = getDate(end);
  var dateArr = [];
  while ((endTime.getTime() - startTime.getTime()) > 0) {
    var year = startTime.getFullYear();
    var month = startTime.getMonth().toString().length === 1 ? "0" + (parseInt(startTime.getMonth().toString(),10) + 1) : (startTime.getMonth() + 1);
    var day = startTime.getDate().toString().length === 1 ? "0" + startTime.getDate() : startTime.getDate();
    dateArr.push(year + "-" + month + "-" + day);
    startTime.setDate(startTime.getDate() + 1);
  }
  return dateArr;
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

