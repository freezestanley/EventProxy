class proxyEvent {
  constructor (callback = null) {
    this._callback = callback
    let _self = this
    let pry = HTMLElement.prototype
    pry['__proxy']  = {
      __addEvent: HTMLElement.prototype.addEventListener,
      __removeEvent: HTMLElement.prototype.removeEventListener
    }
    Object.defineProperty(HTMLElement.prototype, 'addEventListener', {
      get : function(){
        return function (type, listener, options, useCapture) {
          let _this = this
          this.__eventList = this.__eventList ? this.__eventList : new Array()
          this.__eventOrginList = this.__eventOrginList ? this.__eventOrginList : new Array()
          let listenerCallback = (e) => {
            _self._callback ? _self._callback.call(_this, e) : null
            listener.call(_this, e)
          }
          this.__proxy.__addEvent.call(this, type, listenerCallback, options, useCapture)
          this.__eventList.push({type , listener: listenerCallback})
          this.__eventOrginList.push({type, listener})
        }
      },
      enumerable : true,
      configurable : true
    })
    Object.defineProperty(HTMLElement.prototype, 'removeEventListener', {
      get : function(){
        return function (type, listener, options, useCapture) {
          let _this = this
          this.__eventOrginList = this.__eventOrginList ? this.__eventOrginList : new Array()
          let index = this.__eventOrginList.findIndex((ele, idx, arr) => {
            return ele.listener === listener
          })
          if (index >= 0 ) {
            let event = this.__eventList[index].listener
            this.__proxy.__removeEvent.call(this, type, event, options, useCapture)
            this.__eventOrginList.splice(index, 1)
            this.__eventList.splice(index, 1)
          }
        }
      },
      enumerable : true,
      configurable : true
    })

    for (let i in pry) {
      if (i.indexOf('on') === 0) {
        let abc 
          Object.defineProperty(HTMLElement.prototype, i, {
            get : function(e){
              return this.__pro && this.__pro[`__${i}`] ? this.__pro[`__${i}`] : null ;
            },
            set : function(newValue){
              this.__pro = this.__pro ? this.__pro : Object.create(this.__proxy)
              let type = i.split('on')[1]
              if (newValue){
                this.addEventListener(type, newValue)
              } else {
                this.removeEventListener(type, this.__pro[`__${i}`])
              }
              abc = newValue
              this.__pro[`__${i}`] = abc
            },
            enumerable : true,
            configurable : true
          })
      }
    }
  }

  get callback () {
    return this._callback
  }
  
  set callback (fun) {
    this._callback = fun
  }
}


module.exports = proxyEvent