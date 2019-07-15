//获取结点xpath.
module.exports = function readXPath (element) {
  function findId (ele) {
    if (ele == document.body) {//递归到body处，结束递归
      return '/html/' + ele.tagName.toLowerCase();
    }
    if (!ele.parentNode) {
      return "/html";
    }
    if (ele.id && ele.id.length >= 1) {
      return '//*[@id=\"' + ele.id + '\"]';
    }
    if (ele.parentNode) {
      var ix = 1,//在nodelist中的位置，且每次点击初始化
      siblings = ele.parentNode.childNodes;//同级的子元素
      for (var i = 0, l = siblings.length; i < l; i++) {
        var sibling = siblings[i];
        //如果这个元素是siblings数组中的元素，则执行递归操作
        if (sibling == ele) {
          return findId(ele.parentNode) + '/' + ele.tagName.toLowerCase() + '[' + (ix) + ']';
          //如果不符合，判断是否是element元素，并且是否是相同元素，如果是相同的就开始累加
        } else if (sibling.nodeType == 1 && sibling.tagName == element.tagName) {
        // } else {
          ix++;
        }
      }
    }
  }
  return findId(element).replace('/html[1]', '')
};