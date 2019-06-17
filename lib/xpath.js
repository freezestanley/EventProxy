module.exports = function queryXpathDoms (xpath) {
  var paths = xpath.split('/').filter(e => e);
  var node = document;

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (path == '') {
      continue;
    }
    if (path == 'html') {
      continue;
    }
    if (path == 'body') {
      node = document.body;
      continue;
    }
    var tagName = path;
    if (path.indexOf('@id=') >= 0) {
      node = document.getElementById(path.split('"')[1])
      var islast = paths.length - 1
      if (i == islast) {
        return tag
      } else {
        continue
      }
    }
    var tagIndex = 1;
    if (path.indexOf('[') >= 0) {
      tagName = path.split('[')[0];
      tagIndex = parseInt(path.split('[')[1]);
    }
    // var childNode = node.childNodes[tagIndex]
    // if (childNode.tagName && childNode.tagName.toLowerCase() == tagName) {
    //   node = childNode
    //   if (i == (paths.length - 1)) {
    //     return node
    //   } else {
    //     continue
    //   }
    // }
    var childNodes = node.childNodes;
    var tagCnt = 1;
    var flag = false;
    for (var j = 0; j < childNodes.length; j++) {
      var childNode = childNodes[j];
      if (childNode.tagName && childNode.tagName.toLowerCase() == tagName) {
        if (tagCnt == tagIndex) {
          flag = true;
          findDom = childNode;
          node = childNode;
          break;
        }
        tagCnt++;
      }
    }
    //找到了.
    if (flag) {
      //是否是最后一个
      if (i == paths.length - 1) {
        break;
      }
      findDom = null;
      continue;
    } else { //没找到. 就结束了
      break;
    }
  }
  return findDom;
};
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
  return findId(element)
};
//获取域名, 
module.exports = function getDomain (willCookieDomain) {
  var domain = location.hostname;
  if (!willCookieDomain) {
    return domain;
  }
  var ds = domain.split('\.');
  if (ds.length >= 3) {
    domain = '';
    for (var i = 1; i < ds.length; i++) {
      domain += '.' + ds[i];
    }
  }
  return domain;
};