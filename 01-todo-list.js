const todos = [
  "Get milk",
  "Wash car",
  "Walk dog",
];

function addTodo(todo) {
  todos.push(todo);
}

function removeTodo(idx) {
  if (!todos[idx]) throw new Error(`No todo at index ${idx}!`);
  todos.splice(idx, 1);
}

function updateTodo(idx, newText) {
  if (!todos[idx]) throw new Error(`No todo at index ${idx}!`);
  todos[idx] = newText;
}

function viewTodos() {
  return `<h1>Todos:</h1>
  <ul>
  ${todos.map((todo, idx) => `
    <li>
      ${todo} [${idx}]
      <form method='POST' action='/todos/${idx}/delete'>
        <button>🚮</button>
      </form>
      <form method='POST' action='/todos/${idx}'>
        <input name='newValue'>
        <button>✏️</button>
      </form>
    </li>
  `).join('\n')}
  </ul>

  <p>Add Todo:</p>
  <form method='POST' action='/todos'>
    <input name='newValue'>
    <button>✚</button>
  </form>
  `;
}

const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));

/*

A reasonable routing plan:

Todos:

GET /addTodo
GET /removeTodo/:id
GET /updateTodo/:id
GET /viewTodos


The RESTful routing plan:

GET /todos -> Browse your Todos
POST /todos -> Add a Todo
GET /todos/:id -> Look at a particular Todo
POST /todos/:id -> Update a particular Todo
POST /todos/:id/delete -> Delete a particular todo

GET /users -> Browse your users
POST /users -> Add a User
GET /users/:id -> Look at a particular User
POST /users/:id -> Update a particular User
POST /users/:id/delete -> Delete a particular User

GET /posts -> Browse your posts
POST /posts -> Add a Post
GET /posts/:id -> Look at a particular Post
POST /posts/:id -> Update a particular Post
POST /posts/:id/delete -> Delete a particular Post

GET /tweets -> Browse your tweets
POST /tweets -> Add a Tweet
GET /tweets/:id -> Look at a particular Tweet
POST /tweets/:id -> Update a particular Tweet
POST /tweets/:id/delete -> Delete a particular Tweet

CRUD - Create Read Update Delete
BREAD - Browse Read Edit Add Delete

*/

app.post('/todos', (request, response) => { addTodo(request.body.newValue); response.redirect('/todos') });
app.post('/todos/:id/delete', (request, response) => { removeTodo(request.params.id); response.redirect('/todos'); });
app.post('/todos/:id', (request, response) => { updateTodo(request.params.id, request.body.newValue); response.redirect('/todos'); });
app.get('/todos', (request, response) => { response.send(viewTodos()); });

app.listen(PORT, () => { console.log('I think the server is actually listening on port ' + PORT) });
