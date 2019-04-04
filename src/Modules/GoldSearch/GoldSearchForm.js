import React from 'react';
import moment from 'moment';
import { Form, Row, Col, Input, Button, Select, DatePicker, Card } from 'antd';
import 'moment/locale/zh-cn';
import {
  SELECT_LOGIN_NAME,
  SELECT_USER_ID,
  FORM_ITEM_STYLE,
  BODY_MARGIN_STYLE,
  STRINGS,
  FAILED
} from './Constants';
moment.locale('zh-cn');
const { Option } = Select;
const { RangePicker } = DatePicker;


class GoldSearchFilter extends React.Component {
  rnageDisabledRangeTime = (_, type) => {
    if (type === 'start') {
      return {
        disabledHours: () => this.range(0, 60).splice(4, 20),
        disabledMinutes: () => this.range(30, 60),
        disabledSeconds: () => [55, 56],
      };
    }
    return {
      disabledHours: () => this.range(0, 60).splice(20, 4),
      disabledMinutes: () => this.range(0, 31),
      disabledSeconds: () => [55, 56],
    };
  }
  rangeDisabledDate = (current) => {
    return current && current > moment().endOf('day');
  }
  range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }
  datePickerDisabledDate = (current) => {
    let retBol = true;
    const fields = this.props.form.getFieldsValue();
    if (current < moment().endOf('day') && current >= new Date(fields['release-range-picker'][1]).getTime()) {
      retBol = false;
    }
    return retBol;
  };

  getFields() {
    const { getFieldDecorator } = this.props.form;
    const fields = this.props.form.getFieldsValue();
    const inputRules = {
      rules: [{ required: true, message: '请输入内容' }]
    }
    const rangeConfig = {
      rules: [{ required: true, message: '请选择时间' }]
    };
    const datePickerConfig = {
      rules: [{
        required: true,
        message: !fields['release-range-picker'] ? '请先选择发布时间' : '请选择时间'
      }]
    };

    return (
      <Row gutter={20}>
        <Col span={3}>
          <Form.Item label={STRINGS.filter.searchOpt} style={FORM_ITEM_STYLE}>
            {getFieldDecorator(FAILED.filter.typeGroups,{ initialValue: SELECT_LOGIN_NAME })(
              <Select>
                <Option value={SELECT_LOGIN_NAME}>{STRINGS.filter.loginName}</Option>
                <Option value={SELECT_USER_ID}>{STRINGS.filter.userId}</Option>
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col span={3}>
          <Form.Item >
            {getFieldDecorator(FAILED.filter.typeInput, inputRules)(<Input />)}
          </Form.Item>
        </Col>

        <Col span={7}>
          <Form.Item label={STRINGS.filter.releaseTime} style={FORM_ITEM_STYLE}>
            {getFieldDecorator('release-range-picker', rangeConfig)(
              <RangePicker
                disabledDate={this.rangeDisabledDate}
                disabledTime={this.rnageDisabledRangeTime}
              />
            )}
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label={STRINGS.filter.jsTime} style={FORM_ITEM_STYLE}>
            {getFieldDecorator(FAILED.filter.jsTiem, datePickerConfig)(
              <DatePicker
                disabled={!fields['release-range-picker'] ? true : false}
                disabledDate={this.datePickerDisabledDate}
              />
            )}
          </Form.Item>
        </Col>
        <Col span={1} style={{ textAlign: 'right', marginTop: '4px' }}>
          <Button type="primary" htmlType="submit">{STRINGS.filter.searchBtn}</Button>
         </Col>
      </Row>
    )
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const releaseRangeValue = fieldsValue['release-range-picker'];
        const values = {
          [FAILED.filter.lxStartTime]: releaseRangeValue && releaseRangeValue[0].format('YYYY-MM-DD'),
          [FAILED.filter.lxEndTime]: releaseRangeValue && releaseRangeValue[1].format('YYYY-MM-DD'),
          [FAILED.filter.jsTiem]: fieldsValue[FAILED.filter.jsTiem].format('YYYY-MM-DD'),
        };
        if (fieldsValue[FAILED.filter.typeGroups] === SELECT_LOGIN_NAME) {
          values.login_name = fieldsValue[FAILED.filter.typeInput];
        } else if (fieldsValue[FAILED.filter.typeGroups] === SELECT_USER_ID) {
          values.user_id = fieldsValue[FAILED.filter.typeInput];
        }
        console.log('Received values of form: ', values);
        this.props.onHandleSearch(values)
      }
    });
  }

  render() {
    return (
      <Card title={STRINGS.filter.title} style={BODY_MARGIN_STYLE}>
        <Form className="ant-advanced-search-form" onSubmit={this.handleSearch} >
          {this.getFields()}
        </Form>
      </Card>
    );
  }
}
const GoldSearchForm = Form.create({ name: 'advanced_search' })(GoldSearchFilter);
export default GoldSearchForm;