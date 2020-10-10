# 从在地址栏输入 url 问题来看前端性能优化

让我们先看看一个经典问题：

## 在浏览器中输入一个网址后，发生了什么？

1. 浏览器通过 DNS 解析查询域名的 ip 地址

2. 向查询到的 IP 地址发起 http 请求

3. 服务器响应请求，并返回资源

4. 浏览器解析返回的 HTML 数据，如果遇到 CSS 或者 JS 资源则暂停解析，等待资源加载完成，随后浏览器将 HTML 解析为 DOM，将 CSS 解析为 CSSOM，之后合并为 Render tree，然后根据 render tree 进行渲染

5. 整个过程结束之后，浏览器关闭 TCP 连接

那么让我们仔细分析上述每个过程，看看哪些地方可以做优化。

### 1. **DNS 查询**

当人们输入域名时，机器不能理解域名，所以需要 DNS 查询。以 xxx.com 域名为例，DNS 查询步骤为：

1. **查找浏览器缓存** - 首先，浏览器会查找自己的缓存
2. **系统缓存** - 如果在浏览器缓存里没有找到需要的记录，浏览器会做一个系统调用来查找这个网址的对应 DNS 信息（我们可以通过 hosts 文件来影响 DNS 查找）
3. **路由器缓存** - 如果在系统缓存中没找到记录，就会发起 DNS 查询请求，请求到路由器时，路由器会查找自己的缓存
4. **ISP DNS 缓存** - isp（互联网服务提供商，例如：中国电信）

5. **递归搜索** - ISP 的 DNS 服务器从根域名服务器开始进行递归搜索，从.com 顶级域名服务器到 xxx 域名服务器

综上，DNS 查询的很大一部分依赖于缓存，所以我们可以通过提高缓存命中率，来优化 DNS 查询，见：[DNS 查询优化](./DNS查询优化.md)

### 2. **发起 http 请求**

当我们真正发起 http 请求后，优化的点就更多了：

- **域名拆分**

  i. 系统的可用资源是有限的（端口数量和线程切换开销），所以不可能允许网页发起无限制的并发请求。浏览器对于并发请求数量的限制是基于域名（domain）的，通常一个域名允许的并发请求数量为 6 个。当网页的并发请求数量大于 6 个时，其余的请求就会被阻塞，而阻塞就意味着性能变差。解决方案是通过 domain hash 技术来增加并发量（因为浏览器是基于 domain 的并发控制，而不是标签页）。

  > ii. 按照普通设计，当网站 cookie 信息有 1 KB、网站首页共 150 个资源时，用户在请求过程中需要发送 150 KB 的 cookie 信息，在 512 Kbps 的常见上行带宽下，需要长达 3 秒左右才能全部发送完毕。 尽管这个过程可以和页面下载不同资源的时间并发，但毕竟对速度造成了影响。 而且这些信息在 js/css/images/flash 等静态资源上，几乎是没有任何必要的。解决方案是启用和主站不同的域名来放置静态资源，也就是 cookie free。

  以上问题的解决方案是启用和主站不同的域名来放置静态资源，既**域名拆分**。但域名拆分并不是越多越好，过多的域名会增加 DNS 查询的时间，可能会产生负优化。

- **http 请求**

### 3. **服务器响应**

对于服务器响应这一块，首先，响应肯定要快，其次要直接，最后响应内容尺寸要尽量的小。

- **响应要快**

  > 服务器响应用时衡量的是花费了多长时间来加载必要的 HTML 以开始呈现服务器所托管的网页，其中减去了 Google 和您的服务器之间的网络延迟时长。每次运行所用的时间可以有所不同，但这种差异不应太大。事实上，如果各次服务器响应在用时方面存在很大差异的话，则可能意味着有潜在的性能问题。
  >
  > 您应将服务器响应用时控制在 200 毫秒内。 很多潜在因素都可能会延缓服务器响应，例如缓慢的应用逻辑、缓慢的数据库查询、缓慢的路由、框架、库、资源 CPU 不足或内存不足。您需要充分考虑所有这些因素，才能改善服务器的响应用时。 若想找出服务器响应用时过长的原因，首先要进行衡量。然后，准备好相关数据，并参阅有关如何解决该问题的相应指导。当解决问题后，您必须继续衡量服务器响应用时，并设法应对任何会在将来出现的性能瓶颈问题。
  >
  > 1. 收集并检查现有性能和数据。若无可用内容，请使用自动化的网络应用监测解决方案（市面上有托管的开源版本，适用于大多数平台）进行评估，或添加自定义的方法。
  > 2. 找出并修复首要的性能瓶颈问题。如果您使用的是热门网页框架或内容管理平台，请参阅与性能优化最佳做法相关的文档。
  > 3. 监测并提醒任何会在将来出现的性能衰退问题！

- **负载均衡**

