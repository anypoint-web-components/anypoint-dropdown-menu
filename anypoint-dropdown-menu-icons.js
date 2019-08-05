import '@polymer/iron-iconset-svg/iron-iconset-svg.js';
const $documentContainer = document.createElement('template');
$documentContainer.innerHTML = `<iron-iconset-svg name="paper-dropdown-menu" size="16">
<svg><defs>
<g id="arrow-drop-down"><path xmlns="http://www.w3.org/2000/svg" d="M8.002 11.352L3.501 4.924l1.027-.276 3.473 4.96 3.471-4.959 1.027.275-4.497 6.428z"></path></g>
</defs></svg>
</iron-iconset-svg>`;
document.head.appendChild($documentContainer.content);
