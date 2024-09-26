// build/dev/javascript/prelude.mjs
var CustomType = class {
  withFields(fields) {
    let properties = Object.keys(this).map(
      (label) => label in fields ? fields[label] : this[label]
    );
    return new this.constructor(...properties);
  }
};
var List = class {
  static fromArray(array3, tail) {
    let t = tail || new Empty();
    for (let i = array3.length - 1; i >= 0; --i) {
      t = new NonEmpty(array3[i], t);
    }
    return t;
  }
  [Symbol.iterator]() {
    return new ListIterator(this);
  }
  toArray() {
    return [...this];
  }
  // @internal
  atLeastLength(desired) {
    for (let _ of this) {
      if (desired <= 0)
        return true;
      desired--;
    }
    return desired <= 0;
  }
  // @internal
  hasLength(desired) {
    for (let _ of this) {
      if (desired <= 0)
        return false;
      desired--;
    }
    return desired === 0;
  }
  countLength() {
    let length3 = 0;
    for (let _ of this)
      length3++;
    return length3;
  }
};
function prepend(element2, tail) {
  return new NonEmpty(element2, tail);
}
function toList(elements, tail) {
  return List.fromArray(elements, tail);
}
var ListIterator = class {
  #current;
  constructor(current) {
    this.#current = current;
  }
  next() {
    if (this.#current instanceof Empty) {
      return { done: true };
    } else {
      let { head, tail } = this.#current;
      this.#current = tail;
      return { value: head, done: false };
    }
  }
};
var Empty = class extends List {
};
var NonEmpty = class extends List {
  constructor(head, tail) {
    super();
    this.head = head;
    this.tail = tail;
  }
};
var Result = class _Result extends CustomType {
  // @internal
  static isResult(data) {
    return data instanceof _Result;
  }
};
var Ok = class extends Result {
  constructor(value) {
    super();
    this[0] = value;
  }
  // @internal
  isOk() {
    return true;
  }
};
var Error = class extends Result {
  constructor(detail) {
    super();
    this[0] = detail;
  }
  // @internal
  isOk() {
    return false;
  }
};
function remainderInt(a, b) {
  if (b === 0) {
    return 0;
  } else {
    return a % b;
  }
}
function makeError(variant, module, line, fn, message, extra) {
  let error = new globalThis.Error(message);
  error.gleam_error = variant;
  error.module = module;
  error.line = line;
  error.fn = fn;
  for (let k in extra)
    error[k] = extra[k];
  return error;
}

// build/dev/javascript/gleam_stdlib/gleam/option.mjs
var Some = class extends CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
};
var None = class extends CustomType {
};

// build/dev/javascript/gleam_stdlib/dict.mjs
var tempDataView = new DataView(new ArrayBuffer(8));
var SHIFT = 5;
var BUCKET_SIZE = Math.pow(2, SHIFT);
var MASK = BUCKET_SIZE - 1;
var MAX_INDEX_NODE = BUCKET_SIZE / 2;
var MIN_ARRAY_NODE = BUCKET_SIZE / 4;

// build/dev/javascript/gleam_stdlib/gleam_stdlib.mjs
function identity(x) {
  return x;
}
function to_string(term) {
  return term.toString();
}
function join(xs, separator) {
  const iterator = xs[Symbol.iterator]();
  let result = iterator.next().value || "";
  let current = iterator.next();
  while (!current.done) {
    result = result + separator + current.value;
    current = iterator.next();
  }
  return result;
}
var unicode_whitespaces = [
  " ",
  // Space
  "	",
  // Horizontal tab
  "\n",
  // Line feed
  "\v",
  // Vertical tab
  "\f",
  // Form feed
  "\r",
  // Carriage return
  "\x85",
  // Next line
  "\u2028",
  // Line separator
  "\u2029"
  // Paragraph separator
].join("");
var left_trim_regex = new RegExp(`^([${unicode_whitespaces}]*)`, "g");
var right_trim_regex = new RegExp(`([${unicode_whitespaces}]*)$`, "g");

// build/dev/javascript/gleam_stdlib/gleam/int.mjs
function to_string2(x) {
  return to_string(x);
}
function min(a, b) {
  let $ = a < b;
  if ($) {
    return a;
  } else {
    return b;
  }
}

