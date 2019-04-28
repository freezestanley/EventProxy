module.exports.taskQuene = function taskQuene (event = [], param, target) {
  let eventlist = event.filter(e => e)
  if (eventlist.length < 1) return function () {}
  let cur = eventlist.shift()
  return function (evt = param) {
    cur.call(target, evt, taskQuene(eventlist, evt, target))
  }
}