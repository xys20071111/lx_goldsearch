import React, { Component } from 'react';
import moment from 'moment';
import { array, func } from 'prop-types';
import { Table, message } from 'antd';
import 'moment/locale/zh-cn';
import GoldSearchForm from './GoldSearchForm';
import {
  BODY_MARGIN_STYLE,
  GOLD_SEARCH_URL,
  PAGINATION_STYLE,
  columns
} from './Constants';
moment.locale('zh-cn');

export default class GoldSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      filter: {}
    }
  }
  static propTypes = {
    dataSource: array,
    onhandleGoldSearch: func
  }
  static defaultProps = {
    dataSource: [],
    onhandleGoldSearch: () => {}
  }
  _getUrl = (currentPage, pageSize) => {
    const { filter } = this.state;
    let url = GOLD_SEARCH_URL;
    let params = [];
    for (const key in filter) {
      if (filter[key]) {
        params.push(`${key}=${filter[key]}`);
      }
    }
    params.push(`page_index=${currentPage}`);
    params.push(`page_size=${pageSize}`);
    const retUrl = `${url}?${params.join('&')}`;
    return retUrl;
  }
  queryData = (currentPage = 1, pageSize = 10) => {
    let token = sessionStorage.getItem('token') || undefined;
    if(!token) {
      this.setState({
        loading: false
      }, () => message.error('token 获取失败'));
      return;
    }
    fetch(this._getUrl(currentPage, pageSize), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
        'Accept':'application/json',
        'Authorization': token,
        //'Authorization': 'b6c36f16d85374e7e98da305231ea8d2866aff1a34040bdfc914c4c6beb411d1',
      },
    })
    .then(response => response.json())
    .then(res => {
      let [data,total,msg] = [[], 0, ''];
      if (res.result === 0 && res.data && res.data.stat_data && res.data.stat_data.length > 0) {
        data = res.data.stat_data;
        total = res.data.total;
      } else if (res.result !== 0) {
        msg = res.msg;
      }
      this.setState({
        loading: false,
        data,
        total,
        pageIndex: 1,
        pageSize
      }, () => {if(msg !== '') message.error(res.msg)})
    }).catch(e => {
      this.setState({
        loading: false
      }, () => message.error(`查询失败,失败信息：${e}`))
    })
  }

  searchData = (filter) => {
    this.setState({
      loading: true,
      filter
    }, () => this.queryData());
  }

  itemRender = (current, type, originalElement) => {
    if (type === 'prev') {
      return <span>上一页 </span>;
    } if (type === 'next') {
      return <span> 下一页</span>;
    }
    return originalElement;
  }

  render() {
    const { loading, data, total, pageSize } = this.state;
    return (
      <div>
        <style>{PAGINATION_STYLE}</style>
        <GoldSearchForm onHandleSearch={filter => this.searchData(filter)} />
        <Table
          bordered
          rowKey={record => record.p_id}
          style={BODY_MARGIN_STYLE}
          loading={loading}
          columns={columns}
          dataSource={data}
          size="middle"
          pagination={{
            total,
            pageSize,
            itemRender: this.itemRender,
            showSizeChanger: true,
            pageSizeOptions: ['5','10','20','30','40'],
            onShowSizeChange: (current, changeSize) => this.queryData(current, changeSize),
            onChange: (current) => this.queryData(current, pageSize),
            showTotal: function () {  //设置显示一共几条数据
              return '共 ' + total + ' 条数据';
            }
          }}
        />
      </div>
    )
  }
}