// build/dev/javascript/gleam_stdlib/gleam/list.mjs
function count_length(loop$list, loop$count) {
  while (true) {
    let list = loop$list;
    let count = loop$count;
    if (list.atLeastLength(1)) {
      let list$1 = list.tail;
      loop$list = list$1;
      loop$count = count + 1;
    } else {
      return count;
    }
  }
}
function length(list) {
  return count_length(list, 0);
}
function do_reverse(loop$remaining, loop$accumulator) {
  while (true) {
    let remaining = loop$remaining;
    let accumulator = loop$accumulator;
    if (remaining.hasLength(0)) {
      return accumulator;
    } else {
      let item3 = remaining.head;
      let rest$1 = remaining.tail;
      loop$remaining = rest$1;
      loop$accumulator = prepend(item3, accumulator);
    }
  }
}
function reverse(xs) {
  return do_reverse(xs, toList([]));
}
function do_map(loop$list, loop$fun, loop$acc) {
  while (true) {
    let list = loop$list;
    let fun = loop$fun;
    let acc = loop$acc;
    if (list.hasLength(0)) {
      return reverse(acc);
    } else {
      let x = list.head;
      let xs = list.tail;
      loop$list = xs;
      loop$fun = fun;
      loop$acc = prepend(fun(x), acc);
    }
  }
}
function map(list, fun) {
  return do_map(list, fun, toList([]));
}
function do_index_map(loop$list, loop$fun, loop$index, loop$acc) {
  while (true) {
    let list = loop$list;
    let fun = loop$fun;
    let index = loop$index;
    let acc = loop$acc;
    if (list.hasLength(0)) {
      return reverse(acc);
    } else {
      let x = list.head;
      let xs = list.tail;
      let acc$1 = prepend(fun(x, index), acc);
      loop$list = xs;
      loop$fun = fun;
      loop$index = index + 1;
      loop$acc = acc$1;
    }
  }
}
function index_map(list, fun) {
  return do_index_map(list, fun, 0, toList([]));
}
function reverse_and_prepend(loop$prefix, loop$suffix) {
  while (true) {
    let prefix = loop$prefix;
    let suffix = loop$suffix;
    if (prefix.hasLength(0)) {
      return suffix;
    } else {
      let first$1 = prefix.head;
      let rest$1 = prefix.tail;
      loop$prefix = rest$1;
      loop$suffix = prepend(first$1, suffix);
    }
  }
}
function do_concat(loop$lists, loop$acc) {
  while (true) {
    let lists = loop$lists;
    let acc = loop$acc;
    if (lists.hasLength(0)) {
      return reverse(acc);
    } else {
      let list = lists.head;
      let further_lists = lists.tail;
      loop$lists = further_lists;
      loop$acc = reverse_and_prepend(list, acc);
    }
  }
}
function concat(lists) {
  return do_concat(lists, toList([]));
}
function fold(loop$list, loop$initial, loop$fun) {
  while (true) {
    let list = loop$list;
    let initial = loop$initial;
    let fun = loop$fun;
    if (list.hasLength(0)) {
      return initial;
    } else {
      let x = list.head;
      let rest$1 = list.tail;
      loop$list = rest$1;
      loop$initial = fun(initial, x);
      loop$fun = fun;
    }
  }
}

// build/dev/javascript/gleam_stdlib/gleam/string.mjs
function join2(strings, separator) {
  return join(strings, separator);
}

// build/dev/javascript/gleam_stdlib/gleam/bool.mjs
function guard(requirement, consequence, alternative) {
  if (requirement) {
    return consequence;
  } else {
    return alternative();
  }
}

// build/dev/javascript/lustre/lustre/effect.mjs
var Effect = class extends CustomType {
  constructor(all) {
    super();
    this.all = all;
  }
};
function none() {
  return new Effect(toList([]));
}

// build/dev/javascript/lustre/lustre/internals/vdom.mjs
var Text = class extends CustomType {
  constructor(content) {
    super();
    this.content = content;
  }
};
var Element = class extends CustomType {
  constructor(key, namespace, tag, attrs, children, self_closing, void$) {
    super();
    this.key = key;
    this.namespace = namespace;
    this.tag = tag;
    this.attrs = attrs;
    this.children = children;
    this.self_closing = self_closing;
    this.void = void$;
  }
};
var Attribute = class extends CustomType {
  constructor(x0, x1, as_property) {
    super();
    this[0] = x0;
    this[1] = x1;
    this.as_property = as_property;
  }
};

// build/dev/javascript/lustre/lustre/attribute.mjs
function attribute(name, value) {
  return new Attribute(name, identity(value), false);
}
function style(properties) {
  return attribute(
    "style",
    fold(
      properties,
      "",
      (styles, _use1) => {
        let name$1 = _use1[0];
        let value$1 = _use1[1];
        return styles + name$1 + ":" + value$1 + ";";
      }
    )
  );
}

