if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

morgan.token('body', (req, res) => {
    return req.body ? JSON.stringify(req.body) : '';
});

// Database connection
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI)
    .then(result => {
        console.log('Connected to mongo');
    })
    .catch(err => {
        console.log('Error connecting to mongo', err.message);
    });

app.use(express.json());
app.use(cors());
app.use(express.static('build'));
app.use(morgan('tiny'));
app.use(morgan(':body'));

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons);
    })
});

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'Please make sure to include a name and number'
        });
    }
    const person = new Person({ name: body.name, number: body.number });
    person.save().then(savedPerson => {
        res.json(savedPerson);
    });
})

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Person.findById(id)
        .then(foundPerson => {
            if (foundPerson) {
                res.json(foundPerson);
            } else {
                res.status(404).end();
            }
        })
        .catch(err => next(err));
});

app.put('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    const person = req.body;
    Person.findByIdAndUpdate(id, person, { new: true })
        .then(updatedPerson => res.json(updatedPerson))
        .catch(err => next(err));
});

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Person.findByIdAndRemove(id)
        .then(result => {
            res.status(204).end();
        })
        .catch(err => next(err));
});

app.get('/info', async (req, res) => {
    const datetime = new Date(Date.now());
    const allPersons = await Person.find({});
    res.send(`<p>Phonebook has info for ${allPersons.length} people.</p>
    <p>${datetime.toString()}</p>`);
})

const errorHandler = (err, req, res, next) => {
    console.error(err.message);

    if (err.name === 'CastError') {
        return res.status(400).send({ error: 'malformed object id' });
    }
    next(err);
}

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});