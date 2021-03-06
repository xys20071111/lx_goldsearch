import React from 'react';
import moment from 'moment';
import { GET_COLUMNS } from './Constants';
import { Table, Layout, Spin } from 'antd';
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
    if (this.props.lineOption.series.length === 0) {
      this.myChart.clear();
    } else {
      this.myChart.setOption(this.props.lineOption);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.lineOption !== nextProps.lineOption) {
      console.log('图标数据变更:', nextProps.lineOption);
      this.myChart.clear();
      this.myChart.setOption(nextProps.lineOption, true);
    }
  }

  itemRender = (current, type, originalElement) => {
    if (type === 'prev') {
      return <span>上一页</span>;
    } if (type === 'next') {
      return <span>下一页</span>;
    }
    return originalElement;
  }


  renderTable = () => {
    const { keyValue } = this.props;
    return (
      <Table
        bordered
        rowKey={record => `${record.area_id}_${record.rec_date}_${record.publish_count}`}
        style={BODY_MARGIN_STYLE}
        loading={false}
        columns={GET_COLUMNS(keyValue)}
        dataSource={this.props.data}
        size="small"
        pagination={{
          showSizeChanger: true,
          itemRender: this.itemRender,
          pageSizeOptions: ['5','10','20','30','40'],
        }}
      />
    )
  }

  renderLineChart = () => {
    const { series = [] } = this.props.lineOption;
    return (
      <div className='echart_main'>
        {series.length === 0 ? <div className='noData'>无数据</div> : null}
        <div id='main' className='echart' />
      </div>
    )
  }

  render() {
    return (
      <Spin spinning={false}>
        <Content>
          {this.renderLineChart()}
          {this.renderTable()}
        </Content>
      </Spin>
    );
  }
}
export default ReleaseExerciseContent;