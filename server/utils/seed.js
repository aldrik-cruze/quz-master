require('dotenv').config();
const bcrypt = require('bcrypt');
const { createTables } = require('../models/schema');
const User = require('../models/User');
const Topic = require('../models/Topic');
const Question = require('../models/Question');

const topics = [
    { name: 'HTML', description: 'HyperText Markup Language - Building blocks of web pages', icon: '📄' },
    { name: 'CSS', description: 'Cascading Style Sheets - Styling and layout', icon: '🎨' },
    { name: 'JavaScript', description: 'Programming language for web interactivity', icon: '⚡' },
    { name: 'PHP', description: 'Server-side scripting language', icon: '🐘' },
    { name: 'Node.js', description: 'JavaScript runtime for server-side development', icon: '🟢' },
    { name: 'React', description: 'JavaScript library for building user interfaces', icon: '⚛️' },
    { name: 'C', description: 'General-purpose programming language', icon: '©️' },
    { name: 'C++', description: 'Object-oriented programming language', icon: '➕' },
    { name: 'Python', description: 'High-level programming language', icon: '🐍' },
    { name: 'Java', description: 'Object-oriented programming language', icon: '☕' },
    { name: 'MySQL', description: 'Relational database management system', icon: '🗄️' }
];

const questions = {
    'HTML': [
        { q: 'What does HTML stand for?', a: 'HyperText Markup Language', b: 'High Tech Modern Language', c: 'Home Tool Markup Language', d: 'Hyperlinks and Text Markup Language', correct: 'a', difficulty: 'easy' },
        { q: 'Which HTML tag is used to define an internal style sheet?', a: '<script>', b: '<style>', c: '<css>', d: '<link>', correct: 'b', difficulty: 'easy' },
        { q: 'Which HTML element is used to specify a footer for a document?', a: '<bottom>', b: '<section>', c: '<footer>', d: '<end>', correct: 'c', difficulty: 'easy' },
        { q: 'Which attribute is used to provide a unique identifier for an HTML element?', a: 'class', b: 'id', c: 'name', d: 'key', correct: 'b', difficulty: 'easy' },
        { q: 'What is the correct HTML element for inserting a line break?', a: '<break>', b: '<lb>', c: '<br>', d: '<newline>', correct: 'c', difficulty: 'easy' },
        { q: 'Which HTML attribute specifies an alternate text for an image?', a: 'title', b: 'src', c: 'alt', d: 'text', correct: 'c', difficulty: 'easy' },
        { q: 'What is the correct HTML for creating a hyperlink?', a: '<a url="url">link</a>', b: '<a href="url">link</a>', c: '<link href="url">link</link>', d: '<a>url</a>', correct: 'b', difficulty: 'easy' },
        { q: 'Which HTML element defines the title of a document?', a: '<head>', b: '<title>', c: '<meta>', d: '<header>', correct: 'b', difficulty: 'easy' },
        { q: 'What is the correct HTML for making a text input field?', a: '<input type="text">', b: '<textinput>', c: '<textfield>', d: '<text>', correct: 'a', difficulty: 'medium' },
        { q: 'Which HTML element is used to display a scalar measurement within a range?', a: '<range>', b: '<measure>', c: '<meter>', d: '<gauge>', correct: 'c', difficulty: 'medium' },
        { q: 'What does the HTML <canvas> element do?', a: 'Creates a painting area', b: 'Used to draw graphics', c: 'Displays images', d: 'Both A and B', correct: 'd', difficulty: 'medium' },
        { q: 'Which HTML5 element defines navigation links?', a: '<nav>', b: '<navigation>', c: '<navigate>', d: '<links>', correct: 'a', difficulty: 'medium' },
        { q: 'What is the correct HTML element for playing audio files?', a: '<audio>', b: '<sound>', c: '<mp3>', d: '<music>', correct: 'a', difficulty: 'medium' },
        { q: 'Which HTML attribute is used to define inline styles?', a: 'class', b: 'style', c: 'styles', d: 'font', correct: 'b', difficulty: 'easy' },
        { q: 'What is the correct HTML for making a checkbox?', a: '<input type="check">', b: '<input type="checkbox">', c: '<checkbox>', d: '<check>', correct: 'b', difficulty: 'easy' },
        { q: 'Which HTML element is used to group body content in a table?', a: '<tbody>', b: '<body>', c: '<table-body>', d: '<tgroup>', correct: 'a', difficulty: 'medium' },
        { q: 'What is the purpose of the HTML <datalist> element?', a: 'Creates a data table', b: 'Lists database items', c: 'Provides autocomplete options', d: 'Displays a list', correct: 'c', difficulty: 'hard' },
        { q: 'Which HTML element is used to define important text?', a: '<important>', b: '<strong>', c: '<b>', d: '<i>', correct: 'b', difficulty: 'easy' },
        { q: 'What is the correct HTML for inserting a background image?', a: '<background img="url">', b: '<body bg="url">', c: '<body style="background-image:url()">', d: '<bg>url</bg>', correct: 'c', difficulty: 'medium' },
        { q: 'Which HTML element defines an article?', a: '<article>', b: '<section>', c: '<content>', d: '<post>', correct: 'a', difficulty: 'easy' }
    ],
    'CSS': [
        { q: 'What does CSS stand for?', a: 'Creative Style Sheets', b: 'Cascading Style Sheets', c: 'Computer Style Sheets', d: 'Colorful Style Sheets', correct: 'b', difficulty: 'easy' },
        { q: 'Which CSS property is used to change the text color?', a: 'text-color', b: 'font-color', c: 'color', d: 'text-style', correct: 'c', difficulty: 'easy' },
        { q: 'How do you add a background color in CSS?', a: 'background-color:', b: 'bgcolor:', c: 'color:', d: 'bg-color:', correct: 'a', difficulty: 'easy' },
        { q: 'Which CSS property controls the text size?', a: 'text-size', b: 'font-size', c: 'text-style', d: 'font-style', correct: 'b', difficulty: 'easy' },
        { q: 'How do you make text bold in CSS?', a: 'font-weight: bold', b: 'text-style: bold', c: 'font: bold', d: 'text-weight: bold', correct: 'a', difficulty: 'easy' },
        { q: 'Which property is used to change the font of an element?', a: 'font-family', b: 'font-type', c: 'font-style', d: 'typeface', correct: 'a', difficulty: 'easy' },
        { q: 'How do you display borders around cells in CSS?', a: 'border-style', b: 'border', c: 'cell-border', d: 'table-border', correct: 'b', difficulty: 'easy' },
        { q: 'Which CSS property is used to create space between element border and content?', a: 'margin', b: 'padding', c: 'spacing', d: 'border-spacing', correct: 'b', difficulty: 'medium' },
        { q: 'What is the default value of the position property?', a: 'relative', b: 'fixed', c: 'absolute', d: 'static', correct: 'd', difficulty: 'medium' },
        { q: 'Which CSS property controls the stacking order of elements?', a: 'z-index', b: 'stack-order', c: 'layer', d: 'position-index', correct: 'a', difficulty: 'medium' },
        { q: 'What does the CSS box model consist of?', a: 'Margin, Border, Padding, Content', b: 'Width, Height, Padding', c: 'Content, Style, Layout', d: 'Div, Span, Box', correct: 'a', difficulty: 'medium' },
        { q: 'Which CSS property is used to make text italic?', a: 'font-style: italic', b: 'text-style: italic', c: 'font: italic', d: 'text: italic', correct: 'a', difficulty: 'easy' },
        { q: 'How do you select an element with id "header"?', a: '.header', b: '#header', c: '*header', d: 'header', correct: 'b', difficulty: 'easy' },
        { q: 'Which CSS property is used for flexbox layout?', a: 'display: flex', b: 'layout: flex', c: 'flex-layout', d: 'flexbox: true', correct: 'a', difficulty: 'medium' },
        { q: 'What is the CSS property for rounded corners?', a: 'corner-radius', b: 'border-curve', c: 'border-radius', d: 'round-corner', correct: 'c', difficulty: 'easy' },
        { q: 'Which CSS pseudo-class selects links that have been visited?', a: ':visited', b: ':active', c: ':link', d: ':hover', correct: 'a', difficulty: 'medium' },
        { q: 'How do you make each word in text start with a capital letter?', a: 'text-transform: capitalize', b: 'text-style: capitalize', c: 'transform: uppercase', d: 'font-variant: caps', correct: 'a', difficulty: 'medium' },
        { q: 'Which property is used to align items horizontally in flexbox?', a: 'align-items', b: 'justify-content', c: 'flex-align', d: 'horizontal-align', correct: 'b', difficulty: 'medium' },
        { q: 'What does the CSS calc() function do?', a: 'Performs calculations', b: 'Calculates element position', c: 'Creates calculations table', d: 'Validates calculations', correct: 'a', difficulty: 'hard' },
        { q: 'Which CSS property creates a transition effect?', a: 'transition', b: 'transform', c: 'animate', d: 'effect', correct: 'a', difficulty: 'medium' }
    ],
    'JavaScript': [
        { q: 'Which company developed JavaScript?', a: 'Microsoft', b: 'Netscape', c: 'Oracle', d: 'Google', correct: 'b', difficulty: 'easy' },
        { q: 'What is the correct syntax for a function in JavaScript?', a: 'function myFunction()', b: 'function:myFunction()', c: 'def myFunction()', d: 'create myFunction()', correct: 'a', difficulty: 'easy' },
        { q: 'How do you declare a variable in JavaScript?', a: 'variable x', b: 'var x', c: 'v x', d: 'dim x', correct: 'b', difficulty: 'easy' },
        { q: 'Which operator is used for strict equality in JavaScript?', a: '==', b: '===', c: '=', d: '!=', correct: 'b', difficulty: 'easy' },
        { q: 'How do you write "Hello World" in an alert box?', a: 'msg("Hello World")', b: 'alert("Hello World")', c: 'msgBox("Hello World")', d: 'alertBox("Hello World")', correct: 'b', difficulty: 'easy' },
        { q: 'Which method is used to parse a string to an integer?', a: 'parseInt()', b: 'parseInteger()', c: 'toInt()', d: 'int()', correct: 'a', difficulty: 'easy' },
        { q: 'What is the output of typeof null?', a: 'null', b: 'undefined', c: 'object', d: 'number', correct: 'c', difficulty: 'medium' },
        { q: 'Which method adds an element to the end of an array?', a: 'push()', b: 'pop()', c: 'shift()', d: 'unshift()', correct: 'a', difficulty: 'easy' },
        { q: 'How do you create an object in JavaScript?', a: 'var obj = []', b: 'var obj = {}', c: 'var obj = ()', d: 'var obj = <>', correct: 'b', difficulty: 'easy' },
        { q: 'What is a closure in JavaScript?', a: 'A loop that closes', b: 'A function with preserved scope', c: 'A closed code block', d: 'An ending statement', correct: 'b', difficulty: 'hard' },
        { q: 'Which keyword is used to define a constant?', a: 'const', b: 'constant', c: 'var', d: 'let', correct: 'a', difficulty: 'easy' },
        { q: 'What does JSON stand for?', a: 'JavaScript Object Notation', b: 'JavaScript Online Network', c: 'Java Source Open Network', d: 'JavaScript Oriented Notation', correct: 'a', difficulty: 'easy' },
        { q: 'Which method removes the last element from an array?', a: 'push()', b: 'pop()', c: 'shift()', d: 'remove()', correct: 'b', difficulty: 'easy' },
        { q: 'What is the result of 2 + "2" in JavaScript?', a: '4', b: '22', c: 'NaN', d: 'Error', correct: 'b', difficulty: 'medium' },
        { q: 'Which method is used to find an element in an array?', a: 'find()', b: 'search()', c: 'locate()', d: 'indexOf()', correct: 'a', difficulty: 'medium' },
        { q: 'What is the purpose of Promise in JavaScript?', a: 'Handle errors', b: 'Handle async operations', c: 'Create loops', d: 'Define variables', correct: 'b', difficulty: 'medium' },
        { q: 'How do you comment a single line in JavaScript?', a: '/* comment */', b: '<!-- comment -->', c: '// comment', d: '# comment', correct: 'c', difficulty: 'easy' },
        { q: 'Which method converts JSON string to JavaScript object?', a: 'JSON.parse()', b: 'JSON.stringify()', c: 'JSON.convert()', d: 'JSON.toObject()', correct: 'a', difficulty: 'medium' },
        { q: 'What is the scope of a variable declared with let?', a: 'Global', b: 'Function', c: 'Block', d: 'Module', correct: 'c', difficulty: 'medium' },
        { q: 'Which ES6 feature allows default parameter values?', a: 'Arrow functions', b: 'Template literals', c: 'Default parameters', d: 'Destructuring', correct: 'c', difficulty: 'medium' }
    ],
    'PHP': [
        { q: 'What does PHP stand for?', a: 'Personal Home Page', b: 'PHP: Hypertext Preprocessor', c: 'Private Home Page', d: 'Public Hypertext Processor', correct: 'b', difficulty: 'easy' },
        { q: 'Which symbol is used to access a property of an object in PHP?', a: '.', b: '->', c: '::', d: '/', correct: 'b', difficulty: 'easy' },
        { q: 'How do you start a PHP code block?', a: '<php>', b: '<?php', c: '<script>', d: '<%', correct: 'b', difficulty: 'easy' },
        { q: 'Which function is used to include a file in PHP?', a: 'include()', b: 'require()', c: 'import()', d: 'Both A and B', correct: 'd', difficulty: 'easy' },
        { q: 'What is the correct way to create a variable in PHP?', a: 'var $name', b: '$name', c: 'variable name', d: 'v $name', correct: 'b', difficulty: 'easy' },
        { q: 'Which operator is used to concatenate strings in PHP?', a: '+', b: '&', c: '.', d: ',', correct: 'c', difficulty: 'easy' },
        { q: 'How do you get information from a form using PHP?', a: '$_GET or $_POST', b: 'request.form', c: '$form', d: 'get_form()', correct: 'a', difficulty: 'medium' },
        { q: 'Which function is used to connect to MySQL in PHP?', a: 'mysql_connect()', b: 'mysqli_connect()', c: 'db_connect()', d: 'connect_mysql()', correct: 'b', difficulty: 'medium' },
        { q: 'What does the die() function do?', a: 'Ends the script', b: 'Deletes a file', c: 'Removes a variable', d: 'Closes connection', correct: 'a', difficulty: 'easy' },
        { q: 'Which function checks if a variable is set?', a: 'is_set()', b: 'isset()', c: 'var_exists()', d: 'defined()', correct: 'b', difficulty: 'easy' },
        { q: 'How do you create an array in PHP?', a: 'array()', b: '[]', c: 'Both A and B', d: 'new Array()', correct: 'c', difficulty: 'easy' },
        { q: 'Which function is used to count array elements?', a: 'count()', b: 'length()', c: 'size()', d: 'sizeof()', correct: 'a', difficulty: 'easy' },
        { q: 'What is the default file extension for PHP files?', a: '.html', b: '.ph', c: '.php', d: '.xml', correct: 'c', difficulty: 'easy' },
        { q: 'Which superglobal contains session variables?', a: '$_SESSION', b: '$SESSION', c: '$_COOKIE', d: '$_SERVER', correct: 'a', difficulty: 'medium' },
        { q: 'How do you start a session in PHP?', a: 'session_start()', b: 'start_session()', c: 'session_begin()', d: 'begin_session()', correct: 'a', difficulty: 'easy' },
        { q: 'Which function is used to send email in PHP?', a: 'send_mail()', b: 'mail()', c: 'email()', d: 'sendmail()', correct: 'b', difficulty: 'medium' },
        { q: 'What does PDO stand for in PHP?', a: 'PHP Data Objects', b: 'Personal Data Object', c: 'Public Database Operation', d: 'PHP Database Output', correct: 'a', difficulty: 'medium' },
        { q: 'Which function is used to redirect to another page?', a: 'redirect()', b: 'header()', c: 'location()', d: 'goto()', correct: 'b', difficulty: 'medium' },
        { q: 'How do you create a constant in PHP?', a: 'const NAME', b: 'define("NAME", value)', c: '$CONSTANT = value', d: 'Both A and B', correct: 'd', difficulty: 'medium' },
        { q: 'Which function converts a string to lowercase?', a: 'lowercase()', b: 'strtolower()', c: 'tolower()', d: 'lower()', correct: 'b', difficulty: 'easy' }
    ],
    'Node.js': [
        { q: 'What is Node.js?', a: 'A framework', b: 'A library', c: 'A runtime environment', d: 'A database', correct: 'c', difficulty: 'easy' },
        { q: 'Which engine does Node.js use?', a: 'Spider Monkey', b: 'V8', c: 'Chakra', d: 'JavaScriptCore', correct: 'b', difficulty: 'easy' },
        { q: 'What is npm?', a: 'Node Package Manager', b: 'New Programming Module', c: 'Node Programming Method', d: 'Network Package Manager', correct: 'a', difficulty: 'easy' },
        { q: 'Which method is used to include modules in Node.js?', a: 'include()', b: 'import()', c: 'require()', d: 'use()', correct: 'c', difficulty: 'easy' },
        { q: 'What does the fs module in Node.js do?', a: 'File system operations', b: 'Full stack operations', c: 'Fast server operations', d: 'Function storage', correct: 'a', difficulty: 'easy' },
        { q: 'Which method creates a server in Node.js?', a: 'http.createServer()', b: 'server.create()', c: 'http.newServer()', d: 'createServer()', correct: 'a', difficulty: 'medium' },
        { q: 'What is Express.js?', a: 'A database', b: 'A web framework', c: 'A templating engine', d: 'A testing tool', correct: 'b', difficulty: 'easy' },
        { q: 'Which command installs a package globally?', a: 'npm install -g', b: 'npm global install', c: 'npm add -g', d: 'npm get -g', correct: 'a', difficulty: 'easy' },
        { q: 'What is middleware in Express?', a: 'A database layer', b: 'Functions that execute during request-response cycle', c: 'A routing method', d: 'A template engine', correct: 'b', difficulty: 'medium' },
        { q: 'Which method reads a file asynchronously?', a: 'fs.read()', b: 'fs.readFile()', c: 'fs.readFileSync()', d: 'fs.open()', correct: 'b', difficulty: 'medium' },
        { q: 'What is the purpose of package.json?', a: 'Store data', b: 'Manage dependencies', c: 'Configure server', d: 'Define routes', correct: 'b', difficulty: 'easy' },
        { q: 'Which core module handles URL operations?', a: 'url', b: 'http', c: 'path', d: 'query', correct: 'a', difficulty: 'medium' },
        { q: 'How do you export a module in Node.js?', a: 'export.module', b: 'module.exports', c: 'exports.module', d: 'export.default', correct: 'b', difficulty: 'easy' },
        { q: 'What is the event loop in Node.js?', a: 'A loop statement', b: 'Handles async operations', c: 'A for loop', d: 'An error handler', correct: 'b', difficulty: 'medium' },
        { q: 'Which method listens for HTTP requests?', a: 'server.listen()', b: 'server.start()', c: 'server.run()', d: 'server.begin()', correct: 'a', difficulty: 'easy' },
        { q: 'What does REPL stand for?', a: 'Read Eval Print Loop', b: 'Run Execute Print Loop', c: 'Read Execute Process Loop', d: 'Run Eval Print Line', correct: 'a', difficulty: 'medium' },
        { q: 'Which method sends a response to client?', a: 'res.send()', b: 'response.send()', c: 'send.response()', d: 'res.write()', correct: 'a', difficulty: 'easy' },
        { q: 'What is cluster in Node.js?', a: 'A database cluster', b: 'Multiple Node processes', c: 'A server group', d: 'A module bundler', correct: 'b', difficulty: 'hard' },
        { q: 'Which module is used for path operations?', a: 'fs', b: 'url', c: 'path', d: 'dir', correct: 'c', difficulty: 'easy' },
        { q: 'What is callback hell?', a: 'A debugging tool', b: 'Nested callbacks', c: 'Error handling', d: 'A design pattern', correct: 'b', difficulty: 'medium' }
    ],
    'React': [
        { q: 'What is React?', a: 'A framework', b: 'A library', c: 'A language', d: 'A database', correct: 'b', difficulty: 'easy' },
        { q: 'Which company developed React?', a: 'Google', b: 'Facebook', c: 'Microsoft', d: 'Twitter', correct: 'b', difficulty: 'easy' },
        { q: 'What is JSX?', a: 'JavaScript Extension', b: 'JavaScript XML', c: 'Java Syntax', d: 'JSON Extension', correct: 'b', difficulty: 'easy' },
        { q: 'Which method is used to create components?', a: 'React.createComponent()', b: 'React.component()', c: 'function or class', d: 'React.make()', correct: 'c', difficulty: 'easy' },
        { q: 'What is the virtual DOM?', a: 'A copy of real DOM', b: 'A database', c: 'A framework', d: 'A testing tool', correct: 'a', difficulty: 'medium' },
        { q: 'Which hook manages state in functional components?', a: 'useState', b: 'useEffect', c: 'useContext', d: 'useReducer', correct: 'a', difficulty: 'easy' },
        { q: 'What is props in React?', a: 'Properties passed to components', b: 'A state manager', c: 'A lifecycle method', d: 'A routing method', correct: 'a', difficulty: 'easy' },
        { q: 'How do you handle events in React?', a: 'onclick', b: 'onClick', c: 'onPress', d: 'addEventListener', correct: 'b', difficulty: 'easy' },
        { q: 'What is the purpose of keys in React lists?', a: 'Styling', b: 'Unique identification', c: 'Sorting', d: 'Filtering', correct: 'b', difficulty: 'medium' },
        { q: 'Which hook is used for side effects?', a: 'useState', b: 'useEffect', c: 'useMemo', d: 'useCallback', correct: 'b', difficulty: 'easy' },
        { q: 'What is React Router?', a: 'A state manager', b: 'A routing library', c: 'A component library', d: 'A testing tool', correct: 'b', difficulty: 'easy' },
        { q: 'What is Redux?', a: 'A state management library', b: 'A routing tool', c: 'A testing framework', d: 'A component library', correct: 'a', difficulty: 'medium' },
        { q: 'Which method is called after a component mounts?', a: 'componentWillMount', b: 'componentDidMount', c: 'componentWillUpdate', d: 'componentDidUpdate', correct: 'b', difficulty: 'medium' },
        { q: 'What are controlled components?', a: 'Components with state', b: 'Form inputs controlled by React state', c: 'Parent components', d: 'Stateless components', correct: 'b', difficulty: 'medium' },
        { q: 'What is the purpose of useCallback?', a: 'Memoize functions', b: 'Handle callbacks', c: 'Create effects', d: 'Manage state', correct: 'a', difficulty: 'hard' },
        { q: 'What does React.Fragment do?', a: 'Creates a component', b: 'Groups elements without extra DOM node', c: 'Handles errors', d: 'Manages state', correct: 'b', difficulty: 'medium' },
        { q: 'Which command creates a new React app?', a: 'npm create react', b: 'create-react-app', c: 'npx create-react-app', d: 'npm init react', correct: 'c', difficulty: 'easy' },
        { q: 'What is prop drilling?', a: 'Passing props through multiple levels', b: 'A debugging technique', c: 'A state pattern', d: 'An optimization method', correct: 'a', difficulty: 'medium' },
        { q: 'What is the Context API used for?', a: 'Routing', b: 'State management across components', c: 'Styling', d: 'Testing', correct: 'b', difficulty: 'medium' },
        { q: 'What are Higher Order Components?', a: 'Components that return components', b: 'Parent components', c: 'Class components', d: 'Functional components', correct: 'a', difficulty: 'hard' }
    ],
    'C': [
        { q: 'Who is the creator of C language?', a: 'Dennis Ritchie', b: 'Bjarne Stroustrup', c: 'James Gosling', d: 'Guido van Rossum', correct: 'a', difficulty: 'easy' },
        { q: 'Which header file is used for input/output operations?', a: 'stdlib.h', b: 'stdio.h', c: 'math.h', d: 'string.h', correct: 'b', difficulty: 'easy' },
        { q: 'What is the size of int data type?', a: '1 byte', b: '2 bytes', c: '4 bytes', d: 'Depends on compiler', correct: 'd', difficulty: 'medium' },
        { q: 'Which function is used to allocate memory dynamically?', a: 'malloc()', b: 'alloc()', c: 'new()', d: 'allocate()', correct: 'a', difficulty: 'medium' },
        { q: 'What is a pointer in C?', a: 'A variable that stores address', b: 'A function', c: 'A data type', d: 'An operator', correct: 'a', difficulty: 'easy' },
        { q: 'Which operator is used to access structure members?', a: '->', b: '.', c: '::', d: 'Both A and B', correct: 'd', difficulty: 'medium' },
        { q: 'What is the return type of main function?', a: 'void', b: 'int', c: 'char', d: 'float', correct: 'b', difficulty: 'easy' },
        { q: 'Which loop is guaranteed to execute at least once?', a: 'for', b: 'while', c: 'do-while', d: 'None', correct: 'c', difficulty: 'easy' },
        { q: 'What is the purpose of the break statement?', a: 'Exit from loop', b: 'Skip iteration', c: 'Return from function', d: 'Stop program', correct: 'a', difficulty: 'easy' },
        { q: 'Which function is used to copy strings?', a: 'strcpy()', b: 'strcat()', c: 'strcmp()', d: 'strlen()', correct: 'a', difficulty: 'easy' },
        { q: 'What does NULL represent?', a: 'Zero', b: 'Empty string', c: 'Null pointer', d: 'Undefined', correct: 'c', difficulty: 'easy' },
        { q: 'Which keyword is used to define constants?', a: 'const', b: 'constant', c: 'define', d: '#define', correct: 'a', difficulty: 'easy' },
        { q: 'What is the difference between ++i and i++?', a: 'No difference', b: 'Pre and post increment', c: 'Speed', d: 'Syntax only', correct: 'b', difficulty: 'medium' },
        { q: 'Which function frees allocated memory?', a: 'free()', b: 'delete()', c: 'remove()', d: 'clear()', correct: 'a', difficulty: 'easy' },
        { q: 'What is a structure in C?', a: 'A loop', b: 'User-defined data type', c: 'A function', d: 'A pointer', correct: 'b', difficulty: 'easy' },
        { q: 'Which operator has highest precedence?', a: '+', b: '*', c: '()', d: '[]', correct: 'c', difficulty: 'medium' },
        { q: 'What is recursion?', a: 'Loop', b: 'Function calling itself', c: 'Nested function', d: 'Iteration', correct: 'b', difficulty: 'easy' },
        { q: 'What is the purpose of sizeof operator?', a: 'Calculate size in bytes', b: 'Compare sizes', c: 'Allocate memory', d: 'Free memory', correct: 'a', difficulty: 'easy' },
        { q: 'Which storage class has global scope?', a: 'auto', b: 'static', c: 'extern', d: 'register', correct: 'c', difficulty: 'medium' },
        { q: 'What is a dangling pointer?', a: 'Null pointer', b: 'Pointer to freed memory', c: 'Void pointer', d: 'Constant pointer', correct: 'b', difficulty: 'hard' }
    ],
    'C++': [
        { q: 'Who developed C++?', a: 'Dennis Ritchie', b: 'Bjarne Stroustrup', c: 'James Gosling', d: 'Ken Thompson', correct: 'b', difficulty: 'easy' },
        { q: 'What is the extension of C++ files?', a: '.c', b: '.cpp', c: '.cp', d: '.cxx', correct: 'b', difficulty: 'easy' },
        { q: 'Which header file is used for cout and cin?', a: 'stdio.h', b: 'stdlib.h', c: 'iostream', d: 'conio.h', correct: 'c', difficulty: 'easy' },
        { q: 'What is a class in C++?', a: 'A function', b: 'A blueprint for objects', c: 'A variable', d: 'A loop', correct: 'b', difficulty: 'easy' },
        { q: 'Which concept allows a class to inherit from another?', a: 'Polymorphism', b: 'Encapsulation', c: 'Inheritance', d: 'Abstraction', correct: 'c', difficulty: 'easy' },
        { q: 'What is a constructor?', a: 'Destroys object', b: 'Initializes object', c: 'Copies object', d: 'Deletes object', correct: 'b', difficulty: 'easy' },
        { q: 'What is the purpose of destructor?', a: 'Create object', b: 'Clean up resources', c: 'Initialize variables', d: 'Copy object', correct: 'b', difficulty: 'easy' },
        { q: 'Which operator is used for dynamic memory allocation?', a: 'malloc', b: 'alloc', c: 'new', d: 'create', correct: 'c', difficulty: 'easy' },
        { q: 'What is operator overloading?', a: 'Creating new operators', b: 'Using operators multiple times', c: 'Redefining operator behavior', d: 'Loading operators', correct: 'c', difficulty: 'medium' },
        { q: 'What is a virtual function?', a: 'Abstract function', b: 'Function that can be overridden', c: 'Static function', d: 'Inline function', correct: 'b', difficulty: 'medium' },
        { q: 'What is polymorphism?', a: 'Multiple forms', b: 'Data hiding', c: 'Code reuse', d: 'Memory management', correct: 'a', difficulty: 'medium' },
        { q: 'Which access specifier is most restrictive?', a: 'public', b: 'protected', c: 'private', d: 'static', correct: 'c', difficulty: 'easy' },
        { q: 'What is encapsulation?', a: 'Code repetition', b: 'Data hiding', c: 'Memory allocation', d: 'Function overloading', correct: 'b', difficulty: 'easy' },
        { q: 'What is a pure virtual function?', a: 'Function with no body', b: 'Function = 0', c: 'Virtual function', d: 'Static function', correct: 'b', difficulty: 'medium' },
        { q: 'What is STL?', a: 'Standard Template Library', b: 'System Type Library', c: 'String Template Library', d: 'Static Template Library', correct: 'a', difficulty: 'easy' },
        { q: 'Which container in STL is FIFO?', a: 'stack', b: 'queue', c: 'vector', d: 'list', correct: 'b', difficulty: 'medium' },
        { q: 'What is a friend function?', a: 'Member function', b: 'Function that accesses private members', c: 'Static function', d: 'Virtual function', correct: 'b', difficulty: 'medium' },
        { q: 'What is the diamond problem?', a: 'Memory issue', b: 'Multiple inheritance ambiguity', c: 'Pointer problem', d: 'Constructor issue', correct: 'b', difficulty: 'hard' },
        { q: 'What is RAII?', a: 'Resource Acquisition Is Initialization', b: 'Random Access Instant Interface', c: 'Runtime Allocation In Initialization', d: 'Reference And Inheritance Interface', correct: 'a', difficulty: 'hard' },
        { q: 'What is the difference between delete and delete[]?', a: 'No difference', b: 'delete for single object, delete[] for arrays', c: 'Speed', d: 'Syntax only', correct: 'b', difficulty: 'medium' }
    ],
    'Python': [
        { q: 'Who created Python?', a: 'Guido van Rossum', b: 'Dennis Ritchie', c: 'Bjarne Stroustrup', d: 'James Gosling', correct: 'a', difficulty: 'easy' },
        { q: 'Which keyword is used to define a function?', a: 'function', b: 'def', c: 'func', d: 'define', correct: 'b', difficulty: 'easy' },
        { q: 'How do you start a comment in Python?', a: '//', b: '/*', c: '#', d: '<!--', correct: 'c', difficulty: 'easy' },
        { q: 'Which data type is mutable?', a: 'tuple', b: 'string', c: 'list', d: 'int', correct: 'c', difficulty: 'easy' },
        { q: 'What is the output of print(type([]))?', a: '<class \'list\'>', b: '<class \'array\'>', c: '<class \'tuple\'>', d: '<class \'dict\'>', correct: 'a', difficulty: 'medium' },
        { q: 'Which method adds an element to a list?', a: 'add()', b: 'append()', c: 'insert()', d: 'push()', correct: 'b', difficulty: 'easy' },
        { q: 'What is a lambda function?', a: 'Named function', b: 'Anonymous function', c: 'Class method', d: 'Built-in function', correct: 'b', difficulty: 'medium' },
        { q: 'Which module is used for regular expressions?', a: 'regex', b: 're', c: 'regexp', d: 'reg', correct: 'b', difficulty: 'easy' },
        { q: 'What is self in Python?', a: 'A keyword', b: 'Instance reference', c: 'A function', d: 'A variable', correct: 'b', difficulty: 'easy' },
        { q: 'How do you create a dictionary?', a: '[]', b: '()', c: '{}', d: '<>', correct: 'c', difficulty: 'easy' },
        { q: 'What is PEP 8?', a: 'Python version', b: 'Style guide', c: 'Package manager', d: 'Error code', correct: 'b', difficulty: 'medium' },
        { q: 'Which keyword is used for exception handling?', a: 'catch', b: 'except', c: 'error', d: 'handle', correct: 'b', difficulty: 'easy' },
        { q: 'What is the output of 3 ** 2?', a: '6', b: '9', c: '5', d: 'Error', correct: 'b', difficulty: 'easy' },
        { q: 'What is a decorator in Python?', a: 'Design pattern', b: 'Function that modifies another function', c: 'Class method', d: 'Built-in function', correct: 'b', difficulty: 'medium' },
        { q: 'Which method converts string to lowercase?', a: 'lower()', b: 'toLower()', c: 'lowercase()', d: 'caseLower()', correct: 'a', difficulty: 'easy' },
        { q: 'What is __init__ in Python?', a: 'Destructor', b: 'Constructor', c: 'Class method', d: 'Static method', correct: 'b', difficulty: 'easy' },
        { q: 'What is list comprehension?', a: 'List method', b: 'Concise way to create lists', c: 'List sorting', d: 'List iteration', correct: 'b', difficulty: 'medium' },
        { q: 'Which module is used to work with JSON?', a: 'json', b: 'jsonlib', c: 'simplejson', d: 'jsonparser', correct: 'a', difficulty: 'easy' },
        { q: 'What is the Global Interpreter Lock (GIL)?', a: 'Security feature', b: 'Mutex for thread safety', c: 'Error handler', d: 'Memory manager', correct: 'b', difficulty: 'hard' },
        { q: 'What is the difference between is and ==?', a: 'No difference', b: 'is checks identity, == checks equality', c: 'Speed', d: 'Syntax only', correct: 'b', difficulty: 'medium' }
    ],
    'Java': [
        { q: 'Who developed Java?', a: 'Dennis Ritchie', b: 'James Gosling', c: 'Bjarne Stroustrup', d: 'Guido van Rossum', correct: 'b', difficulty: 'easy' },
        { q: 'What is the extension of Java files?', a: '.jv', b: '.java', c: '.class', d: '.jar', correct: 'b', difficulty: 'easy' },
        { q: 'Which company originally developed Java?', a: 'Microsoft', b: 'Sun Microsystems', c: 'Oracle', d: 'IBM', correct: 'b', difficulty: 'easy' },
        { q: 'What is JVM?', a: 'Java Virtual Machine', b: 'Java Visual Method', c: 'Java Variable Manager', d: 'Java Version Manager', correct: 'a', difficulty: 'easy' },
        { q: 'Which keyword is used to inherit a class?', a: 'inherits', b: 'extends', c: 'implements', d: 'inherit', correct: 'b', difficulty: 'easy' },
        { q: 'What is the default value of boolean variable?', a: 'true', b: 'false', c: '0', d: 'null', correct: 'b', difficulty: 'easy' },
        { q: 'Which method is the entry point of Java program?', a: 'start()', b: 'run()', c: 'main()', d: 'execute()', correct: 'c', difficulty: 'easy' },
        { q: 'What is encapsulation?', a: 'Code reuse', b: 'Data hiding', c: 'Multiple forms', d: 'Memory management', correct: 'b', difficulty: 'easy' },
        { q: 'Which access modifier is most restrictive?', a: 'public', b: 'protected', c: 'private', d: 'default', correct: 'c', difficulty: 'easy' },
        { q: 'What is an interface?', a: 'A class', b: 'Abstract type with method signatures', c: 'A package', d: 'A variable', correct: 'b', difficulty: 'medium' },
        { q: 'What is the purpose of final keyword?', a: 'End program', b: 'Make constant', c: 'Delete object', d: 'Close file', correct: 'b', difficulty: 'easy' },
        { q: 'Which exception is thrown when dividing by zero?', a: 'NullPointerException', b: 'ArithmeticException', c: 'DivideByZeroException', d: 'MathException', correct: 'b', difficulty: 'medium' },
        { q: 'What is polymorphism?', a: 'Data hiding', b: 'Code reuse', c: 'Multiple forms', d: 'Single form', correct: 'c', difficulty: 'easy' },
        { q: 'Which collection maintains insertion order?', a: 'HashSet', b: 'TreeSet', c: 'LinkedHashSet', d: 'Set', correct: 'c', difficulty: 'medium' },
        { q: 'What is a constructor?', a: 'Destroys object', b: 'Initializes object', c: 'Copies object', d: 'Deletes object', correct: 'b', difficulty: 'easy' },
        { q: 'What is the difference between == and equals()?', a: 'No difference', b: '== for reference, equals() for content', c: 'Speed', d: 'Syntax only', correct: 'b', difficulty: 'medium' },
        { q: 'What is a package in Java?', a: 'A class', b: 'Namespace for classes', c: 'A method', d: 'A variable', correct: 'b', difficulty: 'easy' },
        { q: 'Which keyword is used to handle exceptions?', a: 'try-catch', b: 'error-handle', c: 'exception', d: 'handle', correct: 'a', difficulty: 'easy' },
        { q: 'What is garbage collection?', a: 'Manual memory management', b: 'Automatic memory management', c: 'Disk cleanup', d: 'Code optimization', correct: 'b', difficulty: 'medium' },
        { q: 'What is the super keyword used for?', a: 'Create object', b: 'Access parent class', c: 'Delete object', d: 'Define class', correct: 'b', difficulty: 'easy' }
    ],
    'MySQL': [
        { q: 'What does SQL stand for?', a: 'Structured Query Language', b: 'Simple Query Language', c: 'Standard Question Language', d: 'System Query Language', correct: 'a', difficulty: 'easy' },
        { q: 'Which command is used to create a database?', a: 'CREATE DB', b: 'NEW DATABASE', c: 'CREATE DATABASE', d: 'MAKE DATABASE', correct: 'c', difficulty: 'easy' },
        { q: 'Which clause is used to filter results?', a: 'FILTER', b: 'WHERE', c: 'HAVING', d: 'SELECT', correct: 'b', difficulty: 'easy' },
        { q: 'What does SELECT * FROM table do?', a: 'Selects all columns', b: 'Deletes all rows', c: 'Updates all rows', d: 'Creates new table', correct: 'a', difficulty: 'easy' },
        { q: 'Which command is used to add data?', a: 'ADD', b: 'INSERT', c: 'PUT', d: 'CREATE', correct: 'b', difficulty: 'easy' },
        { q: 'What is a primary key?', a: 'First column', b: 'Unique identifier', c: 'Foreign key', d: 'Index', correct: 'b', difficulty: 'easy' },
        { q: 'Which command deletes all rows from a table?', a: 'DELETE', b: 'TRUNCATE', c: 'DROP', d: 'REMOVE', correct: 'b', difficulty: 'medium' },
        { q: 'What is a foreign key?', a: 'Primary key', b: 'Reference to another table', c: 'Unique key', d: 'Index', correct: 'b', difficulty: 'easy' },
        { q: 'Which clause orders results?', a: 'SORT BY', b: 'ORDER', c: 'ORDER BY', d: 'SORT', correct: 'c', difficulty: 'easy' },
        { q: 'What does JOIN do?', a: 'Combines tables', b: 'Splits tables', c: 'Deletes tables', d: 'Creates tables', correct: 'a', difficulty: 'easy' },
        { q: 'Which function returns number of rows?', a: 'COUNT()', b: 'SUM()', c: 'NUM()', d: 'TOTAL()', correct: 'a', difficulty: 'easy' },
        { q: 'What is GROUP BY used for?', a: 'Sorting', b: 'Filtering', c: 'Grouping rows', d: 'Joining tables', correct: 'c', difficulty: 'medium' },
        { q: 'Which command modifies existing data?', a: 'MODIFY', b: 'CHANGE', c: 'UPDATE', d: 'ALTER', correct: 'c', difficulty: 'easy' },
        { q: 'What is an index?', a: 'Primary key', b: 'Performance optimization structure', c: 'Foreign key', d: 'Table name', correct: 'b', difficulty: 'medium' },
        { q: 'Which operator checks for NULL?', a: '= NULL', b: 'IS NULL', c: '== NULL', d: 'NULL', correct: 'b', difficulty: 'easy' },
        { q: 'What does DISTINCT do?', a: 'Removes duplicates', b: 'Adds duplicates', c: 'Counts rows', d: 'Sorts rows', correct: 'a', difficulty: 'easy' },
        { q: 'Which JOIN returns all rows from both tables?', a: 'INNER JOIN', b: 'LEFT JOIN', c: 'RIGHT JOIN', d: 'FULL OUTER JOIN', correct: 'd', difficulty: 'medium' },
        { q: 'What is a view?', a: 'Physical table', b: 'Virtual table', c: 'Index', d: 'Database', correct: 'b', difficulty: 'medium' },
        { q: 'Which function returns current date?', a: 'NOW()', b: 'DATE()', c: 'CURDATE()', d: 'TODAY()', correct: 'c', difficulty: 'medium' },
        { q: 'What is normalization?', a: 'Data backup', b: 'Database design technique', c: 'Query optimization', d: 'Index creation', correct: 'b', difficulty: 'medium' }
    ]
};

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Create tables
        await createTables();

        // Create default admin account
        console.log('👤 Creating default admin account...');
        const adminPassword = await bcrypt.hash('admin123', 10);
        try {
            await User.create('admin', 'admin@quiz.com', adminPassword, 'admin');
            console.log('✅ Admin account created (username: admin, password: admin123)\n');
        } catch (error) {
            console.log('⚠️  Admin account already exists\n');
        }

        // Seed topics
        console.log('📚 Seeding topics...');
        for (const topic of topics) {
            try {
                const existing = await Topic.findByName(topic.name);
                if (!existing) {
                    await Topic.create(topic.name, topic.description, topic.icon);
                    console.log(`   ✓ Added topic: ${topic.icon} ${topic.name}`);
                } else {
                    console.log(`   - Topic already exists: ${topic.name}`);
                }
            } catch (error) {
                console.log(`   ✗ Error adding topic ${topic.name}`);
            }
        }

        // Seed questions
        console.log('\n📝 Seeding questions...');
        for (const [topicName, topicQuestions] of Object.entries(questions)) {
            const topic = await Topic.findByName(topicName);
            if (!topic) {
                console.log(`   ✗ Topic not found: ${topicName}`);
                continue;
            }

            const existingCount = await Question.countByTopic(topic.id);
            if (existingCount > 0) {
                console.log(`   - ${topicName}: ${existingCount} questions already exist`);
                continue;
            }

            for (const q of topicQuestions) {
                await Question.create(
                    topic.id,
                    q.q,
                    q.a,
                    q.b,
                    q.c,
                    q.d,
                    q.correct,
                    q.difficulty
                );
            }
            console.log(`   ✓ ${topicName}: Added ${topicQuestions.length} questions`);
        }

        console.log('\n✅ Database seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   - Topics: ${topics.length}`);
        console.log(`   - Questions: ${Object.values(questions).reduce((sum, arr) => sum + arr.length, 0)}`);
        console.log('\n🚀 You can now start the server with: npm start');
        
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error seeding database:', error.message);
        process.exit(1);
    }
};

seedDatabase();