// build/dev/javascript/lustre/lustre/element.mjs
function element(tag, attrs, children) {
  if (tag === "area") {
    return new Element("", "", tag, attrs, toList([]), false, true);
  } else if (tag === "base") {
    return new Element("", "", tag, attrs, toList([]), false, true);
  } else if (tag === "br") {
    return new Element("", "", tag, attrs, toList([]), false, true);
  } else if (tag === "col") {
    return new Element("", "", tag, attrs, toList([]), false, true);
  } else if (tag === "embed") {
    return new Element("", "", tag, attrs, toList([]), false, true);
  } else if (tag === "hr") {
    return new Element("", "", tag, attrs, toList([]), false, true);
  } else if (tag === "img") {
    return new Element("", "", tag, attrs, toList([]), false, true);
  } else if (tag === "input") {
    return new Element("", "", tag, attrs, toList([]), false, true);
  } else if (tag === "link") {
    return new Element("", "", tag, attrs, toList([]), false, true);
  } else if (tag === "meta") {
    return new Element("", "", tag, attrs, toList([]), false, true);
  } else if (tag === "param") {
    return new Element("", "", tag, attrs, toList([]), false, true);
  } else if (tag === "source") {
    return new Element("", "", tag, attrs, toList([]), false, true);
  } else if (tag === "track") {
    return new Element("", "", tag, attrs, toList([]), false, true);
  } else if (tag === "wbr") {
    return new Element("", "", tag, attrs, toList([]), false, true);
  } else {
    return new Element("", "", tag, attrs, children, false, false);
  }
}
function text(content) {
  return new Text(content);
}

// build/dev/javascript/lustre/lustre/internals/runtime.mjs
var Debug = class extends CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
};
var Dispatch = class extends CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
};
var Shutdown = class extends CustomType {
};
var ForceModel = class extends CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
};

