const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

morgan.token('body', (req, res) => {
    return req.body ? JSON.stringify(req.body) : '';
});

app.use(express.json());
app.use(cors());
app.use(express.static('build'));
app.use(morgan('tiny'));
app.use(morgan(':body'));

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
];

const generateID = () => {
    return Math.floor(Math.random() * 10000);
}

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.post('/api/persons', (req, res) => {
    if (!(req.body.name && req.body.number)) {
        return res.status(400).json({
            error: 'Person must have name and number'
        });
    }
    if (persons.map(p => p.name).includes(req.body.name)) {
        return res.status(400).json({
            error: 'Name must be unique'
        });
    }
    const newPerson = req.body;
    newPerson.id = generateID();
    persons = persons.concat(newPerson);
    res.json(newPerson);
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = persons.find(p => p.id === parseInt(id));
    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    persons = persons.filter(p => p.id !== parseInt(id));
    res.status(204).end();
});

app.get('/info', (req, res) => {
    const datetime = new Date(Date.now());
    res.send(`<p>Phonebook has info for ${persons.length} people.</p>
    <p>${datetime.toString()}</p>`);
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});