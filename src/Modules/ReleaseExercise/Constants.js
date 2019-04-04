
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
  title: {
    text: '折线图堆叠'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data:['邮件营销']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: false
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['2018-03-01','2018-03-02','周三','周四','周五','周六','周日']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name:'发布练习次数',
      type:'line',
      stack: '总量',
      data:[120, 132, 101, 134, 90, 230, 210]
    }
  ]
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
  console.log('get search data:', retArray);
  return retArray;
}