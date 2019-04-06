import { createSelector } from 'reselect';


const getLineOption = (state) => state.home.get('lineOption');
const getList = (state) => state.home.get('list');
const getKeyValues = (state) => state.home.getIn(['filter','keyValue']);
const getCurrentSelect = (state) => state.home.getIn(['filter', 'currentSelect']);
const getAreas = state => state.home.getIn(['filter', 'areas']);


const getLineOptionSelector = createSelector(
  getLineOption,
  data => data.toJS()
)
const getKeyValuesSelector = createSelector(
  getKeyValues,
  data => data.toJS()
)
const getListSelector = createSelector(
  getList,
  data => data.toJS()
)
const getCurrentSelectSelector = createSelector(
  getCurrentSelect,
  data => data.toJS()
)
const getAreasSelector = createSelector(
	getAreas,
	data => data.toJS()
)



export {
  getLineOptionSelector,
  getKeyValuesSelector,
  getListSelector,
  getCurrentSelectSelector,
  getAreasSelector
}