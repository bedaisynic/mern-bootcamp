// Skeleton answers keyed by question text so reordering questions cannot move answers.
// Additional sections are being added; missing entries show a clear draft notice.
export const EVALUATION_ANSWERS: Partial<Record<string, readonly string[]>> = {
  "What are different types of css selectors? (just give the most common ones)": [
    "Common selectors: element (button), class (.card), ID (#menu), and attribute ([disabled]).",
    "Combinators select relationships: descendant (.card p), child (.card > p), and sibling (+ or ~).",
    "Pseudo-classes select states (:hover, :focus); pseudo-elements select parts (::before)."
  ],
  "What is the difference between id and class?": [
    "An id should be unique in the document; a class can be shared by many elements.",
    "One element can have several classes.",
    "#id has higher CSS specificity than .class; prefer classes for reusable styling."
  ],
  "What is CSS specificity? Give examples of which elements have higher specificity.": [
    "Specificity resolves competing selectors within the same cascade origin, importance, and layer.",
    "IDs outrank classes, attributes, and pseudo-classes; those outrank element selectors.",
    "Example: #app .title beats .card .title; equal specificity usually means the later rule wins.",
    "Inline styles outrank ordinary stylesheet rules; !important changes cascade priority rather than adding specificity."
  ],
  "Why should you avoid using inline styles or !important?": [
    "Inline styles make reuse, responsive rules, and consistent theming harder.",
    "!important makes overrides harder and can start a cascade of competing rules.",
    "Prefer reusable classes and clear cascade layers; use exceptions only for a specific reason."
  ],
  "What is the CSS box model? Explain content, border, padding, and margin.": [
    "Content is the text or image area.",
    "Padding is space inside the border; border surrounds it; margin is space outside it.",
    "Total occupied size depends on these values and box-sizing."
  ],
  "What is box-sizing? What are the differences between border-box and content-box?": [
    "box-sizing controls what width and height include.",
    "content-box includes only content; padding and border add extra size.",
    "border-box includes content, padding, and border; margin is always outside.",
    "border-box usually makes layouts easier to predict."
  ],
  "What are different positions in CSS?": [
    "static follows normal document flow; offsets do not move it.",
    "relative keeps its space but allows offsets and can anchor absolute children.",
    "absolute leaves normal flow and uses its containing block, commonly the nearest positioned ancestor.",
    "fixed usually uses the viewport; sticky follows flow until a scroll threshold such as top: 0 is reached within its scrolling container."
  ],
  "How do you approach responsive web design?": [
    "Start with a small-screen layout and flexible widths, images, and spacing.",
    "Use Flexbox or Grid and media queries such as @media (min-width: 48rem).",
    "Breakpoints are layout thresholds chosen where content needs a change, not only device names.",
    "Test narrow and wide screens, zoom, touch targets, and horizontal overflow."
  ],
  "What is the difference between Flexbox and css grid?": [
    "Flexbox lays out items mainly along one axis: a row or a column.",
    "Grid coordinates rows and columns together.",
    "Use Flexbox for navigation or card alignment; Grid for page layouts and card grids. They work well together."
  ],
  "What is justify-content and align-items in flexbox?": [
    "justify-content distributes free space along the main axis.",
    "align-items aligns items on the cross axis.",
    "With flex-direction: row the main axis is horizontal; with column it is vertical.",
    "Example: justify-content: center and align-items: center center an item on both axes."
  ],
  "What is the difference between rem, px, and em?": [
    "px is a CSS pixel, not necessarily one physical screen pixel.",
    "rem is relative to the root element's font size.",
    "em in font-size is relative to the parent's font size; in most other properties it uses the element's own font size.",
    "rem helps consistent sizing; em helps component-relative sizing."
  ],
  "What are CSS modules?": [
    "CSS Modules scope class names to a file by generating unique names during the build.",
    "Import a .module.css file and use className={styles.card}.",
    "They reduce accidental naming conflicts while still using normal CSS."
  ],
  "What are CSS Preprocessors? Give 1-2 examples. Can we directly run them in the browser?": [
    "Preprocessors add features such as variables, mixins, nesting, and functions.",
    "Examples: Sass/SCSS and Less.",
    "Compile them into CSS before sending them to the browser; browsers do not directly execute Sass or Less."
  ],
  "Tell me about the basics of tailwind CSS?": [
    "Tailwind provides utility classes such as flex, p-4, and text-center.",
    "Combine utilities in markup; use responsive and state variants such as md:flex and hover:bg-blue-600.",
    "A build step generates styles from detected classes; shared tokens and components keep the design consistent."
  ],
  "What are Component Libraries like Material UI, Chakra, Ant Design?": [
    "Component libraries provide reusable UI pieces such as dialogs, forms, tables, and menus.",
    "Material UI, Chakra UI, and Ant Design include styling and interaction patterns.",
    "Set a theme and compose components; still test accessibility, bundle size, and product-specific behavior."
  ],
  "What are some of the most common design systems for the UI?": [
    "Examples include Material Design, Ant Design, IBM Carbon, and the US Web Design System.",
    "A design system includes tokens, components, interaction rules, and usage guidance.",
    "Choose consistent patterns for color, spacing, typography, and accessibility."
  ],
  "What is the process between you entering a url in the browser and seeing the content on the browser?": [
    "Parse the URL and check browser caches; use DNS to find the server IP.",
    "Open a connection, usually TCP plus TLS for HTTPS; HTTP/3 uses QUIC.",
    "Send an HTTP request; receive HTML and fetch CSS, JavaScript, images, and fonts.",
    "Build the DOM and CSS rules, run scripts, calculate layout, paint, and compose the page."
  ],
  "What is an IP address?": [
    "An IP address identifies a network interface so packets can reach it.",
    "IPv4 uses addresses like 192.0.2.1; IPv6 uses longer addresses like 2001:db8::1.",
    "Addresses can be public or private and may change over time."
  ],
  "What is the DNS (Domain Name System)?": [
    "DNS maps names like example.com to IP addresses.",
    "A resolver checks caches and asks DNS servers when needed.",
    "Records have a TTL that controls how long results can be cached."
  ],
  "What is semantic HTML? Why do we need it?": [
    "Semantic HTML uses elements that describe meaning, such as nav, main, article, and button.",
    "It helps screen readers, search engines, and developers understand the page.",
    "Use a real button for an action instead of a clickable div."
  ],
  "What is a meta tag?": [
    "A meta tag provides page metadata inside head.",
    "Examples include charset, viewport for mobile layout, and description for search previews.",
    "It describes the page rather than displaying normal page content."
  ],
  "What are HTML attributes?": [
    "Attributes add settings or information to HTML elements.",
    "Examples: href on a link, src and alt on an image, and disabled on a button.",
    "Boolean attributes such as disabled mean true when present."
  ],
  "What are self-closing (void) elements in HTML? Does <input> need a closing tag?": [
    "Void elements cannot contain children and have no closing tag.",
    "Examples include input, img, br, hr, and meta; input does not need </input>.",
    "JSX requires a closing slash, such as <input />, even though HTML does not."
  ],
  "What is the alt attribute on <img> for?": [
    "Alt text describes an image when it cannot be seen or loaded.",
    "Screen readers use it; describe the image's meaning or action.",
    "Use alt=\"\" for purely decorative images to avoid extra noise."
  ],
  "What is HTML injection and how to avoid it?": [
    "HTML injection happens when untrusted text is interpreted as markup.",
    "Prefer textContent or escaped template values instead of innerHTML.",
    "If rich HTML is required, sanitize it with a maintained allowlist sanitizer; add CSP as another defense."
  ],
  "How does React JSX automatically sanitize input?": [
    "React escapes strings inserted into JSX, so user text appears as text instead of executable markup.",
    "This is escaping, not a general HTML sanitizer; dangerouslySetInnerHTML bypasses this protection.",
    "Validate URLs and sanitize any untrusted rich HTML separately."
  ],
  "What is the difference between Local storage, session storage, and cookies?": [
    "localStorage persists until cleared; sessionStorage belongs to a tab session. Both store strings and are readable by JavaScript.",
    "Typical quotas are around 5 MiB each per origin, but browser limits vary.",
    "Cookies are small, usually about 4 KiB each, and matching cookies are sent automatically with HTTP requests.",
    "Cookies support HttpOnly, Secure, and SameSite; web storage does not."
  ],
  "What is event bubbling and event capturing?": [
    "Capturing travels from ancestors down toward the event target.",
    "Bubbling travels from the target back up through ancestors.",
    "addEventListener(type, handler, true) listens during capture; stopPropagation stops further propagation.",
    "Event delegation uses bubbling to handle many child elements with one parent listener."
  ],
  "What is Document Object Model (DOM)? Give some examples of how we select DOM elements using Javascript.": [
    "The DOM is the browser's object tree for an HTML document.",
    "JavaScript can read and change elements, attributes, styles, and text.",
    "Select elements with document.getElementById('name'), querySelector('.card'), or querySelectorAll('button')."
  ],
  "What is the Intersection Observer API? What is it used for?": [
    "IntersectionObserver asynchronously reports when an element crosses visibility thresholds relative to a viewport or container.",
    "Use it for lazy loading, infinite-scroll sentinels, and visibility tracking.",
    "It avoids repeatedly measuring every element in scroll handlers; it does not prove the user actually looked at it."
  ],
  "What is the difference between let, const, and var?": [
    "let and const are block-scoped; var is function-scoped.",
    "let can be reassigned; const cannot be reassigned; var can be redeclared.",
    "var is initialized to undefined during hoisting; let and const cannot be accessed before initialization.",
    "Prefer const, then let when reassignment is needed."
  ],
  "Can you modify the properties of an object declared with const? Why or why not?": [
    "Yes: const protects the variable binding, not the object's contents.",
    "const user = {name: 'A'}; user.name = 'B' works, but user = {} does not.",
    "Object.freeze prevents direct property changes, but is shallow."
  ],
  "Explain the difference between \"Pass by Value\" and \"Pass by Reference\" with examples. (aka. primitive vs reference types)": [
    "JavaScript always passes values; for objects, that value is a reference to the object.",
    "Changing a copied primitive does not change the original: let b = a; b = 2.",
    "Mutating obj.name inside a function affects the shared object; assigning obj = {} only changes the local parameter."
  ],
  "Explain the difference between Global Scope, Function Scope, and Block Scope.": [
    "Global scope is accessible across the relevant script or environment.",
    "Function scope belongs to a function; var stays within it.",
    "Block scope belongs to braces such as if or for; let and const stay within it.",
    "Inner scopes can access outer bindings; outer scopes cannot access inner bindings."
  ],
  "Define \"Closure\" in your own words. What is its purpose?": [
    "A closure is a function together with access to the lexical scope where it was created.",
    "It can keep using outer variables after the outer function returns.",
    "Use closures for private state, function factories, debounce, and callbacks."
  ],
  "What is a \"private variable,\" and how does a closure create one?": [
    "A private variable is state that outside code cannot access directly.",
    "A function can create a local variable and return methods that close over it.",
    "Example: a counter returns increment and getCount functions while keeping count hidden."
  ],
  "What is hoisting?": [
    "Hoisting means declarations are processed before code executes in their scope.",
    "Function declarations can usually be called before their source position; var reads as undefined before assignment.",
    "let, const, and class are in a temporal dead zone until initialized; accessing them early throws."
  ],
  "How could the Global/Window object potentially cause memory leaks in Javascript?": [
    "Objects referenced from window stay reachable and cannot be garbage-collected.",
    "Large global caches, forgotten event listeners, and active timers can retain unused data.",
    "Limit globals, bound caches, and remove listeners and timers when no longer needed."
  ],
  "What are the 7 primitive data types in JavaScript, and how are they stored in memory compared to Objects?": [
    "The primitives are string, number, bigint, boolean, undefined, symbol, and null.",
    "Primitives are immutable values; objects are shared through reference values.",
    "Engines manage actual stack and heap storage; 'all primitives on the stack' is only a rough teaching model."
  ],
  "What is the difference between undefined, null, and “not defined”?": [
    "undefined usually means a value was not assigned or a property is missing.",
    "null is an explicit empty value chosen by the programmer.",
    "'Not defined' means no accessible binding exists; reading it usually throws ReferenceError."
  ],
  "What is type coercion? Is it good, how do we deal with it?": [
    "Type coercion converts a value from one type to another, often automatically.",
    "Examples: '5' + 1 gives '51'; Number('5') gives 5.",
    "It can be useful but surprising; prefer explicit conversions, strict equality, and validated inputs."
  ],
  "Difference between == vs ===, and which one should we use?": [
    "== compares with coercion; === compares without coercing types.",
    "'5' == 5 is true, while '5' === 5 is false.",
    "Prefer === for predictable checks; use an intentional loose comparison only when its rules are understood."
  ],
  "Explain the difference between \"Pass by Value\" and \"Pass by Reference\" with examples.": [
    "JavaScript passes every argument by value; an object reference is also a value.",
    "A primitive parameter can be changed without changing the caller's variable.",
    "An object parameter can mutate the shared object, but reassigning the parameter cannot replace the caller's binding."
  ],
  "Why does [] == [] and {} == {} return false in JavaScript?": [
    "Each array or object literal creates a different object identity.",
    "Object equality compares identity, not matching contents, so [] == [] and ({} == {}) are false.",
    "Compare needed fields or use a suitable deep comparison for structural equality."
  ],
  "How does the \"Shallow Copy\" differ from a \"Deep Copy\"? How do you do a shallow copy?": [
    "A shallow copy creates a new outer object while sharing nested references.",
    "Use {...obj}, [...arr], Object.assign({}, obj), or arr.slice().",
    "A deep copy also copies supported nested data; changing a copied nested value then does not change the source."
  ],
  "What are the ways to perform deep cloning?": [
    "Use structuredClone for supported data, including cycles and many built-in types.",
    "Use a tested clone library or a domain-specific copy function for custom needs.",
    "JSON serialization works only for JSON-compatible data and loses information."
  ],
  "What are the limitations of using JSON.parse(JSON.stringify(obj)) for deep cloning?": [
    "JSON cloning loses undefined object properties, functions, and symbols; dates become strings.",
    "NaN and Infinity become null; Map and Set do not retain their entries by default.",
    "Circular references and BigInt cause errors without custom handling.",
    "Prototypes and class behavior are not preserved."
  ],
  "What is structuredClone?": [
    "structuredClone is a built-in deep-copy API for supported structured data.",
    "It supports cycles, Date, Map, Set, and typed arrays.",
    "It cannot clone functions or DOM nodes and does not preserve custom class prototypes.",
    "Transferable buffers can be moved instead of copied."
  ],
  "Explain the \"Spread Operator\" (...) and how it behaves when merging objects with conflicting keys.": [
    "Spread expands values into arrays, argument lists, or object properties.",
    "{...a, ...b} copies own enumerable properties; later conflicting keys win.",
    "It is shallow, so nested objects remain shared."
  ],
  "What is \"Short-circuit evaluation\" in Logical Operators (&& and ||)?": [
    "&& returns the first falsy operand, or the last operand if all are truthy.",
    "|| returns the first truthy operand, or the last operand if all are falsy.",
    "They stop evaluating as soon as the result is known and return operand values, not always booleans."
  ],
  "Explain the difference between the Logical OR operator (||) and the Nullish Coalescing operator (??).": [
    "|| uses the fallback for any falsy value, including 0, false, and ''.",
    "?? uses the fallback only for null or undefined.",
    "Use count ?? 10 when zero is a valid value."
  ],
  "What is \"Falsy\" in JavaScript? List all the falsy values you can think of.": [
    "Falsy values behave as false in a boolean context.",
    "They include false, 0, -0, 0n, '', null, undefined, and NaN.",
    "Empty arrays and objects are truthy; document.all is a legacy browser exception."
  ],
  "What is the difference between + between 1 + \"1\" vs. 1 + 1?": [
    "1 + '1' produces the string '11' because + concatenates when a primitive operand is a string.",
    "1 + 1 produces the number 2.",
    "Convert input explicitly when numeric addition is intended."
  ],
  "How to convert a string type into a number? And vice versa?": [
    "Use Number(text) for whole-value conversion; check Number.isNaN on the result.",
    "parseInt(text, 10) and parseFloat(text) parse a numeric prefix; reject trailing junk separately if needed.",
    "Use String(value) or a template literal to convert to text.",
    "Watch out: Number('') is 0."
  ],
  "What are Template Literals / string literal / string interpolation?": [
    "Template literals use backticks and support interpolation with ${expression}.",
    "They support multiline strings without manual newline escapes.",
    "Example: `Hello, ${name}` inserts the value of name into the string."
  ],
  "What is optional chaining? Demonstrate how to use it.": [
    "Optional chaining stops with undefined when the left side is null or undefined.",
    "Examples: user?.address?.city, items?.[0], and onSave?.().",
    "It does not protect an undeclared variable or replace validation of required data."
  ],
  "What is the purpose of the finally block in a try...catch...finally statement?": [
    "finally runs after try and catch whether the operation succeeds or throws.",
    "Use it for cleanup such as closing resources or resetting a loading flag.",
    "Avoid returning from finally because it can replace an earlier return value or hide an error."
  ],
  "When using switch statements, what happens if you forget the break keyword?": [
    "Execution falls through into later case blocks until a break, return, or throw.",
    "This can be intentional when cases share logic.",
    "Otherwise add break to avoid accidentally running the next case."
  ],
  "What is the difference between console.log(foo) and console.log(foo())?": [
    "console.log(foo) logs the function value when foo is a function.",
    "console.log(foo()) calls foo now and logs its returned value.",
    "If foo returns nothing, that logged result is undefined."
  ],
  "What is the difference between func(callback) and func(callback())?": [
    "func(callback) passes the function so func can call it later.",
    "func(callback()) runs callback immediately and passes its returned value.",
    "Use a wrapper such as () => callback(id) when arguments must be supplied later."
  ],
  "Explain the \"Rest Parameter\" (...args) and how it differs from the spread operator?": [
    "A rest parameter collects remaining arguments into an array: function sum(...args).",
    "Spread expands a collection: sum(...numbers).",
    "Rest appears in a binding or parameter position; spread appears where values are supplied."
  ],
  "How to define Default Parameters for a function?": [
    "Set defaults in the parameter list: function greet(name = 'Guest').",
    "A default is used when the argument is missing or undefined.",
    "null, 0, false, and '' do not trigger the default."
  ],
  "Why use arrow functions? What is a problem that it solves?": [
    "Arrow functions provide short callback syntax and inherit this from the surrounding scope.",
    "They avoid losing the surrounding this in callbacks.",
    "They have no own arguments and cannot be used as constructors; avoid them for methods needing dynamic this."
  ],
  "What is an arrow function’s implicit return and explicit return?": [
    "An expression body returns implicitly: x => x * 2.",
    "A block body needs an explicit return: x => { return x * 2; }.",
    "Wrap an object literal in parentheses for implicit return: () => ({name: 'Ada'})."
  ],
  "What is an IIFE (Immediately Invoked Function Expression), and its purpose and use cases?": [
    "An IIFE is a function expression that runs immediately: (function () { ... })().",
    "It creates a scope for temporary or private variables.",
    "It was common before modules and block scope; async IIFEs can also group awaited startup work."
  ],
  "What is a \"Higher-Order Function\" and its purpose? Provide 3 examples of a built-in JavaScript HOF.": [
    "A higher-order function accepts a function or returns a function.",
    "It lets you reuse behavior while passing in the changing logic.",
    "Built-in examples: array.map, array.filter, and array.reduce."
  ],
  "What is a \"Callback Function\"?": [
    "A callback is a function passed to another function to be called by it.",
    "It can run synchronously, as in map, or later, as in a timer or event handler.",
    "Callbacks are not automatically asynchronous."
  ],
  "What is function currying?": [
    "Currying changes a function of several arguments into a chain of one-argument functions.",
    "Example: add(a)(b) instead of add(a, b).",
    "It supports reusable specialized functions, such as const addTax = add(5)."
  ],
  "What is hasOwnProperty? How is it different from directly checking the property from the object using obj.something?": [
    "hasOwnProperty checks whether a property belongs directly to the object rather than its prototype.",
    "obj.something reads the value and can find inherited properties; a truthiness check also misses 0, false, and undefined.",
    "Prefer Object.hasOwn(obj, 'something') when objects might override hasOwnProperty."
  ],
  "Explain the this keyword.": [
    "For a regular function, this is determined mainly by how it is called.",
    "obj.method() uses obj; new Constructor() uses the new instance; call/apply/bind can set it.",
    "Arrow functions inherit this from their surrounding scope.",
    "A plain function call has undefined this in strict mode."
  ],
  "Give more examples of how this keyword behaves differently in different places.": [
    "obj.method() sets this to obj; detaching that method loses the receiver.",
    "new User() sets this to the created instance; boundFn always uses its bound this.",
    "In a browser classic script, top-level this is window; in an ES module it is undefined.",
    "An arrow callback keeps the surrounding this instead of receiving its own."
  ],
  "Explain call, apply, and bind. What are their differences?": [
    "call invokes a function immediately with this and separate arguments: fn.call(obj, a, b).",
    "apply invokes it with this and an array-like argument list: fn.apply(obj, [a, b]).",
    "bind returns a new function with fixed this and optionally preset arguments; it does not call it immediately."
  ],
  "Explain the difference between a Class and an Object (Instance).": [
    "A class defines how objects are created and what methods they share.",
    "An instance is a particular object created with new, with its own state.",
    "Example: User is a class; new User('Ada') is one instance."
  ],
  "What is the difference between Prototype Methods and Static Methods? Give three examples of a built-in static method of Object, Promise, Array.": [
    "Prototype methods are called on instances and shared through the prototype.",
    "Static methods are called on the class or constructor itself.",
    "Examples: Object.keys(obj), Promise.all(promises), and Array.isArray(value) are static methods."
  ],
  "What does it mean when we say ES6 Classes are just \"Syntax Sugar\"?": [
    "Classes provide a clearer syntax over JavaScript's prototype-based object model.",
    "Methods live on the prototype and inheritance links prototypes.",
    "Classes still add rules such as strict-mode bodies and requiring new; they are not identical to a simple function rewrite."
  ],
  "How do you iterate over the keys and values of an Object? Give three ways.": [
    "Object.keys(obj) gives own enumerable string keys.",
    "Object.values(obj) gives their values; Object.entries(obj) gives key/value pairs.",
    "Use for...of over Object.entries; for...in also includes inherited enumerable properties unless filtered."
  ],
  "What is destructuring?": [
    "Destructuring pulls values from an array or object into variables.",
    "Example: const {name, age} = user or const [first] = items.",
    "Rename an object property with const {name: userName} = user; defaults use =."
  ],
  "Explain Array and Object destructuring difference": [
    "Array destructuring matches positions: const [first, second] = values.",
    "Object destructuring matches property names: const {name} = user.",
    "Both support defaults and rest; object properties can also be renamed."
  ],
  "Which of the following Array methods mutate (modify) the original array, and which return a new array? map(), filter(), push(), pop(), slice(), splice(), sort() (You can ask one by one)": [
    "map, filter, and slice return new arrays without changing the source array themselves.",
    "push, pop, splice, and sort mutate the original array.",
    "push returns the new length, pop returns the removed item, splice returns removed items, and sort returns the same array reference.",
    "Callbacks can still mutate objects shared between arrays."
  ],
  "What is the difference between Array.prototype forEach and map, and filter?": [
    "forEach runs a callback for each item and returns undefined; use it for side effects.",
    "map returns one transformed result per item in a new array.",
    "filter returns a new array containing only items that pass a condition."
  ],
  "What does the Array.prototype.reduce method do?": [
    "reduce combines array items into one accumulated result.",
    "Examples include a sum, grouped records, or a lookup object.",
    "Supply an initial accumulator, such as items.reduce((sum, x) => sum + x, 0), especially for empty arrays."
  ],
  "Can you break out of a forEach loop? If not, what should you use instead?": [
    "A return inside forEach only exits that callback, not the loop.",
    "Use for...of when you need break or continue.",
    "Use some, every, or find when early exit matches the question you are asking."
  ],
  "Explain the difference between Array.isArray(arr) and typeof arr.": [
    "Array.isArray(arr) specifically checks whether a value is an array, including across realms.",
    "typeof [] returns 'object', as does typeof {}.",
    "Use Array.isArray when array-specific behavior is required."
  ],
  "What is the runtime of sort?": [
    "JavaScript does not require one sorting algorithm or complexity.",
    "Modern general-purpose comparison sorts are commonly O(n log n), with engine-specific details.",
    "Comparator cost also matters; do not assume a guaranteed time bound from the language specification."
  ],
  "What are JSON.parse and JSON.stringify?": [
    "JSON.stringify converts supported JavaScript data to JSON text.",
    "JSON.parse converts JSON text back into JavaScript values and throws on invalid JSON.",
    "JSON excludes functions, undefined values in objects, and object prototypes; validate parsed external data."
  ],
  "Difference between a normal object {} and Map?": [
    "An object is useful for records with known string or symbol property names.",
    "Map supports keys of any type, has size, and provides set/get/has/delete methods.",
    "Map is convenient for dynamic lookup tables and direct iteration; objects serialize to JSON more naturally."
  ],
  "Is an object ordered? How about a Map instance?": [
    "Map iterates keys in insertion order.",
    "Ordinary object own keys follow defined rules: integer-index keys first in numeric order, then other strings in insertion order, then symbols.",
    "Different enumeration APIs include different kinds of properties; do not treat object order as arbitrary."
  ],
  "What are some RESTful URL design principles?": [
    "Use resource nouns and collections: /users and /users/42/orders.",
    "Use HTTP methods for actions instead of verbs like /getUsers.",
    "Keep naming consistent; use query parameters for filtering, sorting, and pagination.",
    "Return meaningful status codes and a consistent error shape."
  ],
  "How can you define the versions of an API (e.g., v1, v2)?": [
    "Common choices are a URL prefix (/api/v1/users), a version header, or a media type.",
    "Pick a consistent approach and document breaking changes.",
    "Keep old versions available during migration and announce deprecation clearly."
  ],
  "What is the difference between a Path parameter (e.g., /:variable) and a Query parameter?": [
    "A path parameter identifies a resource or route segment: /users/42.",
    "A query parameter modifies the request, such as /users?page=2&sort=name.",
    "Both arrive as external input and need validation and parsing."
  ],
  "What is a request body and a Data Transfer Object (DTO)?": [
    "A request body carries submitted data, often JSON, for operations such as creating a user.",
    "A DTO defines the shape of data crossing an API boundary.",
    "Validate the DTO and map only allowed fields into domain models to avoid accidental exposure or writes."
  ],
  "When do we use GET, POST, PUT, PATCH, and DELETE? Explain each method.": [
    "GET reads a resource and should not change server state.",
    "POST submits data, often to create a resource; PUT replaces the target representation.",
    "PATCH applies a partial update; DELETE removes a resource.",
    "GET, PUT, and DELETE are idempotent by defined semantics; POST and PATCH are not guaranteed to be."
  ],
  "Difference between PUT and PATCH?": [
    "PUT replaces the target representation and is defined as idempotent.",
    "PATCH applies a partial modification, such as changing only an email address.",
    "PATCH can be idempotent when setting a value, but an operation like incrementing a counter may not be."
  ],
  "What is idempotent? Give examples, explain in details": [
    "An operation is idempotent when repeating the same request has the same intended effect as doing it once.",
    "PUT setting name to 'Ada' stays the same after retries; DELETE leaves the resource absent after repeated calls.",
    "Responses can differ even when the effect is idempotent.",
    "For payments or POST requests, use an idempotency key backed by durable deduplication."
  ],
  "What is the difference between client-side pagination and server-side pagination?": [
    "Client-side pagination downloads the data first and slices it in the browser.",
    "Server-side pagination requests only a page or cursor window from the API.",
    "Client-side is simple for small lists; server-side reduces network, memory, and database work for large datasets."
  ],
  "Difference between http and https?": [
    "HTTP sends application data without transport encryption.",
    "HTTPS is HTTP protected by TLS, providing encryption, integrity, and server authentication.",
    "HTTPS does not itself fix application bugs or prove the server is trustworthy in every other way."
  ],
  "Explain status code in different ranges and give some examples": [
    "2xx means success: 200 OK, 201 Created, and 204 No Content.",
    "3xx means redirection or cache validation, such as 301, 302, and 304.",
    "4xx means a client-side request problem: 400 invalid request, 401 missing/invalid authentication, 403 insufficient permission, 404 missing resource, 409 conflict.",
    "5xx means a server or upstream failure, such as 500 or 503."
  ],
  "What is http cache control? Give examples": [
    "Cache-Control tells browsers and shared caches whether and how long to reuse a response.",
    "public, max-age=3600 allows caching for an hour; private limits storage to a private cache.",
    "no-cache allows storage but requires revalidation; no-store says not to store.",
    "Use versioned asset URLs for long-lived caching and ETag for revalidation."
  ],
  "How is Axios different from fetch api?": [
    "fetch is built into browsers and uses Response objects; JSON parsing is a separate async step.",
    "Axios is a library with convenient JSON handling, interceptors, and configurable defaults.",
    "Axios rejects non-success HTTP statuses by default; fetch resolves them, so check response.ok.",
    "Both support cancellation with an AbortSignal in supported environments."
  ],
  "What is an Axios Interceptor?": [
    "An interceptor runs shared logic before requests or after responses.",
    "Use it to attach auth headers, record timing, or normalize errors.",
    "Keep refresh-token retries bounded and avoid retry loops; remove interceptors when they are no longer needed."
  ],
  "How do you cancel an API request that has been sent out?": [
    "Pass an AbortController signal to fetch or a supported HTTP client, then call controller.abort().",
    "Catch cancellation separately from real errors and avoid updating stale UI.",
    "Cancellation stops waiting or transfer where possible; it does not guarantee the server undoes work already started."
  ],
  "What is an AbortController?": [
    "AbortController creates a signal shared with cancellable async operations.",
    "Example: fetch(url, {signal: controller.signal}); controller.abort().",
    "It is useful for component cleanup, obsolete search requests, and timeouts.",
    "An aborted signal cannot be reset; create a new controller for a new operation."
  ],
  "What does fetch's promise resolve to, and what does res.json() do? Does fetch reject on a 404 or 500?": [
    "fetch resolves to a Response once response headers arrive.",
    "res.json() reads the body asynchronously and parses it as JSON; it can reject on invalid JSON.",
    "A 404 or 500 does not reject fetch; check res.ok or res.status.",
    "Network errors and cancellation normally reject the promise."
  ],
  "What HTTP method does fetch default to, and how do you send a POST with a JSON body?": [
    "fetch defaults to GET.",
    "Send JSON with fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)}).",
    "Check response.ok before reading the expected body; a 204 response has no JSON body."
  ],
  "What is the difference between RESTful APIs and GraphQL?": [
    "REST exposes resources through URLs and HTTP methods.",
    "GraphQL exposes a typed schema where clients request particular fields, often through one endpoint.",
    "REST fits standard HTTP caching well; GraphQL supports flexible data selection but adds resolver, authorization, and query-cost complexity."
  ],
  "What are \"overfetching\" and \"underfetching,\" and how does GraphQL solve them?": [
    "Overfetching downloads more fields than the UI needs; underfetching requires extra requests for missing data.",
    "GraphQL lets clients select fields and related data in one query.",
    "Server resolvers still need efficient batching to avoid N+1 database queries."
  ],
  "How do HTTP responses differ between REST (multiple status codes) and GraphQL (always 200)?": [
    "REST commonly uses status codes to describe request outcomes.",
    "GraphQL can return HTTP 200 with data and field-level errors when execution ran, including partial success.",
    "GraphQL is not always 200: malformed requests, authentication layers, and transport failures can use other status codes.",
    "Clients should inspect both HTTP status and the GraphQL errors field."
  ],
  "Why is it easier to cache RESTful APIs compared to GraphQL?": [
    "REST GET URLs identify resource representations that standard browser and CDN caches understand.",
    "GraphQL commonly sends different queries to one POST endpoint, so URL-only HTTP caching is less direct.",
    "GraphQL can still use persisted GET queries, response caching, and normalized client caches."
  ],
  "When would you choose RESTful over GraphQL, and vice versa?": [
    "Choose REST for straightforward resource APIs, public interfaces, and simple HTTP caching.",
    "Choose GraphQL when clients need varied combinations of related fields and a shared typed schema helps.",
    "Consider team skills, query-cost controls, authorization, and maintenance rather than assuming one is always faster."
  ],
  "Why was GraphQL created, and why did many teams later move away from it?": [
    "GraphQL was created to let clients request the data they need without many rigid endpoints.",
    "Some teams find resolver performance, schema governance, caching, and authorization too costly for their needs.",
    "REST or a focused BFF can be simpler for those teams; GraphQL remains useful and has not been universally abandoned."
  ],
  "What is a GraphQL schema?": [
    "A GraphQL schema defines available types, fields, queries, and mutations.",
    "It is the contract clients use for validation, documentation, and tooling.",
    "Example: a User type exposes id and name, and a user(id) query returns one."
  ],
  "What is a resolver?": [
    "A resolver is a function that supplies the value for a GraphQL field.",
    "It can read a database, call another service, or return an existing object field.",
    "Enforce authorization and use batching where needed to prevent repeated queries."
  ],
  "What's the difference between a query and a mutation?": [
    "A query reads data and should avoid side effects.",
    "A mutation requests a state change, such as creating an order.",
    "Both are schema-defined operations; subscriptions provide an additional pattern for pushed updates."
  ],
  "What is a BFF (Backend for Frontend), and what problem does it solve?": [
    "A BFF is a backend tailored to a particular frontend, such as mobile or web.",
    "It combines service responses and shapes them into what a screen needs.",
    "Browser-to-many-service calls add round trips, waterfalls, duplicated auth handling, and partial-failure logic.",
    "A BFF can call services in parallel closer to them, but must avoid becoming a bottleneck."
  ],
  "What's wrong with short polling?": [
    "Short polling sends requests repeatedly even when nothing has changed.",
    "It wastes network and server work and only notices updates at the next interval.",
    "It can still be adequate for simple, low-frequency updates."
  ],
  "How is long polling different from short polling?": [
    "Short polling responds immediately, even when there is no update.",
    "Long polling holds the request until data arrives or a timeout occurs, then the client reconnects.",
    "It reduces empty requests but still needs connection management and retry logic."
  ],
  "What is a WebSocket?": [
    "A WebSocket is a long-lived connection that allows client and server to send messages independently.",
    "It suits chat, live collaboration, and other bidirectional updates.",
    "Plan authentication, reconnects, heartbeats, and message recovery; reconnecting alone does not restore missed messages."
  ],
  "What are Server-Sent Events (SSE)?": [
    "SSE streams server-to-client events over an HTTP response using text/event-stream.",
    "Browsers provide EventSource with reconnect support and event IDs for resumable delivery when the server supports it.",
    "The client sends commands through separate HTTP requests; SSE is one-way."
  ],
  "When would you choose SSE over a WebSocket?": [
    "Choose SSE when the server mainly pushes updates, such as progress or notifications.",
    "It works naturally with HTTP and browser EventSource reconnect behavior.",
    "Choose WebSocket for frequent two-way messaging or binary messages; consider authentication and proxy behavior for both."
  ],
  "What is Socket.IO, and how does it relate to WebSocket?": [
    "Socket.IO is a library that adds named events, rooms, acknowledgments, and reconnect behavior.",
    "It commonly uses WebSocket and can fall back to HTTP long polling.",
    "It uses its own protocol, so a plain WebSocket client is not directly compatible with a Socket.IO server."
  ],
  "What is the difference between JavaScript and TypeScript? Which should be preferred by companies and why?": [
    "TypeScript adds static types and tooling to JavaScript and compiles to JavaScript.",
    "It catches many mistakes before runtime and helps refactoring in larger teams.",
    "Companies often choose it for maintainability; small scripts may use JavaScript for less setup.",
    "Types disappear at runtime, so validate external inputs separately."
  ],
  "What is the difference between any and unknown & Which is Safer?": [
    "any disables most type checking for that value and allows unsafe operations to spread.",
    "unknown accepts any value but requires narrowing before use.",
    "Prefer unknown for untrusted data, then validate its shape or check its type."
  ],
  "What is the difference between void and never, when are they used?": [
    "void describes a function whose return value is not used.",
    "never describes something that cannot produce a normal value, such as a function that always throws.",
    "never also helps check that every case of a union has been handled."
  ],
  "Difference between interface vs. type, and which one should we use?": [
    "Both can describe object shapes and support composition.",
    "interface can be extended and declaration-merged; type can also express unions, tuples, and other type expressions.",
    "Use the project's convention; interfaces suit extensible object contracts, while aliases suit unions and type transformations."
  ],
  "Can Chrome run a .ts file directly? Or, can typescript run in the browser? Why?": [
    "Browsers execute JavaScript and do not natively type-check or execute general TypeScript syntax.",
    "Compile or strip TypeScript into JavaScript with a build tool before serving it.",
    "A .ts filename alone is not the issue; type syntax such as interfaces is not browser JavaScript."
  ],
  "What are generics? What are their use cases?": [
    "Generics let a type or function work with multiple types while preserving relationships between inputs and outputs.",
    "Example: function first<T>(items: T[]): T | undefined.",
    "Use them for reusable collections, API response wrappers, and hooks; constrain T when particular fields are required."
  ],
  "What are union and intersection types?": [
    "A union A | B means a value can match either type.",
    "An intersection A & B must satisfy both types at once.",
    "Narrow unions before accessing type-specific fields; intersections are useful for combining compatible object shapes."
  ],
  "How do you explicitly mark parameter types and return types in arrow functions?": [
    "Annotate parameters and place the return type before the arrow.",
    "Example: const add = (a: number, b: number): number => a + b.",
    "TypeScript can infer many types, but explicit public function signatures document the contract."
  ],
  "How do you define optional properties in an interface?": [
    "Add ? after the property name: interface User { name: string; age?: number }.",
    "The property may be absent; reading it can produce undefined.",
    "Check or default the value before using it where a number is required."
  ],
  "How and when would you use Type Assertion (as)?": [
    "as tells the compiler to treat a value as a chosen type; it performs no runtime conversion or validation.",
    "Use it when you have information the compiler cannot infer, such as a known DOM element type.",
    "Prefer narrowing and validation for external data; avoid assertions that merely silence real errors."
  ],
  "How and when would you use the Non-null Assertion operator (!)": [
    "The postfix ! removes null and undefined from the compiler's view of a value.",
    "It adds no runtime check, so a wrong assumption can still crash.",
    "Use it only when an invariant guarantees the value; otherwise guard the value or use optional chaining."
  ],
  "What are Enums and why do we need them?": [
    "An enum names a set of related values, such as workflow states.",
    "TypeScript enums usually create a runtime object; numeric and string enums behave differently.",
    "String literal unions or as-const objects can provide a lighter alternative.",
    "Use named values to avoid scattered magic strings or numbers."
  ],
  "How many threads does Javascript have? Why do we need async / non-blocking operations?": [
    "Each JavaScript execution thread runs one call stack at a time.",
    "Browsers and Node also use runtime threads and can run workers.",
    "Async I/O lets other work continue while waiting for network, disk, or timers; CPU-heavy JavaScript still blocks its thread."
  ],
  "Explain the Javascript event loop and how these work together": [
    "An execution context holds the current function's bindings and execution state; contexts form the call stack.",
    "Browser APIs handle timers, network work, and events outside that stack.",
    "Ready callbacks wait in task queues; promise handlers and queueMicrotask use the microtask queue.",
    "After a task finishes and the stack clears, drain microtasks before the next task; the browser also gets rendering opportunities."
  ],
  "Which task has higher priority? For example, given same delay, setTimeout and Promise.resolve, which one comes out first?": [
    "Promise handlers are microtasks; setTimeout callbacks are tasks.",
    "After synchronous code finishes, queued microtasks run before the next timer task.",
    "Promise.resolve().then(...) therefore runs before setTimeout(..., 0) scheduled in the same turn.",
    "A timer delay is a minimum wait, not an exact execution time."
  ],
  "What is callback hell? How do we solve this problem?": [
    "Callback hell is deeply nested callbacks that make flow and error handling hard to follow.",
    "Use named functions, promise chains, or async/await to flatten the structure.",
    "Keep steps small and handle errors in one clear place when possible."
  ],
  "What is a Promise? Why do we need it?": [
    "A promise represents an eventual result: pending, then fulfilled or rejected.",
    "It gives async operations a standard way to compose results and errors.",
    "It settles once; handlers run asynchronously even if the promise is already settled."
  ],
  "What is .then, .catch, and .finally?": [
    "then handles fulfillment and can transform the result or return another promise.",
    "catch handles rejection; throwing inside a handler rejects the next promise.",
    "finally runs cleanup on either outcome and normally preserves the earlier result.",
    "Each returns a new promise, allowing chaining."
  ],
  "Why can we not do Promise.then or Promise.catch?": [
    "then and catch are instance methods, so call them on a promise such as fetch(url).then(...).",
    "Promise is the constructor and exposes static methods such as resolve, all, and race.",
    "Promise.resolve(value).then(...) first creates or obtains an instance."
  ],
  "How do we handle multiple promises like concurrent API requests?": [
    "Start independent requests together and combine their promises.",
    "Use Promise.all when every result is required; use allSettled when partial success is useful.",
    "Limit concurrency for large batches to avoid overloading the server.",
    "Handle errors and cancellation deliberately."
  ],
  "What is the difference between Promise.all and Promise.allSettled?": [
    "Promise.all fulfills with ordered results only if all inputs fulfill; it rejects when an input rejects.",
    "Promise.allSettled waits for all and returns a status plus value or reason for each.",
    "Neither automatically cancels the remaining operations."
  ],
  "Why would we need Promise.race?": [
    "Promise.race settles with the first input promise to settle, whether fulfilled or rejected.",
    "Use it for a timeout or competing sources when the first outcome matters.",
    "It does not stop the losing operations; cancel them separately when supported."
  ],
  "Difference between using .then and .catch, vs using async/await for promises. Which syntax should we use and why?": [
    "Both approaches use promises; async/await makes sequential async code look like normal control flow.",
    "Use try/catch with await; use then/catch for explicit chains or small transformations.",
    "Prefer the style that keeps dependencies clear and remains consistent with the project.",
    "Awaiting independent operations one by one accidentally makes them sequential."
  ],
  "How to call a few api’s in parallel vs in sequence? When should you do each": [
    "Parallel: start independent calls together, then await Promise.all([getA(), getB()]).",
    "Sequential: await getUser(), then use its ID in await getOrders(user.id).",
    "Use parallel work for lower total latency; use sequence when one result depends on another.",
    "Add bounded concurrency for many requests."
  ],
  "What is a js module and why do we use it?": [
    "A module is a file with its own scope that exports reusable code and imports dependencies.",
    "Modules separate responsibilities and avoid global-variable collisions.",
    "Their dependency structure also helps build tools analyze and optimize code."
  ],
  "What is the difference between CommonJS and ES modules?": [
    "CommonJS uses require and module.exports and traditionally loads modules synchronously in Node.",
    "ES modules use import and export with a statically analyzable structure and live bindings.",
    "Browsers support ES modules; Node supports both with file-extension and package configuration rules."
  ],
  "Difference between default export and named export. How are they imported?": [
    "A default export is imported under a chosen name: import Button from './Button'.",
    "Named exports use their exported names: import {Button, helper} from './ui'.",
    "Named imports can be aliased with as; a module can have multiple named exports but one default."
  ],
  "Difference between ES5 and ES6?": [
    "ES6 added let/const, arrow functions, classes, modules, template literals, destructuring, and rest/spread.",
    "It also introduced promises, Map, Set, symbols, and iterators.",
    "ES5 commonly used var, constructor functions, and callbacks; build tools can transform many newer syntax features for older targets."
  ]
};
