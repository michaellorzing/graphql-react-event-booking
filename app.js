const express = require('express');
const bodyParser = require('body-parser');
//sets up middleware
const graphqlHttp = require('express-graphql');
//pulls build schema out of the graphql package to build below
const { buildSchema } = require('graphql');


const app = express();

const events = [];

app.use(bodyParser.json());


//single endpoint where everything is sent. The rootquery or rootmutation describe what essentially are object properties of how the data will be shaped. rootquery will return events in the form of strings in an array. the '!' indicates that the returned data can't be null. the schema objects house key value pairs that refer back to the defined rootquery or rootmutation. Mutation uses what looks like a function to "PUT" information and return something.
app.use(
  '/graphql',
  graphqlHttp({
    schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
    }
    
    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
    rootValue: {
      //these match the schema to the resolver functions. looks to run a function upon returning our list of events and "resolve them". Create event is set to an anonymous function that takes in a series of arguments. They get listed in key value pairs based on Event Input type created above. They get pushed to a global nmed event, then returned here. Root Mutation above runs what looks like function that takes in eventInput(named like a standard argument/variable) set to the EventInput schema outlined. It expects to return an Event.
      events: () => {
        return events;
      },
      createEvent: (args) => {
        const event = {
          _id: Math.random().toString(),
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date().toISOString()
        };
        events.push(event)
        return event;
      }
    },
    graphiql: true
  })
);

app.listen(3000)