// build/dev/javascript/lustre/vdom.ffi.mjs
function morph(prev, next, dispatch, isComponent = false) {
  let out;
  let stack = [{ prev, next, parent: prev.parentNode }];
  while (stack.length) {
    let { prev: prev2, next: next2, parent } = stack.pop();
    if (next2.subtree !== void 0)
      next2 = next2.subtree();
    if (next2.content !== void 0) {
      if (!prev2) {
        const created = document.createTextNode(next2.content);
        parent.appendChild(created);
        out ??= created;
      } else if (prev2.nodeType === Node.TEXT_NODE) {
        if (prev2.textContent !== next2.content)
          prev2.textContent = next2.content;
        out ??= prev2;
      } else {
        const created = document.createTextNode(next2.content);
        parent.replaceChild(created, prev2);
        out ??= created;
      }
    } else if (next2.tag !== void 0) {
      const created = createElementNode({
        prev: prev2,
        next: next2,
        dispatch,
        stack,
        isComponent
      });
      if (!prev2) {
        parent.appendChild(created);
      } else if (prev2 !== created) {
        parent.replaceChild(created, prev2);
      }
      out ??= created;
    } else if (next2.elements !== void 0) {
      iterateElement(next2, (fragmentElement) => {
        stack.unshift({ prev: prev2, next: fragmentElement, parent });
        prev2 = prev2?.nextSibling;
      });
    } else if (next2.subtree !== void 0) {
      stack.push({ prev: prev2, next: next2, parent });
    }
  }
  return out;
}
function createElementNode({ prev, next, dispatch, stack }) {
  const namespace = next.namespace || "http://www.w3.org/1999/xhtml";
  const canMorph = prev && prev.nodeType === Node.ELEMENT_NODE && prev.localName === next.tag && prev.namespaceURI === (next.namespace || "http://www.w3.org/1999/xhtml");
  const el2 = canMorph ? prev : namespace ? document.createElementNS(namespace, next.tag) : document.createElement(next.tag);
  let handlersForEl;
  if (!registeredHandlers.has(el2)) {
    const emptyHandlers = /* @__PURE__ */ new Map();
    registeredHandlers.set(el2, emptyHandlers);
    handlersForEl = emptyHandlers;
  } else {
    handlersForEl = registeredHandlers.get(el2);
  }
  const prevHandlers = canMorph ? new Set(handlersForEl.keys()) : null;
  const prevAttributes = canMorph ? new Set(Array.from(prev.attributes, (a) => a.name)) : null;
  let className = null;
  let style2 = null;
  let innerHTML = null;
  for (const attr of next.attrs) {
    const name = attr[0];
    const value = attr[1];
    if (attr.as_property) {
      if (el2[name] !== value)
        el2[name] = value;
      if (canMorph)
        prevAttributes.delete(name);
    } else if (name.startsWith("on")) {
      const eventName = name.slice(2);
      const callback = dispatch(value);
      if (!handlersForEl.has(eventName)) {
        el2.addEventListener(eventName, lustreGenericEventHandler);
      }
      handlersForEl.set(eventName, callback);
      if (canMorph)
        prevHandlers.delete(eventName);
    } else if (name.startsWith("data-lustre-on-")) {
      const eventName = name.slice(15);
      const callback = dispatch(lustreServerEventHandler);
      if (!handlersForEl.has(eventName)) {
        el2.addEventListener(eventName, lustreGenericEventHandler);
      }
      handlersForEl.set(eventName, callback);
      el2.setAttribute(name, value);
    } else if (name === "class") {
      className = className === null ? value : className + " " + value;
    } else if (name === "style") {
      style2 = style2 === null ? value : style2 + value;
    } else if (name === "dangerous-unescaped-html") {
      innerHTML = value;
    } else {
      if (el2.getAttribute(name) !== value)
        el2.setAttribute(name, value);
      if (name === "value" || name === "selected")
        el2[name] = value;
      if (canMorph)
        prevAttributes.delete(name);
    }
  }
  if (className !== null) {
    el2.setAttribute("class", className);
    if (canMorph)
      prevAttributes.delete("class");
  }
  if (style2 !== null) {
    el2.setAttribute("style", style2);
    if (canMorph)
      prevAttributes.delete("style");
  }
  if (canMorph) {
    for (const attr of prevAttributes) {
      el2.removeAttribute(attr);
    }
    for (const eventName of prevHandlers) {
      handlersForEl.delete(eventName);
      el2.removeEventListener(eventName, lustreGenericEventHandler);
    }
  }
  if (next.key !== void 0 && next.key !== "") {
    el2.setAttribute("data-lustre-key", next.key);
  } else if (innerHTML !== null) {
    el2.innerHTML = innerHTML;
    return el2;
  }
  let prevChild = el2.firstChild;
  let seenKeys = null;
  let keyedChildren = null;
  let incomingKeyedChildren = null;
  let firstChild = next.children[Symbol.iterator]().next().value;
  if (canMorph && firstChild !== void 0 && // Explicit checks are more verbose but truthy checks force a bunch of comparisons
  // we don't care about: it's never gonna be a number etc.
  firstChild.key !== void 0 && firstChild.key !== "") {
    seenKeys = /* @__PURE__ */ new Set();
    keyedChildren = getKeyedChildren(prev);
    incomingKeyedChildren = getKeyedChildren(next);
  }
  for (const child of next.children) {
    iterateElement(child, (currElement) => {
      if (currElement.key !== void 0 && seenKeys !== null) {
        prevChild = diffKeyedChild(
          prevChild,
          currElement,
          el2,
          stack,
          incomingKeyedChildren,
          keyedChildren,
          seenKeys
        );
      } else {
        stack.unshift({ prev: prevChild, next: currElement, parent: el2 });
        prevChild = prevChild?.nextSibling;
      }
    });
  }
  while (prevChild) {
    const next2 = prevChild.nextSibling;
    el2.removeChild(prevChild);
    prevChild = next2;
  }
  return el2;
}
var registeredHandlers = /* @__PURE__ */ new WeakMap();
function lustreGenericEventHandler(event) {
  const target = event.currentTarget;
  if (!registeredHandlers.has(target)) {
    target.removeEventListener(event.type, lustreGenericEventHandler);
    return;
  }
  const handlersForEventTarget = registeredHandlers.get(target);
  if (!handlersForEventTarget.has(event.type)) {
    target.removeEventListener(event.type, lustreGenericEventHandler);
    return;
  }
  handlersForEventTarget.get(event.type)(event);
}
function lustreServerEventHandler(event) {
  const el2 = event.currentTarget;
  const tag = el2.getAttribute(`data-lustre-on-${event.type}`);
  const data = JSON.parse(el2.getAttribute("data-lustre-data") || "{}");
  const include = JSON.parse(el2.getAttribute("data-lustre-include") || "[]");
  switch (event.type) {
    case "input":
    case "change":
      include.push("target.value");
      break;
  }
  return {
    tag,
    data: include.reduce(
      (data2, property) => {
        const path = property.split(".");
        for (let i = 0, o = data2, e = event; i < path.length; i++) {
          if (i === path.length - 1) {
            o[path[i]] = e[path[i]];
          } else {
            o[path[i]] ??= {};
            e = e[path[i]];
            o = o[path[i]];
          }
        }
        return data2;
      },
      { data }
    )
  };
}
function getKeyedChildren(el2) {
  const keyedChildren = /* @__PURE__ */ new Map();
  if (el2) {
    for (const child of el2.children) {
      iterateElement(child, (currElement) => {
        const key = currElement?.key || currElement?.getAttribute?.("data-lustre-key");
        if (key)
          keyedChildren.set(key, currElement);
      });
    }
  }
  return keyedChildren;
}
function diffKeyedChild(prevChild, child, el2, stack, incomingKeyedChildren, keyedChildren, seenKeys) {
  while (prevChild && !incomingKeyedChildren.has(prevChild.getAttribute("data-lustre-key"))) {
    const nextChild = prevChild.nextSibling;
    el2.removeChild(prevChild);
    prevChild = nextChild;
  }
  if (keyedChildren.size === 0) {
    iterateElement(child, (currChild) => {
      stack.unshift({ prev: prevChild, next: currChild, parent: el2 });
      prevChild = prevChild?.nextSibling;
    });
    return prevChild;
  }
  if (seenKeys.has(child.key)) {
    console.warn(`Duplicate key found in Lustre vnode: ${child.key}`);
    stack.unshift({ prev: null, next: child, parent: el2 });
    return prevChild;
  }
  seenKeys.add(child.key);
  const keyedChild = keyedChildren.get(child.key);
  if (!keyedChild && !prevChild) {
    stack.unshift({ prev: null, next: child, parent: el2 });
    return prevChild;
  }
  if (!keyedChild && prevChild !== null) {
    const placeholder = document.createTextNode("");
    el2.insertBefore(placeholder, prevChild);
    stack.unshift({ prev: placeholder, next: child, parent: el2 });
    return prevChild;
  }
  if (!keyedChild || keyedChild === prevChild) {
    stack.unshift({ prev: prevChild, next: child, parent: el2 });
    prevChild = prevChild?.nextSibling;
    return prevChild;
  }
  el2.insertBefore(keyedChild, prevChild);
  stack.unshift({ prev: keyedChild, next: child, parent: el2 });
  return prevChild;
}
function iterateElement(element2, processElement) {
  if (element2.elements !== void 0) {
    for (const currElement of element2.elements) {
      iterateElement(currElement, processElement);
    }
  } else if (element2.subtree !== void 0) {
    iterateElement(element2.subtree(), processElement);
  } else {
    processElement(element2);
  }
}

