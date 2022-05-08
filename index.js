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

getNodes(elt);
textNodes.forEach(node => 
{
  if(node.data)
  {  
    const splitedText = node.data.split(/(\s+)/); 
    const parent = node.parentNode;
    const origNodes = Array.from(parent.childNodes);
    
    var updatedNodes = [];
    origNodes.forEach(child => 
    {
      if (child == node)
      {
        splitedText.forEach(txt =>
          {
            if (txt.length > 0)
            {
              updatedNodes.push(document.createTextNode(txt));
            }
          });
      }
      else
      {
        updatedNodes.push(child);
      }
    });
    
    origNodes.forEach(child => {parent.removeChild(child);});
    updatedNodes.forEach(child => {parent.appendChild(child);});
  }
});