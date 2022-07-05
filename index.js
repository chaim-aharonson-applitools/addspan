
//https://coryrylan.com/blog/wrapping-dom-text-nodes-with-javascript
//javascript:

// Returns true if `a` contains `b`
// (x1, y1) and (x2, y2) are top-left and bottom-right corners
const contains = (a, b) => (a.x <= b.x && a.y <= b.y && a.right >= b.right && a.bottom >= b.bottom);
const rectdTest = (a, b) => (a.height < 0.5* b.height);
const intersect = (a, b) => {
  var x = Math.max(a.x, b.x);
  var num1 = Math.min(a.right, b.right);
  var y = Math.max(a.y, b.y);
  var num2 = Math.min(a.bottom, b.bottom);
  if (num1 >= x && num2 >= y)
    return new DOMRect(x, y, num1 - x, num2 - y);
  else
    return new DOMRect(0, 0, 0, 0);
  }


const selector = 'body';
const elt = document.querySelector(selector);
const layer = document.createElement('div');
layer.style.cssText = 'position:fixed;left:0;top:0;bottom:0;right:0;z-index:22222;background-color: rgba(255,255,255,0.5)';
document.body.appendChild(layer);
let textNodes = [];
const getNodes = (parent) => {
  const children = Array.from(parent.childNodes);
  if (children && children.length) {
    children.forEach((node) => {
      if (node.nodeType === 3 && node.textContent.trim().length > 1) {
        textNodes.push(node);
      }
      else {
        getNodes(node);
      }
    });
  }
};


const range = document.createRange();
let textAndLocList = [];
getNodes(elt);
textNodes.forEach(node => {
  if (node.data) {
    const splitedText = node.data.split(/(\s+)/);
    const splitedTextNodes = [];
    splitedText.forEach(txt => {
      if (txt.length > 0) {
        splitedTextNodes.push(document.createTextNode(txt));
      }
    });

    const parent = node.parentNode;
    var parentRect = parent.getBoundingClientRect()
    if (parentRect.width == 0 && parentRect.height == 0)
    {
      return;
    } 
    
    var parentStyle = window.getComputedStyle(parent, null);
    if (parentStyle.visibility  === "hidden"){
      return;
    }
    const origNodes = Array.from(parent.childNodes);

    var updatedNodes = [];
    origNodes.forEach(child => {
      if (child == node) {
        splitedTextNodes.forEach(txtNode => { updatedNodes.push(txtNode); });
      }
      else {
        updatedNodes.push(child);
      }
    });

    origNodes.forEach(child => { parent.removeChild(child); });
    updatedNodes.forEach(child => { parent.appendChild(child); });

    splitedTextNodes.forEach(child => {
      range.selectNode(child);
      const rect = range.getBoundingClientRect();
      var rect_layer = document.createElement('div');
      var schtyle = window.getComputedStyle(child.parentNode, null); // .getPropertyValue('font-size');

      if (!contains(parentRect, rect))
      {
        var intersection = intersect(parentRect, rect);
        if (rectdTest(intersection, rect))
        {
          return;
        }
      }
      
      if (rect.width == 0 && rect.height == 0)
      {
        return;
      }
      
      rect_layer.style.cssText = `position:absolute;left:${rect.x}px;top:${rect.y}px;width:${rect.width}px;height:${rect.height}px;z-index:10;color: green; font: ${schtyle.getPropertyValue('font')};`; //
      rect_layer.style.lineHeight = '';
      rect_layer.innerHTML = child.data;
      layer.appendChild(rect_layer);
      const textAndLoc = { text: child.data, rect };
      textAndLocList.push(textAndLoc);
    });
  }
})