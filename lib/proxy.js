const taskQuene = require('./task.js')
module.exports = class proxyEvent {
  constructor (options = null) {
    this._beforeGuard = options ? options.beforeGuard || null : null
    this._afterGuard = options ? options.afterGuard || null : null
    this._node = options ? options.node || [] : []
    let node = [HTMLElement.prototype, ...this._node]
    node.map((e) => {
      this.initEventproxy(e)
    }, this)
  }
  get onBeforeGuard () {
    return this._beforeGuard
  }
  set onBeforeGuard (fun) {
    this._beforeGuard = fun
  }
  get onAfterGuard () {
    return this._afterGuard
  }
  set onAfterGuard (fun) {
    this._afterGuard = fun
  }
  initEventproxy (target) {
    let self = this
    target['__proxy'] = {
      __addEvent: target.addEventListener,
      __removeEvent: target.removeEventListener,
      __beforeGuard: [],
      __afterGuard: [],
      __firstGuard: {},
      __eventOrginList: {},
      __eventShadowList: {},
      __onEventGuard: {}
    }
    target.addBeforeGuard = function (e) {
      this.__proxy.__beforeGuard.push(e)
    }
    target.addAfterGuard = function (e) {
      this.__proxy.__afterGuard.push(e)
    }
    target.getEventListenerList = function (type) {
      return this.__proxy.__eventOrginList[type]
    }
    target.firstGuard = function (type, fun) {
      this.__proxy.__firstGuard[type] = fun
    }
    Object.defineProperty(target, 'addEventListener', {
      get: function () {
        return function (type, listener, options, useCapture) {
          let shadow = typeof listener === 'object' ? options.noShadow : false
          if (shadow) {
            this.__proxy.__eventShadowList[type] = this.__proxy.__eventShadowList[type] || []
            this.__proxy.__eventShadowList[type].push(listener)
            this.__proxy.__addEvent.call(this, type, listener, options, useCapture)
          } else {
            this.__proxy.__eventOrginList[type] = this.__proxy.__eventOrginList[type] || []
            let eventObject = {
              type,
              target: typeof listener === 'object' ? listener : target,
              handleEvent: function (evt) {
                if (typeof listener === 'object') {
                  (taskQuene([
                    self.addBeforeGuard,
                    ...target['__proxy']['__beforeGuard'],
                    function (evt, next) {
                      listener.handleEvent(evt)
                      taskQuene(target['__proxy']['__afterGuard'], evt, this)()
                      self.addAfterGuard && self.addAfterGuard.call(this, evt, function () {})
                    }
                  ], evt, this.target))()
                } else {
                  (taskQuene([
                    self.addBeforeGuard,
                    ...target['__proxy']['__beforeGuard'],
                    function (evt, next) {
                      listener.call(this, evt)
                      taskQuene(target['__proxy']['__afterGuard'], evt, this)()
                      self.addAfterGuard && self.addAfterGuard.call(this, evt, function () {})
                    }
                  ], evt, this.target))()
                }
              },
              options,
              useCapture
            }
            if (this.__proxy.__eventOrginList[type].length < 1 && this.__proxy.__firstGuard[type]) {
              let fun = eventObject.handleEvent
              eventObject.handleEvent = function (evt) {
                target.__proxy.__firstGuard[type].call(this.target, evt)
                fun.call(this, evt)
              }
            }
            this.__proxy.__eventOrginList[type].push({
              type,
              listener,
              options,
              useCapture,
              handleEvent: eventObject
            })
            this.__proxy.__addEvent.call(this, type, eventObject, options, useCapture)
          }
        }
      },
      enumerable: true,
      configurable: true
    })
    Object.defineProperty(target, 'removeEventListener', {
      get: function () {
        return function (type, listener, options, useCapture) {
          if (!listener) return this.__proxy.__removeEvent.call(this, type, listener, options, useCapture)
          if (this.__proxy.__eventOrginList && this.__proxy.__eventOrginList[type] && this.__proxy.__eventOrginList[type].length > 0) {
            let index = this.__proxy.__eventOrginList[type].findIndex((ele, idx, arr) => {
              return ele.listener === listener && ele.options === options
            })
            if ( index >= 0) {
              this.__proxy.__removeEvent.call(this, type, this.__proxy.__eventOrginList[type][index].handleEvent, options, useCapture)
              this.__proxy.__eventOrginList[type].splice(index, 1)
              return
            }
          }
          if (this.__proxy.__eventShadowList && this.__proxy.__eventShadowList[type] && this.__proxy.__eventShadowList[type].length > 0) {
            let shadowIndex = this.__proxy.__eventShadowList[type].findIndex((ele, idx, arr) => {
              return ele === listener && ele.options === options
            })
            if (shadowIndex >= 0) {
              this.__proxy.__removeEvent.call(this, type, this.__proxy.__eventShadowList[type][shadowIndex], options, useCapture)
              this.__proxy.__eventShadowList[type].splice(shadowIndex, 1)
              return
            }
          } 
          this.__proxy.__removeEvent.call(this, type, listener, options, useCapture)
        }
      },
      enumerable: true,
      configurable: true
    })
    for (let i in target) {
      if (i.indexOf('on') === 0) {
        let proty = Object.getOwnPropertyDescriptor(target, i)
        if (proty && !proty.configurable) {
          continue
        }
        Object.defineProperty(target, i, {
          get: function (e) {
            return this.__proxy.__onEventGuard && this.__proxy.__onEventGuard[`__${i}`]
              ? this.__proxy.__onEventGuard[`__${i}`]
              : null
          },
          set: function (newValue) {
            this.__proxy.__onEventGuard = this.__proxy.__onEventGuard ? this.__proxy.__onEventGuard : {}
            let type = i.split('on')[1]
            if (newValue) {
              this.addEventListener(type, newValue)
            } else {
              this.removeEventListener(type, this.__proxy.__onEventGuard[`__${i}`])
            }
            this.__proxy.__onEventGuard[`__${i}`] = newValue
          },
          enumerable: true,
          configurable: true
        })
      }
    }
  }
}