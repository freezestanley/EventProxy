# ProxyEvent
## Install
```
npm i event-shadow
```

## use
```
import { ProxyEvent } from 'event-shadow'
const proxyEvent = new ProxyEvent()
proxyEvent.addAfterGuard = function (ev) {
  // do something....
}
```
## Info
```
new ProxyEvent(options)
```
> options
+ beforeGuard | 全局event前守卫  | 每次都会触发
+ afterGuard  | 全局event后守卫  | 每次都会触发
+ node        | 被代理元素 默认 HTMLElement.prototype

> Event
+ onBeforeGuard | 全局event前守卫
+ onAfterGuard | 全局event后守卫

> 被代理的元素 new ProxyEvent({node: [document]})

> Add Methods
+ getEventListenerList(type)  | type 事件类型
+ firstGuard(type, callback)  | type 时间类型  | callback 回调函数事件在所有事件之前执行 只会执行一次
+ addBeforeGuard(callback)  | callback 回调函数事件在所有事件之前执行  | 每次都会触发
+ addAfterGuard(callback)  | callback 回调函数事件在所有事件之前执行  | 每次都会触发

## taskQuene
```
import { taskQuene } from 'event-shadow'
const list = [function (evt, next) {
  console.log('this is 1')
  console.log(evt)
  console.log(this)
  next()
}, function (evt, next) {
  console.log('this is 2')
  console.log(evt)
  console.log(this)
  next()
}]
const param = {value: '123'}
const obj = {name: 'obj'}
const a = taskQuene(list, param, obj)
a()

// this is 1
// {value: "123"}
// {name: "obj"}
// this is 2
// {value: "123"}
// {name: "obj"}
```
> taskQuene
+ taskQuene | event = [] callback list, param 参数, argthis









