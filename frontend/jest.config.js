module.exports = {
  testEnvironment: 'jsdom', // 设置测试环境
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'], // 添加额外的断言库
  moduleNameMapper: {
    // 如果你使用了例如 CSS 模块，可以在这里配置它们的映射
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  testPathIgnorePatterns: ['/node_modules/'], // 忽略 node_modules 中的测试文件
  transform: {
    // 如果你使用了例如 Babel，可以在这里配置它的转换器
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  // 其他可能的配置项...
};
