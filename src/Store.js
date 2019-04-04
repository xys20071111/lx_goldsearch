import { createStore, applyMiddleware } from 'redux';
import createReducer from './Reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import createHistory from 'history/createHashHistory'
import { routerMiddleware } from 'react-router-redux'

export default function configureStore(initialState = {}) {

  const history = createHistory();
  const routemiddleware = routerMiddleware(history)
  const middlewares = [
    routemiddleware
  ];

  const store = createStore(
    createReducer(),
    initialState,
    composeWithDevTools(applyMiddleware(...middlewares))
  );

  // Extensions
  //store.runSaga = sagaMiddleware.run;
  store.asyncReducers = {}; // Async reducer registry
  return store;
}
