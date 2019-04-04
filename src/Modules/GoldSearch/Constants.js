import React from 'react';

/** form constants */
const SELECT_LOGIN_NAME = 1;
const SELECT_USER_ID = 2;
const FORM_ITEM_STYLE = {
  display: 'flex',
  'alignItem': 'center',
  'justifyContent': 'flex-end'
}
const BODY_MARGIN_STYLE = {
  margin: '10px'
}
const STRINGS = {
  filter: {
    searchOpt: '查询条件',
    loginName: '登录名',
    userId: '用户ID',
    releaseTime: '练习发布时间',
    jsTime: '结算时间',
    searchBtn: '查询',
    title: '新版作业金币查询'
  }
}
const FAILED = {
  filter: {
    typeGroups: 'types',
    typeInput: 'user_id',
    lxStartTime: 'start_time',
    lxEndTime: 'end_time',
    jsTiem: 'reckon_time',
  },
  table: {
    rowNumber: 'row_id',
    hwName: 'p_name',
    hwType: 'group_type',
    classid: 'class_group_id',
    classname: 'class_group_name',
    jsClassPersonNumber: 'reckon_student_count',
    jsReadCount: 'reckon_read_count',
    jsSheBei: 'reckon_device_count',
    jsRate: 'reckon_device_read_percent',
    currentClassCount: 'student_count',
    currenRead: 'read_count',
    currentSheBei: 'device_count',
    currentRate: 'device_read_percent'
  }
}

/** search constants */
const GOLD_SEARCH_URL = '/app/homework/teacherhwstatnbypage';
const PAGINATION_STYLE = `
.ant-table-pagination {
  margin-right: 50px !important;
}
.ant-pagination-prev {
  margin-right: 10px !important;
}
.ant-pagination-next {
  margin-left: 10px !important;
  margin-right: 10px !important;
}`;
const HW_TYPE_STRINGS = {
  201: '班级练习',
  2001: '小组练习'
}

/** table columns */

const columns = [{
  title: '序号',
  width: '3%',
  align: 'center',
  dataIndex: FAILED.table.rowNumber
}, {
  title: '练习名称',
  width: '13%',
  align: 'center',
  dataIndex: FAILED.table.hwName
}, {
  title: '练习类型',
  width: '7%',
  align: 'center',
  dataIndex: FAILED.table.hwType,
  render: text => HW_TYPE_STRINGS[text]
}, {
  title: '班级ID',
  width: '5%',
  align: 'center',
  dataIndex: FAILED.table.classid
}, {
  title: '班级名称',
  width: '8%',
  align: 'center',
  dataIndex: FAILED.table.classname
}, {
  title: '结算时班级人数',
  width: '7%',
  align: 'center',
  dataIndex: FAILED.table.jsClassPersonNumber
}, {
  title: '结算期阅读数',
  width: '8%',
  align: 'center',
  dataIndex: FAILED.table.jsReadCount
}, {
  title: '结算期设备',
  width: '5%',
  align: 'center',
  dataIndex: FAILED.table.jsSheBei
}, {
  title: '结算期阅读率',
  width: '7%',
  align: 'center',
  dataIndex: FAILED.table.jsRate,
  sorter: (a, b) => a[FAILED.table.jsRate] - b[FAILED.table.jsRate],
  render: text => <span>{text}%</span>,
}, {
  title: '当前班级人数',
  width: '6%',
  align: 'center',
  dataIndex: FAILED.table.currentClassCount,
}, {
  title: '当前阅读数',
  width: '6%',
  align: 'center',
  dataIndex: FAILED.table.currenRead,
}, {
  title: '当前设备数',
  width: '6%',
  align: 'center',
  dataIndex: FAILED.table.currentSheBei,
}, {
  title: '当前阅读率',
  width: '6%',
  align: 'center',
  dataIndex: FAILED.table.currentRate,
  sorter: (a, b) => a[FAILED.table.currentRate] - b[FAILED.table.currentRate],
  render: text => <span>{text}%</span>,
}];


export {
  SELECT_LOGIN_NAME,
  SELECT_USER_ID,
  FORM_ITEM_STYLE,
  BODY_MARGIN_STYLE,
  STRINGS,
  FAILED,
  HW_TYPE_STRINGS,
  GOLD_SEARCH_URL,
  PAGINATION_STYLE,
  columns
};