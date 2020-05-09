// 配置PostCSS的配置文件

// PostCSS配置文件需要导出一个对象
module.exports = {
  // 配置要使用的相关插件
  plugins: {
    // autoprefixer: {
    //   // 配置要兼容到的系统(浏览器)环境
    //   browsers: ['Android >= 4.0', 'iOS >= 8'],
    // },

    // 把 px 转成 rem
    'postcss-pxtorem': {
      // 转换的根元素基准值
      rootValue: 37.5,

      // 需要转换的css属性, *就是所有属性都要转换
      propList: ['*']
    }
  }
}
