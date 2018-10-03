
# 第三部分 -> `router.init(this)`

::: tip 概述
vue-router源码第三部分，该部分分析`router.init(this)`的执行过程。 this指的是new Vue的实例对象。
:::

## 一、router.init(this)
```javascript
init (app: any /* Vue component instance */) {

    // 1. 缓存所有app
    this.apps.push(app)

    // 2. 阻止重复执行 init
    //main app already initialized.
    if (this.app) {
      return
    }

    this.app = app
    // 3. 
    const history = this.history

    if (history instanceof HTML5History) {
      history.transitionTo(history.getCurrentLocation())
    } else if (history instanceof HashHistory) {
      const setupHashListener = () => {
        history.setupListeners()
      }
      history.transitionTo(
        // 获取当前的url hash  
        history.getCurrentLocation(),
        setupHashListener,
        setupHashListener
      )
    }

    history.listen(route => {
      this.apps.forEach((app) => {
        app._route = route
      })
    })
  }
```
### 1. 第3步，`history.transitionTo`
```javascript
const setupHashListener = () => {
        history.setupListeners()
      }
 history.transitionTo(
        // 获取浏览器当前的url 的 hash  
        history.getCurrentLocation(),
        setupHashListener,
        setupHashListener
      )
```
#### i. `history.transitionTo`的代码如下：
```javascript
transitionTo (location, onComplete, onAbort) {
    // 1. 根据当前传入location, 找到pathMap 或 nameMap中的匹配项
    const route = this.router.match(location, this.current)

    this.confirmTransition(route, () => {
      this.updateRoute(route)
      onComplete && onComplete(route)
      this.ensureURL()

      // fire ready cbs once
      if (!this.ready) {
        this.ready = true
        this.readyCbs.forEach(cb => { cb(route) })
      }
    }, err => {
      if (onAbort) {
        onAbort(err)
      }
      if (err && !this.ready) {
        this.ready = true
        this.readyErrorCbs.forEach(cb => { cb(err) })
      }
    })
  }
```
执行到`this.router.match(location, this.current)`, 代码如下：
```javascript
function match (
    raw: RawLocation,
    currentRoute?: Route,
    redirectedFrom?: Location
  ): Route {
    // 1. 格式化, 成 {path,query,hash}
    const location = normalizeLocation(raw, currentRoute, false, router)
> xxxxxxxx

    const { name } = location
    // 2 如果raw有name属性, 则执行此步骤
    // 如果raw 有name属性, 在上一步normalizeLocation()时, 返回的值就是raw, 
    // 此时 location = raw
    if (name) {
      const record = nameMap[name]
      if (process.env.NODE_ENV !== 'production') {
        warn(record, `Route with name '${name}' does not exist`)
      }
      if (!record) return _createRoute(null, location)
      const paramNames = record.regex.keys
        .filter(key => !key.optional)
        .map(key => key.name)

      if (typeof location.params !== 'object') {
        location.params = {}
      }

      if (currentRoute && typeof currentRoute.params === 'object') {
        for (const key in currentRoute.params) {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key]
          }
        }
      }

      if (record) {
        location.path = fillParams(record.path, location.params, `named route "${name}"`)
        return _createRoute(record, location, redirectedFrom)
      }
    } 
    // 3. 如果!location.name && location.path
    // 通常router.init()时, 会执行这里
    // 将当前的路由与 pathMap中的路由进行匹配, 找到对应项
    else if (location.path) {
      location.params = {}
      for (let i = 0; i < pathList.length; i++) {
        const path = pathList[i]
        const record = pathMap[path]
        if (matchRoute(record.regex, location.path, location.params)) {
          return _createRoute(record, location, redirectedFrom)
        }
      }
    }
    // no match
    return _createRoute(null, location)
  }

```