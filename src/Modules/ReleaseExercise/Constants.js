
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
