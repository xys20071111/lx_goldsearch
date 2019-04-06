import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import Fetch from 'Common/Helpers';
import 'moment/locale/zh-cn';
import { connect } from 'react-redux';
import * as types from './Store/ReleaseActionType';
import { getAreasSelector } from './Store/ReleaseSelector';
import { Form, Row, Col, Button, DatePicker, Cascader } from 'antd';
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

  getFields = () => {
    const { getFieldDecorator } = this.props.form;
    return (
      <Row gutter={20}>
        <Col span={1}>
          <Button type="primary">本月</Button>
        </Col>
        <Col span={1}>
          <Button type="primary">上月</Button>
        </Col>
        <Col span={6}>
          <Form.Item >
            {getFieldDecorator('release-range-picker')(
              <RangePicker />
            )}
          </Form.Item>
        </Col>
        <Col span={6}>
          <Cascader
            onChange={this.onChange}
            size="large"
            options={this.props.option}
            loadData={() => this.loadData}
            onPopupVisibleChange={this.visible}
          />
        </Col>
        <Col span={1}>
          <Button type="primary" icon="search">查询</Button>
        </Col>
      </Row>
    )
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form className="release_exercise-form" onSubmit={this.handleSearch} >
        <Row gutter={20}>
        <Col span={1}>
          <Button type="primary">本月</Button>
        </Col>
        <Col span={1}>
          <Button type="primary">上月</Button>
        </Col>
        <Col span={6}>
          <Form.Item >
            {getFieldDecorator('release-range-picker', {
              initialValue: [moment('2019/03/01', 'YYYY-MM-DD'), moment('2019/03/15', 'YYYY-MM-DD')]
            })(
              <RangePicker />
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
    option: getAreasSelector(state)
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getAllAreas: data => dispatch({ type: types.GET_ALL_AREAS, data }),
    getSubareas: data => dispatch({ type: types.GET_SUB_AREAS, data }),
    getChildrenSubareas: data => dispatch({ type: types.GET_CHILDREN_SUB_AREAS, data }),
    setSelectedArea: (areaid, areaType) => dispatch({ type: types.SET_SELECTED_AREA, areaid, areaType })
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ReleaseExerciseForm);