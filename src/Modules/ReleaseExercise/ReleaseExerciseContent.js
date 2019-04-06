import React from 'react';
import moment from 'moment';
import { COLUMNS } from './Constants';
import { Table, Layout } from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/chart/line';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const { Content } = Layout;
const BODY_MARGIN_STYLE = {
  margin: '10px'
}

class ReleaseExerciseContent extends React.Component {
  constructor(props) {
    super(props);
    this.myChart = null;
  }

  componentDidMount() {
    this.myChart = echarts.init(document.getElementById('main'));
    console.log('图标初始化数据:', this.props.lineOption)
    this.myChart.setOption(this.props.lineOption);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.lineOption.series !== nextProps.lineOption.series) {
      console.log('图标数据变更:', nextProps.lineOption);
      this.myChart.clear();
      this.myChart.setOption(nextProps.lineOption, true);
    }
  }


  renderTable = () => {
    return (
      <Table
        bordered
        rowKey={record => `${record.area_id}_${record.rec_date}_${record.publish_count}`}
        style={BODY_MARGIN_STYLE}
        loading={false}
        columns={COLUMNS}
        dataSource={this.props.data}
        size="small"
      />
    )
  }

  renderLineChart = () => {
    return (
      <div style={{ height: '45%' }} id='main' />
    )
  }

  render() {
    return (
      <Content>
        {this.renderLineChart()}
        {this.renderTable()}
      </Content>
    );
  }
}
export default ReleaseExerciseContent;