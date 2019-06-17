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