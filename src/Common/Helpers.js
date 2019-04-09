//前置拼接url
const host = window.location.host;
const protocol = window.location.protocol;
let api = `${protocol}//${host}/`;


//处理promise和fetch的兼容性以及引入
require('es6-promise').polyfill();
require('isomorphic-fetch');

//处理get请求，传入参数对象拼接
let formatUrl = obj => {
  let params = Object.values(obj).reduce((a, b, i) => `${a}${Object.keys(obj)[i]}=${b}&`, '?');
  return params.substring(0, params.length - 1);
};

let Fetch = (url, option = {}) => {
  option.headers = option.headers || {};

  option.headers['token'] = `${JSON.parse(window.sessionStorage.getItem('token')).token}`;
  option.headers['Authorization'] = `${JSON.parse(window.sessionStorage.getItem('token')).token}`;
 /*  option.headers['Authorization'] = `1dfd02d05871f65cc08c5dd09d7315f15b878556951bc9d0dde6397d8a29d255`;
  option.headers['token'] = `1dfd02d05871f65cc08c5dd09d7315f15b878556951bc9d0dde6397d8a29d255`; */

  const m = (option.method || 'GET').toLocaleLowerCase();
  // get query format
  if (m === 'get') {
    if (option.query) {
      url = url + formatUrl(option.query);
    }
  }
  //对非get类请求头和请求体做处理
  if (m === 'post' || m === 'put' || m === 'delete') {
    option.headers['Content-Type'] = option.headers['Content-Type'] || 'application/json';
    option.body = JSON.stringify(option.body);
  }
  return new Promise((resolve, reject) => {
    fetch(api + url, option)
      .then(parseJSON)
      .then(response => resolve(response))
      .catch(error => {
        console.log('err', error);
        Fetch.otherError && Fetch.otherError(error.message);
      });
  });
};

//response 转化
function parseJSON(response) {
  return response.json();
}

export default Fetch;