// build/dev/javascript/lustre/client-runtime.ffi.mjs
var LustreClientApplication2 = class _LustreClientApplication {
  #root = null;
  #queue = [];
  #effects = [];
  #didUpdate = false;
  #isComponent = false;
  #model = null;
  #update = null;
  #view = null;
  static start(flags, selector, init3, update2, view3) {
    if (!is_browser())
      return new Error(new NotABrowser());
    const root2 = selector instanceof HTMLElement ? selector : document.querySelector(selector);
    if (!root2)
      return new Error(new ElementNotFound(selector));
    const app = new _LustreClientApplication(init3(flags), update2, view3, root2);
    return new Ok((msg) => app.send(msg));
  }
  constructor([model, effects], update2, view3, root2 = document.body, isComponent = false) {
    this.#model = model;
    this.#update = update2;
    this.#view = view3;
    this.#root = root2;
    this.#effects = effects.all.toArray();
    this.#didUpdate = true;
    this.#isComponent = isComponent;
    window.requestAnimationFrame(() => this.#tick());
  }
  send(action) {
    switch (true) {
      case action instanceof Dispatch: {
        this.#queue.push(action[0]);
        this.#tick();
        return;
      }
      case action instanceof Shutdown: {
        this.#shutdown();
        return;
      }
      case action instanceof Debug: {
        this.#debug(action[0]);
        return;
      }
      default:
        return;
    }
  }
  emit(event, data) {
    this.#root.dispatchEvent(
      new CustomEvent(event, {
        bubbles: true,
        detail: data,
        composed: true
      })
    );
  }
  #tick() {
    this.#flush_queue();
    if (this.#didUpdate) {
      const vdom = this.#view(this.#model);
      const dispatch = (handler) => (e) => {
        const result = handler(e);
        if (result instanceof Ok) {
          this.send(new Dispatch(result[0]));
        }
      };
      this.#didUpdate = false;
      this.#root = morph(this.#root, vdom, dispatch, this.#isComponent);
    }
  }
  #flush_queue(iterations = 0) {
    while (this.#queue.length) {
      const [next, effects] = this.#update(this.#model, this.#queue.shift());
      this.#didUpdate ||= this.#model !== next;
      this.#model = next;
      this.#effects = this.#effects.concat(effects.all.toArray());
    }
    while (this.#effects.length) {
      this.#effects.shift()(
        (msg) => this.send(new Dispatch(msg)),
        (event, data) => this.emit(event, data)
      );
    }
    if (this.#queue.length) {
      if (iterations < 5) {
        this.#flush_queue(++iterations);
      } else {
        window.requestAnimationFrame(() => this.#tick());
      }
    }
  }
  #debug(action) {
    switch (true) {
      case action instanceof ForceModel: {
        const vdom = this.#view(action[0]);
        const dispatch = (handler) => (e) => {
          const result = handler(e);
          if (result instanceof Ok) {
            this.send(new Dispatch(result[0]));
          }
        };
        this.#queue = [];
        this.#effects = [];
        this.#didUpdate = false;
        this.#root = morph(this.#root, vdom, dispatch, this.#isComponent);
      }
    }
  }
  #shutdown() {
    this.#root.remove();
    this.#root = null;
    this.#model = null;
    this.#queue = [];
    this.#effects = [];
    this.#didUpdate = false;
    this.#update = () => {
    };
    this.#view = () => {
    };
  }
};
var start = (app, selector, flags) => LustreClientApplication2.start(
  flags,
  selector,
  app.init,
  app.update,
  app.view
);
var is_browser = () => globalThis.window && window.document;

