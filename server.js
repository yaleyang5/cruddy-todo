
// Todo Model //////////////////////////////////////////////////////////////////

// acquire the exported components from ./datastore
const Todo = require('./datastore');

// Configure Express ///////////////////////////////////////////////////////////

const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './public')));

// RESTful Routes for CRUD operations //////////////////////////////////////////

// Create (Crud) -- collection route
// call the method post, an express routing method, passing in an endpoint and a callback. if the endpoint (the route) is correct, invoke the callback
app.post('/todo', (req, res) => {
  // call the method create from the object Todo. Todo was imported from datastore. Pass in the request body text, and a callback
  // the newTodo is the object from .create: { id, text }
  Todo.create(req.body.todoText, (err, newTodo) => {
    if (err) {
      // if the error argument is truthy send 400
      res.sendStatus(400);
    } else {
      // if the error argument is falsey, report status 201 (successful post), and use .json on { id, text } to send a stringified response
      res.status(201).json(newTodo);
    }
  });
});


// call the method 'get'. Pass in the endpoint as the first argument, and a callback as the second argument
// Read all (cRud) -- collection route
app.get('/todo', (req, res) => {
  // if the endpoint is correct, invoke .readAll from Todo. Todos is an array. Each element contains the id and corresponding text.
  Todo.readAll((err, todos) => {
    if (err) {
      res.sendStatus(400);
    } else {
      // report a status of 200 for success, and stringify the array of todos
      res.status(200).json(todos);
    }
  });
});


// invoke the method 'get' with an endpoint of the id of interest, and a callback
// Read one (cRud) -- member route
app.get('/todo/:id', (req, res) => {
  // the callback invokes the readOne method from Todo. Pass in the id of the target text (provided by the url), and a callback. The todo is a single todo object.
  Todo.readOne(req.params.id, (err, todo) => {
    // if the todo exists, stringify and report it.
    if (todo) {
      res.status(200).json(todo);
    } else {
      // otherwise, report 404 for error
      res.sendStatus(404);
    }
  });
});


// invoke the put method with an endpoint of the id of interest, and a callback
// Update (crUd) -- member route
app.put('/todo/:id', (req, res) => {
  // if the endpoint is correct, invoke the method 'update' passing in the id and the text as the first two arguments. Pass in a callback as the third parameter.
  Todo.update(req.params.id, req.body.todoText, (err, todo) => {
    if (todo) {
      // todo is an object of the id and text
      res.status(200).json(todo);
    } else {
      res.sendStatus(404);
    }
  });
});


// invoke the delete method with an endpoint of the target key
// Delete (cruD) -- member route
app.delete('/todo/:id', (req, res) => {
  // invoke the delete method from the Todo object. Pass in the id provided by the url, and a callback with one parameter.
  Todo.delete(req.params.id, (err) => {
    if (err) {
      // if there was an error, report 404
      res.sendStatus(404);
    } else {
      // if the property was successfully deleted, report 204 (no content)
      res.sendStatus(204);
    }
  });
});

// Start & Initialize Web Server ///////////////////////////////////////////////

const port = 3000;
app.listen(port, () => {
  console.log('CRUDdy Todo server is running in the terminal');
  console.log(`To get started, visit: http://localhost:${port}`);
});

// call the initialize method from the object Todo
Todo.initialize();
