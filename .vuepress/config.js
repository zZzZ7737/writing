module.exports = {
  title: 'LiZ2z Blog',
  description: 'LiZ2z Blog',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { 
        text: '源码分析',
        link: '/read-source-code/',
        items: [
          {
            text: 'vue-router', 
            link: '/read-source-code/vue-router',
            items: [
              {text: '第一部分', link: '/read-source-code/vue-router/first-part'},
              {text: '第二部分', link: '/read-source-code/vue-router/second-part'},
              {text: '第三部分', link: '/read-source-code/vue-router/third-part'},
            ]
          },
          {
            text: 'vue',
            link: '/read-source-code/vue'
          }
        ]
      },
    ],
    sidebarDepth: 2,
    sidebar: 'auto',
    displayAllHeaders: true,
    lastUpdated: 'Last Updated', // string | boolean
    serviceWorker: {
      updatePopup: true // Boolean | Object, 默认值是 undefined.
      // 如果设置为 true, 默认的文本配置将是: 
      // updatePopup: { 
      //    message: "New content is available.", 
      //    buttonText: "Refresh" 
      // }
    }
  }
}