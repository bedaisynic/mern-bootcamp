// Interview-ready answers keyed by question text, with short memory cues.
// Experience questions are examples to adapt to the reader's actual background.
// References for version-sensitive details:
// https://react.dev/learn/react-compiler/introduction
// https://react.dev/reference/react/use
// https://react.dev/reference/rsc/server-components
// https://docs.langchain.com/oss/javascript/langgraph/interrupts
// https://www.oracle.com/europe/java/technologies/java-se-support-roadmap.html
// https://web.dev/articles/vitals
export type EvaluationAnswer = {
  spoken: string;
  bullets: readonly string[];
  closing?: string;
};

export const EVALUATION_ANSWERS: Partial<Record<string, EvaluationAnswer>> = {
  "What is the process between you entering a url in the browser and seeing the content on the browser?": {
    "spoken": "When I enter a URL, the browser uses DNS to find the server's IP address. It connects to the server, sends an HTTP request, and receives a response. Then it parses the HTML and CSS, runs JavaScript, and renders the page.",
    "bullets": [
      "DNS lookup",
      "Connection and request",
      "Response and rendering"
    ]
  },
  "What is an IP address?": {
    "spoken": "An IP address is a network address that helps data reach the right device or network interface. IPv4 looks like 192.0.2.1, while IPv6 uses a longer format. Addresses can be public or private.",
    "bullets": [
      "Network address",
      "IPv4 or IPv6",
      "Public or private"
    ]
  },
  "What is the DNS (Domain Name System)?": {
    "spoken": "DNS is like the internet's address book. It translates a domain name into an IP address so the browser knows which server to contact. Results are cached to make later lookups faster.",
    "bullets": [
      "Domain → IP address",
      "Cached lookups"
    ]
  },
  "What is semantic HTML? Why do we need it?": {
    "spoken": "Semantic HTML means choosing tags that describe the content's purpose, like nav, main, and button. It makes the page easier for screen readers, search engines, and developers to understand.",
    "bullets": [
      "Meaningful tags",
      "Accessibility",
      "Clear page structure"
    ]
  },
  "What is a meta tag?": {
    "spoken": "A meta tag describes the page rather than showing content on it. We put it inside head to set things like character encoding, the mobile viewport, or a page description.",
    "bullets": [
      "Inside head",
      "Charset and viewport",
      "Page description"
    ]
  },
  "What are HTML attributes?": {
    "spoken": "HTML attributes give an element extra information or settings. For example, href sets a link's destination, src sets an image's source, and disabled turns off a form control.",
    "bullets": [
      "Extra element settings",
      "href, src, disabled"
    ]
  },
  "What are self-closing (void) elements in HTML? Does <input> need a closing tag?": {
    "spoken": "Void elements cannot contain children, so they have no closing tag in HTML. Examples include input, img, and br. JSX still requires the slash, like <input />.",
    "bullets": [
      "No children",
      "No HTML closing tag",
      "JSX: <input />"
    ]
  },
  "What is the alt attribute on <img> for?": {
    "spoken": "The alt attribute gives an image a text alternative. Screen readers use it, and browsers can show it when an image fails to load. For a decorative image, I use an empty alt value.",
    "bullets": [
      "Describe meaning",
      "Screen-reader support",
      "Decorative: alt=\"\""
    ]
  },
  "What is HTML injection and how to avoid it?": {
    "spoken": "HTML injection happens when untrusted text is treated as markup. I avoid it by rendering text safely instead of using innerHTML. If the app needs rich HTML, I sanitize it with a trusted library.",
    "bullets": [
      "Treat input as text",
      "Avoid unsafe innerHTML",
      "Sanitize rich HTML"
    ]
  },
  "How does React JSX automatically sanitize input?": {
    "spoken": "React escapes strings inserted into JSX, so user input normally appears as text rather than HTML. That protection does not cover everything: dangerouslySetInnerHTML bypasses it, and untrusted URLs still need checking.",
    "bullets": [
      "JSX escapes text",
      "Unsafe HTML bypasses protection",
      "Check URLs too"
    ]
  },
  "What is the difference between Local storage, session storage, and cookies?": {
    "spoken": "Local storage stays until cleared, while session storage lasts for a tab session. Both are readable by JavaScript and usually allow around 5 MiB each per origin. Cookies are much smaller and are automatically sent with matching requests.",
    "bullets": [
      "Local: persistent",
      "Session: tab session",
      "Cookies: about 4 KiB each",
      "Cookie flags: HttpOnly, Secure, SameSite"
    ]
  },
  "What is event bubbling and event capturing?": {
    "spoken": "Capturing moves an event from outer elements toward the target. Bubbling moves it back from the target to its ancestors. Event delegation uses bubbling so one parent can handle events from many children.",
    "bullets": [
      "Capture: outside → target",
      "Bubble: target → outside",
      "Delegation on the parent"
    ]
  },
  "What is Document Object Model (DOM)? Give some examples of how we select DOM elements using Javascript.": {
    "spoken": "The DOM is the browser's object tree for the page. JavaScript uses it to read or change content, attributes, and styles. I can select elements with getElementById, querySelector, or querySelectorAll.",
    "bullets": [
      "Page as an object tree",
      "Read and update elements",
      "ID or CSS selectors"
    ]
  },
  "What is the Intersection Observer API? What is it used for?": {
    "spoken": "IntersectionObserver tells us when an element enters or leaves a viewport or container. I use it for lazy loading, infinite scrolling, or visibility tracking instead of repeatedly checking positions on every scroll.",
    "bullets": [
      "Observe visibility changes",
      "Lazy loading",
      "Infinite-scroll sentinel"
    ]
  },
  "What are different types of css selectors? (just give the most common ones)": {
    "spoken": "The common selectors are element, class, ID, and attribute selectors. We also use combinators for relationships and pseudo-classes for states, like hover or focus. Pseudo-elements style parts such as before or after.",
    "bullets": [
      "button, .card, #menu",
      "[disabled], :hover",
      "Descendant, child, sibling",
      "::before and ::after"
    ]
  },
  "What is the difference between id and class?": {
    "spoken": "An ID should identify one element on a page, while a class can be reused on many elements. An element can also have several classes. For reusable styles, I usually choose classes.",
    "bullets": [
      "ID: unique",
      "Class: reusable",
      "ID has higher specificity"
    ]
  },
  "What is CSS specificity? Give examples of which elements have higher specificity.": {
    "spoken": "Specificity helps the browser choose between competing CSS selectors. Within the same cascade priority, IDs beat classes, and classes beat element selectors. If specificity is equal, the later rule usually wins.",
    "bullets": [
      "ID > class > element",
      "Equal score: later rule",
      "Cascade priority comes first"
    ]
  },
  "Why should you avoid using inline styles or !important?": {
    "spoken": "Inline styles are harder to reuse and override, while !important can make CSS rules fight each other. I prefer classes and a clear cascade, using either exception only when there is a specific reason.",
    "bullets": [
      "Reuse classes",
      "Keep overrides simple",
      "Limit !important"
    ]
  },
  "What is the CSS box model? Explain content, border, padding, and margin.": {
    "spoken": "The box model has content in the middle, then padding, border, and margin. Padding is inside the border, and margin is outside it. Together, they determine how much space an element takes.",
    "bullets": [
      "Content",
      "Padding: inside",
      "Border",
      "Margin: outside"
    ]
  },
  "What is box-sizing? What are the differences between border-box and content-box?": {
    "spoken": "box-sizing decides what width and height include. With content-box, padding and borders add extra size. With border-box, they are included in the declared size, which usually makes layouts easier to predict.",
    "bullets": [
      "content-box: content only",
      "border-box: includes padding/border",
      "Margin stays outside"
    ]
  },
  "What are different positions in CSS?": {
    "spoken": "Static follows normal flow. Relative keeps its space but can move visually. Absolute leaves the flow and uses its containing block. Fixed usually stays relative to the viewport, while sticky sticks after a scroll threshold.",
    "bullets": [
      "Static: normal flow",
      "Relative: offset in place",
      "Absolute: positioned container",
      "Fixed: viewport",
      "Sticky: scroll threshold"
    ]
  },
  "How do you approach responsive web design?": {
    "spoken": "I start with a flexible mobile layout, then add media queries when the content needs more space. Breakpoints are those layout thresholds. I test real content, narrow screens, zoom, and overflow rather than relying only on device sizes.",
    "bullets": [
      "Mobile first",
      "Flexible Grid/Flexbox",
      "Content-based breakpoints",
      "Test zoom and overflow"
    ]
  },
  "What is the difference between Flexbox and css grid?": {
    "spoken": "Flexbox mainly handles one direction at a time, either a row or a column. Grid handles rows and columns together. I use Flexbox for alignment and Grid for larger layouts, and often combine them.",
    "bullets": [
      "Flexbox: one dimension",
      "Grid: two dimensions",
      "Use both together"
    ]
  },
  "What is justify-content and align-items in flexbox?": {
    "spoken": "justify-content controls spacing along the main axis, and align-items controls alignment across it. The main axis depends on flex-direction, so row and column layouts swap those directions.",
    "bullets": [
      "justify-content: main axis",
      "align-items: cross axis",
      "Direction changes the axes"
    ]
  },
  "What is the difference between rem, px, and em?": {
    "spoken": "px is a CSS pixel. rem is based on the root font size. em is usually based on the element's font size, but in font-size itself it uses the parent's size. I often use rem for consistent sizing.",
    "bullets": [
      "px: CSS pixel",
      "rem: root font size",
      "em: local font context"
    ]
  },
  "What are CSS modules?": {
    "spoken": "CSS Modules give classes local names during the build, so styles from different files do not accidentally clash. I import the module and use something like styles.card on the component.",
    "bullets": [
      "File-scoped classes",
      "Generated unique names",
      "Import styles.card"
    ]
  },
  "What are CSS Preprocessors? Give 1-2 examples. Can we directly run them in the browser?": {
    "spoken": "CSS preprocessors let us write features like variables, mixins, and functions before compiling them into CSS. Sass and Less are examples. The browser receives normal CSS, not the preprocessor source.",
    "bullets": [
      "Sass or Less",
      "Extra authoring features",
      "Compile to CSS"
    ]
  },
  "Tell me about the basics of tailwind CSS?": {
    "spoken": "Tailwind gives us small utility classes that we combine in markup, like flex or p-4. Responsive and state prefixes handle cases like mobile layouts and hover. Shared tokens and components keep the design consistent.",
    "bullets": [
      "Utility classes",
      "Responsive/state variants",
      "Shared design tokens"
    ]
  },
  "What are Component Libraries like Material UI, Chakra, Ant Design?": {
    "spoken": "Component libraries provide ready-made UI pieces like dialogs, forms, and tables. Material UI, Chakra, and Ant Design can save time and improve consistency. I still check their accessibility, customization, and bundle cost.",
    "bullets": [
      "Ready-made components",
      "Theme and consistency",
      "Check accessibility and size"
    ]
  },
  "What are some of the most common design systems for the UI?": {
    "spoken": "A design system gives a team shared visual rules and reusable components. Examples include Material Design, Ant Design, IBM Carbon, and USWDS. It covers things like color, spacing, typography, and interaction patterns.",
    "bullets": [
      "Tokens and components",
      "Shared interaction rules",
      "Consistent UI"
    ]
  },
  "What is the difference between let, const, and var?": {
    "spoken": "let and const are block-scoped, while var is function-scoped. let can be reassigned; const cannot. var also allows redeclaration and can be read as undefined before its assignment, so I normally use const and switch to let when needed.",
    "bullets": [
      "const by default",
      "let for reassignment",
      "Avoid var",
      "Block vs. function scope"
    ]
  },
  "Can you modify the properties of an object declared with const? Why or why not?": {
    "spoken": "Yes. const prevents assigning a different object to the variable, but it does not freeze the object itself. I can change user.name, but I cannot replace user with a new object.",
    "bullets": [
      "Binding stays fixed",
      "Properties can change",
      "freeze is shallow"
    ]
  },
  "Explain the difference between \"Pass by Value\" and \"Pass by Reference\" with examples. (aka. primitive vs reference types)": {
    "spoken": "JavaScript passes values. For an object, the copied value is a reference to the same object, so changing a property is visible to the caller. Reassigning the parameter only changes the local variable.",
    "bullets": [
      "Primitives: copied value",
      "Objects: shared reference value",
      "Mutation ≠ reassignment"
    ]
  },
  "Explain the difference between Global Scope, Function Scope, and Block Scope.": {
    "spoken": "Global scope is available across its environment. Function scope belongs to a function, and block scope belongs to braces like an if block. Inner scopes can use outer variables, but not the other way around.",
    "bullets": [
      "Global: broad access",
      "Function: var",
      "Block: let and const",
      "Inner can access outer"
    ]
  },
  "Define \"Closure\" in your own words. What is its purpose?": {
    "spoken": "A closure lets a function remember variables from the scope where it was created, even after that outer function returns. We use it for private state, reusable function factories, and things like debounce.",
    "bullets": [
      "Remembers outer scope",
      "Survives outer return",
      "Private state and callbacks"
    ]
  },
  "What is a \"private variable,\" and how does a closure create one?": {
    "spoken": "A private variable is state that outside code cannot access directly. A closure can keep that variable inside a function and expose only selected operations, like incrementing or reading a counter.",
    "bullets": [
      "Hidden local state",
      "Expose selected functions",
      "Counter example"
    ]
  },
  "What is hoisting?": {
    "spoken": "Hoisting means JavaScript processes declarations before running the scope's code. Function declarations can be called early, var reads as undefined before assignment, and let or const throws if accessed before initialization.",
    "bullets": [
      "Functions: callable early",
      "var: undefined",
      "let/const: temporal dead zone"
    ]
  },
  "How could the Global/Window object potentially cause memory leaks in Javascript?": {
    "spoken": "Anything still referenced from window can stay in memory. A growing global cache or forgotten listener can keep large objects alive. I limit global state and clean up listeners, timers, and unused references.",
    "bullets": [
      "Globals keep references alive",
      "Bound caches",
      "Remove listeners and timers"
    ]
  },
  "What are the 7 primitive data types in JavaScript, and how are they stored in memory compared to Objects?": {
    "spoken": "The seven primitives are string, number, bigint, boolean, undefined, symbol, and null. They are immutable values. Objects are shared through references; the engine handles actual storage, so the stack-versus-heap explanation is only a rough model.",
    "bullets": [
      "Seven primitive types",
      "Primitives are immutable",
      "Objects have identity"
    ]
  },
  "What is the difference between undefined, null, and “not defined”?": {
    "spoken": "undefined usually means no value was assigned. null is an intentional empty value. “Not defined” means the variable does not exist in the current scope, so reading it usually throws a ReferenceError.",
    "bullets": [
      "undefined: missing value",
      "null: deliberate empty",
      "Not defined: missing binding"
    ]
  },
  "What is type coercion? Is it good, how do we deal with it?": {
    "spoken": "Type coercion means converting a value into another type, sometimes automatically. It can be handy, but it can also cause surprises like '5' + 1 becoming '51'. I prefer explicit conversions when the intent matters.",
    "bullets": [
      "Automatic type conversion",
      "Watch strings and numbers",
      "Convert explicitly"
    ]
  },
  "Difference between == vs ===, and which one should we use?": {
    "spoken": "== allows type conversion before comparing, while === does not. For example, '5' == 5 is true, but '5' === 5 is false. I usually use === because its behavior is easier to predict.",
    "bullets": [
      "==: coercion",
      "===: no coercion",
      "Prefer strict equality"
    ]
  },
  "Explain the difference between \"Pass by Value\" and \"Pass by Reference\" with examples.": {
    "spoken": "JavaScript always passes values, including reference values for objects. Changing a primitive parameter does not change the caller's variable. Changing a property on a shared object does, but replacing the local parameter does not.",
    "bullets": [
      "Copy the value",
      "Shared object identity",
      "Reassignment stays local"
    ]
  },
  "Why does [] == [] and {} == {} return false in JavaScript?": {
    "spoken": "Each new array or object is a different object, even if its contents look the same. Equality compares their identity rather than their contents. To compare contents, I compare fields or use a suitable deep comparison.",
    "bullets": [
      "Different objects, different identity",
      "Not a content comparison"
    ]
  },
  "How does the \"Shallow Copy\" differ from a \"Deep Copy\"? How do you do a shallow copy?": {
    "spoken": "A shallow copy creates a new outer container but shares nested objects. A deep copy also copies supported nested data. Spread, slice, and Object.assign make shallow copies, so changing a nested object can still affect the original.",
    "bullets": [
      "Shallow: shared nested data",
      "Deep: copied nested data",
      "Spread, slice, assign"
    ]
  },
  "What are the ways to perform deep cloning?": {
    "spoken": "For supported data, I usually use structuredClone. For custom classes or special requirements, I use a tested library or a custom copy function. JSON cloning works only when the data is safely JSON-compatible.",
    "bullets": [
      "structuredClone",
      "Tested library/custom logic",
      "JSON only for simple data"
    ]
  },
  "What are the limitations of using JSON.parse(JSON.stringify(obj)) for deep cloning?": {
    "spoken": "JSON cloning loses information. Dates become strings, functions and undefined properties disappear, and Map or Set entries are not preserved normally. Circular references and BigInt also fail without special handling.",
    "bullets": [
      "Loses types and behavior",
      "Dates become strings",
      "Cycles and BigInt fail"
    ]
  },
  "What is structuredClone?": {
    "spoken": "structuredClone is a built-in way to deep-copy supported data. It handles cycles and types like Date, Map, and Set, but not functions or DOM nodes. It also does not preserve custom class prototypes.",
    "bullets": [
      "Deep copy",
      "Supports cycles and collections",
      "Not functions or DOM"
    ]
  },
  "Explain the \"Spread Operator\" (...) and how it behaves when merging objects with conflicting keys.": {
    "spoken": "Spread expands values into another array, object, or argument list. When merging objects, the last value for a repeated key wins. The copy is shallow, so nested objects are still shared.",
    "bullets": [
      "Expand values",
      "Last matching key wins",
      "Shallow copy"
    ]
  },
  "What is \"Short-circuit evaluation\" in Logical Operators (&& and ||)?": {
    "spoken": "Short-circuiting means JavaScript stops as soon as it knows the result. && returns the first falsy value, while || returns the first truthy value. They return actual operand values, not necessarily booleans.",
    "bullets": [
      "&&: first falsy",
      "||: first truthy",
      "Skip unnecessary evaluation"
    ]
  },
  "Explain the difference between the Logical OR operator (||) and the Nullish Coalescing operator (??).": {
    "spoken": "|| uses a fallback for any falsy value, including zero or an empty string. ?? only uses the fallback for null or undefined. I use ?? when zero, false, or an empty string is valid.",
    "bullets": [
      "||: any falsy value",
      "??: null or undefined",
      "Preserve 0 and false"
    ]
  },
  "What is \"Falsy\" in JavaScript? List all the falsy values you can think of.": {
    "spoken": "Falsy values act like false in a condition. The main ones are false, zero, negative zero, 0n, an empty string, null, undefined, and NaN. Empty arrays and empty objects are actually truthy.",
    "bullets": [
      "false, 0, -0, 0n",
      "'', null, undefined, NaN",
      "[] and {} are truthy",
      "Legacy exception: document.all"
    ]
  },
  "What is the difference between + between 1 + \"1\" vs. 1 + 1?": {
    "spoken": "1 + '1' becomes the string '11', because + performs string concatenation when a primitive operand is a string. 1 + 1 is numeric addition, so it becomes 2.",
    "bullets": [
      "Number + string → string",
      "Number + number → sum"
    ]
  },
  "How to convert a string type into a number? And vice versa?": {
    "spoken": "I use Number to convert a whole string to a number, and String to turn a value into text. parseInt and parseFloat can parse numeric prefixes, so I use them carefully and check invalid results.",
    "bullets": [
      "Number(text)",
      "String(value)",
      "Check NaN and empty input"
    ]
  },
  "What are Template Literals / string literal / string interpolation?": {
    "spoken": "Template literals use backticks and let us insert expressions with ${...}. They also support multiline text. For example, `Hello, ${name}` combines a greeting with a variable without manual string concatenation.",
    "bullets": [
      "Backticks",
      "${expression}",
      "Multiline strings"
    ]
  },
  "What is optional chaining? Demonstrate how to use it.": {
    "spoken": "Optional chaining safely stops when a value is null or undefined. For example, user?.address?.city gives undefined instead of crashing when a part is missing. It works with properties, indexes, and optional function calls.",
    "bullets": [
      "Stop on null/undefined",
      "user?.address?.city",
      "items?.[0], callback?.()"
    ]
  },
  "What is the purpose of the finally block in a try...catch...finally statement?": {
    "spoken": "finally is where I put cleanup that should happen whether the try succeeds or throws. For example, I might reset a loading flag. I avoid returning from finally because it can hide the original result or error.",
    "bullets": [
      "Always-run cleanup",
      "Reset or release resources",
      "Avoid return in finally"
    ]
  },
  "When using switch statements, what happens if you forget the break keyword?": {
    "spoken": "Without break, execution continues into the following case blocks. That is called fall-through. It can be intentional for shared logic, but otherwise I add break, return, or throw to stop it.",
    "bullets": [
      "Fall-through",
      "Intentional grouping or bug",
      "Stop with break/return"
    ]
  },
  "What is the difference between console.log(foo) and console.log(foo())?": {
    "spoken": "console.log(foo) logs the function itself when foo is a function. console.log(foo()) calls it immediately and logs its return value. If it returns nothing, that result is undefined.",
    "bullets": [
      "foo: function value",
      "foo(): call result"
    ]
  },
  "What is the difference between func(callback) and func(callback())?": {
    "spoken": "func(callback) passes the function so it can be called later. func(callback()) calls it now and passes the result. If I need to pass arguments later, I use a wrapper like () => callback(id).",
    "bullets": [
      "Pass a function",
      "Do not call too early",
      "Wrapper for arguments"
    ]
  },
  "Explain the \"Rest Parameter\" (...args) and how it differs from the spread operator?": {
    "spoken": "Rest collects several values into one array, like ...args in a parameter list. Spread does the opposite: it expands a collection into separate values. The same dots have different jobs depending on where they appear.",
    "bullets": [
      "Rest: collect",
      "Spread: expand",
      "Position decides meaning"
    ]
  },
  "How to define Default Parameters for a function?": {
    "spoken": "I put the default directly in the parameter list, like function greet(name = 'Guest'). It is used when the argument is missing or undefined, but not when the caller passes null, zero, or an empty string.",
    "bullets": [
      "parameter = default",
      "Missing or undefined only"
    ]
  },
  "Why use arrow functions? What is a problem that it solves?": {
    "spoken": "Arrow functions make callbacks shorter and keep this from the surrounding scope. That avoids common this-binding problems. They do not have their own arguments or work as constructors, so I do not use them everywhere.",
    "bullets": [
      "Short syntax",
      "Lexical this",
      "Not constructors"
    ]
  },
  "What is an arrow function’s implicit return and explicit return?": {
    "spoken": "An expression body returns automatically, like x => x * 2. A block body needs return. To return an object implicitly, I wrap it in parentheses, like () => ({name: 'Ada'}).",
    "bullets": [
      "Expression: implicit return",
      "Block: explicit return",
      "Object: wrap in parentheses"
    ]
  },
  "What is an IIFE (Immediately Invoked Function Expression), and its purpose and use cases?": {
    "spoken": "An IIFE is a function expression that runs immediately after it is defined. It creates a private scope for temporary variables. Modules and block scope cover many older use cases, but IIFEs can still group startup work.",
    "bullets": [
      "Define and run immediately",
      "Private scope",
      "Startup logic"
    ]
  },
  "What is a \"Higher-Order Function\" and its purpose? Provide 3 examples of a built-in JavaScript HOF.": {
    "spoken": "A higher-order function accepts a function or returns one. It helps us reuse a process while changing the behavior passed into it. map, filter, and reduce are common built-in examples.",
    "bullets": [
      "Takes or returns functions",
      "Reusable behavior",
      "map, filter, reduce"
    ]
  },
  "What is a \"Callback Function\"?": {
    "spoken": "A callback is a function passed to another function for it to call. It might run immediately, like a map callback, or later, like a timer callback. A callback is not automatically asynchronous.",
    "bullets": [
      "Function passed as input",
      "Can run now or later"
    ]
  },
  "What is function currying?": {
    "spoken": "Currying turns a function with several arguments into a chain of functions taking one argument each. For example, add(a)(b) instead of add(a, b). It makes it easy to create specialized reusable functions.",
    "bullets": [
      "One argument per step",
      "add(a)(b)",
      "Reuse preset choices"
    ]
  },
  "What is hasOwnProperty? How is it different from directly checking the property from the object using obj.something?": {
    "spoken": "hasOwnProperty checks whether the object itself owns a property. Reading obj.x can also find inherited properties, and a truthiness check misses values like zero. Object.hasOwn is often the safer modern choice.",
    "bullets": [
      "Own vs. inherited",
      "Existence ≠ truthiness",
      "Prefer Object.hasOwn"
    ]
  },
  "Explain the this keyword.": {
    "spoken": "For regular functions, this mostly depends on how the function is called. A method call uses its object, and new uses the new instance. Arrow functions are different: they inherit this from their surrounding scope.",
    "bullets": [
      "Method: calling object",
      "new: new instance",
      "Arrow: surrounding this"
    ]
  },
  "Give more examples of how this keyword behaves differently in different places.": {
    "spoken": "obj.method() uses obj as this, but calling a detached method can lose that connection. A plain strict-mode function gets undefined. Browser script-level this is usually window, while module-level this is undefined.",
    "bullets": [
      "Call site matters",
      "Detached method loses receiver",
      "Script vs. module",
      "Arrow keeps outer this"
    ]
  },
  "Explain call, apply, and bind. What are their differences?": {
    "spoken": "call and apply invoke a function immediately with a chosen this. call takes separate arguments, while apply takes an array-like list. bind does not run it immediately; it returns a function with this fixed.",
    "bullets": [
      "call: separate arguments",
      "apply: argument list",
      "bind: new bound function"
    ]
  },
  "Explain the difference between a Class and an Object (Instance).": {
    "spoken": "A class is a blueprint for creating objects with shared behavior. An instance is one actual object created from it, with its own state. For example, User is the class and new User('Ada') creates an instance.",
    "bullets": [
      "Class: blueprint",
      "Instance: actual object"
    ]
  },
  "What is the difference between Prototype Methods and Static Methods? Give three examples of a built-in static method of Object, Promise, Array.": {
    "spoken": "Prototype methods are called on instances, while static methods are called on the class or constructor. Examples of static methods are Object.keys, Promise.all, and Array.isArray. They do not require creating an instance first.",
    "bullets": [
      "Instance vs. constructor",
      "Object.keys",
      "Promise.all",
      "Array.isArray"
    ]
  },
  "What does it mean when we say ES6 Classes are just \"Syntax Sugar\"?": {
    "spoken": "JavaScript classes give us cleaner syntax for prototype-based objects and inheritance. Underneath, instances still share methods through prototypes. Classes also add rules, like strict mode and requiring new, so they are not identical to plain functions.",
    "bullets": [
      "Cleaner prototype syntax",
      "Shared prototype methods",
      "Extra class rules"
    ]
  },
  "How do you iterate over the keys and values of an Object? Give three ways.": {
    "spoken": "Object.keys gives keys, Object.values gives values, and Object.entries gives both. I often loop over entries with for...of. for...in is another option, but it can include inherited properties, so it needs care.",
    "bullets": [
      "keys, values, entries",
      "for...of over entries",
      "Beware inherited properties"
    ]
  },
  "What is destructuring?": {
    "spoken": "Destructuring pulls values out of objects or arrays into variables. For example, const {name} = user. To rename a property while extracting it, I write const {name: userName} = user.",
    "bullets": [
      "Extract values",
      "Match property names",
      "Rename with a colon"
    ]
  },
  "Explain Array and Object destructuring difference": {
    "spoken": "Array destructuring matches positions, like [first, second]. Object destructuring matches property names, like {name, age}. Both can use defaults and rest, but object properties can also be renamed.",
    "bullets": [
      "Arrays: positions",
      "Objects: names",
      "Defaults and rest"
    ]
  },
  "Which of the following Array methods mutate (modify) the original array, and which return a new array? map(), filter(), push(), pop(), slice(), splice(), sort() (You can ask one by one)": {
    "spoken": "map, filter, and slice return new arrays. push, pop, splice, and sort change the original array. Their return values differ, so I do not assume every mutating method returns the updated array.",
    "bullets": [
      "New: map/filter/slice",
      "Mutate: push/pop/splice/sort",
      "Check each return value"
    ]
  },
  "What is the difference between Array.prototype forEach and map, and filter?": {
    "spoken": "forEach runs code for every item and returns undefined. map transforms items into a new array. filter creates a new array containing only the items that pass a condition. I choose based on the result I need.",
    "bullets": [
      "forEach: side effects",
      "map: transform",
      "filter: select"
    ]
  },
  "What does the Array.prototype.reduce method do?": {
    "spoken": "reduce combines many items into one accumulated result, like a sum, an object, or grouped data. I normally provide an initial value so the empty-array case works predictably.",
    "bullets": [
      "Many values → one result",
      "Accumulator",
      "Supply an initial value"
    ]
  },
  "Can you break out of a forEach loop? If not, what should you use instead?": {
    "spoken": "I cannot break out of forEach normally; return only exits the current callback. If I need break or continue, I use for...of. For searching or conditions, find, some, or every may fit better.",
    "bullets": [
      "forEach cannot break",
      "Use for...of",
      "find/some/every short-circuit"
    ]
  },
  "Explain the difference between Array.isArray(arr) and typeof arr.": {
    "spoken": "Array.isArray checks specifically for an array. typeof cannot do that because both arrays and ordinary objects return 'object'. So when I need array-specific behavior, I use Array.isArray.",
    "bullets": [
      "typeof [] → 'object'",
      "Array.isArray([]) → true"
    ]
  },
  "What is the runtime of sort?": {
    "spoken": "JavaScript does not guarantee one sorting algorithm or runtime. In modern engines, a general comparison sort is commonly O(n log n), but the exact behavior is engine-dependent, and the comparator's cost matters too.",
    "bullets": [
      "Commonly O(n log n)",
      "Not a language guarantee",
      "Comparator cost matters"
    ]
  },
  "What are JSON.parse and JSON.stringify?": {
    "spoken": "JSON.stringify turns supported data into JSON text, and JSON.parse turns JSON text back into values. Parsing can fail on invalid text, and JSON does not preserve every JavaScript type or object behavior.",
    "bullets": [
      "stringify: value → text",
      "parse: text → value",
      "Validate external data"
    ]
  },
  "Difference between a normal object {} and Map?": {
    "spoken": "An object works well for records with named fields. A Map works well for dynamic lookups because keys can be any type, and it has methods like set, get, and has plus a size property.",
    "bullets": [
      "Object: named records",
      "Map: any key type",
      "Built-in size and iteration"
    ]
  },
  "Is an object ordered? How about a Map instance?": {
    "spoken": "Map keeps insertion order. Object keys also have defined ordering rules: integer-index keys come first numerically, then other strings in insertion order, then symbols. Different enumeration methods include different kinds of properties.",
    "bullets": [
      "Map: insertion order",
      "Object: key-type rules",
      "Enumeration method matters"
    ]
  },
  "How many threads does Javascript have? Why do we need async / non-blocking operations?": {
    "spoken": "JavaScript runs one call stack at a time on each execution thread. The runtime can handle waiting work outside that stack, so network requests do not have to freeze the app. Heavy synchronous calculations can still block it.",
    "bullets": [
      "One stack per thread",
      "Async I/O avoids waiting",
      "CPU work can still block"
    ]
  },
  "Explain the Javascript event loop and how these work together": {
    "spoken": "The call stack runs our code, and each function call has an execution context. Web APIs handle work like timers and requests. Ready callbacks enter queues; once the stack clears, microtasks run before the next task.",
    "bullets": [
      "Context and call stack",
      "Web APIs handle waiting",
      "Microtasks before next task"
    ]
  },
  "Which task has higher priority? For example, given same delay, setTimeout and Promise.resolve, which one comes out first?": {
    "spoken": "Promise callbacks use the microtask queue, while setTimeout uses a task queue. If both are scheduled in the same turn, the promise callback normally runs first, after the synchronous code finishes. The timer delay is only a minimum wait.",
    "bullets": [
      "Synchronous code first",
      "Promise microtask next",
      "Timer task afterward"
    ]
  },
  "What is callback hell? How do we solve this problem?": {
    "spoken": "Callback hell is deeply nested callbacks that make the flow and errors hard to follow. I flatten it with promises or async/await and split the work into smaller named functions.",
    "bullets": [
      "Avoid deep nesting",
      "Promises or async/await",
      "Small named steps"
    ]
  },
  "What is a Promise? Why do we need it?": {
    "spoken": "A promise represents a result we will get later. It starts pending, then either fulfills or rejects, and settles only once. It gives us a consistent way to combine async work and handle errors.",
    "bullets": [
      "Pending → fulfilled/rejected",
      "Settles once",
      "Compose async work"
    ]
  },
  "What is .then, .catch, and .finally?": {
    "spoken": "`.then()`, `.catch()`, and `.finally()` are methods used to handle Promises in JavaScript.",
    "bullets": [
      "**`.then()`** runs when a Promise is fulfilled and handles the result.",
      "**`.catch()`** runs when a Promise is rejected and handles errors.",
      "**`.finally()`** runs after the Promise is settled, whether it succeeds or fails. It's usually used for cleanup."
    ],
    "closing": "They help us handle asynchronous operations like API requests."
  },
  "Why can we not do Promise.then or Promise.catch?": {
    "spoken": "then and catch belong to a promise instance, not the Promise constructor itself. For example, fetch(url).then(...) works because fetch returns a promise. Promise has static helpers like resolve and all.",
    "bullets": [
      "Instance: then/catch",
      "Constructor: resolve/all"
    ]
  },
  "How do we handle multiple promises like concurrent API requests?": {
    "spoken": "I start independent requests together, then combine them with Promise.all or allSettled. If there are many requests, I limit concurrency so I do not overload the server. I also plan how failures should affect the batch.",
    "bullets": [
      "Start together",
      "all or allSettled",
      "Limit large batches"
    ]
  },
  "What is the difference between Promise.all and Promise.allSettled?": {
    "spoken": "Promise.all succeeds only when every promise succeeds and rejects when one rejects. allSettled waits for every outcome and reports each success or failure. Neither automatically cancels work that is still running.",
    "bullets": [
      "all: every success required",
      "allSettled: inspect every result",
      "No automatic cancellation"
    ]
  },
  "Why would we need Promise.race?": {
    "spoken": "Promise.race gives me the first result or error to settle. It is useful for timeouts or competing sources. The other operations keep running unless I cancel them separately.",
    "bullets": [
      "First settlement wins",
      "Timeouts or competing sources",
      "Cancel losers separately"
    ]
  },
  "Difference between using .then and .catch, vs using async/await for promises. Which syntax should we use and why?": {
    "spoken": "Both styles work with promises. async/await usually makes dependent steps and try/catch easier to read, while then/catch can be neat for short chains. I choose clear, consistent code and avoid making independent work sequential by accident.",
    "bullets": [
      "Same promise model",
      "await: readable sequence",
      "Preserve parallel work"
    ]
  },
  "How to call a few api’s in parallel vs in sequence? When should you do each": {
    "spoken": "I run calls in parallel when they do not depend on each other, using Promise.all. I run them in sequence when one needs the previous result, like fetching a user before fetching that user's orders.",
    "bullets": [
      "Independent → parallel",
      "Dependent → sequential"
    ]
  },
  "What is a js module and why do we use it?": {
    "spoken": "A module is a file with its own scope that imports and exports code. It lets us split responsibilities, reuse functions, and avoid global naming conflicts. Build tools can also analyze those dependencies.",
    "bullets": [
      "Own scope",
      "import and export",
      "Clear dependencies"
    ]
  },
  "What is the difference between CommonJS and ES modules?": {
    "spoken": "CommonJS uses require and module.exports, traditionally in Node. ES modules use import and export and support static analysis and live bindings. Browsers support ES modules, and Node supports both with the right configuration.",
    "bullets": [
      "CommonJS: require/exports",
      "ESM: import/export",
      "Check runtime configuration"
    ]
  },
  "Difference between default export and named export. How are they imported?": {
    "spoken": "A default export is imported with a name I choose. Named exports are imported by their exported names, inside braces, though I can alias them. A module can have many named exports but only one default.",
    "bullets": [
      "Default: no braces",
      "Named: braces",
      "Alias with as"
    ]
  },
  "Difference between ES5 and ES6?": {
    "spoken": "ES6 added features like let/const, arrow functions, classes, modules, promises, and destructuring. ES5 code often uses var, constructor functions, and callbacks instead. Many newer syntax features can be transformed for older environments.",
    "bullets": [
      "Better scope and syntax",
      "Modules and promises",
      "Map, Set, iterators"
    ]
  },
  "What is the difference between JavaScript and TypeScript? Which should be preferred by companies and why?": {
    "spoken": "TypeScript is JavaScript with static types and stronger development tools. It catches many mistakes before the code runs and makes larger codebases easier to change. I often prefer it for team projects, but runtime input still needs validation.",
    "bullets": [
      "JavaScript plus types",
      "Earlier error detection",
      "Runtime validation still needed"
    ]
  },
  "What is the difference between any and unknown & Which is Safer?": {
    "spoken": "any tells TypeScript to stop checking that value. unknown can also hold anything, but I must check its type before using it. I prefer unknown for untrusted data because it forces me to narrow it safely.",
    "bullets": [
      "any: skips checks",
      "unknown: check before use"
    ]
  },
  "What is the difference between void and never, when are they used?": {
    "spoken": "void means a function's return value is not used. never means it cannot return normally, such as a function that always throws. never is also useful for checking that a union's cases are fully handled.",
    "bullets": [
      "void: no useful return",
      "never: no normal return",
      "Exhaustive checks"
    ]
  },
  "Difference between interface vs. type, and which one should we use?": {
    "spoken": "Both describe types, including object shapes. Interfaces can be extended and declaration-merged, while type aliases can also express unions and tuples. I follow the team's convention and use the form that fits the contract.",
    "bullets": [
      "Both describe objects",
      "Interface: merging/extension",
      "Type: unions and tuples"
    ]
  },
  "Can Chrome run a .ts file directly? Or, can typescript run in the browser? Why?": {
    "spoken": "Browsers run JavaScript, not general TypeScript syntax. We compile or strip the types before sending the code to the browser. Type checking happens during development or the build, not inside the browser.",
    "bullets": [
      "Compile to JavaScript",
      "Types disappear",
      "Browser does not type-check"
    ]
  },
  "What are generics? What are their use cases?": {
    "spoken": "Generics make reusable code keep track of the types it receives and returns. For example, first<T>(items: T[]) returns T or undefined. They are useful for collections, API wrappers, and reusable hooks without falling back to any.",
    "bullets": [
      "Reuse without losing types",
      "Input/output relationship",
      "Collections, APIs, hooks"
    ]
  },
  "What are union and intersection types?": {
    "spoken": "A union means a value can be one type or another. An intersection means it must satisfy both types. I narrow a union before using type-specific fields and use intersections to combine compatible contracts.",
    "bullets": [
      "Union: A | B",
      "Intersection: A & B",
      "Narrow before use"
    ]
  },
  "How do you explicitly mark parameter types and return types in arrow functions?": {
    "spoken": "I put types after the parameter names and the return type before the arrow. For example, const add = (a: number, b: number): number => a + b. This makes the function's contract clear.",
    "bullets": [
      "Parameter: name: type",
      "Return: ): type =>"
    ]
  },
  "How do you define optional properties in an interface?": {
    "spoken": "I add a question mark after the property name, like age?: number. That means the property can be absent. Before using it as a required value, I check it or provide a default.",
    "bullets": [
      "property?: Type",
      "May be undefined",
      "Check or default"
    ]
  },
  "How and when would you use Type Assertion (as)?": {
    "spoken": "as tells the compiler what type I believe a value has. It does not convert or validate the value at runtime. I use it only when I know something the compiler cannot infer, not to hide a real type problem.",
    "bullets": [
      "Compile-time assertion",
      "No runtime validation",
      "Prefer narrowing when possible"
    ]
  },
  "How and when would you use the Non-null Assertion operator (!)": {
    "spoken": "The ! operator tells TypeScript that a value is not null or undefined. It adds no runtime check, so a wrong assumption can crash. I prefer a guard unless an invariant really guarantees the value exists.",
    "bullets": [
      "Removes null/undefined from type",
      "No runtime safety",
      "Use only with a guarantee"
    ]
  },
  "What are Enums and why do we need them?": {
    "spoken": "An enum gives names to a group of related values, like order statuses. It helps avoid magic values and usually creates a runtime object. String unions or as-const objects can be simpler alternatives when we only need a fixed set.",
    "bullets": [
      "Named choices",
      "Runtime object",
      "Union or as-const alternative"
    ]
  },
  "What are some RESTful URL design principles?": {
    "spoken": "I design URLs around resources, like /users and /users/42/orders, and use HTTP methods for the action. I keep names consistent and put filtering, sorting, and pagination in query parameters. Responses should use clear status codes.",
    "bullets": [
      "Resource nouns",
      "Methods for actions",
      "Query parameters for options"
    ]
  },
  "How can you define the versions of an API (e.g., v1, v2)?": {
    "spoken": "Common approaches are a URL prefix like /api/v1, a version header, or a media type. I pick one convention, document breaking changes, and give clients time to move before removing an older version.",
    "bullets": [
      "URL, header, or media type",
      "Document breaking changes",
      "Planned deprecation"
    ]
  },
  "What is the difference between a Path parameter (e.g., /:variable) and a Query parameter?": {
    "spoken": "A path parameter identifies something in the route, like the user ID in /users/42. A query parameter adjusts the request, like page=2 or sort=name. Both come from the client, so I validate and parse them.",
    "bullets": [
      "Path: identify resource",
      "Query: filter or options",
      "Validate both"
    ]
  },
  "What is a request body and a Data Transfer Object (DTO)?": {
    "spoken": "The request body carries submitted data, often JSON. A DTO defines the data shape crossing the API boundary. I validate that shape and map only allowed fields into the application's models.",
    "bullets": [
      "Body: submitted data",
      "DTO: boundary contract",
      "Validate allowed fields"
    ]
  },
  "When do we use GET, POST, PUT, PATCH, and DELETE? Explain each method.": {
    "spoken": "GET reads, POST submits or creates, PUT replaces, PATCH partially updates, and DELETE removes. I choose the method by its meaning, not just by what the framework allows. GET should not change server state.",
    "bullets": [
      "GET: read",
      "POST: submit/create",
      "PUT: replace",
      "PATCH: partial update",
      "DELETE: remove"
    ]
  },
  "Difference between PUT and PATCH?": {
    "spoken": "PUT replaces the target representation and is defined as idempotent. PATCH changes selected parts. A PATCH that sets a field can be idempotent, but one that increments a counter may not be.",
    "bullets": [
      "PUT: replace",
      "PATCH: partial change",
      "Idempotency depends on operation"
    ]
  },
  "What is idempotent? Give examples, explain in details": {
    "spoken": "Idempotent means repeating the same request has the same intended effect as doing it once. Setting a name twice or deleting the same resource twice fits that idea, even if the responses differ. Payments often need an idempotency key.",
    "bullets": [
      "Same repeated effect",
      "PUT and DELETE",
      "Keys for safe retries"
    ]
  },
  "What is the difference between client-side pagination and server-side pagination?": {
    "spoken": "Client-side pagination downloads the data first and splits it in the browser. Server-side pagination requests only a limited part. I use client-side pagination for small lists and server-side pagination for large datasets to save network and memory.",
    "bullets": [
      "Client: fetch then slice",
      "Server: fetch one page",
      "Large data → server"
    ]
  },
  "Difference between http and https?": {
    "spoken": "HTTPS is HTTP protected by TLS. It encrypts traffic, checks integrity, and helps authenticate the server. It protects the connection, but we still need secure application code and authorization.",
    "bullets": [
      "HTTP plus TLS",
      "Encryption and integrity",
      "Server authentication"
    ]
  },
  "Explain status code in different ranges and give some examples": {
    "spoken": "2xx means success, 3xx means redirection or cache validation, 4xx means a request problem, and 5xx means a server problem. In particular, 401 means missing or invalid authentication, while 403 means insufficient permission.",
    "bullets": [
      "200 OK; 201 created; 204 no body",
      "3xx: redirect/cache validation",
      "400 invalid; 404 missing; 409 conflict",
      "401 unauthenticated; 403 forbidden",
      "5xx: server/upstream failure"
    ]
  },
  "What is http cache control? Give examples": {
    "spoken": "Cache-Control tells browsers and shared caches when they can reuse a response. max-age sets freshness, private limits shared caching, no-cache requires revalidation, and no-store prevents storage. I choose the policy based on freshness and privacy.",
    "bullets": [
      "max-age: freshness",
      "private: private cache only",
      "no-cache: revalidate",
      "no-store: do not save"
    ]
  },
  "How is Axios different from fetch api?": {
    "spoken": "fetch is built in, while Axios is a library with conveniences like interceptors and automatic JSON handling. fetch resolves even on a 404, so I check response.ok. Axios rejects non-success statuses by default. Both can support AbortSignal cancellation.",
    "bullets": [
      "fetch: built in",
      "Axios: conveniences/interceptors",
      "Different HTTP error defaults"
    ]
  },
  "What is an Axios Interceptor?": {
    "spoken": "An Axios interceptor runs shared logic before a request or after a response. I might use one for auth headers, timing, or error handling. I keep refresh retries bounded so an authentication problem cannot create an infinite loop.",
    "bullets": [
      "Before request/after response",
      "Shared auth or logging",
      "Avoid retry loops"
    ]
  },
  "How do you cancel an API request that has been sent out?": {
    "spoken": "I pass an AbortController signal to fetch or a supported client, then call abort when the result is no longer needed. I handle cancellation separately from real errors. It does not guarantee the server stops work it already started.",
    "bullets": [
      "Pass signal",
      "Call abort",
      "Server work may continue"
    ]
  },
  "What is an AbortController?": {
    "spoken": "AbortController provides a signal that supported async operations can listen to. Calling abort cancels the client-side operation where possible. I use it for old searches, component cleanup, and timeouts, with a new controller for each new operation.",
    "bullets": [
      "Controller and signal",
      "Cancel obsolete work",
      "New controller per operation"
    ]
  },
  "What does fetch's promise resolve to, and what does res.json() do? Does fetch reject on a 404 or 500?": {
    "spoken": "fetch resolves to a Response, and res.json() asynchronously reads and parses its body. A 404 or 500 does not reject fetch automatically, so I check response.ok. Network failures, cancellation, or invalid JSON can still cause rejection.",
    "bullets": [
      "Response first",
      "json(): read and parse",
      "Check HTTP status yourself"
    ]
  },
  "What HTTP method does fetch default to, and how do you send a POST with a JSON body?": {
    "spoken": "fetch defaults to GET. For JSON POST, I set method to POST, Content-Type to application/json, and body to JSON.stringify(data). Then I check the response status before deciding how to read its body.",
    "bullets": [
      "method: 'POST'",
      "JSON content type",
      "JSON.stringify(data)",
      "Check response.ok"
    ]
  },
  "What is the difference between RESTful APIs and GraphQL?": {
    "spoken": "REST organizes APIs around resources and HTTP methods. GraphQL gives clients a typed schema and lets them request specific fields. GraphQL offers flexible data selection, while REST often fits standard HTTP caching and simpler resource APIs well.",
    "bullets": [
      "REST: resource endpoints",
      "GraphQL: selected fields",
      "Flexibility vs. extra complexity"
    ]
  },
  "What are \"overfetching\" and \"underfetching,\" and how does GraphQL solve them?": {
    "spoken": "Overfetching means receiving fields I do not need. Underfetching means making extra requests to get missing data. GraphQL lets the client ask for the fields and relationships it needs, but the server still needs efficient resolvers.",
    "bullets": [
      "Too much vs. too little",
      "Request selected fields",
      "Watch resolver N+1"
    ]
  },
  "How do HTTP responses differ between REST (multiple status codes) and GraphQL (always 200)?": {
    "spoken": "REST commonly uses HTTP status codes for request outcomes. GraphQL can return 200 with partial data and an errors field when execution ran. It is not always 200, so clients must check both the HTTP status and GraphQL errors.",
    "bullets": [
      "REST: HTTP outcomes",
      "GraphQL: data plus errors",
      "Not always HTTP 200"
    ]
  },
  "Why is it easier to cache RESTful APIs compared to GraphQL?": {
    "spoken": "REST GET URLs map naturally to browser and CDN caches. GraphQL often puts different queries behind one POST URL, so basic URL caching is less direct. It can still cache through persisted queries, response caches, or normalized client caches.",
    "bullets": [
      "REST: URL-based caching",
      "GraphQL: extra cache strategy",
      "Persisted queries/client caches"
    ]
  },
  "When would you choose RESTful over GraphQL, and vice versa?": {
    "spoken": "I choose REST for straightforward resource APIs and simple HTTP caching. I consider GraphQL when different clients need varied combinations of related data. The decision also depends on query performance, authorization, and what the team can maintain.",
    "bullets": [
      "REST: simple resource model",
      "GraphQL: flexible data needs",
      "Consider operating cost"
    ]
  },
  "Why was GraphQL created, and why did many teams later move away from it?": {
    "spoken": "GraphQL was created to give clients more control over the data they fetch. Some teams later chose simpler alternatives because schema management, caching, or resolver performance became costly. That is a tradeoff, not a universal move away from GraphQL.",
    "bullets": [
      "Flexible client data",
      "Resolver/schema overhead",
      "Choose by actual needs"
    ]
  },
  "What is a GraphQL schema?": {
    "spoken": "A GraphQL schema is the API's typed contract. It defines available objects, fields, queries, and mutations. Clients use it to know what they can request, and tooling can validate queries against it.",
    "bullets": [
      "Types and fields",
      "Queries and mutations",
      "Validation and documentation"
    ]
  },
  "What is a resolver?": {
    "spoken": "A resolver is the function that supplies a GraphQL field's value. It may read existing data, query a database, or call another service. I enforce permissions and batch repeated lookups so resolvers do not create an N+1 problem.",
    "bullets": [
      "Field → value",
      "Data access and permissions",
      "Batch repeated lookups"
    ]
  },
  "What's the difference between a query and a mutation?": {
    "spoken": "A query reads data and should not change state. A mutation requests a change, such as creating an order. Both are defined in the schema; subscriptions are another option for ongoing updates.",
    "bullets": [
      "Query: read",
      "Mutation: change",
      "Subscription: updates"
    ]
  },
  "What is a BFF (Backend for Frontend), and what problem does it solve?": {
    "spoken": "A BFF is a backend shaped for a particular frontend. It gathers service data and returns what a screen needs. That avoids many browser round trips and keeps service coordination out of the UI, though the BFF must remain reliable.",
    "bullets": [
      "Backend for one frontend",
      "Aggregate and reshape data",
      "Fewer browser round trips"
    ]
  },
  "What's wrong with short polling?": {
    "spoken": "Short polling asks for updates repeatedly, even when nothing has changed. That wastes requests and only finds changes at the next interval. It can still be fine for simple features that do not need instant updates.",
    "bullets": [
      "Repeated requests",
      "Empty responses and delay",
      "Simple but inefficient"
    ]
  },
  "How is long polling different from short polling?": {
    "spoken": "Short polling responds immediately, while long polling waits until data arrives or a timeout happens. The client then starts another request. It reduces empty responses, but still needs reconnect and failure handling.",
    "bullets": [
      "Short: respond now",
      "Long: wait for update",
      "Reconnect after response"
    ]
  },
  "What is a WebSocket?": {
    "spoken": "A WebSocket keeps a connection open so the client and server can send messages whenever needed. It is useful for chat and collaboration. I still need authentication, heartbeats, reconnects, and a plan for missed messages.",
    "bullets": [
      "Persistent two-way connection",
      "Chat and collaboration",
      "Reconnect and recover"
    ]
  },
  "What are Server-Sent Events (SSE)?": {
    "spoken": "SSE streams events from the server to the browser over HTTP. EventSource supports reconnecting, and event IDs can help recover missed updates if the server supports that. The client sends actions through separate requests.",
    "bullets": [
      "Server → client",
      "HTTP event stream",
      "EventSource reconnects"
    ]
  },
  "When would you choose SSE over a WebSocket?": {
    "spoken": "I choose SSE when updates mostly flow from the server, like notifications or progress. I choose WebSocket when both sides send frequent messages or need binary data. I also check authentication and proxy behavior.",
    "bullets": [
      "SSE: one-way updates",
      "WebSocket: two-way traffic",
      "Check infrastructure fit"
    ]
  },
  "What is Socket.IO, and how does it relate to WebSocket?": {
    "spoken": "Socket.IO adds features such as rooms, events, acknowledgments, and reconnects. It often uses WebSocket, with polling as a fallback. It has its own protocol, so it is not directly interchangeable with a plain WebSocket client.",
    "bullets": [
      "Higher-level messaging library",
      "WebSocket with fallback",
      "Own protocol"
    ]
  },
  "What is JSX?": {
    "spoken": "JSX is a JavaScript syntax extension for describing UI with HTML-like markup. A build tool turns it into calls that create React elements. The classic transform uses React.createElement, while modern transforms use the JSX runtime.",
    "bullets": [
      "UI syntax, not HTML strings",
      "Compiled to element calls",
      "createElement or JSX runtime"
    ]
  },
  "Explain React rerendering / reconciliation process": {
    "spoken": "React first renders a description of the UI, then compares it with the previous tree. It uses types, positions, and keys to decide what changed. During commit, it applies the needed DOM updates rather than replacing everything.",
    "bullets": [
      "Render → compare → commit",
      "Virtual DOM description",
      "Types, positions, keys"
    ]
  },
  "Briefly explain React Fiber.": {
    "spoken": "Fiber is React's internal rendering structure and scheduler. It breaks work into smaller units so React can prioritize, pause, or restart rendering. That helps responsiveness, but it does not mean components run on multiple JavaScript threads.",
    "bullets": [
      "Units of rendering work",
      "Prioritize and interrupt",
      "Commit finished changes"
    ]
  },
  "What is a React component?": {
    "spoken": "A React component is a reusable piece of UI. A function component receives props and returns React nodes, usually written as JSX. It can also use hooks for state and behavior and compose other components.",
    "bullets": [
      "Reusable UI",
      "Props in, UI out",
      "Compose components"
    ]
  },
  "What is the difference between state and props?": {
    "spoken": "Props are inputs from the parent, while state is memory managed by the component. I treat both as read-only snapshots and use state setters for changes. When state updates, React schedules another render.",
    "bullets": [
      "Props: parent inputs",
      "State: local memory",
      "Setters request updates"
    ]
  },
  "Why must array/object state be updated immutably instead of mutated in place?": {
    "spoken": "React relies on references to notice many changes. If I mutate the same object, React or a memoized child may miss the update. I create a new object or array, copying each changed level while preserving the old snapshot.",
    "bullets": [
      "New reference for changes",
      "Preserve previous snapshots",
      "Copy the changed path"
    ]
  },
  "Is a prop mutable?": {
    "spoken": "I treat props as read-only. Even if JavaScript lets me mutate an object prop, that changes someone else's data and can break predictable rendering. Instead, I call a callback so the owner can update it.",
    "bullets": [
      "Do not mutate inputs",
      "Owner updates the data",
      "Report changes with callbacks"
    ]
  },
  "What is a \"children\" prop?": {
    "spoken": "children is the content placed between a component's opening and closing tags. A wrapper can render it inside a shared layout. It might be text, elements, or several React nodes, not just one child element.",
    "bullets": [
      "Nested content",
      "Reusable wrappers",
      "Any valid React nodes"
    ]
  },
  "What are smart (container) component and dumb (presentation) component?": {
    "spoken": "A container handles data and coordination, while a presentation component focuses on showing props and reporting actions. This can make code easier to reuse and test, though custom hooks often provide a more flexible way to share logic.",
    "bullets": [
      "Container: data and logic",
      "Presentation: UI and callbacks",
      "Hooks can share behavior"
    ]
  },
  "What is a stateless component?": {
    "spoken": "A stateless component does not keep local state. It renders from its inputs and can report actions through callbacks. Stateless does not automatically mean pure, because it could still perform side effects.",
    "bullets": [
      "No local state",
      "UI from inputs",
      "Not automatically pure"
    ]
  },
  "What is the difference between class components and functional components?": {
    "spoken": "Function components use hooks for state and effects. Class components use this, state, and lifecycle methods. I normally use functions for new code because logic is easier to share with hooks, while classes still appear in older apps and error boundaries.",
    "bullets": [
      "Functions: hooks",
      "Classes: this and lifecycles",
      "Functions for most new code"
    ]
  },
  "What are Fragments in React and why do we use them?": {
    "spoken": "A Fragment groups elements without adding an extra DOM wrapper. I use <>...</> for a simple group. If the group needs a key in a list, I use the explicit Fragment component.",
    "bullets": [
      "Group siblings",
      "No extra DOM node",
      "Explicit Fragment for keys"
    ]
  },
  "What is prop drilling? Is it good? If not, how do we deal with it?": {
    "spoken": "Prop drilling means passing data through components that only forward it. A few levels can be perfectly clear. When it becomes awkward, I consider composition, Context, or a store, while keeping state as local as possible.",
    "bullets": [
      "Data passed through layers",
      "Some drilling is fine",
      "Composition, Context, store"
    ]
  },
  "How do you handle conditional rendering in React?": {
    "spoken": "I use if statements or early returns for larger branches, a ternary for two alternatives, and && for optional content. I watch out for numeric zero with &&, because React may render the zero instead of nothing.",
    "bullets": [
      "if or early return",
      "Ternary for alternatives",
      "Guard against 0 with &&"
    ]
  },
  "What are PropTypes, and do we need them when using React with TypeScript?": {
    "spoken": "PropTypes used to check props at runtime during development. TypeScript usually replaces that role for typed components, and React 19 removed function-component propTypes checking. I still validate API data at runtime because TypeScript types disappear.",
    "bullets": [
      "TypeScript: build-time checks",
      "Legacy PropTypes: runtime checks",
      "Validate external data"
    ]
  },
  "Why choose React as a UI library instead of Vanilla JS, Angular, or Vue?": {
    "spoken": "I choose React when reusable components, declarative UI, and its ecosystem fit the project. Vanilla JavaScript can be simpler for a small page, and Angular or Vue may offer conventions the team prefers. The choice depends on the product and team.",
    "bullets": [
      "Reusable components",
      "Strong ecosystem",
      "Match team and product"
    ]
  },
  "What are the limitations or downsides of React?": {
    "spoken": "React leaves many application choices to the team, like routing and data fetching. Large client bundles can hurt initial loading, and state or effects can become complex. Good conventions, profiling, and careful dependency choices help manage those tradeoffs.",
    "bullets": [
      "More architecture decisions",
      "Bundle and effect complexity",
      "Ongoing maintenance"
    ]
  },
  "What causes a React component to re-render?": {
    "spoken": "A component can re-render because its state changes, its parent renders, or subscribed context/store data changes. I first keep state local and split expensive UI. If profiling shows a need, I use memoization with stable inputs.",
    "bullets": [
      "State, parent, context/store",
      "Localize state",
      "Measure before memoizing"
    ]
  },
  "Explain keys in a list": {
    "spoken": "Keys let React track which list item is which across changes. I use stable IDs unique among siblings. Index keys are risky when items move, and random keys cause remounts, so I avoid them for dynamic lists.",
    "bullets": [
      "Stable sibling identity",
      "Prefer data IDs",
      "Avoid random/dynamic indexes"
    ]
  },
  "What is a pure function?": {
    "spoken": "A pure function gives the same result for the same inputs and does not change anything outside itself. That makes it easier to reason about and test because there are no hidden side effects.",
    "bullets": [
      "Same inputs, same result",
      "No outside changes",
      "Easy to test"
    ]
  },
  "What does it mean for a Component to be \"Pure\"?": {
    "spoken": "A pure component describes UI consistently from its props, state, and context without changing them or doing side effects during render. React may render it again, so that work must be safe to repeat.",
    "bullets": [
      "Predictable render output",
      "No mutation or side effects",
      "Safe to repeat"
    ]
  },
  "What are considered side effects in React components? Where should we handle them?": {
    "spoken": "Side effects include requests, timers, subscriptions, and direct changes outside rendering. I put user-triggered work in event handlers and external synchronization in effects. Values I can calculate from current inputs usually belong directly in render.",
    "bullets": [
      "Events: user actions",
      "Effects: synchronization",
      "Render: pure calculations"
    ]
  },
  "What is React.StrictMode, and why does it render everything twice?": {
    "spoken": "StrictMode runs extra development checks to reveal unsafe code. It can repeat rendering and effect setup/cleanup so missing cleanup or mutation becomes visible. These checks are development-only; I fix the cause rather than disable them.",
    "bullets": [
      "Development checks",
      "Repeated render/setup/cleanup",
      "Find impurities and leaks"
    ]
  },
  "What are mounting and unmounting in a component's lifecycle?": {
    "spoken": "Mounting means a component is added to the tree. Unmounting means it is removed, and cleanup runs. Changing a component's type or key can replace it with a new instance and reset its local state.",
    "bullets": [
      "Mount: added",
      "Unmount: removed",
      "New identity resets state"
    ]
  },
  "What are the class component lifecycle methods?": {
    "spoken": "The main class lifecycles are componentDidMount, componentDidUpdate, and componentWillUnmount. They handle startup, updates, and cleanup. shouldComponentUpdate can skip work, and error-boundary methods handle rendering failures. I avoid the old unsafe lifecycle methods.",
    "bullets": [
      "Mount, update, unmount",
      "shouldComponentUpdate",
      "Error-boundary lifecycles"
    ]
  },
  "How do Error Boundaries work, and why can they only be built using class components?": {
    "spoken": "An error boundary catches rendering errors below it and shows fallback UI. The direct React API uses class methods such as getDerivedStateFromError and componentDidCatch. Function components can use a library or framework wrapper around that boundary behavior.",
    "bullets": [
      "Catch descendant render errors",
      "Show fallback and report",
      "Class API or library wrapper"
    ]
  },
  "What kind of errors can you use Error Boundaries to handle?": {
    "spoken": "Error boundaries handle errors in descendant rendering and React-managed lifecycle work. They do not generally catch event-handler errors, ordinary async failures, server rendering errors, or failures inside the boundary itself. Those need their own error handling.",
    "bullets": [
      "Rendering/lifecycle errors",
      "Not ordinary async/events",
      "Boundary cannot catch itself"
    ]
  },
  "How do you gracefully handle errors when an API call from React fails?": {
    "spoken": "I catch request failures and show a clear error state instead of leaving the UI stuck loading. I check HTTP status, offer a useful retry, and cancel or ignore obsolete requests. Internal details go to safe logs, not the user.",
    "bullets": [
      "Loading/error/success states",
      "Retry where useful",
      "Ignore stale results"
    ]
  },
  "Explain how useState works.": {
    "spoken": "useState keeps a value between renders and gives us a setter. Calling the setter queues an update, and the next render receives the new value. State belongs to that component's identity in the tree.",
    "bullets": [
      "Value and setter",
      "Queued update",
      "Preserved across renders"
    ]
  },
  "What are different ways of calling setState?": {
    "spoken": "With a hook setter, I can pass the next value or a function that calculates it from previous state. I use the function form for dependent updates. Class setState is different because it shallow-merges object updates, while hook setters replace the value.",
    "bullets": [
      "Direct value or updater",
      "Updater for previous state",
      "Hooks replace; classes merge"
    ]
  },
  "How do you queue a series of state updates?": {
    "spoken": "I use updater functions, like setCount(c => c + 1), for a series of dependent updates. React applies them in order. Repeating setCount(count + 1) instead uses the same captured count, so those calls may request the same value.",
    "bullets": [
      "Functional updates",
      "Processed in order",
      "Avoid stale captured values"
    ]
  },
  "Why is it that, when you console.log the state after calling setState, the value is the old value?": {
    "spoken": "The current render has a snapshot of state. Calling its setter schedules a future render; it does not change the variable inside the current closure. That is why a log immediately afterward still shows the old value.",
    "bullets": [
      "State is a snapshot",
      "Setter queues next render",
      "Current closure stays unchanged"
    ]
  },
  "How does useEffect work, and what is its purpose?": {
    "spoken": "useEffect keeps a component synchronized with something outside React, like a connection or subscription. It runs after a commit and can return cleanup. I include its dependencies and avoid using effects for ordinary calculations.",
    "bullets": [
      "Synchronize external systems",
      "After commit",
      "Dependencies and cleanup"
    ]
  },
  "Explain the dependency array in useEffect (empty, none, and with dependencies).": {
    "spoken": "Without an array, an effect runs after every commit. With [], it sets up on mount; with dependencies, it reruns when they change. Cleanup runs before a rerun and on unmount, with extra checks possible in development StrictMode.",
    "bullets": [
      "None: every commit",
      "[]: mount setup",
      "[deps]: changes",
      "Cleanup before rerun/unmount"
    ]
  },
  "How do we clean up in useEffect, and why is it necessary?": {
    "spoken": "I return a cleanup function from the effect to undo its setup. That can remove a listener, clear a timer, or disconnect a subscription. It prevents leaks and stale work when dependencies change or the component unmounts.",
    "bullets": [
      "Undo the setup",
      "Before rerun/on unmount",
      "Avoid leaks and stale work"
    ]
  },
  "How do you clean up a setTimeout or setInterval?": {
    "spoken": "I keep the timer ID and pass it to clearTimeout or clearInterval. Inside an effect, I return that cleanup function so the timer stops when the component unmounts or the effect restarts.",
    "bullets": [
      "Store timer ID",
      "clearTimeout/clearInterval",
      "Return cleanup"
    ]
  },
  "Why might a useEffect call run multiple times unexpectedly, and how do you avoid infinite re-rendering?": {
    "spoken": "Effects can rerun because dependencies changed or StrictMode is checking cleanup. A loop often means the effect updates something that changes its own dependencies. I remove unnecessary effects or stabilize genuinely shared inputs, rather than hiding dependencies.",
    "bullets": [
      "Check dependencies",
      "Watch object/function identity",
      "Break update loops",
      "Keep required dependencies"
    ]
  },
  "What is the difference between handling side effects inside useEffect versus event handlers?": {
    "spoken": "Event handlers run because the user did something, like submitting a form. Effects run because the rendered state needs to stay synchronized with an external system. I put purchases in handlers and room subscriptions in effects.",
    "bullets": [
      "Handler: specific action",
      "Effect: ongoing synchronization"
    ]
  },
  "What is useLayoutEffect?": {
    "spoken": "useLayoutEffect runs after DOM changes but before the browser paints. I use it when I must measure and correct layout before the user sees it. Because it blocks painting, I prefer useEffect when that timing is unnecessary.",
    "bullets": [
      "Before paint",
      "Measure and adjust layout",
      "Use sparingly"
    ]
  },
  "What is useRef, and what are different ways to use it?": {
    "spoken": "useRef gives me a stable object whose current value can change without causing a render. I use it for DOM elements, timer IDs, or other bookkeeping that must survive renders but is not itself UI state.",
    "bullets": [
      "Stable current container",
      "No render on change",
      "DOM nodes and IDs"
    ]
  },
  "What is the difference between useState and useRef?": {
    "spoken": "useState is for values that should update the UI. useRef is for mutable values that should survive renders without causing one. If the screen depends on a changing value, state is usually the right choice.",
    "bullets": [
      "State: triggers rendering",
      "Ref: mutable bookkeeping",
      "Both survive renders"
    ]
  },
  "What is useReducer?": {
    "spoken": "useReducer organizes state changes through a reducer and dispatched actions. The reducer takes the current state and action and returns the next state. I use it when several related transitions make separate setters hard to follow.",
    "bullets": [
      "State + action → next state",
      "dispatch actions",
      "Complex related transitions"
    ]
  },
  "What is the difference between useMemo and useCallback?": {
    "spoken": "useMemo caches a calculated value, while useCallback caches a function reference. Both use dependencies to decide when to refresh. I use them for a real performance need, not as a default around every value or function.",
    "bullets": [
      "useMemo: value",
      "useCallback: function",
      "Measure first"
    ]
  },
  "What is the difference between useMemo and React.memo?": {
    "spoken": "useMemo caches a value inside a component. React.memo can skip rendering a component when its parent renders with equal props. Local state and context can still update it, so memo is only a targeted performance optimization.",
    "bullets": [
      "useMemo: calculation cache",
      "memo: component prop check",
      "State/context still update"
    ]
  },
  "What is a custom hook?": {
    "spoken": "A custom hook is a use-prefixed function that combines hooks into reusable behavior. For example, useDebounce can share timing logic across components. Each call normally has its own state; sharing the hook does not automatically share that state.",
    "bullets": [
      "Reusable hook logic",
      "Name starts with use",
      "Separate state per call"
    ]
  },
  "What are the rules about using custom hooks?": {
    "spoken": "Custom hooks follow the normal hook rules: call them at the top level of a function component or another hook. Do not call them in ordinary conditions, loops, or handlers. Keep effects' dependencies accurate and render logic pure.",
    "bullets": [
      "Top-level calls",
      "Components or hooks only",
      "Correct effect dependencies",
      "use API has special rules"
    ]
  },
  "Provide examples of custom hooks you have used (e.g., useLocalStorage, useDebounce, usePagination, useClickOutside).": {
    "spoken": "A good example is useDebounce for delaying searches, useLocalStorage for a saved setting, or useClickOutside for closing a menu. In an interview, I would choose one I actually used and explain its cleanup and edge cases.",
    "bullets": [
      "Saved settings",
      "Debounce and pagination",
      "Outside-click cleanup",
      "Adapt to real experience"
    ]
  },
  "What is a Higher Order Component (HOC)?": {
    "spoken": "A higher-order component takes a component and returns an enhanced component. It can add shared behavior like authorization or logging. I pass unrelated props through and avoid creating a new wrapper during every render.",
    "bullets": [
      "Component → enhanced component",
      "Shared behavior",
      "Forward props"
    ]
  },
  "What is \"HOC hell\"? And how do we resolve it?": {
    "spoken": "HOC hell means many nested wrappers make the component tree and data flow hard to follow. Custom hooks can share stateful logic without extra wrappers, while composition can keep shared UI clearer.",
    "bullets": [
      "Too many wrappers",
      "Hooks for logic",
      "Composition for UI"
    ]
  },
  "What is React.PureComponent?": {
    "spoken": "PureComponent is a class that shallowly compares props and state to skip some renders. It depends on immutable updates. For function components, React.memo offers a similar prop-based optimization, though context updates still apply.",
    "bullets": [
      "Shallow comparison",
      "Immutable updates",
      "Function alternative: memo"
    ]
  },
  "What is a controlled component?": {
    "spoken": "A controlled input gets its value from React state and updates that state through onChange. The new state then updates the input. An uncontrolled input keeps its value in the DOM and is read with a ref or form API.",
    "bullets": [
      "Controlled: value + onChange",
      "Explicit two-way flow",
      "Uncontrolled: DOM owns value"
    ]
  },
  "What is a Synthetic Event in React?": {
    "spoken": "A SyntheticEvent is React's event wrapper with a consistent interface, including target, currentTarget, and preventDefault. Modern React DOM no longer pools these events, so we do not need persist to keep them for later use.",
    "bullets": [
      "Consistent event interface",
      "target vs. currentTarget",
      "No modern event pooling"
    ]
  },
  "What's the difference between onClick={handleClick}, onClick={handleClick()}, and onClick={() => handleClick(id)}?": {
    "spoken": "Passing handleClick lets React call it on the click. Writing handleClick() calls it during render, which is usually a mistake. A wrapper like () => handleClick(id) waits for the click and then passes an argument.",
    "bullets": [
      "Pass the handler",
      "Avoid render-time invocation",
      "Wrapper for arguments"
    ]
  },
  "How do you perform form input validation?": {
    "spoken": "I validate required fields, formats, and business rules, then show clear errors beside the inputs. React Hook Form can manage the form, and Zod can validate its data. I always repeat important validation on the server.",
    "bullets": [
      "Required, format, cross-field rules",
      "React Hook Form + Zod",
      "Accessible error messages",
      "Server validation too"
    ]
  },
  "What is the default behavior of forms? How do we prevent it?": {
    "spoken": "A normal form submission sends a request and usually navigates or reloads the page. If I handle it in JavaScript, I call preventDefault in onSubmit. I also set non-submit buttons to type=\"button\".",
    "bullets": [
      "Default: submit and navigate",
      "preventDefault in onSubmit",
      "Explicit button types"
    ]
  },
  "Explain debounce and throttle and what we might need them in a form?": {
    "spoken": "Debounce waits until changes pause, so it is good for search requests. Throttle limits how often something runs, so it suits frequent events. I keep input state immediate and only delay expensive work, while cleaning up old requests or timers.",
    "bullets": [
      "Debounce: wait for pause",
      "Throttle: limit frequency",
      "Keep typing immediate"
    ]
  },
  "What is useTransition?": {
    "spoken": "useTransition marks an update as non-urgent so urgent interactions can take priority. I keep an input's own state immediate and transition an expensive result view. It helps scheduling, but does not move CPU-heavy work to another thread.",
    "bullets": [
      "Non-urgent state updates",
      "isPending feedback",
      "Input stays urgent"
    ]
  },
  "What is automatic batching update for states? Since which version is it supported?": {
    "spoken": "Batching groups state updates into fewer renders. React 18 with createRoot expanded automatic batching to timers, promises, and native callbacks. React already batched event-handler updates before that. For dependent updates, I still use updater functions.",
    "bullets": [
      "Fewer renders",
      "Broader in React 18",
      "Use functional updates"
    ]
  },
  "What is React Compiler in React 19?": {
    "spoken": "React Compiler is an optional build-time optimizer that adds automatic memoization to supported components and hooks. It can reduce manual memoization, but it needs tooling setup. Installing React 19 alone does not turn it on.",
    "bullets": [
      "Build-time optimization",
      "Automatic memoization",
      "Requires configuration"
    ]
  },
  "What are server components in React 19?": {
    "spoken": "Server Components run on the server or during a build and can access backend data directly. Their implementation is not shipped as interactive client JavaScript. For state, effects, and browser interaction, I compose them with Client Components.",
    "bullets": [
      "Server/build execution",
      "Less client implementation code",
      "Client components for interaction",
      "Different from SSR"
    ]
  },
  "What is the \"use\" API in React 19?": {
    "spoken": "The use API reads resources such as promises or context during render. A pending promise can show a Suspense fallback, and rejection can reach an error boundary. Unlike ordinary hooks, use can be conditional, but it still belongs in a component or hook.",
    "bullets": [
      "Read promise/context",
      "Suspense and error boundary",
      "Stable cached promises",
      "Conditional calls allowed"
    ]
  },
  "Talk about your experience with React hooks?": {
    "spoken": "I would describe real examples: useState for local UI, useEffect for a subscription, and useRef for DOM access. Then I would explain one custom hook and why its dependencies and cleanup matter, rather than just listing hook names.",
    "bullets": [
      "Choose real examples",
      "Explain why each hook",
      "Include cleanup and tradeoffs"
    ]
  },
  "Tell me about how you design your React folder structure?": {
    "spoken": "I group React code by feature and keep related components, hooks, API code, types, and tests nearby. Truly reusable pieces go into shared folders. The goal is a structure the team can navigate without creating unnecessary layers.",
    "bullets": [
      "Feature-based folders",
      "Keep related code together",
      "Small shared modules"
    ]
  },
  "Tell me about how you can keep your React app code clean?": {
    "spoken": "I keep components focused, names clear, and state minimal. I extract repeated behavior into hooks or plain functions, avoid unnecessary effects, and use types, linting, formatting, and tests. I only add abstractions when they make the code easier to understand.",
    "bullets": [
      "Focused components",
      "Derive instead of duplicate",
      "Reuse carefully",
      "Types, lint, tests"
    ]
  },
  "How do you identify and improve your React app’s performance?": {
    "spoken": "I measure with React Profiler and browser tools before optimizing. Then I target the cause: unnecessary renders, long lists, large bundles, or heavy calculations. I compare before and after so I know the change actually helped.",
    "bullets": [
      "Profile first",
      "Optimize the bottleneck",
      "Measure again"
    ]
  },
  "Real-time Scenario: How would you fix a UI that freezes while a user is typing in an input?": {
    "spoken": "I first profile what blocks typing. I keep the input's state small and immediate, then debounce requests or defer the expensive results. Large lists may need virtualization, and heavy calculations may need a Web Worker.",
    "bullets": [
      "Find the long task",
      "Immediate input state",
      "Debounce/defer results",
      "Virtualize or use worker"
    ]
  },
  "What is the Context API? How does it solve the prop drilling problem?": {
    "spoken": "Context lets descendants read a shared value without passing it through every intermediate component. I provide the value above them and read it with useContext. It works well for things like theme or locale, but is not a complete state or data-fetching solution.",
    "bullets": [
      "Provider above consumers",
      "Avoid prop forwarding",
      "Theme, locale, shared settings"
    ]
  },
  "What happens if useContext is called with no matching Provider above it?": {
    "spoken": "Without a matching provider, useContext returns the default passed to createContext. If that default is undefined, the result is undefined; React does not throw automatically. A custom hook can throw a useful missing-provider error.",
    "bullets": [
      "Returns default value",
      "No automatic error",
      "Optional custom guard"
    ]
  },
  "Explain createContext(), useContext, Context Provider, and Context Consumer.": {
    "spoken": "createContext creates the context and its fallback. The Provider supplies a value, and useContext reads the closest provider above the component. Consumer is the older render-function approach; React 19 also supports the context object as a provider.",
    "bullets": [
      "Create → provide → read",
      "Nearest provider wins",
      "Consumer is older API"
    ]
  },
  "Why is Context API considered bad for performance in large-scale apps?": {
    "spoken": "Context is not inherently slow, but one big value that changes often can notify many consumers. I split unrelated contexts, keep state local, and stabilize provider values when it helps. For selective subscriptions, a store may fit better.",
    "bullets": [
      "Changed value notifies readers",
      "Split unrelated data",
      "Consider selective subscriptions"
    ]
  },
  "When would a Context Consumer component re-render?": {
    "spoken": "A context consumer updates when its provider value changes by Object.is. It can also render because its parent or its own state changes. React.memo does not block an update from context the component reads.",
    "bullets": [
      "Provider value change",
      "Parent or local state",
      "memo does not block context"
    ]
  },
  "Why do we use Redux?": {
    "spoken": "Redux helps organize complex shared state with predictable updates and debugging tools. Its core ideas are one state tree per store, changes requested through actions, and pure reducers. I normally use Redux Toolkit rather than handwritten boilerplate.",
    "bullets": [
      "Single state tree",
      "Actions request changes",
      "Pure reducers",
      "Toolkit for new Redux code"
    ]
  },
  "Explain the Flux pattern with the following concepts.": {
    "spoken": "Flux is a one-way flow: the UI dispatches an action, the store uses a reducer to calculate new state, and subscribed UI reads that state. This makes changes easier to trace than scattered direct mutations.",
    "bullets": [
      "UI → action",
      "Reducer → new state",
      "Store → UI"
    ]
  },
  "How do you read from and write to states in Redux store? Which functions?": {
    "spoken": "I read selected data with useSelector and send actions with useDispatch. The action describes the change, and the reducer updates the store. With Redux Toolkit, createSlice generates reducers and action creators together.",
    "bullets": [
      "Read: useSelector",
      "Write request: dispatch",
      "createSlice for actions/reducers"
    ]
  },
  "What are connect api and mapStateToProps?": {
    "spoken": "connect is React Redux's older HOC API. mapStateToProps selects store values and supplies them as component props. It can also provide dispatch functions; function components commonly use useSelector and useDispatch instead.",
    "bullets": [
      "Older HOC approach",
      "Store data → props",
      "Hooks are common now"
    ]
  },
  "What is Redux Toolkit? How is it different from traditional Redux?": {
    "spoken": "Redux Toolkit is the recommended simpler way to write Redux. configureStore gives useful defaults, and createSlice reduces boilerplate. Immer lets reducers use mutation-like syntax while still producing immutable updates; RTK Query can manage server data.",
    "bullets": [
      "configureStore and createSlice",
      "Less boilerplate",
      "Immer-backed immutable updates"
    ]
  },
  "What is a redux Redux middleware? Explain these examples": {
    "spoken": "Middleware adds behavior around dispatch. Thunk supports async functions that dispatch actions, Saga coordinates async work with generators, and Redux Persist saves and restores selected state. Persist is a persistence library, not simply another async middleware.",
    "bullets": [
      "Thunk: async functions",
      "Saga: generator effects",
      "Persist: save/rehydrate state"
    ]
  },
  "Explain the differences between Redux and the Context API.": {
    "spoken": "Context mainly distributes a value, while Redux provides a full store and update model with selectors, middleware, and debugging conventions. I use Context for simple shared values and consider Redux when shared state transitions and subscriptions become more complex.",
    "bullets": [
      "Context: distribute values",
      "Redux: managed state model",
      "Choose by complexity"
    ]
  },
  "How do you choose whether to store data in local state vs global state?": {
    "spoken": "I keep state local until several components genuinely need it. Then I lift it to a shared parent or store it globally if it is app-wide. Shareable filters belong in the URL, and fetched server data often belongs in a query cache.",
    "bullets": [
      "Local first",
      "Lift when shared",
      "URL for navigation state",
      "Query cache for server data"
    ]
  },
  "Explain the difference between client-side state and server-side state.": {
    "spoken": "Client state belongs to the UI, like an open menu. Server state is owned remotely and can change without our page knowing. That is why server data needs freshness, caching, retries, and synchronization rather than only a local setter.",
    "bullets": [
      "Client: UI-owned",
      "Server: remotely owned",
      "Freshness and synchronization"
    ]
  },
  "What is React Query? What features does it provide and what problems does it solve?": {
    "spoken": "React Query, now TanStack Query, handles fetching and caching server data. It gives us loading and error states, retries, background refetching, and cache invalidation. It reduces repeated request logic but does not replace all local or global UI state.",
    "bullets": [
      "Fetch and cache",
      "Retry and refetch",
      "Mutations and invalidation"
    ]
  },
  "What is React Router?": {
    "spoken": "React Router maps URLs to UI and lets users navigate without full-page reloads. It supports route parameters and nested layouts. Depending on the setup, it can also manage route data and error handling.",
    "bullets": [
      "URL → UI",
      "Client navigation",
      "Parameters and nested routes"
    ]
  },
  "How is Client Side Routing (CSR) different from both traditional routing & Server Side Rendering (SSR)?": {
    "spoken": "Client-side routing changes the page through JavaScript without a full document request. Traditional routing gets a new document from the server. SSR is a different idea: it describes where initial HTML is produced, and an SSR app can still use client routing.",
    "bullets": [
      "Routing: how navigation works",
      "SSR: where HTML renders",
      "Can work together"
    ]
  },
  "Why does Client Side Rendering have slow initial loading and poor SEO, and how could we solve it?": {
    "spoken": "A client-rendered page may wait for JavaScript and data before showing useful content. That delays loading and can complicate crawling. I reduce bundles and waterfalls, and use SSR or SSG when early HTML matters, along with good metadata.",
    "bullets": [
      "JavaScript/data delay",
      "Split and optimize assets",
      "SSR/SSG when useful"
    ]
  },
  "How do you protect a route from unauthorized users in the frontend using Auth Guards?": {
    "spoken": "I check auth state before showing a protected route and redirect or show sign-in when needed. I wait for auth initialization to avoid UI flashes. The API still enforces every permission, because a frontend guard cannot secure the data.",
    "bullets": [
      "Wait for auth state",
      "Redirect or block UI",
      "Server enforces access"
    ]
  },
  "What are the core web vitals? Explain each": {
    "spoken": "Core Web Vitals cover loading, responsiveness, and visual stability. LCP tracks the main content, INP tracks interaction delay, and CLS tracks unexpected movement. I monitor real-user results at the 75th percentile and use browser tools to investigate problems.",
    "bullets": [
      "LCP: ≤2.5 seconds",
      "INP: ≤200 milliseconds",
      "CLS: ≤0.1",
      "Field data plus lab diagnostics"
    ]
  },
  "How do you improve the initial loading speed of your web page? Give as many methods as possible.": {
    "spoken": "I make the first page load smaller and do important work first. That means splitting code, compressing assets, optimizing images and fonts, caching through a CDN, and reducing blocking scripts. SSR or SSG can help show content earlier when the app needs it.",
    "bullets": [
      "Split/lazy-load code",
      "Minify, tree-shake, gzip/Brotli",
      "Resize/compress images",
      "CDN and browser cache",
      "Defer scripts; critical CSS",
      "Preload key assets; optimize fonts",
      "Reduce third-party code",
      "SSR/SSG; avoid waterfalls",
      "HTTP/2 or HTTP/3"
    ]
  },
  "How do you handle displaying a very massive amount of data (like 100,000) on the UI without freezing the browser?": {
    "spoken": "I avoid downloading and rendering all 100,000 items at once. The API returns pages, and virtualization renders only the visible rows plus a small buffer. Libraries like TanStack Virtual or react-window help keep the DOM small.",
    "bullets": [
      "Server pagination",
      "Virtualize visible rows",
      "Small DOM and memory use"
    ]
  },
  "What is infinite scrolling, why do you need it and how do you implement it?": {
    "spoken": "Infinite scrolling loads another batch when the user gets near the end. I observe a sentinel with IntersectionObserver, request the next cursor, and prevent duplicate loads. I also handle the end state, errors, and an accessible load-more option.",
    "bullets": [
      "Observe bottom sentinel",
      "Fetch next cursor",
      "Loading/error/end states",
      "Accessible alternative"
    ]
  },
  "What is an AutoComplete component? How can you improve its performance?": {
    "spoken": "Autocomplete shows suggestions while the user types. I debounce requests, cache repeated searches, and cancel or ignore old responses. The input should stay immediate, and the suggestions need keyboard support as well as good performance.",
    "bullets": [
      "Debounce search",
      "Cache and cancel stale work",
      "Virtualize long results",
      "Keyboard navigation"
    ]
  },
  "Explain offset based vs cursor based pagination?": {
    "spoken": "Offset pagination skips rows to reach a page, which makes page numbers easy but can become slow or unstable as data changes. Cursor pagination starts after a known record, so it works better for large changing lists with a suitable index.",
    "bullets": [
      "Offset: skip N rows",
      "Cursor: after known position",
      "Stable order and matching index"
    ]
  },
  "Explain the ways to improve performance for image loading?": {
    "spoken": "I serve the right image size and format, compress it, and cache it near users with a CDN. srcset and sizes help the browser choose. I lazy-load below-the-fold images, but prioritize the main image and reserve layout space.",
    "bullets": [
      "WebP/AVIF; correct dimensions",
      "srcset/sizes or picture",
      "CDN and cache",
      "Lazy-load below the fold",
      "Preload now; prefetch later",
      "Width/height prevent shifts"
    ]
  },
  "What is lazy loading? And what is dynamic import in React?": {
    "spoken": "Lazy loading waits until code or content is needed. Dynamic import loads a module asynchronously, and React.lazy uses that to load a component. Suspense shows a fallback while supported content waits; it does not automatically handle every effect-based request.",
    "bullets": [
      "import() loads on demand",
      "React.lazy for components",
      "Suspense fallback"
    ]
  },
  "What are web worker and service worker?": {
    "spoken": "A Web Worker runs calculations off the main thread, without direct DOM access. A Service Worker handles supported background and network events for an origin, which helps with caching and offline use. They solve different problems.",
    "bullets": [
      "Web Worker: CPU work",
      "Service Worker: network/offline",
      "Messages, not direct DOM"
    ]
  },
  "What tools have you used for Data Visualization?": {
    "spoken": "I would choose tools based on the chart and explain one I actually used. Chart.js is convenient for standard charts, D3 is flexible for custom visuals, and Highcharts offers many built-in features. I also consider accessibility, licensing, and maintenance.",
    "bullets": [
      "Match the chart's needs",
      "Real project example",
      "Accessibility and performance"
    ]
  },
  "Give a brief comparison between Chart.js, Highcharts, D3.js": {
    "spoken": "Chart.js is straightforward for common canvas charts. Highcharts has a rich set of chart features, with licensing to check. D3 gives lower-level control for custom visuals, but usually needs more implementation work.",
    "bullets": [
      "Chart.js: simple standard charts",
      "Highcharts: feature-rich",
      "D3: custom control"
    ]
  },
  "What is the microfrontend concept? What is a Shell App?": {
    "spoken": "Microfrontends split a frontend into independently owned applications or features. A shell app brings them together through shared layout, navigation, and routing. It supports separate teams and releases, but adds integration and consistency work.",
    "bullets": [
      "Independent feature apps",
      "Shell: shared entry/layout",
      "Independence adds complexity"
    ]
  },
  "What is module federation? Briefly explain how to set it up.": {
    "spoken": "Module Federation lets one built app load modules exposed by another at runtime. I configure the host, remotes, exposed modules, and shared dependencies with supported tooling. Then I add loading failures and compatible version rules, especially for React.",
    "bullets": [
      "Host and remotes",
      "Exposed/shared modules",
      "Version and failure handling"
    ]
  },
  "How do you share data between multiple microfrontends?": {
    "spoken": "I share data through explicit contracts, like URLs, typed events, or a small shared interface. Backend data stays behind APIs. A global shared store is possible, but it can tightly couple apps that are supposed to release independently.",
    "bullets": [
      "URL, events, narrow contracts",
      "APIs for durable data",
      "Avoid hidden coupling"
    ]
  },
  "How do you make your web application more accessible? What guidelines do you follow?": {
    "spoken": "I start with semantic HTML, clear labels, keyboard access, visible focus, and good contrast. Then I check images, forms, and dynamic updates. I follow the applicable WCAG guidance, commonly aiming for AA, and combine automated checks with manual testing.",
    "bullets": [
      "Semantic HTML and labels",
      "Keyboard and focus",
      "Contrast and alternatives",
      "WCAG and manual checks"
    ]
  },
  "What are aria attributes? Give some examples.": {
    "spoken": "ARIA describes accessible names, states, and relationships when native HTML is not enough. For example, aria-expanded reports whether a panel is open, and aria-describedby links help text. I prefer native elements and keep ARIA synchronized with actual behavior.",
    "bullets": [
      "Names, states, relationships",
      "expanded/controls/describedby",
      "Native HTML first"
    ]
  },
  "How do you test accessibility? What tool do you use?": {
    "spoken": "I use automated tools like axe to catch common issues, then test keyboard navigation, zoom, focus, and screen-reader behavior manually. Automation helps, but it cannot tell whether every interaction or label makes sense to a person.",
    "bullets": [
      "axe checks",
      "Keyboard and zoom",
      "VoiceOver or NVDA"
    ]
  },
  "How to make sure your app is cross browser compatible?": {
    "spoken": "I define the browsers we support, use standards, and check compatibility before adopting new features. I add fallbacks or polyfills where needed and test real layouts and interactions. Transpiling syntax alone does not add missing browser APIs.",
    "bullets": [
      "Supported browser matrix",
      "Feature detection/fallbacks",
      "Test actual behavior"
    ]
  },
  "How do you test your app’s cross browser compatibility?": {
    "spoken": "I automate important flows in Chromium, Firefox, and WebKit with Playwright, then check target browsers and real devices where needed. I test layout, forms, keyboard or touch input, and network behavior because emulation does not reproduce everything.",
    "bullets": [
      "Cross-engine automation",
      "Real target devices",
      "Layout and interaction checks"
    ]
  },
  "What is a Polyfill?": {
    "spoken": "A polyfill supplies a runtime feature missing from an older browser, such as an array method. A syntax transform is different: it rewrites code. I load only needed polyfills and check whether they can accurately reproduce the feature.",
    "bullets": [
      "Adds missing runtime APIs",
      "Different from transpiling syntax",
      "Target only supported needs"
    ]
  },
  "What is web component?": {
    "spoken": "Web Components are browser standards for reusable custom elements. Custom Elements define behavior, Shadow DOM can isolate structure and styles, and templates support reusable markup. They can work across frameworks through properties and events.",
    "bullets": [
      "Custom Elements",
      "Optional Shadow DOM",
      "Templates, properties, events"
    ]
  },
  "What is Shadow DOM?": {
    "spoken": "Shadow DOM creates a separate subtree attached to a host element, with scoped styles. It helps avoid style collisions, and slots accept outside content. It is not React's virtual DOM and should not be treated as a security boundary.",
    "bullets": [
      "Scoped subtree and styles",
      "Slots for outside content",
      "Encapsulation, not security"
    ]
  },
  "Name a web component framework": {
    "spoken": "Lit is one library for building reactive Web Components with templates. Stencil is another option that compiles components into custom elements. The output can be used across frameworks, though event and property integration still needs checking.",
    "bullets": [
      "Lit",
      "Stencil",
      "Standards-based custom elements"
    ]
  },
  "What is Storybook and its purpose?": {
    "spoken": "Storybook lets us build and review components in isolation. I create stories for important states, like loading, error, and disabled, so developers and designers can inspect behavior without navigating the full app. It also supports documentation and UI checks.",
    "bullets": [
      "Isolated component states",
      "Shared documentation",
      "Interaction/visual checks"
    ]
  },
  "How do you improve the performance of your React app? ": {
    "spoken": "I measure first, then reduce the work causing the slowdown. Common fixes are smaller bundles, better asset loading, localized state, fewer unnecessary effects, and virtualized lists. I memoize expensive work only when it helps and verify the result afterward.",
    "bullets": [
      "Profile first",
      "Optimize loading and rendering",
      "Virtualize large lists",
      "Measure the improvement"
    ]
  },
  "Difference between React and React Native?": {
    "spoken": "React is the UI model, while React DOM renders it for the web and React Native renders native platform views. They share components and hooks, but use different elements, styling, navigation, and platform APIs.",
    "bullets": [
      "Web: DOM elements",
      "Native: platform views",
      "Shared React concepts"
    ]
  },
  "What does it mean that React Native is cross platform?": {
    "spoken": "Cross-platform means we can share much of the React Native application across iOS and Android. It still uses native views, not just a website wrapper. Some features and behaviors need platform-specific code and testing.",
    "bullets": [
      "Shared application code",
      "Native platform UI",
      "Some platform-specific work"
    ]
  },
  "What is StyleSheet.create?": {
    "spoken": "StyleSheet.create defines named React Native style objects. It makes styles easier to organize and type-check. The properties look similar to CSS, but they are JavaScript objects using React Native's supported styling model.",
    "bullets": [
      "Named style objects",
      "Organized and typed",
      "Not browser CSS"
    ]
  },
  "What is a FlatList component?": {
    "spoken": "FlatList is a virtualized React Native list. It renders a window of items rather than mounting everything at once, which helps long feeds. I provide stable keys and tune item rendering when scrolling performance needs improvement.",
    "bullets": [
      "Virtualized list",
      "renderItem and stable keys",
      "Good for large datasets"
    ]
  },
  "What is a ScrollView component?": {
    "spoken": "ScrollView makes its children scrollable, but generally mounts them all. It is suitable for small pages or forms. For a long list, I use FlatList so memory and rendering work stay under control.",
    "bullets": [
      "All children mounted",
      "Small bounded content",
      "Long list → FlatList"
    ]
  },
  "What is AsyncStorage?": {
    "spoken": "AsyncStorage is persistent, asynchronous key/value storage commonly used through a React Native community package. It stores strings, so structured data needs serialization. It is not encrypted secret storage, so I use secure platform storage for sensitive credentials.",
    "bullets": [
      "Async string key/value store",
      "Serialize structured data",
      "Not for secrets"
    ]
  },
  "What is the benefit of using Next.js over React? And vice versa?": {
    "spoken": "Next.js adds application features around React, including routing, server rendering, and static generation. That can save setup for a full-stack site. A plain React setup can be simpler for a client-only app or an existing backend architecture.",
    "bullets": [
      "Next: integrated app features",
      "React: flexible UI setup",
      "Match rendering/deployment needs"
    ]
  },
  "What is the difference between page router and app router?": {
    "spoken": "The Pages Router uses the pages directory and APIs like getServerSideProps. The App Router uses app, nested layouts, and Server Components by default. Their data and caching models differ, so moving between them is more than renaming folders.",
    "bullets": [
      "pages vs. app",
      "Different data-loading models",
      "App: layouts/server components"
    ]
  },
  "What is the difference between client component and server component?": {
    "spoken": "Server Components run on the server or at build time and can access backend data. Client Components support interaction, state, and effects. A Client Component may still get initial server-rendered HTML before hydration, so “client” does not mean “never rendered on the server.”",
    "bullets": [
      "Server: data/backend code",
      "Client: interaction/hooks",
      "Client UI can be prerendered"
    ]
  },
  "What is hydration?": {
    "spoken": "Hydration attaches React's interactive behavior to HTML already generated on the server. React reuses that HTML, so the first server and client output should match. Random values or browser-only logic can cause mismatches.",
    "bullets": [
      "Reuse server HTML",
      "Attach interactivity",
      "Initial output must match"
    ]
  },
  "What is Server Side Rendering (SSR)?": {
    "spoken": "SSR means generating the initial HTML on the server for a request. It can show useful content earlier and help crawlers, but adds server work. Caching and hydration still need careful design.",
    "bullets": [
      "Request-time HTML",
      "Earlier content",
      "Server cost and hydration"
    ]
  },
  "What are Static Site Generation (SSG) and Incremental Static Regeneration (ISR)?": {
    "spoken": "SSG generates pages ahead of time, usually during the build. ISR lets supported frameworks refresh generated pages after deployment. I choose the approach based on how often content changes and avoid sharing private personalized pages through public caches.",
    "bullets": [
      "SSG: build ahead",
      "ISR: refresh generated pages",
      "Choose freshness rules"
    ]
  },
  "What does it mean when we say Angular is a framework, but React is a library?": {
    "spoken": "Angular is an application framework with built-in conventions for things like forms, routing, and dependency injection. React mainly handles UI composition, so we choose more surrounding tools. The difference is how much each provides, not which can build a large app.",
    "bullets": [
      "Angular: integrated framework",
      "React: UI library",
      "Convention vs. flexibility"
    ]
  },
  "What is NgRx?": {
    "spoken": "NgRx provides reactive state-management tools for Angular. In its Redux-style store, actions describe events, reducers update state, selectors read it, and effects handle side effects. I use it when shared state complexity justifies that structure.",
    "bullets": [
      "Actions and reducers",
      "Selectors and effects",
      "Complex shared state"
    ]
  },
  "What is 'signal' briefly and in which version was it released?": {
    "spoken": "A signal holds a value and tracks where it is read. When it changes, dependent computations or UI can update. Angular introduced signals as a developer preview in version 16, with core APIs becoming stable later.",
    "bullets": [
      "Reactive value",
      "Tracked dependencies",
      "Introduced in Angular 16"
    ]
  },
  "What are RxJs and observables briefly? How are they different from promises?": {
    "spoken": "RxJS helps compose streams using Observables. A Promise settles once, while an Observable can emit many values over time and commonly starts on subscription. Unsubscribing can stop work if the source supports cleanup.",
    "bullets": [
      "Promise: one settlement",
      "Observable: stream of values",
      "Operators and subscriptions"
    ]
  },
  "What is dependency injection?": {
    "spoken": "Dependency injection means supplying dependencies from outside instead of constructing them inside the code. For example, a service receives its repository. That makes dependencies clearer and lets tests provide a controlled substitute.",
    "bullets": [
      "Supply, do not hard-code",
      "Lower coupling",
      "Easier substitution in tests"
    ]
  },
  "Difference between Angular and React?": {
    "spoken": "Angular provides more built-in application structure, while React leaves more choices to the team. Angular commonly uses templates, DI, RxJS, and signals; React uses JSX and hooks. I choose based on team skills, conventions, and product needs.",
    "bullets": [
      "Angular: stronger conventions",
      "React: flexible composition",
      "Fit the team and project"
    ]
  },
  "What is NestJS briefly? Explain how it's different from Express?": {
    "spoken": "NestJS adds modules, controllers, and dependency injection around Node application development. Express is a smaller HTTP framework with fewer rules. Nest often runs on Express or Fastify, so it adds structure rather than replacing the underlying runtime.",
    "bullets": [
      "Nest: application structure",
      "Express: lightweight HTTP layer",
      "More conventions, more setup"
    ]
  },
  "What are common Java versions in enterprise projects?": {
    "spoken": "Enterprise projects may still use Java 8 or 11, while newer stacks often target LTS versions such as 17, 21, or 25. I check the actual framework, vendor support, and company policy before choosing a version.",
    "bullets": [
      "LTS versions",
      "Framework compatibility",
      "Vendor and company support"
    ]
  },
  "Talk about three primary ways of doing dependency injection?": {
    "spoken": "Constructor injection provides dependencies when an object is created. Setter injection provides them later, and field injection lets a framework assign them directly. I usually prefer constructors for required dependencies because the contract is visible and easier to test.",
    "bullets": [
      "Constructor: explicit requirements",
      "Setter: later/optional",
      "Field: framework assignment"
    ]
  },
  "What is IoC (inversion of control)?": {
    "spoken": "Inversion of control means a framework or coordinator takes over part of the flow or object lifecycle. Instead of controlling everything ourselves, we supply code that it calls. Dependency injection is one way to apply that idea to dependencies.",
    "bullets": [
      "Framework controls lifecycle/flow",
      "Our code supplies behavior",
      "DI is one technique"
    ]
  },
  "Talk about the 4 principles of OOP": {
    "spoken": "The four OOP ideas are encapsulation, abstraction, inheritance, and polymorphism. They help us protect state, hide details, reuse behavior, and swap implementations behind a shared interface. I still prefer composition when inheritance would make the design rigid.",
    "bullets": [
      "Encapsulation: protect state",
      "Abstraction: hide details",
      "Inheritance: derive behavior",
      "Polymorphism: interchangeable implementations"
    ]
  },
  "What are decorators?": {
    "spoken": "Decorators add metadata or behavior to supported declarations, like a class or method. Frameworks use them for routing and dependency injection. The exact rules depend on whether the project uses legacy TypeScript decorators or the newer standard model.",
    "bullets": [
      "Metadata or wrapped behavior",
      "Routes and injection",
      "Check decorator mode"
    ]
  },
  "What is Node.js?": {
    "spoken": "Node.js runs JavaScript outside the browser. It combines V8 with APIs for files, networking, and processes, making it useful for services and tools. It does not provide a browser DOM by default.",
    "bullets": [
      "JavaScript runtime",
      "V8 plus system APIs",
      "APIs, services, CLI tools"
    ]
  },
  "What does \"Node is single-threaded\" mean? Is it good for CPU-intensive tasks, why?": {
    "spoken": "Node runs JavaScript callbacks on one main event-loop thread per isolate. Other runtime threads handle some work, but heavy synchronous JavaScript still blocks requests. For CPU-heavy work, I use workers, processes, or a separate service.",
    "bullets": [
      "Main JavaScript thread",
      "Runtime has other threads",
      "CPU work → workers/processes"
    ]
  },
  "What is an I/O operation, and why does it make Node fast for this kind of work?": {
    "spoken": "I/O is work like reading files, calling a database, or waiting for a network response. Node can handle many such waits without one JavaScript thread per request. That makes it efficient for I/O-heavy services, though dependencies still limit performance.",
    "bullets": [
      "Disk, network, database",
      "Nonblocking waiting",
      "Good concurrency for I/O"
    ]
  },
  "What is the V8 engine?": {
    "spoken": "V8 is the engine that executes JavaScript and manages memory. It compiles and optimizes code and performs garbage collection. Node builds its system APIs and runtime behavior around V8, so the engine is only one part of Node.",
    "bullets": [
      "JavaScript execution",
      "Compilation and optimization",
      "Garbage collection"
    ]
  },
  "How does the Node.js event loop work? How could it handle thousands of concurrent requests?": {
    "spoken": "Node starts asynchronous I/O, then lets the event loop handle other work while it waits. Ready callbacks run through phases such as timers, poll, and check. This supports many concurrent requests, as long as we avoid blocking code and resource exhaustion.",
    "bullets": [
      "Start I/O and continue",
      "Event-loop phases",
      "Thousands of waiting operations",
      "Avoid blocking and saturation"
    ]
  },
  "How is Node.js event loop different from the browser's event loop?": {
    "spoken": "Both use a stack and async queues, but browsers also coordinate rendering and DOM events. Node uses libuv phases and adds APIs like setImmediate and nextTick. I avoid depending on incidental callback ordering because context and runtime versions can matter.",
    "bullets": [
      "Browser: rendering and DOM",
      "Node: libuv phases",
      "Node-specific scheduling APIs"
    ]
  },
  "What is libuv?": {
    "spoken": "libuv is the cross-platform library behind much of Node's event loop and async I/O. It coordinates OS events and a worker pool for selected tasks, including some filesystem and crypto work. Not every async operation uses that pool.",
    "bullets": [
      "Event loop and OS integration",
      "Selected worker-pool tasks",
      "Cross-platform runtime support"
    ]
  },
  "What is setImmediate?": {
    "spoken": "setImmediate queues work for Node's check phase after poll. It lets me defer work to another event-loop phase. Its order relative to a zero-delay timer depends on where it was scheduled, so I do not assume one fixed order.",
    "bullets": [
      "Check phase",
      "Deferred callback",
      "Timer order depends on context"
    ]
  },
  "What is process.nextTick()?": {
    "spoken": "process.nextTick schedules a callback after the current operation before the event loop continues. It uses a separate Node queue, so repeatedly scheduling it can starve I/O. Ordering against promise callbacks can also depend on CommonJS versus module context.",
    "bullets": [
      "Node-specific queue",
      "Runs before loop continues",
      "Can starve I/O"
    ]
  },
  "What are macrotasks and microtasks? Give examples of each.": {
    "spoken": "Timers and I/O callbacks are task-like work handled through Node's phases. Promise handlers and queueMicrotask use microtasks. Microtasks run at checkpoints before later tasks, and Node's nextTick adds another separate scheduling queue.",
    "bullets": [
      "Tasks: timers/I/O",
      "Microtasks: promises",
      "nextTick is separate"
    ]
  },
  "What is the scripts field in package.json? How do you run one?": {
    "spoken": "The scripts field gives names to project commands. For example, a dev script runs with npm run dev, and locally installed tools are available inside it. Some scripts, like start and test, also have short npm commands.",
    "bullets": [
      "Named project commands",
      "npm run <name>",
      "Local binaries available"
    ]
  },
  "Difference between npm and yarn? Just briefly": {
    "spoken": "npm and Yarn both install dependencies and run scripts. Their commands, lockfiles, workspace features, and installation strategies differ. I use the package manager and lockfile chosen by the repository so installs remain consistent.",
    "bullets": [
      "Same core purpose",
      "Different lockfiles/features",
      "Follow repository choice"
    ]
  },
  "What is a .env file? What do we put in it?": {
    "spoken": "A .env file stores environment-specific configuration, like a port or local database URL. I load and validate it through the project's tooling. I do not commit real secrets or put private keys in frontend variables, which may become public.",
    "bullets": [
      "Key/value configuration",
      "Parse and validate",
      "Keep secrets out of Git/client"
    ]
  },
  "How do you start a Node.js project after cloning it?": {
    "spoken": "I read the README, select the required Node version, and install locked dependencies. Then I set up local configuration and services, run needed migrations, and start the documented dev script. I use safe local credentials rather than production secrets.",
    "bullets": [
      "Correct runtime/package manager",
      "Install locked dependencies",
      "Configure services and migrations",
      "Run checks and dev script"
    ]
  },
  "Explain core Node.js modules and variables like os, fs, path, and env.": {
    "spoken": "os provides system information, fs handles files, and path handles file paths. Environment variables are read through process.env and usually need parsing. On request paths, I prefer nonblocking operations and validate configuration early.",
    "bullets": [
      "os, fs, path",
      "process.env strings",
      "Async I/O and validation"
    ]
  },
  "Explain the layered architecture in Express.js.": {
    "spoken": "I split the app into routes/controllers, services, and repositories. Controllers handle HTTP, services handle business rules, and repositories handle persistence. Middleware surrounds the request flow for shared concerns like authentication and logging.",
    "bullets": [
      "HTTP → service → repository",
      "Clear responsibilities",
      "Middleware for cross-cutting work"
    ]
  },
  "What is the purpose of the Controller, Service, and Repository layers?": {
    "spoken": "Controllers translate HTTP input and output. Services apply business rules and coordinate work. Repositories hide database details. Keeping those jobs separate makes the code easier to test and stops framework or SQL details from spreading everywhere.",
    "bullets": [
      "Controller: HTTP",
      "Service: business rules",
      "Repository: data access"
    ]
  },
  "What is an Express middleware? Give examples of use cases.": {
    "spoken": "Express middleware runs as part of request processing. It can parse JSON, log requests, authenticate users, or enforce limits. Each middleware must respond, call next, or pass an error, and its order in the stack matters.",
    "bullets": [
      "req, res, next",
      "Shared request behavior",
      "Order and completion matter"
    ]
  },
  "How do you handle errors in Express?": {
    "spoken": "I use centralized error middleware after routes, return a consistent safe response, and log internal details with a request ID. Async failures must reach that handler; Express 5 forwards rejected handler promises automatically. I avoid leaking stack traces or sending twice.",
    "bullets": [
      "Central error handler",
      "Forward async failures",
      "Safe response, useful logs"
    ]
  },
  "What are CORS issues and how do you handle them?": {
    "spoken": "CORS errors mean the browser was not allowed to read a cross-origin response. I configure trusted origins, headers, methods, and preflights on the server. For cookies, both sides need matching credentials settings; the client cannot bypass missing permission with no-cors.",
    "bullets": [
      "Server allowlist",
      "Handle preflight",
      "Correct credential settings"
    ]
  },
  "What's the difference between req.params, req.query, and req.body?": {
    "spoken": "req.params holds named route segments, req.query holds URL options, and req.body holds parsed submitted data. For example, the user ID can be a path parameter and page can be a query parameter. I validate all three.",
    "bullets": [
      "params: route values",
      "query: URL options",
      "body: submitted content"
    ]
  },
  "How do you implement authentication and authorization middlewares?": {
    "spoken": "Authentication middleware verifies the caller and attaches a trusted identity. Authorization middleware then checks permission for the specific action and resource. I use 401 for missing or invalid authentication and 403 for insufficient permission, without trusting client-supplied roles.",
    "bullets": [
      "Verify identity",
      "Check permission/ownership",
      "401 vs. 403"
    ]
  },
  "How do you handle returning massive amounts of data in an API?": {
    "spoken": "I return bounded pages instead of one huge response, select only needed fields, and filter in the database. For large exports, I use streaming or a background job. Limits and timeouts protect memory and database capacity.",
    "bullets": [
      "Pagination and field selection",
      "Indexed filters",
      "Stream or async export"
    ]
  },
  "What is Swagger?": {
    "spoken": "Swagger is a set of tools around API descriptions, commonly using OpenAPI. The specification defines routes, schemas, parameters, and authentication, while Swagger UI makes it interactive. I keep it aligned with the real API rather than treating docs as automatically correct.",
    "bullets": [
      "OpenAPI contract",
      "Interactive Swagger UI",
      "Keep docs synchronized"
    ]
  },
  "What tools do you use to test your APIs and express apps? (not just Postman)": {
    "spoken": "I use curl or an API client for quick checks, Jest or Vitest for logic, and Supertest for HTTP tests. Real isolated databases cover integration behavior. Browser E2E tests and load tests answer different questions beyond whether one endpoint returns data.",
    "bullets": [
      "curl/API clients",
      "Jest/Vitest + Supertest",
      "Integration, E2E, load checks"
    ]
  },
  "What is the difference between SQL (relational) and NoSQL databases (non-relational) on a high level? How to choose?": {
    "spoken": "SQL databases organize related data in tables with constraints and joins. NoSQL includes document, key/value, graph, and other models. I choose based on relationships, query patterns, consistency, and operations—not on the assumption that one category is always faster.",
    "bullets": [
      "SQL: tables and relations",
      "NoSQL: several data models",
      "Choose by access patterns"
    ]
  },
  "Give some examples of SQL and NoSQL databases? (3 of each)": {
    "spoken": "PostgreSQL, MySQL, and SQL Server are relational examples. MongoDB, Redis, and Cassandra are NoSQL examples with different models. I compare the individual systems because “NoSQL” covers very different ways of storing and querying data.",
    "bullets": [
      "SQL: Postgres/MySQL/SQL Server",
      "NoSQL: MongoDB/Redis/Cassandra"
    ]
  },
  "What is database normalization and denormalization? How do we do them?": {
    "spoken": "Normalization separates facts into related tables to reduce duplication and update mistakes. Denormalization deliberately combines or copies data to speed reads. I normalize for correctness first and denormalize when measured query needs justify keeping copies synchronized.",
    "bullets": [
      "Normalize: reduce duplication",
      "Denormalize: faster reads",
      "Keep copies consistent"
    ]
  },
  "What is a Primary key? What is a foreign key?": {
    "spoken": "A primary key uniquely identifies a row and cannot be null. A foreign key links a row to a valid key in another table, or sometimes the same table. That helps the database enforce relationships instead of leaving all checks to application code.",
    "bullets": [
      "Primary: row identity",
      "Foreign: relationship",
      "Referential integrity"
    ]
  },
  "What's the difference between a PRIMARY KEY and a UNIQUE constraint?": {
    "spoken": "A primary key is the table's main non-null row identifier. A UNIQUE constraint protects another candidate value or combination, and a table can have several. Null behavior for UNIQUE depends on the database and configuration.",
    "bullets": [
      "One primary key constraint",
      "Several UNIQUE constraints",
      "Check null rules"
    ]
  },
  "Explain the following relations in relational databases and give an example of each:": {
    "spoken": "A user and profile can be one-to-one. A customer and orders are one-to-many; from an order back to its customer, that is many-to-one. Students and courses are many-to-many, so they need a linking table.",
    "bullets": [
      "1:1 user/profile",
      "1:N customer/orders",
      "N:1 reverse view",
      "N:N students/courses"
    ]
  },
  "How do you implement a many-to-many relationship in a relational database?": {
    "spoken": "I create a junction table containing foreign keys to both sides, like student_id and course_id. A composite key or unique constraint prevents duplicate pairs. The table can also store relationship details, such as when the student enrolled.",
    "bullets": [
      "Junction table",
      "Two foreign keys",
      "Unique pair"
    ]
  },
  "What is a View?": {
    "spoken": "A view is a saved query we can use like a virtual table. It simplifies repeated queries or exposes a controlled representation of data. A normal view does not store separate results; a materialized view does and needs refresh rules.",
    "bullets": [
      "Named query",
      "Virtual table",
      "Materialized view stores results"
    ]
  },
  "What's the difference between INSERT, UPDATE, and DELETE, and when would you use each?": {
    "spoken": "INSERT adds rows, UPDATE changes existing rows, and DELETE removes rows. I use conditions carefully for updates and deletes because a missing WHERE can affect the whole table. Related changes may need a transaction.",
    "bullets": [
      "INSERT: add",
      "UPDATE: change",
      "DELETE: remove",
      "Check WHERE and transactions"
    ]
  },
  "How do you perform JOINs in SQL?": {
    "spoken": "I join tables using related keys and an ON condition. For example, orders joins users on orders.user_id = users.id. I choose the join type based on whether unmatched rows should remain and check for accidental row multiplication.",
    "bullets": [
      "Related keys and ON",
      "Choose matching/unmatched behavior",
      "Watch duplicate row growth"
    ]
  },
  "Difference between Left Join, Right Join, Inner Join, and Outer Join.": {
    "spoken": "INNER JOIN returns matches only. LEFT JOIN keeps all left rows, and RIGHT JOIN keeps all right rows. FULL OUTER JOIN keeps unmatched rows from both sides, filling missing columns with null where supported.",
    "bullets": [
      "Inner: matches",
      "Left: all left",
      "Right: all right",
      "Full: both sides"
    ]
  },
  "What are ACID principles in a database?": {
    "spoken": "ACID describes reliable transaction behavior. Atomicity is all-or-nothing, consistency preserves rules, isolation controls concurrent interactions, and durability protects committed data. The exact isolation and failure guarantees still depend on the database configuration.",
    "bullets": [
      "Atomic: all or nothing",
      "Consistent: rules preserved",
      "Isolated: concurrency rules",
      "Durable: committed data survives"
    ]
  },
  "What is a database transaction?": {
    "spoken": "A transaction groups related operations so they commit together or roll back. A money transfer is a classic example. I keep transactions short, choose a suitable isolation level, and handle retryable conflicts safely.",
    "bullets": [
      "Group related operations",
      "Commit or rollback",
      "Short and safely retryable"
    ]
  },
  "What is a stored procedure, and what's one real reason to use one?": {
    "spoken": "A stored procedure is database-side logic saved under a name. It can perform a repeated multi-step operation close to the data, reducing round trips or controlling access. The tradeoff is database-specific code that needs its own versioning and testing.",
    "bullets": [
      "Named database logic",
      "Fewer round trips",
      "Version and test it"
    ]
  },
  "What is JSONB in PostgreSQL? When would we need it?": {
    "spoken": "JSONB stores parsed JSON in PostgreSQL and supports JSON queries and indexes. I use it for flexible attributes alongside relational fields. I avoid hiding all important structure in JSON, because typed columns and constraints are still valuable.",
    "bullets": [
      "Flexible JSON fields",
      "Query and index support",
      "Keep core structure explicit"
    ]
  },
  "What is an ORM (Object-Relational Mapping)? Give some examples.": {
    "spoken": "An ORM maps application models to relational database operations. Prisma, Sequelize, TypeORM, and Hibernate are examples. It saves repetitive work, but I still inspect queries and understand SQL because an ORM can generate slow queries or N+1 problems.",
    "bullets": [
      "Objects ↔ relational data",
      "Less repetitive SQL",
      "Understand generated queries"
    ]
  },
  "What is an ODM (Object-Document Mapping)? Give an example.": {
    "spoken": "An ODM maps application models to document data. Mongoose is a common MongoDB example with schemas, validation, and model methods. It adds application structure without making the database relational or removing the need for careful data modeling.",
    "bullets": [
      "Documents and models",
      "Mongoose",
      "Schemas and validation"
    ]
  },
  "What is database migration, and how do we perform them?": {
    "spoken": "A migration is a versioned database change. I write and review it, test it on realistic data, and apply it with the project's tool. For production, I consider locking, backups, and backward-compatible changes so old and new app versions can coexist.",
    "bullets": [
      "Versioned schema/data changes",
      "Test realistic data",
      "Expand/contract and recovery"
    ]
  },
  "How do you handle data validation?": {
    "spoken": "I validate input at the API boundary, business rules in the service, and integrity in database constraints. Client validation helps users, but the server cannot trust it. I also limit sizes, parse types, and control unexpected fields.",
    "bullets": [
      "Client: usability",
      "API: input schema",
      "Service: business rules",
      "Database: integrity"
    ]
  },
  "What is SQL injection and how do you prevent it?": {
    "spoken": "SQL injection happens when input becomes part of SQL syntax. I use parameterized queries rather than string concatenation and allowlist dynamic identifiers like sort columns. Least-privilege accounts and careful raw-query review add protection.",
    "bullets": [
      "Parameterized values",
      "Allowlist identifiers",
      "Least privilege"
    ]
  },
  "What is a database connection pool?": {
    "spoken": "A connection pool reuses a limited number of database connections instead of opening one for every request. That saves setup time and protects the database. I size it across all app instances and always release borrowed connections, including on errors.",
    "bullets": [
      "Reuse bounded connections",
      "Control total capacity",
      "Release on every path"
    ]
  },
  "What is indexing, and What's the tradeoff of adding an index?": {
    "spoken": "An index is an extra structure that helps the database find or order rows faster. The cost is storage and extra write work. I add indexes for real query patterns, paying attention to composite column order and unused indexes.",
    "bullets": [
      "Faster reads",
      "More storage/write cost",
      "Match actual queries"
    ]
  },
  "How do you identify slow queries and optimize them?": {
    "spoken": "I find slow queries through logs and traces, then inspect their execution plans. I check indexes, row counts, joins, sorts, and locks. After changing the query or index, I test realistic data and load to confirm the improvement.",
    "bullets": [
      "Logs and EXPLAIN",
      "Inspect scans/joins/locks",
      "Measure before and after"
    ]
  },
  "In an EXPLAIN plan, what's the difference between a Seq Scan and an Index Scan?": {
    "spoken": "A sequential scan reads table rows directly, while an index scan uses an index to find relevant locations. An index scan is not always better; reading much of a small table can be faster sequentially. I compare actual work and timing.",
    "bullets": [
      "Seq: scan table",
      "Index: locate matching rows",
      "Choose by real cost"
    ]
  },
  "What is the N + 1 query problem? And how do you identify and solve it?": {
    "spoken": "N+1 means loading a list once, then making another query for every item. I spot it in repeated SQL or traces and replace it with joins, eager loading, or batching. I still avoid fetching an unnecessarily huge joined result.",
    "bullets": [
      "One query plus one per item",
      "Detect repeated SQL",
      "Join, eager-load, or batch"
    ]
  },
  "How do you do vertical scaling and horizontal scaling for relational databases?": {
    "spoken": "Vertical scaling gives one database more CPU, memory, or faster disks. Horizontal scaling adds nodes, often replicas for reads or shards for distributed writes. I optimize queries first because adding machines also adds consistency and operational complexity.",
    "bullets": [
      "Vertical: bigger machine",
      "Horizontal: more machines",
      "Replicas vs. shards"
    ]
  },
  "What is a primary node and a replica node?": {
    "spoken": "The primary usually accepts writes, while replicas copy its changes. Replicas can support reads and failover, but asynchronous copies may lag. I route reads carefully when a user must immediately see their latest write.",
    "bullets": [
      "Primary: writes",
      "Replicas: copies/reads/failover",
      "Watch replication lag"
    ]
  },
  "What problem does sharding and replication each solve?": {
    "spoken": "Replication copies data to improve availability and read capacity. Sharding divides data across nodes to spread storage and write load. They can work together, with replicas for each shard, but the shard key and consistency rules matter.",
    "bullets": [
      "Replication: copies",
      "Sharding: divides",
      "Can combine both"
    ]
  },
  "How do you do scaling for Document-based NoSQL databases?": {
    "spoken": "For document databases, I first optimize indexes and query shapes. Replicas help availability and suitable reads; sharding spreads storage and writes. I choose a shard key that avoids hot spots and consider cross-shard query and transaction costs.",
    "bullets": [
      "Optimize before scaling",
      "Replicas and shards",
      "Good shard key",
      "Avoid hot partitions"
    ]
  },
  "What is microservice architecture? Why do we need it? Advantages of it.": {
    "spoken": "Microservices split a product into services around business capabilities, each with a clear contract and independent deployment. They help teams release and scale separately. I use them when those benefits justify the network, data, and operational complexity.",
    "bullets": [
      "Business boundaries",
      "Independent releases/scaling",
      "Clear ownership"
    ]
  },
  "What do you give up with microservices, and when should you stay a monolith?": {
    "spoken": "Microservices trade local simplicity for network calls, partial failures, and cross-service consistency work. If the team or boundaries do not need independent services, I would stay with a well-structured monolith. A modular monolith is often a strong starting point.",
    "bullets": [
      "More failure modes",
      "More operating overhead",
      "Monolith when simpler"
    ]
  },
  "Why does each service own its own database, and what replaces JOINs and transactions?": {
    "spoken": "A service owns its data so other services cannot depend on private tables or bypass its rules. Cross-service reads use APIs or projections. Multi-service changes often use local transactions and sagas, with outbox patterns helping reliable event publication.",
    "bullets": [
      "Private data ownership",
      "APIs/read models",
      "Sagas and outbox",
      "Eventual consistency"
    ]
  },
  "What is the difference between horizontal and vertical scaling?": {
    "spoken": "Vertical scaling makes one machine more powerful. Horizontal scaling adds more instances and spreads work across them. Horizontal scaling also needs decisions about shared state, load distribution, and consistency, so it is not just adding servers.",
    "bullets": [
      "Vertical: bigger",
      "Horizontal: more",
      "Plan state and routing"
    ]
  },
  "How do microservices communicate between each other using sync vs async? What are the tradeoffs?": {
    "spoken": "Synchronous calls wait for a response, which is simple but couples latency and availability. Asynchronous messages let services work independently in time and buffer bursts. The tradeoff is eventual consistency, duplicate handling, and more complex troubleshooting.",
    "bullets": [
      "Sync: immediate response",
      "Async: buffered/decoupled",
      "Different failure tradeoffs"
    ]
  },
  "When should you use 'REST Api requests' or 'message queue' between services?": {
    "spoken": "I use REST when the caller needs an answer now, such as reading a product. I use a queue for background work, bursts, and retries when completion can happen later. Sometimes the API returns a job ID while a worker handles the task.",
    "bullets": [
      "REST: answer now",
      "Queue: process later",
      "Job ID for async workflow"
    ]
  },
  "What is modular monolith?": {
    "spoken": "A modular monolith is one deployable application with clearly separated business modules. Modules communicate through defined interfaces instead of reaching into each other's internals. It keeps operations and transactions simpler while preserving boundaries that may support later extraction.",
    "bullets": [
      "One deployment",
      "Strong internal boundaries",
      "Simpler operations"
    ]
  },
  "How to migrate a monolithic application to a microservice app?": {
    "spoken": "I identify a clear business boundary and extract it gradually, using a strangler approach rather than a big rewrite. I move data ownership deliberately and add contracts, tracing, and rollback plans. I only extract services where there is a concrete benefit.",
    "bullets": [
      "Find useful boundaries",
      "Strangle gradually",
      "Move data carefully",
      "Test and observe"
    ]
  },
  "What is an API Gateway? How does it work in a microservice architecture?": {
    "spoken": "An API Gateway is a front door that routes requests to services. It can apply shared policies like rate limits, authentication checks, and logging. I keep business logic in services, which still enforce resource-level permissions.",
    "bullets": [
      "Shared entry point",
      "Routing and policies",
      "Service authorization still needed"
    ]
  },
  "What is service discovery?": {
    "spoken": "Service discovery tells callers where current service instances are running. A registry, platform DNS, or proxy tracks changing endpoints and health. That lets services find each other even when instances restart or scale.",
    "bullets": [
      "Find current endpoints",
      "DNS/registry/proxy",
      "Track health and lifecycle"
    ]
  },
  "What is a Circuit Breaker? What is Opossum?": {
    "spoken": "A circuit breaker stops repeated calls to a failing dependency so the app can fail fast and recover. It moves through closed, open, and half-open states. Opossum is a Node library for this pattern; I still use timeouts and sensible fallbacks.",
    "bullets": [
      "Closed → open → half-open",
      "Stop cascading failures",
      "Opossum for Node"
    ]
  },
  "What are a message queue and event-driven architecture, and how do they relate?": {
    "spoken": "A queue holds work for consumers to process later. Event-driven systems react to facts that happened, and pub/sub sends one event to independent subscribers. I plan delivery, retries, and duplicate handling rather than assuming messaging is automatically reliable.",
    "bullets": [
      "Queue: buffered work",
      "Events: facts",
      "Pub/sub: fan-out"
    ]
  },
  "What is Kafka and why would you use it?": {
    "spoken": "Kafka is a distributed event log that stores records in partitioned topics. It is useful for durable streams, replay, and several independent consumers. I choose it when those capabilities matter enough to justify its operational and schema-management work.",
    "bullets": [
      "Durable partitioned log",
      "Replay and consumer groups",
      "Streaming and integration"
    ]
  },
  "Explain Kafka’s core concepts.": {
    "spoken": "A Kafka message is a record. Topics group records, and partitions provide ordered logs. A consumer group shares partitions among its members, while offsets track positions within each partition. These pieces explain how Kafka scales and resumes processing.",
    "bullets": [
      "Record → topic/partition",
      "Group shares partitions",
      "Offset: partition position"
    ]
  },
  "What delivery guarantees does Kafka give?": {
    "spoken": "Kafka preserves order within a partition, not across the whole topic. At-least-once processing is common, so duplicates can happen. Replication, acknowledgments, producer idempotence, and careful offset commits protect delivery; external side effects still need their own retry safety.",
    "bullets": [
      "Partition ordering only",
      "At-least-once is common",
      "Configure durability",
      "External effects need idempotency"
    ]
  },
  "How do you handle duplicate messages?": {
    "spoken": "I give the operation a stable ID and record successful processing durably, often with a unique constraint. The effect and deduplication should be atomic where possible. An idempotent consumer gives the same intended result when a message is delivered again.",
    "bullets": [
      "Stable event/operation ID",
      "Durable deduplication",
      "Safe repeated effect"
    ]
  },
  "How is Kafka different from RabbitMQ?": {
    "spoken": "Kafka focuses on retained streams and replay, while RabbitMQ focuses on routing messages to queues. A RabbitMQ exchange uses bindings and rules to choose queues. I compare replay, routing, workload, and operations rather than treating them as identical tools.",
    "bullets": [
      "Kafka: retained log",
      "RabbitMQ: routed queues",
      "Exchange routes via bindings"
    ]
  },
  "What is a dead-letter queue for?": {
    "spoken": "A dead-letter queue holds messages that still fail after the configured attempts. It keeps poison messages from blocking normal work. I alert on it, retain the failure reason, and replay messages in a controlled way after fixing the cause.",
    "bullets": [
      "Isolate failed messages",
      "Alert and investigate",
      "Controlled replay"
    ]
  },
  "What is the saga pattern, and why does event-driven architecture need one?": {
    "spoken": "A saga breaks a multi-service workflow into local transactions with compensating actions. If payment fails after inventory is reserved, we release that reservation. It can use orchestration or events, but compensation still needs retries and sometimes manual recovery.",
    "bullets": [
      "Local steps",
      "Compensating actions",
      "Orchestrated or event-driven"
    ]
  },
  "What is Redis and its primary use cases?": {
    "spoken": "Redis is a fast in-memory data store with useful structures like hashes, sets, and sorted sets. I use it for caching, sessions, counters, or rate limits. Persistence and replication depend on configuration, so I do not assume every Redis setup is equally durable.",
    "bullets": [
      "In-memory structures",
      "Cache/session/counters",
      "Check durability settings"
    ]
  },
  "Explain caching with Redis.": {
    "spoken": "With cache-aside, I check Redis first. On a miss, I read the source and cache the result with a TTL. I also plan invalidation and stampede protection; eviction policies like LRU remove eligible keys under memory pressure.",
    "bullets": [
      "Hit vs. miss",
      "Cache → source → cache",
      "TTL and invalidation",
      "Eviction ≠ expiration"
    ]
  },
  "How do you scale the read and write operations of Redis?": {
    "spoken": "Replication copies Redis data for availability and eligible read scaling. Sharding splits keys to spread memory and writes. Redis Cluster manages hash slots and failover, but multi-key operations, replica lag, and hot keys still need careful design.",
    "bullets": [
      "Replicas: copies/read capacity",
      "Shards: divide keys",
      "Cluster: slots and failover"
    ]
  },
  "What is Docker, why do we need it?": {
    "spoken": "Docker packages an app and its dependencies into an image, then runs it in an isolated container. That makes environments more repeatable. Containers share a host kernel, so I still configure security, resource limits, networking, and persistent data.",
    "bullets": [
      "Repeatable app package",
      "Image → container",
      "Shared kernel, explicit limits"
    ]
  },
  "What are a Dockerfile, a docker image and container?": {
    "spoken": "A Dockerfile is the build recipe, an image is the packaged template, and a container is an instance of that image. Container writes are temporary unless I use a volume or external storage for data that must survive replacement.",
    "bullets": [
      "Dockerfile: recipe",
      "Image: template",
      "Container: instance"
    ]
  },
  "What is docker-compose and what problem does it solve?": {
    "spoken": "Docker Compose describes several containers, networks, and volumes in one YAML setup. It is useful for running an app with its database and cache locally. I still need health checks and retries because “started” does not mean “ready.”",
    "bullets": [
      "Multi-container configuration",
      "Local app/database/cache",
      "Readiness is separate"
    ]
  },
  "What is Kubernetes and its purpose?": {
    "spoken": "Kubernetes runs and manages containers across machines. A Pod is a scheduling unit, a Deployment manages replicas and updates, and a Service gives stable routing. Docker can build the images, but Kubernetes uses compatible runtimes and does not require Docker Engine.",
    "bullets": [
      "Pod: running unit",
      "Deployment: replicas/updates",
      "Service: discovery/routing",
      "OCI images and runtimes"
    ]
  },
  "State the CAP theorem. What does it mean for a design?": {
    "spoken": "CAP says that during a network partition, we cannot guarantee both linearizable consistency and availability for every request. We may reject or wait to preserve one current view, or keep responding with possible stale data. It is a partition-time tradeoff, not simply “pick any two.”",
    "bullets": [
      "Partition occurs",
      "Consistency vs. availability",
      "Choice depends on operation"
    ]
  },
  "How do you make a system fault tolerant?": {
    "spoken": "I combine redundancy with bounded failure handling. Timeouts limit waiting, retries handle transient failures, circuit breakers stop repeated bad calls, and fallbacks provide reduced service. Retries must be safe, and I test failover and recovery instead of only happy paths.",
    "bullets": [
      "Timeout: stop waiting",
      "Retry: backoff and jitter",
      "Breaker: fail fast",
      "Fallback: reduced behavior"
    ]
  },
  "What is a CDN, and how does it improve the performance of a system?": {
    "spoken": "A CDN serves cached content from locations near users. That reduces network distance and origin load, especially for assets and cacheable responses. I define cache keys, freshness, and private-data rules so faster delivery does not mean serving the wrong content.",
    "bullets": [
      "Nearby edge cache",
      "Lower latency/origin load",
      "Correct caching policy"
    ]
  },
  "What is a load balancer, and how does it choose an instance?": {
    "spoken": "A load balancer sends traffic to healthy instances using rules like round-robin or least connections. Health checks remove bad targets. An API Gateway adds API policies like authentication and rate limits; some products can provide both roles.",
    "bullets": [
      "Distribute traffic",
      "Health checks",
      "Gateway adds API policies"
    ]
  },
  "How do you identify backend performance issues (e.g., long response times, slow query logs, identifying slow functions)?": {
    "spoken": "I start with latency percentiles, error rates, and resource saturation. Traces locate slow stages, query plans explain database work, and profiles reveal expensive functions. Then I reproduce the issue under realistic load before choosing a fix.",
    "bullets": [
      "Metrics → traces → profiles",
      "Slow queries and locks",
      "Pools, CPU, memory, loop lag"
    ]
  },
  "How do you solve performance bottlenecks or a slow api? (e.g., caching, Redis, query optimization)": {
    "spoken": "I identify the bottleneck before changing anything. Then I reduce queries, add useful indexes, paginate, cache suitable data, or parallelize independent calls. Heavy work may move to a job worker. Afterward, I verify latency, correctness, and resource use under load.",
    "bullets": [
      "Find slow stage",
      "Reduce/cache/batch work",
      "Offload heavy jobs",
      "Verify under load"
    ]
  },
  "What are the core pillars of performance monitoring tools (Telemetry, Trace, Log, Metrics)?": {
    "spoken": "Telemetry is the umbrella term. Logs record events, metrics summarize numbers, and traces connect work across a request. OpenTelemetry collects and exports signals; Loki, Grafana, Tempo, and Mimir provide log, visualization, trace, and metric capabilities.",
    "bullets": [
      "Logs: events",
      "Metrics: numbers",
      "Traces: request journey",
      "OTel collects; LGTM stores/views"
    ]
  },
  "Why run the app on EC2 and the database on RDS, instead of installing Postgres on the same instance?": {
    "spoken": "Separating the app and database lets them scale, fail, and be maintained independently. RDS manages many database operations like backups and configured failover. Sharing one EC2 instance is simpler initially, but one resource problem can affect both the app and its data.",
    "bullets": [
      "Separate failure/resource domains",
      "Managed database operations",
      "Independent scaling"
    ]
  },
  "What kind of workload is Lambda well-suited for, and what's a bad fit for it?": {
    "spoken": "Lambda fits event-driven work that is bounded in duration, like processing an upload. A separate shipping-label worker keeps slow work off the request path and isolates failures. For long-running or consistently heavy work, containers or VMs may fit better.",
    "bullets": [
      "Event-driven bounded work",
      "Separate background processing",
      "Queues and safe retries"
    ]
  },
  "What's a \"cold start\" in Lambda, and how to handle this issue?": {
    "spoken": "A cold start happens when Lambda prepares a new execution environment before running the function. I reduce startup work and dependencies, reuse clients safely, and consider provisioned concurrency when predictable startup latency justifies the cost.",
    "bullets": [
      "New environment startup",
      "Keep initialization lean",
      "Provisioned concurrency if needed"
    ]
  },
  "What do ECS and Fargate each do, and how do they work together?": {
    "spoken": "ECS manages container tasks and services. Fargate supplies managed compute for those containers so I do not manage the underlying hosts. ECS can also run on EC2, so orchestration and compute are separate choices.",
    "bullets": [
      "ECS: orchestrate",
      "Fargate: managed compute",
      "EC2 is another option"
    ]
  },
  "What is EKS? How does it relate to Kubernetes and to ECS?": {
    "spoken": "EKS is AWS's managed Kubernetes service. ECS is a different AWS container orchestrator. I choose EKS when Kubernetes compatibility and its ecosystem matter, and compare that with ECS's AWS-specific model and the team's operating skills.",
    "bullets": [
      "EKS: managed Kubernetes",
      "ECS: AWS orchestrator",
      "Choose by ecosystem/operations"
    ]
  },
  "How do EC2, Fargate, and Lambda compare?": {
    "spoken": "EC2 gives me virtual machines and the most host control. Fargate runs containers without host management. Lambda runs event-triggered functions. I compare duration, traffic shape, startup latency, control, cost, and operations instead of assuming one is always cheapest.",
    "bullets": [
      "EC2: VMs",
      "Fargate: containers",
      "Lambda: functions"
    ]
  },
  "How does auto-scaling work for EC2 and ECS?": {
    "spoken": "An EC2 Auto Scaling group maintains instance capacity and replaces unhealthy instances. Policies can use CPU, request load, or schedules. ECS service scaling changes task counts; with EC2-backed ECS, I also need enough host capacity, while Fargate handles that layer.",
    "bullets": [
      "EC2: instance count",
      "ECS: task count",
      "Metrics, schedules, limits"
    ]
  },
  "What is S3, and what is it used for? How is it different from a database or a file system?": {
    "spoken": "S3 stores objects under bucket keys. I use it for uploads, assets, backups, or logs. It is not a relational database or a normal shared filesystem, so access patterns, permissions, versioning, and delivery are designed around object storage.",
    "bullets": [
      "Buckets and objects",
      "Files/assets/backups",
      "Not database or filesystem"
    ]
  },
  "What are S3 storage classes and lifecycle rules, and why use them?": {
    "spoken": "S3 storage classes trade access speed and usage patterns against cost. Lifecycle rules move or expire objects automatically. I check retrieval charges, minimum durations, and restore delays before moving data into a cheaper archival class.",
    "bullets": [
      "Match class to access pattern",
      "Automatic transitions/expiration",
      "Consider retrieval costs"
    ]
  },
  "What are the AWS equivalents of Postgres/MySQL, MongoDB, Redis, and Kafka?": {
    "spoken": "RDS or Aurora cover PostgreSQL/MySQL-compatible needs. DocumentDB offers MongoDB-compatible APIs but is not identical to MongoDB; Atlas is another choice. ElastiCache handles Redis-compatible caching, and MSK manages Kafka. I verify features before treating anything as a drop-in replacement.",
    "bullets": [
      "SQL: RDS/Aurora",
      "Documents: DocumentDB/Atlas",
      "Redis-compatible: ElastiCache",
      "Kafka: MSK",
      "Durable memory needs: MemoryDB"
    ]
  },
  "What is SQS and SNS? How do they work together?": {
    "spoken": "SNS publishes to subscribers, while SQS buffers messages for consumers. For fan-out, I put SNS first and give each consumer its own SQS queue. That provides independent processing and retries, but consumers still need duplicate handling.",
    "bullets": [
      "SNS: publish/fan-out",
      "SQS: buffer/process",
      "SNS → separate queues"
    ]
  },
  "What is IAM? What are users, roles, and policies?": {
    "spoken": "IAM controls AWS identities and permissions. Users are identities, roles are assumed with temporary credentials, and policies define permissions. I prefer least privilege and temporary role credentials over embedding long-lived keys in application code.",
    "bullets": [
      "Users, roles, policies",
      "Temporary credentials",
      "Least privilege"
    ]
  },
  "What is AWS Secrets Manager, and why use it instead of a .env file in production?": {
    "spoken": "Secrets Manager stores production secrets with controlled access, auditing, and rotation features. That is safer to manage than distributing static .env files. The app reads secrets using a restricted role, and I keep them out of client bundles and logs.",
    "bullets": [
      "Central secret store",
      "Restricted role access",
      "Rotation and auditing"
    ]
  },
  "What is CloudWatch? How is it different from other APM like Otel-LGTM?": {
    "spoken": "CloudWatch provides AWS-integrated logs, metrics, alarms, and dashboards. OpenTelemetry plus LGTM is a more portable observability approach. They can coexist; I compare signal coverage, correlation, retention, operating work, and cost rather than assuming one replaces every APM feature.",
    "bullets": [
      "CloudWatch: AWS integration",
      "OTel/LGTM: portable stack",
      "Compare operations and cost"
    ]
  },
  "What are AWS Bedrock and AWS SageMaker?": {
    "spoken": "Bedrock gives managed access to foundation models for generative-AI apps. SageMaker supports broader ML development, training, and deployment workflows. I choose based on whether I need to use a supported model or manage more of a custom ML lifecycle.",
    "bullets": [
      "Bedrock: foundation-model access",
      "SageMaker: broader ML lifecycle"
    ]
  },
  "What are Terraform and CloudFormation, and how do they compare?": {
    "spoken": "Terraform declares infrastructure across many providers and manages plans and state. CloudFormation manages AWS resources through stacks. Both make changes reviewable and repeatable, but I still protect secrets, review destructive changes, and watch for drift.",
    "bullets": [
      "Terraform: provider breadth/state",
      "CloudFormation: AWS stacks",
      "Review plans and drift"
    ]
  },
  "Difference between unit testing, integration testing, E2E testing?": {
    "spoken": "Unit tests check a small behavior, integration tests check parts working together, and E2E tests check a full user flow. I use Jest or Vitest for logic, Supertest for HTTP tests, and Playwright or Cypress for browser flows, with real dependencies where needed.",
    "bullets": [
      "Unit: focused behavior",
      "Integration: collaboration/boundaries",
      "E2E: complete flow",
      "Choose tools by test scope"
    ]
  },
  "What is Test Driven Development (TDD)?": {
    "spoken": "TDD means writing a failing test before the implementation. I follow red, green, refactor: see it fail, write enough code to pass, then improve the design. The test should express the required behavior, not just mirror the code.",
    "bullets": [
      "Red: fail",
      "Green: pass",
      "Refactor: improve"
    ]
  },
  "What is BDD (Behavior-Driven Development)? And name one tool for it.": {
    "spoken": "BDD makes expected behavior understandable to product, QA, and developers. We describe scenarios with Given, When, and Then, often using Cucumber. It can work alongside TDD because it focuses on shared feature behavior rather than replacing code-level testing.",
    "bullets": [
      "Shared behavior language",
      "Given/When/Then",
      "Cucumber"
    ]
  },
  "What is test coverage?": {
    "spoken": "Coverage tells us which code ran during tests, not whether it was checked well. I focus on critical behaviors and missing branches rather than one magic percentage. To increase useful coverage, I add meaningful edge and failure cases or remove dead code.",
    "bullets": [
      "Execution, not correctness",
      "Risk-based targets",
      "Add missing behavior checks"
    ]
  },
  "What are the different types of testing, and when do you use each?": {
    "spoken": "Smoke tests check whether the build is basically alive. Happy-path tests cover success, regression tests protect existing behavior, and snapshots compare saved output. I use snapshots carefully because matching an old result does not prove that result was correct.",
    "bullets": [
      "Smoke: basic health",
      "Happy path: success",
      "Regression: prevent old failures",
      "Snapshot: compare output"
    ]
  },
  "How do you write your test cases?": {
    "spoken": "I start with requirements and list normal, invalid, boundary, and failure cases. Then I arrange inputs, perform the action, and assert observable results. I generate coverage with the runner, but use it to find gaps rather than chase a number.",
    "bullets": [
      "Arrange → act → assert",
      "Happy, edge, error cases",
      "vitest/jest --coverage",
      "Prioritize meaningful assertions"
    ]
  },
  "What tools do you use for frontend and backend testing?": {
    "spoken": "For frontend tests, I use a runner like Jest or Vitest with React Testing Library. For backend tests, Supertest can exercise HTTP routes and a real test database checks persistence. Playwright or Cypress handles full browser workflows.",
    "bullets": [
      "Jest/Vitest: runner",
      "Testing Library: components",
      "Supertest: API",
      "Playwright/Cypress: browser"
    ]
  },
  "Explain how you use Playwright or Cypress for E2E testing.": {
    "spoken": "I run the app with isolated test data, then use Playwright or Cypress to navigate and act like a user. I find controls by role or label and assert visible outcomes. Condition-based waits and failure traces make tests more reliable than fixed sleeps.",
    "bullets": [
      "Real user flow",
      "Stable accessible locators",
      "Wait for conditions",
      "Capture failure evidence"
    ]
  },
  "How do you deal with API calls and mocks during testing?": {
    "spoken": "I mock calls when testing local behavior or forcing unusual responses. I use real services in dedicated integration tests and a few critical E2E flows to catch contract problems. Each test resets its data and should never accidentally call production services.",
    "bullets": [
      "Mock controlled UI/logic cases",
      "Real dependencies for integration",
      "Isolate and reset data"
    ]
  },
  "How do you integrate automated tests into a CI/CD pipeline?": {
    "spoken": "I run fast checks on pull requests, then appropriate integration and critical E2E tests before release. CI publishes results and blocks on meaningful failures. Heavier suites can run in parallel or scheduled stages, while flaky tests get tracked and fixed.",
    "bullets": [
      "PR: lint/types/unit checks",
      "Integration and critical E2E",
      "Required gates and reports"
    ]
  },
  "What is the difference between authentication and authorization?": {
    "spoken": "Authentication answers “Who are you?” Authorization answers “What can you do?” Logging in does not mean someone can access every resource. The server must verify both identity and permission for the requested action.",
    "bullets": [
      "Authentication: identity",
      "Authorization: permission",
      "Enforce on the server"
    ]
  },
  "What is RBAC and how do you handle very granular user permissions?": {
    "spoken": "RBAC gives permissions to roles and assigns roles to users. For finer control, I also check things like ownership, organization, or resource attributes. I centralize those rules and deny by default instead of creating endless role combinations.",
    "bullets": [
      "Roles → permissions",
      "Ownership/attribute rules",
      "Deny by default"
    ]
  },
  "Difference between JWT and Session-based authentication?": {
    "spoken": "Session auth usually stores state on the server and gives the client an opaque ID. JWT auth can verify signed claims locally, but revocation and fresh permissions need planning. Both can scale to millions of users; the choice depends on requirements, not user count alone.",
    "bullets": [
      "Session: server-side state",
      "JWT: signed claims",
      "Compare revocation and operations"
    ]
  },
  "Walk through a full JWT auth flow, from login to an authenticated request.": {
    "spoken": "The user logs in over HTTPS, and the server verifies their credentials. It issues a short-lived access token, then checks that token on protected requests. I verify the signature, claims, expiry, and permissions; refreshing or signing in again handles expiration.",
    "bullets": [
      "Login and verify credentials",
      "Issue short-lived token",
      "Verify signature and claims",
      "Authorize the resource"
    ]
  },
  "What is a JWT, what are the three parts of it?": {
    "spoken": "A JWT commonly has a header, payload, and signature. The first two describe the token and claims; the signature proves they were not altered with the expected key. I verify it with a trusted library and validate the claims. Signing does not encrypt it.",
    "bullets": [
      "Header.payload.signature",
      "Verify key/algorithm/claims",
      "Signed ≠ encrypted"
    ]
  },
  "Token Security": {
    "spoken": "I keep signing keys in a restricted server secret store. If a token is stolen, short expiry limits exposure, while refresh revocation or a denylist can stop continued access. I revoke affected sessions and investigate the leak rather than relying on decoding the token.",
    "bullets": [
      "Protect signing keys",
      "Short access lifetime",
      "Revoke refresh/session",
      "Denylist when needed"
    ]
  },
  "What is the difference between an access token and a refresh token?": {
    "spoken": "An access token is short-lived and used for API requests. A refresh token lasts longer and is only used to get a new access token. I protect and rotate refresh tokens, detect reuse, and revoke the session when needed.",
    "bullets": [
      "Access: call API",
      "Refresh: renew access",
      "Rotation and revocation"
    ]
  },
  "Where could you store authentication tokens (Local storage vs. Http-only cookies)?": {
    "spoken": "Local storage is readable by JavaScript, so XSS can steal tokens from it. HttpOnly cookies block direct script reading, but cookies are sent automatically, so CSRF protection matters. Neither choice replaces defenses against XSS or sound session management.",
    "bullets": [
      "localStorage: XSS theft risk",
      "HttpOnly: no direct JS read",
      "Cookies: defend CSRF",
      "Secure/SameSite and expiry"
    ]
  },
  "What are OAuth 2.0, OIDC, and SSO, and how do they relate?": {
    "spoken": "OAuth delegates access, like allowing an app to read a calendar. OIDC adds identity for sign-in. SSO lets one identity-provider login serve multiple apps, often through OIDC or SAML. I use a well-supported flow rather than inventing my own login protocol.",
    "bullets": [
      "OAuth: delegated access",
      "OIDC: identity/sign-in",
      "SSO: one login, many apps",
      "Authorization Code + PKCE"
    ]
  },
  "What is CORS?": {
    "spoken": "CORS lets the server say which browser origins may read its responses. I configure allowed origins, methods, headers, and credentials on the backend. The frontend cannot bypass missing permission, and CORS is not a substitute for authentication.",
    "bullets": [
      "Server-controlled allowlist",
      "Preflight and credentials",
      "Not an auth mechanism"
    ]
  },
  "What is XSS (Cross-Site Scripting)? How to defend against it?": {
    "spoken": "XSS happens when attacker-controlled content runs as script in our origin. I escape text, validate URLs, and sanitize any intentional rich HTML. CSP adds another layer, but it does not replace safe rendering or fix every XSS issue.",
    "bullets": [
      "Escape normal text",
      "Sanitize rich HTML",
      "Validate URLs",
      "CSP as another layer"
    ]
  },
  "What is CSRF and how do you defend against it?": {
    "spoken": "CSRF tricks a browser into sending an unwanted authenticated request, often using cookies. I use appropriate SameSite settings, CSRF tokens, and origin checks for state changes. GET stays read-only, and I do not rely on CORS alone.",
    "bullets": [
      "Automatically attached credentials",
      "SameSite + CSRF token",
      "Check origin; safe GET"
    ]
  },
  "How do you safely store secrets such as user passwords and API keys?": {
    "spoken": "I hash passwords with a password-specific algorithm such as Argon2id and a unique salt; I do not store plain text or reversible passwords. Private API keys belong in a restricted secret manager. Encryption, access controls, and safe logging protect other sensitive data.",
    "bullets": [
      "Password hash + unique salt",
      "Restricted secret manager",
      "No secrets in code/logs"
    ]
  },
  "How do you protect a server against DDoS attacks and abuse?": {
    "spoken": "I use edge-level DDoS protection along with application limits. Rate limits, size limits, timeouts, and quotas protect expensive work, while monitoring and backpressure help during spikes. A single Express middleware cannot stop a large network attack by itself.",
    "bullets": [
      "Edge/WAF protection",
      "Limits and timeouts",
      "Monitor and shed excess load"
    ]
  },
  "What is SQL Injection? Different ways to prevent it": {
    "spoken": "SQL injection means input changes the query's syntax. I prevent it with parameters instead of concatenating values, and allowlists for dynamic identifiers like column names. I also use limited database privileges and review raw ORM queries.",
    "bullets": [
      "Bind values as parameters",
      "Allowlist identifiers",
      "Least-privilege database user"
    ]
  },
  "How do you ensure a secure web application?": {
    "spoken": "I secure the whole flow: HTTPS, strong login, server-side permissions, validated input, and safe output. I protect secrets and stored data, patch dependencies, and monitor suspicious behavior. Backups, recovery tests, and incident plans matter as much as prevention.",
    "bullets": [
      "Auth and authorization",
      "Input/output protections",
      "Secrets and data access",
      "Patch, monitor, recover"
    ]
  },
  "What is the difference between Agile and Waterfall methodologies?": {
    "spoken": "Waterfall organizes work into larger sequential phases. Agile delivers smaller increments and adjusts through feedback. Scrum is one framework for practicing Agile with sprints, roles, and events. Agile still needs planning, documentation, and quality standards.",
    "bullets": [
      "Waterfall: phased sequence",
      "Agile: inspect and adapt",
      "Scrum: one Agile framework"
    ]
  },
  "What are some common roles in scrum and what they do?": {
    "spoken": "The Product Owner owns backlog priorities and product value. The Scrum Master helps the team use Scrum effectively, and Developers deliver the increment. A Project Manager may exist in the company, but it is not a formal Scrum accountability.",
    "bullets": [
      "PO: value and backlog",
      "SM: process and effectiveness",
      "Developers: usable increment"
    ]
  },
  "Who are some common people that developers have to interact often with?": {
    "spoken": "Developers work with product, design, QA, other engineers, and operations, plus security or support when needed. Stakeholders are anyone affected by the product's outcomes. I keep communication clear about needs, progress, risks, and tradeoffs.",
    "bullets": [
      "Product/design/QA/engineering",
      "Operations/security/support",
      "Stakeholders: affected people"
    ]
  },
  "How do you get your work or ticket?": {
    "spoken": "The Product Owner orders the backlog, and the team clarifies upcoming tickets during refinement. In planning, developers select work around the Sprint Goal and capacity. Tickets may be pulled or assigned depending on the team, so I describe the actual process.",
    "bullets": [
      "PO orders backlog",
      "Refine requirements",
      "Plan around goal/capacity",
      "Pull or assign by convention"
    ]
  },
  "List out some Scrum ceremonies and explain each.": {
    "spoken": "Planning chooses the goal and work. The Daily Scrum checks progress and adjusts the plan. The review gathers feedback on the increment, and the retrospective improves teamwork. Refinement prepares future backlog items and happens throughout the sprint.",
    "bullets": [
      "Planning: goal and plan",
      "Daily: inspect progress",
      "Review: product feedback",
      "Retro: process improvement",
      "Refinement: prepare future work"
    ]
  },
  "What is the typical whole workflow when working on a Jira ticket?": {
    "spoken": "I clarify acceptance criteria, create a branch, implement and test the change, then open a pull request. After review and CI pass, it merges and gets verified in deployment. Acceptance criteria describe this ticket; Definition of Done sets shared completion standards.",
    "bullets": [
      "Clarify → branch → implement",
      "Test → PR → review",
      "Verify release",
      "Criteria vs. shared DoD"
    ]
  },
  "How do you make sure you finish your tasks on time, and what do you do if you fall behind?": {
    "spoken": "I break work into small steps, prioritize, and track uncertainty. If I am falling behind, I raise it early with a clear explanation and ask for help. We agree on scope or timing changes instead of silently skipping quality checks.",
    "bullets": [
      "Small steps and priorities",
      "Raise blockers early",
      "Agree on scope/date"
    ]
  },
  "What do you look for during code reviews?": {
    "spoken": "I review correctness, security, edge cases, tests, and readability. I look for clear names and sensible responsibilities, using DRY and SOLID as guides rather than rigid rules. The goal is code the team can safely understand and change.",
    "bullets": [
      "SOLID: responsibility/open-closed/substitution",
      "Interface segregation/dependency inversion",
      "DRY: avoid duplicated knowledge",
      "Clear names and tests"
    ]
  },
  "How do you organize the folder structure of your project?": {
    "spoken": "I group code by feature or business capability and keep related tests nearby. On the backend, I separate HTTP, business, and data-access responsibilities. Shared modules stay small, and the structure grows with the project rather than adding layers just for appearance.",
    "bullets": [
      "Feature-based organization",
      "Clear layer responsibilities",
      "Small shared modules"
    ]
  },
  "What is Singleton? Why need it? Give examples.": {
    "spoken": "A singleton gives one shared instance within a defined runtime scope, like a logger or connection pool. It can manage an expensive resource, but hidden global state makes tests harder. One process's singleton is not a single instance across all servers.",
    "bullets": [
      "One instance per scope",
      "Logger or pool",
      "Watch global coupling"
    ]
  },
  "Explain functional programming vs imperative programming": {
    "spoken": "Imperative code explains the steps and mutations needed to get a result. Functional programming emphasizes pure functions, immutable data, and composition. JavaScript supports both, and I choose the clearest approach rather than forcing every problem into one style.",
    "bullets": [
      "Imperative: steps and changes",
      "Functional: pure transformations",
      "Combine when useful"
    ]
  },
  "What does your day to day life look like?": {
    "spoken": "I would describe my real routine: checking priorities and alerts, joining standup, working on tickets, testing, and reviewing code. I also coordinate with product, design, QA, and platform teams, then communicate progress or blockers. The details should match actual experience.",
    "bullets": [
      "Priorities and standup",
      "Code, tests, reviews",
      "Team coordination",
      "Report progress/blockers"
    ]
  },
  "What does CI/CD stand for, and what is its purpose?": {
    "spoken": "CI automatically checks frequent integrated changes. Continuous delivery keeps validated code ready to release, while continuous deployment releases it automatically after the gates pass. The purpose is fast feedback and repeatable, lower-risk delivery.",
    "bullets": [
      "CI: integrate and validate",
      "Delivery: ready to release",
      "Deployment: release automatically"
    ]
  },
  "Explain the different environments:": {
    "spoken": "Local is my own workspace, dev is shared early integration, QA is for testing, and staging rehearses production. Production serves real users. The exact names vary, but data and secrets should be isolated and the tested artifact promoted consistently.",
    "bullets": [
      "Local/dev/QA",
      "Staging: production-like",
      "Production: real users"
    ]
  },
  "What happens in the CI/CD pipeline after you open an PR?": {
    "spoken": "After a pull request opens, CI checks out the change, installs locked dependencies, and runs quality checks and tests. It may build an artifact and preview environment. Required results and review determine whether it can merge and move toward deployment.",
    "bullets": [
      "Checkout and install",
      "Lint/types/tests/build",
      "Reports or preview",
      "Merge/release gates"
    ]
  },
  "How do you ensure the code quality during the CI/CD pipeline process?": {
    "spoken": "I use required lint, type checks, relevant tests, and code review. Dependency and security checks add coverage, while a repeatable build produces the release artifact. Quality gates should catch useful failures rather than create noise that people learn to ignore.",
    "bullets": [
      "Automated checks",
      "Reviewed changes",
      "Security/dependency analysis",
      "Actionable release gates"
    ]
  },
  "What is SonarQube and Lint? What are their differences?": {
    "spoken": "Lint tools flag code patterns and rule violations. SonarQube adds broader analysis and reporting, such as duplication, complexity, and coverage trends. They overlap, but neither runs all the behavioral checks that tests and review provide.",
    "bullets": [
      "Lint: code rules",
      "Sonar: broader quality reporting",
      "Tests still needed"
    ]
  },
  "What are feature flags? How is cherry-pick different?": {
    "spoken": "A feature flag controls whether deployed behavior is active, which helps gradual rollouts and quick disabling. Cherry-pick copies a commit onto another branch. One changes activation; the other changes the code included in a branch.",
    "bullets": [
      "Flag: control behavior",
      "Cherry-pick: copy commit",
      "Activation vs. code history"
    ]
  },
  "Explain the below deployment strategies, what they are and their benefits:": {
    "spoken": "Blue/green keeps old and new environments and switches traffic between them. Canary starts with a small share of users and expands if metrics stay healthy. Both need monitoring and compatible database changes so rollback is actually possible.",
    "bullets": [
      "Blue/green: switch environments",
      "Canary: grow traffic share",
      "Monitor and plan rollback"
    ]
  },
  "What happens immediately after the deployment? How does the engineering team ensure the deployment is successful?": {
    "spoken": "Right after deployment, I check health and critical user flows, then compare errors, latency, and business signals with the baseline. I watch logs and traces during rollout. If there is a meaningful regression, I pause, mitigate, or roll back.",
    "bullets": [
      "Health and smoke tests",
      "Error/latency/business metrics",
      "Observe and recover"
    ]
  },
  "What is a YAML/.yml file? What do we write in it?": {
    "spoken": "YAML is a text format for structured configuration; .yml and .yaml mean the same thing. We use it for workflows, containers, and deployment definitions. Indentation matters, and secrets should come from protected stores rather than literal values in the file.",
    "bullets": [
      "Mappings, lists, values",
      "CI/Compose/Kubernetes",
      "Indentation and safe secrets"
    ]
  },
  "How do you monitor your app in production?": {
    "spoken": "I monitor request volume, errors, latency, and resource pressure, plus real user outcomes. Logs, metrics, traces, and client errors help explain failures. Alerts need clear thresholds, an owner, and a response plan rather than firing on every harmless fluctuation.",
    "bullets": [
      "Traffic/errors/latency/saturation",
      "Business and client signals",
      "Correlated telemetry",
      "Actionable alerts"
    ]
  },
  "List out some common monitoring tools and their uniqueness": {
    "spoken": "New Relic is strong in application performance monitoring, Splunk in searching machine data and logs, and Sentry in application errors and release debugging. Their features overlap, so I choose based on the visibility the team actually needs.",
    "bullets": [
      "New Relic: APM",
      "Splunk: logs/search",
      "Sentry: errors/releases"
    ]
  },
  "What is Otel-LGTM stack and what does each one do?": {
    "spoken": "OpenTelemetry collects and exports telemetry. Loki handles logs, Grafana visualizes data, Tempo stores traces, and Mimir stores metrics. Together they help us connect symptoms to causes, but good instrumentation and useful alerts still need design.",
    "bullets": [
      "OTel: instrument/export",
      "Loki: logs",
      "Grafana: views",
      "Tempo: traces",
      "Mimir: metrics"
    ]
  },
  "What is a bundler (e.g., Webpack), and what does bundling mean? Why do we need bundling?": {
    "spoken": "A bundler follows imports and produces deployable code and assets. It can transform, optimize, and split that code for delivery. We do not have to put everything into one file; smaller initial chunks often load faster.",
    "bullets": [
      "Follow dependencies",
      "Transform and optimize",
      "Split delivery into chunks"
    ]
  },
  "What are the differences between Webpack and Vite?": {
    "spoken": "Webpack is a highly configurable bundler with a mature plugin ecosystem. Vite focuses on fast development using native-module-based serving and on-demand transforms, plus a production build. I compare actual versions and project needs instead of assuming one tool is always faster.",
    "bullets": [
      "Webpack: mature/configurable",
      "Vite: fast dev workflow",
      "Production setup varies"
    ]
  },
  "Explain some of the build tool's feature and what it does": {
    "spoken": "Tree shaking removes unused code when it is safe. Code splitting loads separate chunks as needed. HMR updates changed modules during development, and the dev server serves and transforms the app. These features improve delivery or development, but solve different problems.",
    "bullets": [
      "Tree shake: remove unused",
      "Split: load smaller chunks",
      "HMR: update without full reload",
      "Dev server: serve/transform"
    ]
  },
  "Give a detailed explanation on how your code is shipped to production": {
    "spoken": "I implement a focused branch, run checks, and open a pull request. CI and review validate it, then we build a versioned artifact and test it in a release environment. We roll it out with monitoring and a recovery plan, including compatible database changes.",
    "bullets": [
      "Branch → PR → CI/review",
      "Versioned artifact",
      "Test → rollout → monitor",
      "Recovery plan"
    ]
  },
  "If there's a bug in production, how would you know? And what are the steps you take to fix it? ": {
    "spoken": "I learn about production bugs from alerts, traces, client errors, support, or business metrics. I assess impact and mitigate first, then reproduce and fix the cause with a regression test. After a safe rollout, I verify recovery and document follow-up work.",
    "bullets": [
      "Detect and assess",
      "Mitigate/rollback if needed",
      "Reproduce and regression-test",
      "Verify recovery"
    ]
  },
  "What are prompts, tokens, and the context window?": {
    "spoken": "A prompt tells the model what to do. Tokens are the pieces of text or data it processes, and the context window is how much input and output can fit at once. I budget that space for instructions, evidence, history, and the answer.",
    "bullets": [
      "Prompt: instructions/input",
      "Tokens: processing units",
      "Context window: size limit"
    ]
  },
  "What are the differences between skills and hooks?": {
    "spoken": "A skill is reusable guidance for doing a task, often with supporting resources. A hook runs configured behavior at a lifecycle event, such as before a tool call. Their details depend on the tool, and neither replaces proper permission enforcement.",
    "bullets": [
      "Skill: reusable task guidance",
      "Hook: event-triggered behavior",
      "Permissions enforced separately"
    ]
  },
  "How do you use AI in your day-to-day work and to help with your code?": {
    "spoken": "I would describe real uses like understanding code, drafting small changes, suggesting tests, and reviewing edge cases. I give AI clear requirements and relevant context, then inspect the diff and run checks. I do not treat confident output as proof.",
    "bullets": [
      "Clear task and context",
      "Draft/explain/review",
      "Verify with code and tests"
    ]
  },
  "How do you verify the AI's output and keep the code secure?": {
    "spoken": "I check AI output against requirements, existing code, and trusted documentation. Then I review the diff for security problems and run relevant checks. I also inspect generated tests, because a test can repeat the implementation's mistake instead of checking the intended behavior.",
    "bullets": [
      "Review the diff",
      "Verify sources and behavior",
      "Check security boundaries",
      "Tests must reflect requirements"
    ]
  },
  "What is a system prompt and how is it different from a normal prompt?": {
    "spoken": "A system prompt sets high-level behavior and constraints, while a user prompt asks for the current task. The exact hierarchy depends on the platform. I do not put secrets in prompts or assume instructions alone can enforce security.",
    "bullets": [
      "System: overall behavior",
      "User: current request",
      "Not a security boundary"
    ]
  },
  "Explain the common prompting techniques": {
    "spoken": "Zero-shot gives no example, one-shot gives one, and few-shot gives several. For complex tasks, I ask for clear steps and verifiable intermediate results. I judge prompting by measured task quality, not by how much hidden reasoning it appears to request.",
    "bullets": [
      "Zero/one/few examples",
      "Break down complex tasks",
      "Ask for concise evidence"
    ]
  },
  "What is structured output, why do we need it, and how do you do it?": {
    "spoken": "Structured output means the result follows a defined shape, such as a JSON Schema. That makes it easier for software to consume. I use supported schema constraints and still validate the values, because correct structure does not guarantee a correct answer.",
    "bullets": [
      "Predictable schema",
      "Parse and validate",
      "Handle refusal/incomplete output"
    ]
  },
  "What is AI's hallucination? How do we reduce it?": {
    "spoken": "A hallucination is an unsupported or false answer that may sound confident. I reduce it with relevant sources, narrower tasks, tools, and permission to say “I don't know.” I still verify important claims and use evals because no prompt eliminates it completely.",
    "bullets": [
      "Unsupported confident output",
      "Ground in sources/tools",
      "Allow uncertainty",
      "Verify with evals"
    ]
  },
  "What is a tool? What makes an AI an agent?": {
    "spoken": "A tool is an operation the application lets the model request, such as searching or creating a ticket. An agent can choose tools and next steps toward a goal. The application still validates arguments, permissions, and execution limits.",
    "bullets": [
      "Tool: callable operation",
      "Agent: chooses steps/tools",
      "App enforces safety"
    ]
  },
  "What is the agentic loop? How does it work?": {
    "spoken": "The agent gets a goal and context, then answers or requests tools. The application validates and executes allowed calls, returns results, and repeats the cycle. It stops when done, when input is needed, or when a time, cost, or step limit is reached.",
    "bullets": [
      "Model → tool request",
      "Validate → execute → result",
      "Repeat with limits"
    ]
  },
  "What is MCP?": {
    "spoken": "MCP is a standard way for AI applications to connect to tools and context. A server exposes capabilities, and a client inside the host connects to it. Authentication and authorization still need enforcement; the protocol does not make every tool call safe.",
    "bullets": [
      "Server exposes capabilities",
      "Client connects",
      "Tools/resources/prompts"
    ]
  },
  "How does RAG work, and what problem does it solve?": {
    "spoken": "RAG retrieves relevant information and puts it in the model's context before it answers. That helps with private or changing knowledge without retraining each time. I still evaluate retrieval and grounding, because missing or irrelevant evidence can produce a bad answer.",
    "bullets": [
      "Retrieve → add context → answer",
      "Private/current knowledge",
      "Check evidence and grounding"
    ]
  },
  "Explain the RAG ingestion pipeline.": {
    "spoken": "I load and clean approved documents, split them into useful chunks, create embeddings, and store them with metadata in an indexed search system. At query time, I retrieve relevant chunks with permission filters. I also update or remove stale content.",
    "bullets": [
      "Load and chunk",
      "Embed and index",
      "Keep metadata/permissions",
      "Refresh stale data"
    ]
  },
  "What is the difference between keyword search, vector search, and hybrid search?": {
    "spoken": "Keyword search finds matching terms, which helps exact names and codes. Vector search finds semantic similarity, even with different wording. Hybrid search combines both, often with reranking. I test real queries because similarity is not the same as useful evidence.",
    "bullets": [
      "Keyword: exact terms",
      "Vector: meaning similarity",
      "Hybrid: combine/rerank"
    ]
  },
  "What is a workflow, what is an agent, and what is the difference?": {
    "spoken": "A workflow follows predefined paths, while an agent chooses some steps dynamically. Workflows are easier to predict and budget; agents are more flexible. I often combine them, keeping permissions and limits explicit around the flexible parts.",
    "bullets": [
      "Workflow: fixed structure",
      "Agent: dynamic choices",
      "Hybrid with guardrails"
    ]
  },
  "What are some common workflow patterns?": {
    "spoken": "Prompt chaining passes one step's output to the next. Routing selects a specialized path, and parallelization runs independent work together. I use clear input/output contracts and combine results carefully instead of adding more calls without a reason.",
    "bullets": [
      "Chain: sequential steps",
      "Router: choose path",
      "Parallel: independent work"
    ]
  },
  "What is context engineering, and how could you do it?": {
    "spoken": "Context engineering means giving the model the right information for the current step. I select relevant instructions, evidence, state, and tool results while trimming noise. I preserve permission boundaries and separate untrusted content from authoritative instructions.",
    "bullets": [
      "Select useful context",
      "Summarize/filter history",
      "Reserve output space",
      "Protect trust boundaries"
    ]
  },
  "What is agent orchestration (orchestrator-workers)?": {
    "spoken": "An orchestrator splits a task, assigns work to specialized workers, then combines and checks their results. It helps when subtasks are separable, but adds cost and coordination. I use clear contracts and limits instead of assuming more agents automatically means better answers.",
    "bullets": [
      "Decompose and assign",
      "Combine and verify",
      "Bound cost and coordination"
    ]
  },
  "What is a checkpoint, and why does a long-running agent need one?": {
    "spoken": "A checkpoint saves enough state to resume after a failure or pause. That can include completed steps, pending work, messages, and tool results. For long tasks, it avoids losing progress, but resumed external actions still need idempotency to prevent duplication.",
    "bullets": [
      "Save progress/state",
      "Resume after interruption",
      "Protect against repeated effects"
    ]
  },
  "How do you add human approval to an agent?": {
    "spoken": "I pause before the important action and show exactly what would happen. I save state and wait for approval from a trusted user, then recheck permissions and arguments before executing. Approval applies to that action, not unlimited future actions.",
    "bullets": [
      "Show exact action",
      "Pause and save state",
      "Approve, revalidate, execute"
    ]
  },
  "What are LangChain, LangGraph and LangSmith, and how do they fit together?": {
    "spoken": "LangChain provides integrations and building blocks for models and tools. LangGraph manages stateful graph execution, branching, and resume behavior. LangSmith helps trace, evaluate, and debug the application. They can work together, but we can choose only the parts we need.",
    "bullets": [
      "LangChain: building blocks",
      "LangGraph: execution/state",
      "LangSmith: tracing/evals"
    ]
  },
  "What are the three parts of a LangGraph graph?": {
    "spoken": "A LangGraph graph has state, nodes, and edges. State holds the working data, nodes perform work and update it, and edges choose what runs next. When branches update the same data, I define how those updates merge.",
    "bullets": [
      "State: shared data",
      "Nodes: work",
      "Edges: routing"
    ]
  },
  "What does LangGraph give you that a plain while loop does not?": {
    "spoken": "LangGraph provides structured state transitions, checkpoints, resume, and human-in-the-loop behavior. A simple while loop may be enough for a small agent, but we would have to build those features ourselves. Neither option automatically makes external actions safe to repeat.",
    "bullets": [
      "State and branching",
      "Persistence and resume",
      "Interruptions and inspection"
    ]
  },
  "What is a checkpointer, and what is thread_id for?": {
    "spoken": "A checkpointer saves graph state so execution can continue later. thread_id identifies which saved execution to resume. I reuse it for the same conversation and enforce access checks so one user cannot open another user's saved state.",
    "bullets": [
      "Checkpointer: persistence",
      "thread_id: saved execution",
      "Enforce tenant/user access"
    ]
  },
  "How does interrupt work, and why must you not charge a card before it?": {
    "spoken": "interrupt pauses the graph and waits for a resume value, such as approval. A node can restart when resumed, so charging before interrupt may charge again. I request approval first and use a durable idempotency key for the charge even afterward.",
    "bullets": [
      "Pause and resume",
      "Node may restart",
      "Approve before side effect",
      "Idempotency key"
    ]
  },
  "Why does an AI app need evals, and not only unit tests?": {
    "spoken": "AI can produce different answers to the same task and still be wrong when the code works. Unit tests check deterministic software behavior; evals check task quality, grounding, and failure cases across examples. I use both and repeat cases when variability matters.",
    "bullets": [
      "Unit tests: code behavior",
      "Evals: AI task quality",
      "Representative/regression cases"
    ]
  },
  "What kinds of grader are there, and when do you use each?": {
    "spoken": "Rule-based graders check exact requirements cheaply. Model graders assess meaning or quality when exact matching is too rigid. Human graders handle expert judgment and calibrate the others. I choose based on risk and verify that the grader itself is reliable.",
    "bullets": [
      "Deterministic rules",
      "Model-based judgment",
      "Human calibration"
    ]
  },
  "What is an LLM as a judge, and how do you write a good test case for it?": {
    "spoken": "An LLM judge scores an answer against a rubric. A good case includes the task, relevant context, expected criteria, and unacceptable failures. I ask for a structured score with concise evidence and compare it with human judgments, because the judge can also be biased or fooled.",
    "bullets": [
      "Task, context, rubric",
      "Score with evidence",
      "Calibrate against humans"
    ]
  },
  "How do you evaluate a RAG system?": {
    "spoken": "I evaluate retrieval and generation separately. First, did we retrieve the right sources? Then, is the answer correct and supported by them? I include missing-answer and permission cases and track latency and cost alongside quality.",
    "bullets": [
      "Retrieval relevance/coverage",
      "Answer accuracy/faithfulness",
      "Citation and access checks",
      "Cost and latency"
    ]
  },
  "What are observability and tracing, and how are they different from evaluation?": {
    "spoken": "Observability shows what happened through logs, metrics, and traces. Evaluation judges whether it was good or correct. A trace connects model, retrieval, and tool steps, so I can use it to explain why an eval failed.",
    "bullets": [
      "Observe: what happened",
      "Evaluate: was it good",
      "Trace: connected execution steps"
    ]
  },
  "How do you debug an AI's mistake?": {
    "spoken": "I reproduce the original inputs and inspect the trace step by step. I look for missing evidence, bad context, wrong tool arguments, or a generation mistake, then fix the earliest failure. Finally, I add a regression case and check for unintended quality changes.",
    "bullets": [
      "Reproduce and trace",
      "Find first wrong step",
      "Fix and regression-test"
    ]
  },
  "What is prompt injection, and how does it work?": {
    "spoken": "Prompt injection hides attacker instructions in content the model reads, like a webpage or document. It tries to redirect the task or misuse tools. I treat that content as data and enforce access and action rules outside the model, using several defensive layers.",
    "bullets": [
      "Untrusted content as instructions",
      "Tool/data misuse risk",
      "Permissions outside the prompt"
    ]
  },
  "What are guardrails, what do they do and where do they go?": {
    "spoken": "Guardrails are checks around inputs, context, tools, and outputs. Examples include schema validation, permissions, sensitive-data filtering, and step limits. I put authorization and approval before side effects and measure failures, because one filter cannot guarantee safety.",
    "bullets": [
      "Validate input/output",
      "Authorize before actions",
      "Filter data and bound execution"
    ]
  },
  "What is prompt caching?": {
    "spoken": "Prompt caching reuses computation for matching prompt prefixes on supported providers. It can reduce input cost and latency without returning a saved answer. Stable shared context can help, but eligibility, retention, and pricing depend on the provider's rules.",
    "bullets": [
      "Reuse prefix computation",
      "Not an answer cache",
      "Provider-specific rules"
    ]
  },
  "What is semantic caching?": {
    "spoken": "Semantic caching reuses an answer for a similar request. It can save calls, but similar wording may need different answers for different users or fresh data. I use conservative matching, permission boundaries, and invalidation so cached responses stay appropriate.",
    "bullets": [
      "Reuse similar answers",
      "Similarity can mislead",
      "Partition by access/freshness"
    ]
  },
  "How do you control the cost of an LLM app?": {
    "spoken": "I measure cost per successful task, then reduce unnecessary tokens, calls, retries, and tool steps. I choose the smallest model that passes quality checks, cache safely, and bound execution. After optimizing, I recheck quality and security rather than only the bill.",
    "bullets": [
      "Measure cost per success",
      "Right-sized model/context",
      "Safe caching and limits",
      "Re-evaluate quality"
    ]
  }
};
