class proxyEvent {
  constructor(options = null) {
    let _self = this;
    this._callback = options ? options.callback || null : null;
    this._includeWindows = options ? options.includeWindows || true : true;
    if (this._includeWindows) {
      this.initEventproxy(window);
    }
    this.initEventproxy(HTMLElement.prototype);
    this.initEventproxy(document);
  }

  get callback() {
    return this._callback;
  }

  set callback(fun) {
    this._callback = fun;
  }

  initEventproxy(target) {
    let _self = this;
    target["__proxy"] = {
      __addEvent: target.addEventListener,
      __removeEvent: target.removeEventListener,
      __run: "once"
    };
    // noShadow
    // once
    target.getEventListenerList = function(e) {
      return this.__eventOrginList[e];
    };

    Object.defineProperty(target, "mode", {
      get: function() {
        return this.__proxy.__run;
      },
      set: function(val) {
        this.__proxy.__run = val;
        let _self = this;
        for (var i in this.__eventList) {
          this.__eventList[i].map((e, idx, arr) => {
            _self.__proxy.__removeEvent.call(
              _self,
              e.type,
              e.listener,
              e.options
            );
          });
        }
        this.__eventList = {};
        const origin = Object.assign(this.__eventOrginList);
        this.__eventOrginList = {};
        for (var i in origin) {
          origin[i].map((e, idx, arr) => {
            this.addEventListener(e.type, e.listener, e.options);
          });
        }
      },
      enumerable: true,
      configurable: true
    });

    Object.defineProperty(target, "addEventListener", {
      get: function() {
        return function(type, listener, options, useCapture) {
          let _this = this;

          this.__eventList = this.__eventList || {};
          this.__eventOrginList = this.__eventOrginList || {};
          this.__eventList[type] = this.__eventList[type] || [];
          this.__eventOrginList[type] = this.__eventOrginList[type] || [];

          let listenerCallback;

          if (this.mode === "once") {
            if (typeof options === "object" && options.noShadow) {
              listenerCallback = e => {
                listener.call(_this, e);
              };
            } else {
              if (
                this.__eventList[type].length ===
                this.__eventOrginList[type].length
              ) {
                listenerCallback = e => {
                  _self._callback && _self._callback.call(_this, e);
                };

                this.__proxy.__addEvent.call(this, type, listenerCallback);
                this.__eventList[type].unshift({
                  type,
                  listener: listenerCallback,
                  options: null
                });
              }
            }

            listenerCallback = e => {
              listener.call(_this, e);
            };
            this.__proxy.__addEvent.call(
              this,
              type,
              listenerCallback,
              options,
              useCapture
            );
            this.__eventList[type].push({
              type,
              listener: listenerCallback,
              options
            });
            this.__eventOrginList[type].push({ type, listener });
          } else {
            if (typeof options === "object") {
              if (options.noShadow) {
                listenerCallback = e => {
                  listener.call(_this, e);
                };
              }
            } else {
              listenerCallback = e => {
                _self._callback && _self._callback.call(_this, e);
                listener.call(_this, e);
              };
            }

            this.__proxy.__addEvent.call(
              this,
              type,
              listenerCallback,
              options,
              useCapture
            );

            this.__eventList[type].push({
              type,
              listener: listenerCallback,
              options
            });
            this.__eventOrginList[type].push({ type, listener });
          }
        };
      },
      enumerable: true,
      configurable: true
    });

    Object.defineProperty(target, "removeEventListener", {
      get: function() {
        return function(type, listener, options, useCapture) {
          let _this = this;

          if (!this.__eventOrginList || !this.__eventOrginList[type]) return;

          this.__eventOrginList = this.__eventOrginList || {};

          let index = this.__eventOrginList[type].findIndex((ele, idx, arr) => {
            return ele.listener === listener;
          });
          if (index >= 0) {
            let num = this.mode === "once" ? index + 1 : index;
            let event = this.__eventList[type][num].listener;
            this.__proxy.__removeEvent.call(
              this,
              type,
              event,
              options,
              useCapture
            );
            this.__eventOrginList[type].splice(index, 1);
            this.__eventList[type].splice(num, 1);
            if (this.__eventOrginList[type].length === 0) {
              this.__eventList[type] = [];
            }
          }
        };
      },
      enumerable: true,
      configurable: true
    });

    for (let i in target) {
      if (i.indexOf("on") === 0) {
        let abc;
        Object.defineProperty(target, i, {
          get: function(e) {
            return this.__pro && this.__pro[`__${i}`]
              ? this.__pro[`__${i}`]
              : null;
          },
          set: function(newValue) {
            this.__pro = this.__pro ? this.__pro : Object.create(this.__proxy);
            let type = i.split("on")[1];
            if (newValue) {
              this.addEventListener(type, newValue);
            } else {
              this.removeEventListener(type, this.__pro[`__${i}`]);
            }
            abc = newValue;
            this.__pro[`__${i}`] = abc;
          },
          enumerable: true,
          configurable: true
        });
      }
    }
  }
}
module.exports = proxyEvent;
