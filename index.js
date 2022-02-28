//https://coryrylan.com/blog/wrapping-dom-text-nodes-with-javascript
//javascript:
const selector = 'body';
const elt = document.querySelector(selector);
let textNodes = [];
const getNodes = (parent) => {
  const children = Array.from(parent.childNodes);
  if (children && children.length){
    children.forEach((node) => {
      if (node.nodeType === 3 && node.textContent.trim().length > 1) {
        textNodes.push(node);
      } else {
        getNodes(node);
      }
    });
  }
};
getNodes(elt);
textNodes.forEach(node => {
  if(node.data){
    const txts = node.data.split(" ");
    const parent = node.parentNode;
    const wrapper = document.createElement("span");
    txts.forEach((txt, idx) => {
      if(txt.trim().length){
        const span = document.createElement("span");
        span.innerText = txt.trim();
        wrapper.appendChild(span);
        if(idx<txts.length-1){
          wrapper.appendChild(document.createTextNode(" "));
        };
      }else{
        wrapper.appendChild(document.createTextNode(" "));
      }
    });
    parent.replaceChild(wrapper, node);
  };
})
