const fragment = document.createDocumentFragment();

const elements = [
  h1("Martin's Tech Blog", "motto"),
  div(span("Interests"), "line"),
  span("Automation -×- Functional programming -×- Backend tech", "interests"),
  div("~", "line"),
];

document.body.prepend(...elements);

// ================ Helper functions ================
function h1(text, className = "") { return createElement("h1", className, text) }
function p(text, className = "") { return createElement("p", className, text) }
function div(element, className = "") { return createElement("div", className, element) }
function span(text, className = "") { return createElement("span", className, text) }

function createElement(tag, className, content) {
  const element = document.createElement(tag);
  element.className = className || "";
  if (content instanceof Element) {
    element.appendChild(content);
  } else {
    element.textContent = content || "";
  }
  return element;
}
