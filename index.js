const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(cors());

app.use(express.json());

app.use(morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body)
    ].join(' ')
  }))
  
let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
})

app.get("/api/persons", (request, response) => {
    response.json(persons);
})

app.get("/info", (request, response) => {
    const date = new Date();
    const info = "Phonebook has info for " +persons.length+ " people <br>" +date;
    response.send(info);
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
    if (person) {
        response.json(person);
    }
    else {
        response.status(404).end();
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.filter(person => person.id !== id)
    response.status(204).end();
})

app.post('/api/persons', (request, response) => {
    const body = request.body;
    const name = body.name;
    const number = body.number;

    if (!name || !number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    const isUniqueArray = persons.filter(person => person.name === name);
    if (isUniqueArray.length !== 0) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    const person = {
        id: Math.floor(Math.random() * 1000),
        name,
        number
    };

    persons = persons.concat(person);
    response.json(person);
})


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});