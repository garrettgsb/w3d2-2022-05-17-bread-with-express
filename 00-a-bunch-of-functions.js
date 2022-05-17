const fs = require('fs');

function readCounter() { return Number(fs.readFileSync('./counter')); }
function writeCounter(value) { return fs.writeFileSync('./counter', value);  }

function increment() { writeCounter(readCounter() + 1); }
function decrement() { writeCounter(readCounter() - 1); }
function setTo(value) { writeCounter(Number(value)); }
function reset() { setTo(0); }


// Mapping between Javascript functions and command line interface
{
  const [_interpreter, _file, operation, value] = process.argv;
  if (operation === 'increment') { increment(); console.log(`After ${operation}: ${readCounter()}`)}
  else if (operation === 'decrement') { decrement(); console.log(`After ${operation}: ${readCounter()}`)}
  else if (operation === 'set') { setTo(value); console.log(`After ${operation}: ${readCounter()}`)}
  else if (operation === 'reset') { reset(); console.log(`After ${operation}: ${readCounter()}`)}
  else { console.log(`Count is: ${readCounter()}`) }
}

//Mapping between Javascript functions and HTTP interface
{
  const express = require('express');
  const app = express();
  const PORT = 3000;

  app.get('/', (request, response) => { response.send(`
    <h1>Count is: ${readCounter()}</h1>
    <a href='/increment'>Increment</a>
    <a href='/decrement'>Decrement</a>
    <form method='POST' action='/reset'>
      <button>Reset</button>
    </form>
    <form method='GET' action='/set'>
      <input name='newCounterValue'>
      <button>Set</button>
    </form>
  `)});

  app.get('/increment', (request, response) => { increment(); response.redirect('/') });
  app.get('/decrement', (request, response) => { decrement(); response.redirect('/') });
  app.post('/reset', (request, response) => { reset(); response.redirect('/') });
  app.get('/set', (request, response) => {
    const { newCounterValue } = request.query;
    if (newCounterValue) setTo(newCounterValue);
    response.redirect('/');
  });

  app.listen(PORT, () => { console.log(`Listening on ${PORT}!`)});
}
