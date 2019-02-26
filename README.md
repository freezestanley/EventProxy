# EventProxy
DOM EventListener EventProxy

# proxy dom event

```
import EventProxy from 'dom-event-proxy'
const eventproxy = new EventProxy()
eventproxy.callback = function (ev) {
  debugger
  console.log('==============ev==================')
  console.log(ev)
}
document.addEventListener("DOMContentLoaded", function(event) {
  document.body.onclick = function (e) {
    console.log('========body onclick===============')
  }
  document.body.addEventListener('click', function (e) {
    console.log('========body addEventListener click===============')
  })
})
```

# const eventproxy = new EventProxy() 
> 页面最开始地方引入
> 当dom 元素被绑定事件后 会有__eventList 属性 里面存放 dom绑定事件列队
