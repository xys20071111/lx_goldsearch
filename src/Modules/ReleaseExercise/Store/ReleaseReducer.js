import _ from 'lodash';
import { fromJS } from 'immutable';
import * as types from './ReleaseActionType';
import { lineOption, getXAxisData, getSeries, getLegend } from 'Modules/ReleaseExercise/Constants';


const homeInitState = fromJS({
  list: [],
  filter: {
    areas: [],
    currentSelect: {
      area_type: 0, // 0:全国  1:省  2:市 3:区
      area_id: 0, // 0: 全国  地域ID
      rec_startdate: '2019-03-06',
      rec_enddate: '2019-03-16'
    },
    keyValue: {}
  },
  lineOption: lineOption
})

/** 获取省市0:全国*/
const getKeyValue = (data) => {
  const datas = data && data.reduce((rs, item) => {
    rs[item.areaid] = item.name;
    return rs;
  }, {})
  return datas;
}

const dateConvert = (data, isLeaf = false) => {
  const allAreas = data && data.reduce((rs, item) => {
    item.value = item.areaid;
    item.label = item.name;
    if (isLeaf) {
      item.isLeaf = true;
    } else {
      item.isLeaf = !item.is_area;
    }
    rs.push(item);
    return rs;
  }, []);
  return allAreas;
}

/** 获取所有地区 省 */
const getAllAreas = (state, action) => {
  const allAreas = dateConvert(action.data);
  const newArray = _.concat([{
    areaid: 0,
    province: 0,
    type: 0,
    label: '全国',
    value: 0,
    is_area: false
}], allAreas);
  return state.setIn(['filter', 'areas'], fromJS(newArray))
              .mergeIn(['filter', 'keyValue'], fromJS(getKeyValue(action.data)));
}

/**市 */
const getSubAreas = (state, action) => {
  if (action.data && _.size(action.data) > 0) {
    const provinceId = action.data[0].province;
    const parent = state.getIn(['filter', 'areas']).findIndex(item => {
      return _.isEqual(item.get('areaid'), provinceId);
    });
    return state.setIn(['filter', 'areas', parent, 'children'], fromJS(dateConvert(action.data, true)))
                .mergeIn(['filter', 'keyValue'], fromJS(getKeyValue(action.data)));
  }
  return state;
}

/**区 */
const getChildrenSubAreas = (state, action) => {
  if (action.data && _.size(action.data) > 0) {
    const { city, province } = action.data[0];

    const parentIndex = state.getIn(['filter', 'areas']).findIndex(item => {
      return _.isEqual(item.get('province'), province);
    });

    const cityIndex = state.getIn(['filter', 'areas', parentIndex, 'children']).findIndex(item => {
      return _.isEqual(item.get('city'), city);
    });

    /*return state.setIn(['filter', 'areas', parentIndex, 'children', cityIndex, 'children'], fromJS(dateConvert(action.data, true)))
                .mergeIn(['filter', 'keyValue'], fromJS(getKeyValue(action.data)));*/
    return state.mergeIn(['filter', 'keyValue'], fromJS(getKeyValue(action.data)));
  }
  return state;
}


/** 当前选中的区域 */
const setCurrentSelectArea = (state, action) => {
  const { areaid = 0, areaType = 0 } = action;
  return state.setIn(['filter', 'currentSelect', 'area_id'], areaid)
              .setIn(['filter', 'currentSelect', 'area_type'], areaType);
}

const searchDate = (state, action) => {
  const xAxisData = getXAxisData(action.filter);
  //if (!action.isQG) {
    const seriesData = getSeries(action.filter, state.getIn(['filter', 'keyValue']));
    const legend = getLegend(action.filter, state.getIn(['filter', 'keyValue']));
    return state.setIn(['list'], fromJS(action.filter))
                .updateIn(['lineOption', 'xAxis', 'data'], () => xAxisData)
                .updateIn(['lineOption', 'series'], () => _.values(seriesData))
                .updateIn(['lineOption', 'legend', 'data'], () => legend);
  //} else { // 全国数据需要处理

  //}
  return state;
}


const releaseReducer = (state = homeInitState, action) => {
  switch (action.type) {
    case types.GET_ALL_AREAS: return getAllAreas(state, action);
    case types.GET_SUB_AREAS: return getSubAreas(state, action);
    case types.GET_CHILDREN_SUB_AREAS: return getChildrenSubAreas(state, action);

    case types.SET_SELECTED_AREA: return setCurrentSelectArea(state, action);
    case types.SEARCH_DATA: return searchDate(state, action);
    default:
      return state;
  }
}


const reducers = {
  home: releaseReducer
}

export default reducers;