- **避免重定向**

  - 尽量减少重定向

    > 重定向会触发额外的 HTTP 请求-响应周期，并会拖慢网页呈现速度。在最好的情况下，每个重定向都会添加一次往返（HTTP 请求-响应）；而在最坏的情况下，除了额外的 HTTP 请求-响应周期外，它还可能会让更多次的往返执行 DNS 查找、TCP 握手和 TLS 协商。因此，您应尽可能减少对重定向的使用以提升网站性能。
    >
    > 以下是重定向模式的一些示例：
    >
    > - example.com 使用自适应网页设计，无需任何重定向 - 快速且理想！
    > - example.com → m.example.com/home - 会导致移动设备用户遭遇多次往返。
    > - example.com → www.example.com → m.example.com - 移动浏览体验非常缓慢。

  - 关于为什么会重定向

    > 服务器给浏览器响应一个 301 永久重定向响应，这样浏览器就会访问“http:// www.facebook.com/” 而非“http://facebook.com/”。
    >
    > 为什么服务器一定要重定向而不是直接发会用户想看的网页内容呢？这个问题有好 多有意思的答案。
    >
    > 其中一个原因跟搜索引擎排名有 关。你看，如果一个页面有两个地址，就像 http://www.igoro.com/ 和http://igoro.com/，搜索引擎会认为它们是两个网站， 结果造成每一个的搜索链接都减少从而降低排名。而搜索引擎知道 301 永久重定向是 什么意思，这样就会把访问带 www 的和不带 www 的地址归到同一个网站排名下。
    >
    > 还有一个是用不同的地址会造成缓存友好性变差。当一个页面有好几个名字时，它 可能会在缓存里出现好几次。

- **开启 Gzip**

  > 所有现代浏览器都支持 gzip 压缩并会为所有 HTTP 请求自动协商此类压缩。启用 gzip 压缩可大幅缩减所传输的响应的大小（最多可缩减 90%），从而显著缩短下载相应资源所需的时间、减少客户端的流量消耗并加快网页的首次呈现速度。

- **协商缓存**

- **开启 KeepAlive**

### 4. **浏览器解析及渲染**

用户看到页面的具体内容由 HTML 及 CSS 来决定，浏览器会先对这些数据进行解析并根据解析结果进行渲染：

1. 浏览器将 HTML 解析为 **DOM**

2. 将 CSS 解析为 **CSSOM**

3. 将 **DOM** 与 **CSSOM** 合并为 **Render Tree**（渲染树）

4. 根据 **Render Tree** 进行**Layout**（布局），即计算元素的具体位置（几何信息）。

5. 布局完成后，就进入到了**Paint（绘制）**阶段，将各个节点绘制到屏幕上

> 如果 DOM 或 CSSOM 被修改，您只能再执行一遍以上所有步骤，以确定哪些像素需要在屏幕上进行重新渲染。
>
> **_优化关键渲染路径就是指最大限度缩短执行上述第 1 步至第 5 步耗费的总时间。_** 这样一来，就能尽快将内容渲染到屏幕上，此外还能缩短首次渲染后屏幕刷新的时间，即为交互式内容实现更高的刷新率。

很明显，过大的 DOM 树（节点层级深、节点过多）及复杂的 CSS 样式（box-shadow）都会显著的增加上述过程的时间。另外，默认情况下，CSS 被视为阻塞渲染的资源，即除非 CSSOM 构建完成，否则浏览器不会渲染任何内容，**外部引入的 CSS 文件**对这一点的影响更为明显，因为要想构建 CSSOM，就必须等待 CSS 文件下载完成，而文件下载可能比解析更耗时。

不仅 CSS 会组织渲染，JavaScript 也会阻止 DOM 构建和延缓网页渲染

- **避免在首屏内容中包含会阻止内容呈现的外部 JavaScript 和 CSS**

  > 浏览器必须先解析网页，然后才能将其呈现给用户。如果浏览器在解析过程中遇到非异步或阻止呈现的外部脚本，则必须停止解析并且下载相应资源。每当发生这种情况时，都会增加一次网络往返过程，这势必会导致网页的首次呈现时间被延迟。
  >
  > 因此，用于呈现首屏内容的 JavaScript 和 CSS 应内嵌到网页中，而用于为网页增添附加功能的 JavaScript 或 CSS 应在 ATF 内容呈现完毕后再开始加载。

