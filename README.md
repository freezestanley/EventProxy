# ProxyEvent
## ProxyEvent install
```
npm i event-shadow
```

## ProxyEvent use
```
import { ProxyEvent } from 'event-shadow'
const proxyEvent = new ProxyEvent()
proxyEvent.addAfterGuard = function (ev) {
  // do something....
}
```

###
```
new ProxyEvent(options)
```
> options
+ beforeGuard | 全局event前守卫
+ afterGuard  | 全局event后守卫
+ node        | 被代理元素 默认 HTMLElement.prototype

# const eventproxy = new EventProxy() 