// build/dev/javascript/lustre/lustre.mjs
var App = class extends CustomType {
  constructor(init3, update2, view3, on_attribute_change) {
    super();
    this.init = init3;
    this.update = update2;
    this.view = view3;
    this.on_attribute_change = on_attribute_change;
  }
};
var ElementNotFound = class extends CustomType {
  constructor(selector) {
    super();
    this.selector = selector;
  }
};
var NotABrowser = class extends CustomType {
};
function application(init3, update2, view3) {
  return new App(init3, update2, view3, new None());
}
function start3(app, selector, flags) {
  return guard(
    !is_browser(),
    new Error(new NotABrowser()),
    () => {
      return start(app, selector, flags);
    }
  );
}

// build/dev/javascript/lustre/lustre/element/html.mjs
function div(attrs, children) {
  return element("div", attrs, children);
}
function p(attrs, children) {
  return element("p", attrs, children);
}
function button(attrs, children) {
  return element("button", attrs, children);
}

// build/dev/javascript/workshop/metadata.mjs
var Metadata = class extends CustomType {
  constructor(id, depth2, attributes) {
    super();
    this.id = id;
    this.depth = depth2;
    this.attributes = attributes;
  }
};

// build/dev/javascript/workshop/part/builder.mjs
var Column = class extends CustomType {
  constructor(id, attributes, inner) {
    super();
    this.id = id;
    this.attributes = attributes;
    this.inner = inner;
  }
};
var Row = class extends CustomType {
  constructor(id, attributes, inner) {
    super();
    this.id = id;
    this.attributes = attributes;
    this.inner = inner;
  }
};
var Paragraph = class extends CustomType {
  constructor(id, attributes, title2, body) {
    super();
    this.id = id;
    this.attributes = attributes;
    this.title = title2;
    this.body = body;
  }
};
var Button = class extends CustomType {
  constructor(id, attributes, contents) {
    super();
    this.id = id;
    this.attributes = attributes;
    this.contents = contents;
  }
};

// build/dev/javascript/workshop/style/font.mjs
var FontStyles = class extends CustomType {
  constructor(bold2, family2, title2) {
    super();
    this.bold = bold2;
    this.family = family2;
    this.title = title2;
  }
};
function family(font_family) {
  return toList([["font-family", font_family]]);
}
function bold() {
  return toList([["font-weight", "bold"]]);
}
function title() {
  let styles = toList([["font-size", "1.25em"]]);
  let _pipe = toList([bold(), styles]);
  return concat(_pipe);
}
function new$4(font_family) {
  let family$1 = () => {
    return family(font_family);
  };
  return new FontStyles(bold, family$1, title);
}

// build/dev/javascript/workshop/style/general.mjs
function padding(_) {
  return toList([["padding", "0.75em"]]);
}
function margin(_) {
  return toList([["margin", "0.75em"]]);
}
function rounded(_) {
  return toList([["border-radius", "1em"]]);
}
function depth(metadata, hue) {
  let luma = min(metadata.depth * 5 + 10, 100);
  let background_color = "hsl(" + to_string2(hue) + ", 100%, " + to_string2(
    luma
  ) + "%)";
  return toList([["background-color", background_color]]);
}
function page(hue) {
  let background_color = "hsl(" + to_string2(hue) + ", 100%, 5%)";
  return toList([
    ["background-color", background_color],
    ["position", "absolute"],
    ["top", "0"],
    ["left", "0"],
    ["height", "100%"],
    ["width", "100%"]
  ]);
}
function min_width(min_width2) {
  let min_width$1 = to_string2(min_width2) + "em";
  return toList([["min-width", min_width$1]]);
}

// build/dev/javascript/workshop/style/part/button.mjs
var ButtonStyles = class extends CustomType {
  constructor(button3) {
    super();
    this.button = button3;
  }
};
function button2() {
  return toList([]);
}
function new$5(hue) {
  return new ButtonStyles(button2);
}

// build/dev/javascript/workshop/style/part/column.mjs
var ColumnStyles = class extends CustomType {
  constructor(column2, item3, last_item3) {
    super();
    this.column = column2;
    this.item = item3;
    this.last_item = last_item3;
  }
};
function column(metadata, hue) {
  let styles = toList([["display", "flex"], ["flex-direction", "column"]]);
  let _pipe = toList([
    depth(metadata, hue),
    padding(metadata),
    rounded(metadata),
    styles
  ]);
  return concat(_pipe);
}
function item() {
  return toList([["margin-bottom", "0.75em"]]);
}
function last_item() {
  return toList([]);
}
function new$6(hue) {
  return new ColumnStyles(
    (_capture) => {
      return column(_capture, hue);
    },
    item,
    last_item
  );
}

