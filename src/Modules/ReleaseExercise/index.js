import _ from 'lodash';
import React, { Component } from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';
import Fetch from 'Common/Helpers';
import { connect } from 'react-redux';
import { message } from 'antd';
import * as types from './Store/ReleaseActionType';
import ReleaseExerciseForm from './ReleaseExerciseForm';
import ReleaseExerciseContent from './ReleaseExerciseContent';
import {
  getLineOptionSelector,
  getKeyValuesSelector,
  getListSelector,
  getCurrentSelectSelector
} from './Store/ReleaseSelector';
moment.locale('zh-cn');


class ReleaseExercise extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      filter: {},
      test: 0
    }
  }

  HandleSearchData = () => {
    const { currentSelect } = this.props;
    Fetch('app/homework/getsubareatimepublishstat', { query: currentSelect }).then(rs => {
      if (_.isEqual(rs.result, 0) && rs.data.stat_data && _.size(rs.data.stat_data) > 0) {
        // console.log('ui  search data:', rs)
        this.props.searchData(rs.data.stat_data, currentSelect.area_type === 0 ? true : false);
      } else {
        message.error(rs.msg);
      }
    }).catch(err => message.error(err.msg))
  }

  render() {
    return (
      <div className='release-exercise'>
        <ReleaseExerciseForm
          onHandleSearch={() => this.HandleSearchData()}
        />
        <ReleaseExerciseContent
          data={this.props.list}
          keyValue={this.props.keyValue}
          lineOption={this.props.lineOption}
        />
      </div>
    )
  }
}



const mapStateToProps = (state) => {
  return {
    currentSelect: getCurrentSelectSelector(state),
    list: getListSelector(state),
    lineOption: getLineOptionSelector(state),
    keyValue: getKeyValuesSelector(state)
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    searchData: (filter, isQG = false) => dispatch({ type: types.SEARCH_DATA, filter, isQG })
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ReleaseExercise);

