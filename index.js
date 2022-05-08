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
    const txts = node.data.split(" ");
    const parent = node.parentNode;
    const wrapper = document.createElement("span");
    const space1 = String.fromCharCode(160);
    const space2 = "\u2009";
    const t = node.data[0];
    let statrtWithSpace = t.includes(space1) || t.includes(" ") || t.includes(space2);
    
    txts.forEach((txt, idx) => 
    {
      const trimText = txt.trim();
      
      const wrappText = trimText.length > 0;
      if(wrappText)
      {
        if (idx == 0 && statrtWithSpace)
        {
          wrapper.appendChild(document.createTextNode(node.data[0]));
        }
        
        wrapper.appendChild(document.createTextNode(trimText));
        if(idx<txts.length-1)
        {
          wrapper.appendChild(document.createTextNode(" "));
        }
      }
      else
      {
        wrapper.appendChild(document.createTextNode(" "));
      }
    });
    
    const splitedTextNodes = Array.from(wrapper.childNodes);
    const origNodes = Array.from(parent.childNodes);
    var updatedNodes = [];
    
    origNodes.forEach(child => 
    {
      if (child == node)
      {
        splitedTextNodes.forEach(txtNode =>
          {
              updatedNodes.push(txtNode);
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