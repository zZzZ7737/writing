---
tags: ['javascript', '基础知识']
createTime: '2018-10-30'
---

参考：[Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/?utm_source=html5weekly)

# javascript线程&异步&Event Loop
最近虽然自己没有面试，但是为了提高自己，看了不少人的面试题，多多少少会提到事件循环（Event Loop）这个概念，于是，各种搜索学习。这就把自己的领悟的东西记一下，不一定都对，但也是代表现阶段的水平。
## 为什么javascript要是单线程的
javascript在设计之初就是单线程的。考虑到javascript的用处：操作DOM、处理各种交互，如果javascript被设计成多线程，那么当一个线程删除了一个DOM节点，而另一个线程却正在使用这个节点，此时，要怎么处理呢？为了避免这种可能导致bug的复杂性问题，单线程无疑是很好的选择。
## 什么是单线程？单线程存在的问题及解决方法
单线程，即任务按照顺序依次执行，后面的必须等到前面的执行完成后才能执行。如果前面的任务执行了很久，后面的任务就要一直等待。故而，单线程虽然简单，但效率却不高。所幸，在我们可以使用异步操作来提高效率。比如：在开发中常常需要进行数据请求操作，在发送请求后，如果一直等待接口返回数据后再进行操作，中间往往会有很长的空档期（IO、网络延迟）。如果在这段时间什么都不做的话，用户体验会很不好。因此往往会使用异步请求。
## javascript执行环境
单线程跟异步？有的人可能会想，这不是互相矛盾吗？事实上，javascript作为一个单线程执行的语言，确实不能同时实现异步，但是`javascript的执行环境`（浏览器、NodeJs）是多线程的啊。我们的一些I/O操作、定时器、事件监听等异步操作，都是执行环境通过其他线程来完成的。需要明白，*javascript的执行* 跟*javascript指令的实现* 是不同的概念，不同的执行环境有不同的实现。

>javascript中可以在函数代码未执行前就调用这个函数，是因为ECMAscript标准规定可以这么做，故而执行环境做了这个实现，而不是说javascript不是单线程。

在浏览器中，可以使用的异步操作指令或方法有`setInterval`、`setTimeout`、`Promise`、`postMessage`等。
## Event Loop
Event Loop就是执行环境实现javascript异步的解决方式。先看下面代码：
```javascript
function one() {
  console.log(1)
}
function two() {
  setTimeout(()=>{
    console.log(2)
  })
+}
function three() {
  setTimeout(()=>{
    console.log(3)
  })
  // new Promise(resolve=>{
  //   resolve()
  // }).then(res=> {
  //   console.log(4)
  // })
}
one()
two()
three()
```
执行过程如下：
![avatar](./imgs/event-loop.1.png)

当javascript线程中`所有的同步任务执行完成后`，javascript执行环境会读取异步任务队列，如果任务队列中有任务，则将所有任务拿到javascript线程上执行，过程如下：
![avatar](./imgs/event-loop.2.png)

此时，又回到第一种情况了。

### Promise异步
Promise的异步产生的任务将`直接作为同步任务放在当前同步任务队列的最后`，这样就导致了Promise的异步比其他所有异步方法的优先级更高，即使 new Promise的执行晚于其他异步。
![avatar](./imgs/event-loop.3.png)

### setTimeout异步
javascript执行环境有一个专用线程负责管理时间延迟函数，当我们使用`setTimeout`函数时，javascript执行环境的实现如下：

![avatar](./imgs/event-loop.4.png)

请注意，在3000ms后将函数推入异步任务队列，这意味着不一定会立即执行，如果此时javascript线程内还有很长很多的同步代码要执行，这个异步函数必须等到所有的同步任务执行完才能被推入javascript线程中执行，这就是为什么`setTimeout`延迟有时不能严格的按照设置的延迟时间进行执行。
### requestAnimationFrame异步
`requestAnimationFrame`函数也只是按照屏幕刷新的时间间隔将异步任务推入到异步任务队列，而不是按照刷新时间立即执行
