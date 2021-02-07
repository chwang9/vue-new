import Mock from "mockjs";

const registerMock = () => {
  const mockPath = require.context(".", true, /\.js$/);
  mockPath.keys().forEach(mockFile => {
    if (mockFile === "./index.js") return;
    const mockData = require(`${mockFile}`).default;
    Object.keys(mockData).forEach(el => {
      Mock.mock(el, mockData[el]);
    });
  });
};

if (process.env.VUE_APP_MOCK === "true") {
  registerMock();
}
