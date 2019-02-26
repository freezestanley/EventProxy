# EventProxy
DOM EventListener EventProxy

# proxy dom event

```
import EventProxy from 'proxyEvent'
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
