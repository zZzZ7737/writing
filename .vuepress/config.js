module.exports = {
  title: 'LiZ2z\'Blog',
  description: 'LiZ2z Blog',
  github:'LiZ2z',
  head: [
    ['link', { rel: 'icon', href: '/logo.ico' }],
    ['link', { rel: 'shortcut icon', href: '/logo.ico' }],
    ['meta',{name:"keywords", content:'LiZ2z,blog,博客,vuepress'}],
    ['meta',{'http-equiv': 'Page-Enter', content: 'revealTrans(duration=1.0,transtion=12)'}]
  ],
  themeConfig: {
    logo: '/logo.png',
    headerNav: [
      { text: 'HOME', link: '/', isNav: true },
      { text: 'TAGS', link: '/tags/', isNav: true  },
      { text: 'CATEGORIES', link: '/categories/', isNav: true  },
    ],
    sidebarDepth: 2,
    sidebar: 'auto',
    displayAllHeaders: true,

    lastUpdated: '最近更新', // string | boolean

    editLinkText: true,

    // 页面内容更新 pwa
    serviceWorker: {
      updatePopup: true, // Boolean | Object, 默认值是 undefined.
      // 如果设置为 true, 默认的文本配置将是: 
      updatePopup: { 
         message: "有可用更新", 
         buttonText: "刷新" 
      }
    },

      // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
      repo: 'LiZ2z/blog',
      // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
      // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
      repoLabel: 'GitHub',
  
      // 以下为可选的编辑链接选项
  
      // 假如你的文档仓库和项目本身不在一个仓库：
      // docsRepo: 'vuejs/vuepress',
      // 假如文档不是放在仓库的根目录下：
      // docsDir: 'docs',
      // 假如文档放在一个特定的分支下：
      // docsBranch: 'master',
      // 默认是 false, 设置为 true 来启用
      editLinks: true,
      // 默认为 "Edit this page"
      editLinkText: '帮助我改善此页面！'
  }
}