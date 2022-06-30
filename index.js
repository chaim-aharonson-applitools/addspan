
//https://coryrylan.com/blog/wrapping-dom-text-nodes-with-javascript
//javascript:
const selector = '.Layout-main';
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
      const rect_layer = document.createElement('div');
      rect_layer.style.cssText = `position:absolute;left:${rect.x}px;top:${rect.y}px;width:${rect.width}px;height:${rect.height}px;z-index:10;color: yellow;`;
      rect_layer.innerHTML = child.data;
      layer.appendChild(rect_layer);
      const textAndLoc = { text: child.data, rect };
      textAndLocList.push(textAndLoc);
    });
  }
})