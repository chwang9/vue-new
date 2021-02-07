import axios from "axios";
require("promise.prototype.finally").shim();
import { notification } from "ant-design-vue";

const errorHandler = error => {
  const { response } = error;
  if (response && response.status) {
    const { config, status, statusText } = response;

    notification.open({
      class: "requestError",
      message: `${status}: ${config.url}`,
      description: `${statusText}`
    });
  } else if (!response) {
    notification.open({
      class: "requestError",
      message: "网络异常",
      description: "您的网络发生异常，无法连接服务器"
    });
  }
  return Promise.reject(error);
};

const request = axios.create({
  // 请求超时
  timeout: 6000
});
request.interceptors.request.use(config => {
  return config;
}, errorHandler);
request.interceptors.response.use(response => {
  return response.data;
}, errorHandler);

export default request;