// build/dev/javascript/workshop/style/part/paragraph.mjs
var ParagraphStyles = class extends CustomType {
  constructor(paragraph2) {
    super();
    this.paragraph = paragraph2;
  }
};
function paragraph(metadata, hue, font_family) {
  let color = "hsl(" + to_string2(hue) + ", 100%, 85%)";
  let styles = toList([["font-family", font_family], ["color", color]]);
  let _pipe = toList([
    depth(metadata, hue),
    padding(metadata),
    rounded(metadata),
    styles
  ]);
  return concat(_pipe);
}
function new$7(hue, font_family) {
  let hue$1 = remainderInt(hue, 360);
  let paragraph$1 = (_capture) => {
    return paragraph(_capture, hue$1, font_family);
  };
  return new ParagraphStyles(paragraph$1);
}

// build/dev/javascript/workshop/style/part/row.mjs
var RowStyles = class extends CustomType {
  constructor(row2, item3, last_item3) {
    super();
    this.row = row2;
    this.item = item3;
    this.last_item = last_item3;
  }
};
function row(metadata, hue) {
  let styles = toList([["display", "flex"], ["flex-direction", "row"]]);
  let _pipe = toList([
    depth(metadata, hue),
    padding(metadata),
    rounded(metadata),
    styles
  ]);
  return concat(_pipe);
}
function item2() {
  return toList([["margin-right", "0.75em"]]);
}
function last_item2() {
  return toList([]);
}
function new$8(hue) {
  return new RowStyles(
    (_capture) => {
      return row(_capture, hue);
    },
    item2,
    last_item2
  );
}

// build/dev/javascript/workshop/style/part.mjs
var PartStyles = class extends CustomType {
  constructor(column2, row2, paragraph2, button3) {
    super();
    this.column = column2;
    this.row = row2;
    this.paragraph = paragraph2;
    this.button = button3;
  }
};
function new$9(font_family, hue) {
  let column2 = new$6(hue);
  let row2 = new$8(hue);
  let button3 = new$5(hue);
  let paragraph2 = new$7(hue, font_family);
  return new PartStyles(column2, row2, paragraph2, button3);
}

// build/dev/javascript/workshop/style.mjs
var StyleConfig = class extends CustomType {
  constructor(padding2, margin2, rounded2, depth2, font, part, page2, min_width2) {
    super();
    this.padding = padding2;
    this.margin = margin2;
    this.rounded = rounded2;
    this.depth = depth2;
    this.font = font;
    this.part = part;
    this.page = page2;
    this.min_width = min_width2;
  }
};
function new$10(hue, font_family) {
  let font_family$1 = (() => {
    let _pipe = font_family;
    let _pipe$1 = map(_pipe, (a) => {
      return '"' + a + '"';
    });
    return join2(_pipe$1, ", ");
  })();
  let font = new$4(font_family$1);
  let part = new$9(font_family$1, hue);
  return new StyleConfig(
    padding,
    margin,
    rounded,
    (_capture) => {
      return depth(_capture, hue);
    },
    font,
    part,
    () => {
      return page(hue);
    },
    min_width
  );
}

