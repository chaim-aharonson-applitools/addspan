//https://coryrylan.com/blog/wrapping-dom-text-nodes-with-javascript

const aplt_visible_layer = true;
const aplt_selector = '.Layout-main';

const aplt_func = {
  hasZeroSize: (elt)=>{
    const eltRect = elt.getBoundingClientRect()
    return (eltRect.width === 0 && eltRect.height === 0)
  },
  isTooSmall: (elt)=>{
    const eltRect = elt.getBoundingClientRect()
    return (eltRect.width <= 1 || eltRect.height <= 1)
  },
  isNotVisible: (elt) => {
    if (elt.constructor.name !== 'Range'){
      var eltStyle = window.getComputedStyle(elt, null)
      if (eltStyle.visibility === 'hidden'){
        return 'hidden'
      }
      if (eltStyle.display === 'none') {
        return 'display_none'
      }
      if (eltStyle.opacity && parseInt(eltStyle.opacity) === 0) {
        return 'transparent'
      }
      // TODO: once not debugging use the following line instead of the above conditions
      //return eltStyle.visibility === 'hidden' || eltStyle.display === 'none' || (eltStyle.opacity && parseInt(eltStyle.opacity) === 0)
    }
    return false;
  },
  isIntersecting: (elt, parentElt) => {
    if (elt && parentElt){
      const eltRect = elt.getBoundingClientRect()
      const parentEltRect = parentElt.getBoundingClientRect();
      const utils = aplt_func.utils;
      if (!utils.contains(parentEltRect, eltRect)) {
        const intersection = utils.intersect(parentEltRect, eltRect);
        if (utils.rectTest(intersection, eltRect)) {
          return true;
        }
      }
    }
    return false;
  },
  utils: {
    // Returns true if `a` contains `b`
    contains: (a, b) => (a.x <= b.x && a.y <= b.y && a.right >= b.right && a.bottom >= b.bottom),
    rectTest: (a, b) => (a.height < 0.5 * b.height),
    intersect: (a, b) => {
      var x = Math.max(a.x, b.x);
      var num1 = Math.min(a.right, b.right);
      var y = Math.max(a.y, b.y);
      var num2 = Math.min(a.bottom, b.bottom);
      if (num1 >= x && num2 >= y) {
        return new DOMRect(x, y, num1 - x, num2 - y);
      } else {
        return new DOMRect(0, 0, 0, 0);
      }
    },
    getPageHeight: () => {
      const body = document.body;
      const html = document.documentElement;

      return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    }
  }
}
const aplt_skip_rules = {
  parent: [
    'hasZeroSize',
    'isNotVisible',
    'isTooSmall',
  ],
  child: [
    'hasZeroSize',
    'isNotVisible',
    'isTooSmall',
    'isIntersecting',
  ]
};
const aplt_should_skip = (elt, rulesRef, parentElt) => {
  let should_skip = false;
  aplt_skip_rules[rulesRef].forEach( ruleName => {
    if (!should_skip){
      should_skip = aplt_func[ruleName](elt, parentElt)
      if (should_skip) {
        console.log('>>> skiped with', rulesRef, ruleName, should_skip !== true ? `> ${should_skip}` : '')
      }
    }
  })
  return should_skip;
}

const aplt_elt = document.querySelector(aplt_selector);
const aplt_layer = document.createElement('div');
if (aplt_visible_layer){
  const pageHeight = aplt_func.utils.getPageHeight();
  aplt_layer.style.cssText = `position:absolute;left:0;top:0;right:0;min-height:100%;height:${pageHeight}px;z-index:22222;background-color: rgba(255,255,255,0.5)`;
  document.body.appendChild(aplt_layer);
}
let aplt_textNodes = [];
const aplt_getNodes = (parent) => {
  const children = Array.from(parent.childNodes);
  if (children && children.length) {
    children.forEach((node) => {
      if (node.nodeType === 3 && node.textContent.trim().length > 0) {
        aplt_textNodes.push(node);
      }
      else {
        aplt_getNodes(node);
      }
    });
  }
};
const aplt_range = document.createRange();
const aplt_results = [];
aplt_getNodes(aplt_elt);
aplt_textNodes.forEach(node => {
  if (node.data) {
    const splitedText = node.data.split(/(\s+)/);
    const splitedTextNodes = [];
    splitedText.forEach(txt => {
      if (txt.length > 0) {
        splitedTextNodes.push(document.createTextNode(txt));
      }
    });
    const parent = node.parentNode;
    if(aplt_should_skip(parent, 'parent')){
      return;
    }
    const origNodes = Array.from(parent.childNodes);
    const updatedNodes = [];
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
      aplt_range.selectNode(child);
      if (aplt_should_skip(aplt_range, 'child', parent)) {
        return;
      }
      const rect = aplt_range.getBoundingClientRect();
      if (aplt_visible_layer) {
        const rect_layer = document.createElement('div');
        const parent_style = window.getComputedStyle(child.parentNode, null);
        rect_layer.style.cssText = `position:absolute;left:${rect.x}px;top:${rect.y}px;width:${rect.width}px;height:${rect.height}px;z-index:10;color: green; font: ${parent_style.getPropertyValue('font')};`; //
        rect_layer.style.lineHeight = '';
        rect_layer.innerHTML = child.data;
        aplt_layer.appendChild(rect_layer);
      }
      aplt_results.push({ text: child.data, rect });
    });
  }
  const body_elt = document.querySelector('body');
  body_elt.setAttribute('data-applitools-info', JSON.stringify(aplt_results))
})