import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import Fetch from 'Common/Helpers';
import 'moment/locale/zh-cn';
import { connect } from 'react-redux';
import * as types from './Store/ReleaseActionType';
import { getAreasSelector, getCurrentSelectSelector } from './Store/ReleaseSelector';
import { Form, Row, Col, Button, DatePicker, Cascader } from 'antd';
import {
  getMonthStartDate,
  getBeforeDay,
  getLastMonthStartDate,
  getLastMonthEndDate
} from './Constants';
moment.locale('zh-cn');
const { RangePicker } = DatePicker;


class ReleaseExerciseFilter extends React.Component {
  constructor(props) {
    super(props);
    this.getAllAreasData(0, (data) => props.getAllAreas(data));
  }

  /**获取全国所有地区 */
  getAllAreasData = (areaid = 0, callback, isarea = 0) => {
    Fetch('api/meta/getsubareas', { query: { areaid, isarea } }).then(rs => {
      if (_.isEqual(rs.result, 0) && rs.data && _.size(rs.data) > 0) {
        callback(rs.data);
      }
    })
  }

  /**查询区县数据 */
  loadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    if (_.isEqual(targetOption.type, 1)) {
      this.getAllAreasData(targetOption.areaid, data => this.props.getSubareas(data));
    }
  }

  /**储存当前选择的区县条件 */
  onChange = (value, selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    const { areaid, type } = targetOption;
    if (_.isEqual(targetOption.type, 2)) {
      this.getAllAreasData(targetOption.areaid, data => this.props.getChildrenSubareas(data));
    }
    this.props.setSelectedArea(areaid, type);
  }

  onHandleRangePicker = (data, dateString) => {
    this.props.setRangePicker(dateString[0], dateString[1]);
  }

  getMonthDate = (type = 'current') => {
    if (type === 'current') {
      this.props.setRangePicker(getMonthStartDate(), getBeforeDay(0));
    } else if (type === 'last') {
      this.props.setRangePicker(getLastMonthStartDate(), getLastMonthEndDate());
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form className="release_exercise-form" onSubmit={this.handleSearch} >
        <Row gutter={20}>
        <Col span={1}>
          <Button type="primary" onClick={() => this.getMonthDate('current')}>本月</Button>
        </Col>
        <Col span={1}>
          <Button type="primary" onClick={() => this.getMonthDate('last')}>上月</Button>
        </Col>
        <Col span={6}>
          <Form.Item >
            {getFieldDecorator('release-range-picker', {
              initialValue: [
                moment(this.props.currentData.rec_startdate, 'YYYY-MM-DD'),
                moment(this.props.currentData.rec_enddate, 'YYYY-MM-DD')
              ],
            })(
              <RangePicker onChange={this.onHandleRangePicker} />
            )}
          </Form.Item>
        </Col>
        <Col span={6}>
          <Cascader
            size="large"
            defaultValue={[0]}
            options={this.props.option}
            loadData={this.loadData}
            onChange={this.onChange}
            changeOnSelect
          />
        </Col>
        <Col span={1}>
          <Button type="primary" icon="search" onClick={() => this.props.onHandleSearch()}>查询</Button>
        </Col>
      </Row>
      </Form>
    );
  }
}
const ReleaseExerciseForm = Form.create({ name: 'release_exercise' })(ReleaseExerciseFilter);

const mapStateToProps = (state) => {
  return {
    option: getAreasSelector(state),
    currentData: getCurrentSelectSelector(state)
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getAllAreas: data => dispatch({ type: types.GET_ALL_AREAS, data }),
    getSubareas: data => dispatch({ type: types.GET_SUB_AREAS, data }),
    getChildrenSubareas: data => dispatch({ type: types.GET_CHILDREN_SUB_AREAS, data }),
    setSelectedArea: (areaid, areaType) => dispatch({ type: types.SET_SELECTED_AREA, areaid, areaType }),
    setRangePicker: (startTime, endTime) => dispatch({ type: types.SET_SELECTED_RANGE_PICKER, startTime, endTime })
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ReleaseExerciseForm);