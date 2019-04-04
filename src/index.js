import React from 'react';
import ReactDOM from 'react-dom';
import 'Styles/index.less';
import ReleaseExercise from './Modules/ReleaseExercise';
import * as serviceWorker from './serviceWorker';
import configureStore from './Store';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';


// Create redux store
const store = configureStore();

ReactDOM.render(
  <AppContainer>
    <Provider store={store}>
      <ReleaseExercise />
    </Provider>
  </AppContainer>
, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