// build/dev/javascript/workshop/part.mjs
var Column2 = class extends CustomType {
  constructor(metadata, inner) {
    super();
    this.metadata = metadata;
    this.inner = inner;
  }
};
var Row2 = class extends CustomType {
  constructor(metadata, inner) {
    super();
    this.metadata = metadata;
    this.inner = inner;
  }
};
var Paragraph2 = class extends CustomType {
  constructor(metadata, title2, body) {
    super();
    this.metadata = metadata;
    this.title = title2;
    this.body = body;
  }
};
var Button2 = class extends CustomType {
  constructor(metadata, contents) {
    super();
    this.metadata = metadata;
    this.contents = contents;
  }
};
function do_from_builder(builder, depth2) {
  if (builder instanceof Column) {
    let id = builder.id;
    let attributes = builder.attributes;
    let inner = builder.inner;
    return new Column2(
      new Metadata(id, depth2, attributes),
      (() => {
        let _pipe = inner;
        return map(
          _pipe,
          (_capture) => {
            return do_from_builder(_capture, depth2 + 1);
          }
        );
      })()
    );
  } else if (builder instanceof Row) {
    let id = builder.id;
    let attributes = builder.attributes;
    let inner = builder.inner;
    return new Row2(
      new Metadata(id, depth2, attributes),
      (() => {
        let _pipe = inner;
        return map(
          _pipe,
          (_capture) => {
            return do_from_builder(_capture, depth2 + 1);
          }
        );
      })()
    );
  } else if (builder instanceof Paragraph) {
    let id = builder.id;
    let attributes = builder.attributes;
    let title2 = builder.title;
    let body = builder.body;
    return new Paragraph2(new Metadata(id, depth2, attributes), title2, body);
  } else {
    let id = builder.id;
    let attributes = builder.attributes;
    let contents = builder.contents;
    return new Button2(
      new Metadata(id, depth2, attributes),
      do_from_builder(contents, depth2)
    );
  }
}
function from_builder(builder) {
  return do_from_builder(builder, 0);
}
function view_paragraph(metadata, styles, title2, body) {
  let elements = toList([p(toList([]), toList([text(body)]))]);
  let elements$1 = (() => {
    if (title2 instanceof Some) {
      let title$1 = title2[0];
      return prepend(
        p(
          toList([style(styles.font.title())]),
          toList([text(title$1)])
        ),
        elements
      );
    } else {
      return elements;
    }
  })();
  return div(
    prepend(
      (() => {
        let _pipe = styles.part.paragraph.paragraph(metadata);
        return style(_pipe);
      })(),
      metadata.attributes
    ),
    elements$1
  );
}
function view_column(metadata, styles, inner) {
  let length3 = length(inner);
  let elements = (() => {
    let _pipe = inner;
    return index_map(
      _pipe,
      (a, i) => {
        let style2 = (() => {
          let $ = i === length3 - 1;
          if ($) {
            return styles.part.column.last_item();
          } else {
            return styles.part.column.item();
          }
        })();
        return div(
          toList([style(style2)]),
          toList([view(styles, a)])
        );
      }
    );
  })();
  return div(
    prepend(
      (() => {
        let _pipe = styles.part.column.column(metadata);
        return style(_pipe);
      })(),
      metadata.attributes
    ),
    elements
  );
}
function view(styles, part) {
  if (part instanceof Column2) {
    let metadata = part.metadata;
    let inner = part.inner;
    return view_column(metadata, styles, inner);
  } else if (part instanceof Row2) {
    let metadata = part.metadata;
    let inner = part.inner;
    return view_row(metadata, styles, inner);
  } else if (part instanceof Paragraph2) {
    let metadata = part.metadata;
    let title2 = part.title;
    let body = part.body;
    return view_paragraph(metadata, styles, title2, body);
  } else {
    let metadata = part.metadata;
    let contents = part.contents;
    return view_button(metadata, styles, contents);
  }
}
function view_row(metadata, styles, inner) {
  let length3 = length(inner);
  let elements = (() => {
    let _pipe = inner;
    return index_map(
      _pipe,
      (a, i) => {
        let style2 = (() => {
          let $ = i === length3 - 1;
          if ($) {
            return styles.part.row.last_item();
          } else {
            return styles.part.row.item();
          }
        })();
        return div(
          toList([style(style2)]),
          toList([view(styles, a)])
        );
      }
    );
  })();
  return div(
    prepend(
      (() => {
        let _pipe = styles.part.row.row(metadata);
        return style(_pipe);
      })(),
      metadata.attributes
    ),
    elements
  );
}
function view_button(metadata, styles, contents) {
  return button(metadata.attributes, toList([view(styles, contents)]));
}

// build/dev/javascript/workshop/workshop.mjs
var Model = class extends CustomType {
  constructor(body, styles) {
    super();
    this.body = body;
    this.styles = styles;
  }
};
function init2(hue, font_family) {
  let styles = new$10(hue, font_family);
  let min_width2 = (() => {
    let _pipe = styles.min_width(16);
    return style(_pipe);
  })();
  let body = from_builder(
    new Row(
      "body",
      toList([]),
      toList([
        new Column(
          "first column",
          toList([]),
          toList([
            new Paragraph(
              "paragraph 1",
              toList([min_width2]),
              new Some("title 1"),
              "body 1"
            ),
            new Paragraph(
              "paragraph 2",
              toList([min_width2]),
              new Some("title 2"),
              "body 2"
            ),
            new Paragraph(
              "paragraph 3",
              toList([min_width2]),
              new Some("title 3"),
              "body 3"
            ),
            new Button(
              "button",
              toList([]),
              new Paragraph("button text", toList([]), new None(), "button")
            )
          ])
        ),
        new Paragraph(
          "outside paragraph",
          toList([min_width2]),
          new Some("title"),
          "body"
        )
      ])
    )
  );
  return [new Model(body, styles), none()];
}
function update(model, _) {
  return [model, none()];
}
function view2(model) {
  return div(
    toList([style(model.styles.page())]),
    toList([view(model.styles, model.body)])
  );
}
function main() {
  let init$1 = (_) => {
    return init2(330, toList(["Comfortaa", "Sans Serif"]));
  };
  let app = application(init$1, update, view2);
  let $ = start3(app, "#app", toList([]));
  if (!$.isOk()) {
    throw makeError(
      "assignment_no_match",
      "workshop",
      82,
      "main",
      "Assignment pattern did not match",
      { value: $ }
    );
  }
  return $;
}

// build/.lustre/entry.mjs
main();