- **CSS 媒体查询**

  有些人会疑惑于为什么不能直接解析现有的 HTML 及 CSS 先用于渲染，而需要等待外部引入的 CSS 下载完成后才继续解析？这里直接引用[谷歌 web 开发文档](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-blocking-css)

  > 在渲染树构建中，我们看到关键渲染路径要求我们同时具有 DOM 和 CSSOM 才能构建渲染树。这会给性能造成严重影响：HTML 和 CSS 都是阻塞渲染的资源。 HTML 显然是必需的，因为如果没有 DOM，我们就没有可渲染的内容，但 CSS 的必要性可能就不太明显。如果我们在 CSS 不阻塞渲染的情况下尝试渲染一个普通网页会怎样？
  >
  > ![有CSS](./nytimes-css-device.png) ![无CSS](./nytimes-nocss-device.png)
  >
  > 上例展示了纽约时报网站使用和不使用 CSS 的显示效果，它证明了为何要在 CSS 准备就绪之前阻塞渲染，————没有 CSS 的网页实际上无法使用。右侧的情况通常称为“内容样式短暂失效”(FOUC)。浏览器将阻塞渲染，直至 DOM 和 CSSOM 全都准备就绪。

  不过，如果我们有一些 CSS 样式只在特定条件下（例如显示网页或将网页投影到大型显示器上时）使用，又该如何？_如果这些资源不阻塞渲染，该有多好。这样我们可以只下载首屏必须的 CSS 资源了，大大节省了时间（我们甚至可以把首屏的 CSS 资源直接放入 HTML 中）_。

  我们可以通过 **_CSS“媒体类型”和“媒体查询”_** 来解决这类用例：

  ```HTML
  <link href="style.css" rel="stylesheet">
  <link href="print.css" rel="stylesheet" media="print">
  <link href="other.css" rel="stylesheet" media="(min-width: 40em)">
  <link href="portrait.css" rel="stylesheet" media="orientation:portrait">
  ```

- **预加载与预链接**

  ```html
  <link rel="preconnect" href="https://www.google.com" />
  ```

- 静态资源

  > 在浏览器显示 HTML 时，它会注意到需要获取其他地址内容的标签。这时，浏览器会 发送一个获取请求来重新获得这些文件。
  >
  > 下面是几个我们访问 facebook.com 时需要重获取的几个 URL：
  >
  > ```
  >  图片
  > http://static.ak.fbcdn.net/rsrc.php/z12E0/hash/8q2anwu7.gif
  > http://static.ak.fbcdn.net/rsrc.php/zBS5C/hash/7hwy7at6.gif
  > …
  > CSS 式样表
  > http://static.ak.fbcdn.net/rsrc.php/z448Z/hash/2plh8s4n.css
  > http://static.ak.fbcdn.net/rsrc.php/zANE1/hash/cvtutcee.css
  > …
  > JavaScript 文件
  > http://static.ak.fbcdn.net/rsrc.php/zEMOA/hash/c8yzb6ub.js
  > http://static.ak.fbcdn.net/rsrc.php/z6R9L/hash/cq2lgbs8.js
  > …
  > ```
  >
  > 这些地址都要经历一个和 HTML 读取类似的过程。所以浏览器会在 DNS 中查找这些 域名，发送请求，重定向等等...
  >
  > 但 不像动态页面那样，静态文件会允许浏览器对其进行缓存。有的文件可能会不需 要与服务器通讯，而从缓存中直接读取。服务器的响应中包含了静态文件保存的期限 信息，所以浏览器知道要把它们缓存多长时间。还有，每个响应都可能包含像版本号一 样工作的 ETag 头（被请求变量的实体值），如果浏览器观察到文件的版本 ETag 信息 已经存在，就马上停止这个文件的传输。
  >
  > 试着猜猜看“fbcdn.net”在地址中代表什么？聪明的答案是"Facebook 内容分发网络 "。Facebook 利用内容分发网络（CDN）分发像图片，CSS 表和 JavaScript 文件这些 静态文件。所以，这些文件会在全球很多 CDN 的数据中心中留下备份。
  >
  > 静态内容往往代表站点的带宽大小，也能通过 CDN 轻松的复制。通常网站会使用第 三方的 CDN。例如，Facebook 的静态文件由最大的 CDN 提供商 Akamai 来托管。
  >
  > 举例来讲，当你试着 ping static.ak.fbcdn.net 的时候，可能会从某个 akamai. net 服务器上获得响应。有意思的是，当你同样再 ping 一次的时候，响应的服务器可 能就不一样，这说明幕后的负载平衡开始起作用了。

参考：

- [浏览器允许的并发请求资源数是什么意思？ - 黄良懿的回答 - 知乎
  ](https://www.zhihu.com/question/20474326/answer/15696641)

- [并发连接数对浏览器加载速度的测试](https://www.iefans.net/bingfa-lianjieshu-sudu-ceshi/)

- [常见的前端性能优化手段都有哪些？都有多大收益？](https://www.zhihu.com/question/40505685)

- [Why do big sites host their images/css on external domains?](https://webmasters.stackexchange.com/questions/26753/why-do-big-sites-host-their-images-css-on-external-domains)

- [在 PageSpeed Insights 中针对网站进行移动设备浏览体验分析](https://developers.google.com/speed/docs/insights/mobile)

- [PageSpeed Insights 规则](https://developers.google.com/speed/docs/insights/rules)

- [Optimizing Encoding and Transfer Size of Text-Based Assets](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/optimize-encoding-and-transfer#text-compression-with-gzip)

- [优化图片](https://developers.google.com/speed/docs/insights/OptimizeImages)

- [Fast Load Times](https://web.dev/fast)

- [阻塞渲染的 CSS](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-blocking-css)

- [尽可能减少浏览器重排](https://developers.google.com/speed/docs/insights/browser-reflow)
