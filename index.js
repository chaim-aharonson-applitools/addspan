//https://coryrylan.com/blog/wrapping-dom-text-nodes-with-javascript
const elt = document.querySelector('#readme > div.Box-body.px-5.pb-5 > article > ul:nth-child(4)');
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
    parent.removeChild(node);
    txts.forEach((txt, idx) => {
      const span = document.createElement("span");
      span.innerText = txt;
      parent.appendChild(span);
      if(idx<txts.length-1){
        parent.appendChild(document.createTextNode(" "));
      };
    });
  };
})
