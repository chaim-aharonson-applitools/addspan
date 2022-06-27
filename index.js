//https://coryrylan.com/blog/wrapping-dom-text-nodes-with-javascript
//javascript:
const selector = 'body';
const elt = document.querySelector(selector);
let textNodes = [];
const getNodes = (parent) => 
{
  const children = Array.from(parent.childNodes);
  if (children && children.length)
  {
    children.forEach((node) => 
    {
      if (node.nodeType === 3 && node.textContent.trim().length > 1) 
      {
        textNodes.push(node);
      } 
      else 
      {
        getNodes(node);
      }
    });
  }
};


const range = document.createRange();
let textAndLocList = [];
getNodes(elt);
textNodes.forEach(node => 
{
  if(node.data)
  {  
    const splitedText = node.data.split(/(\s+)/);
    const splitedTextNodes = [];
    splitedText.forEach(txt =>
      {
        if (txt.length > 0)
        {
          splitedTextNodes.push(document.createTextNode(txt));
        }
      });

    const parent = node.parentNode;
    const origNodes = Array.from(parent.childNodes);
    
    var updatedNodes = [];
    origNodes.forEach(child => 
    {
      if (child == node)
      {
        splitedTextNodes.forEach(txtNode =>{updatedNodes.push(txtNode);});
      }
      else
      {
        updatedNodes.push(child);
      }
    });
    
    origNodes.forEach(child => {parent.removeChild(child);});
    updatedNodes.forEach(child => {parent.appendChild(child);});
    
    splitedTextNodes.forEach(child => 
      {
        range.selectNode(child);
        const rect = range.getBoundingClientRect();
        const textAndLoc = {tetst: child.data, rect: rect};
        textAndLocList.push(textAndLoc);
      });
  }
});

const r = 1;