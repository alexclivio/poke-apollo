const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express');
const fetch = require('node-fetch');

const session = require('express-session')

const app = express()

app.use(express.static("public"))

app.set('trust proxy', 1)
app.use(session({
  secret: 'ironman',
  resave: false,
  saveUninitialized: false
}))

app.get('/', (req, res) => {
  res.sendFile(__dirname+'/public/index.html')
})

const typeDefs = gql`
  type Pokemon {
    name: String
    image: String
  }

  type Lesson {
    title: String,
    value: Int
  }

  type User {
    name: String
    image: String
    lessons: [Lesson]
  }

  type Mutation {
    login(pokemon: String!): User
    enrolled(title: String!): [Lesson]
    unenrolled(title: String!): [Lesson]
    setStar(title: String, value: Int): [Lesson]
  }

  type Query {
    pokemons: [Pokemon]
    search(str: String): [Pokemon]
    getPokemon(str: String): Pokemon
    lessons: [Lesson]
    user: User
  }
`

const resolvers = {
  Mutation: {
    login: (_x, args, context) => {
      context.req.session.pokemon = args.pokemon
      return cachePokemonSession[args.pokemon]
    },
    enrolled: (_, args, context) => {
      cachePokemonSession[context.req.session.pokemon].lessons.push({
        title: args.title,
        value: 0
      })
      return cachePokemonSession[context.req.session.pokemon].lessons
    },
    unenrolled: (_, args, context) => {
      cachePokemonSession[context.req.session.pokemon].lessons = cachePokemonSession[context.req.session.pokemon].lessons.filter(lesson => {
        return lesson.title !== args.title
      })
      return cachePokemonSession[context.req.session.pokemon].lessons
    },
    setStar: (_x, args, context) => {
      const lessons = cachePokemonSession[context.req.session.pokemon].lessons
      const index = lessons.findIndex(e => {
        if(e.title === args.title) {
          return true
        }
      })
      lessons[index].value = args.value
      return lessons
    }
  },
  Query: {
    pokemons: ()=> {
      return cachePokemon
    },
    search: (_x, args) => {
      const results = cachePokemon.filter((pokemon) => {
        return pokemon.name.includes(args.str)
      })
      return results
    },
    getPokemon: (_x, args) => {
      if(cachePokemonSession[args.str]) {
        return cachePokemonSession[args.str]
      }
      return fetch(`https://pokeapi.co/api/v2/pokemon/${args.str}`)
      .then((r) => {
        return r.json()
      }).then(data => {
        const results = {
          name: data.name,
          image: data.sprites.front_default,
          lessons: []
        }
        cachePokemonSession[data.name] = results
        return results
      })
    },
    lessons: () => {
      if(cacheLessons) {
        return cacheLessons
      }
    },
    user: (_x, args, context) => {
      if(context.req.session.pokemon) {
        return cachePokemonSession[context.req.session.pokemon]
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return { req } 
  }
})
server.applyMiddleware({ app });

const cachePokemonSession = {}
let cachePokemon = []
let cacheLessons = []

const startApp = async () => {
  const lessons = fetch('https://www.c0d3.com/api/lessons')
    .then((r) => {
      return r.json()
    }).then(data => {
      const results = data.map((lesson) => {
        return {
          title: lesson.title
        }
      })
      cacheLessons = results
    })

  const pokemon = fetch('https://pokeapi.co/api/v2/pokemon?limit=1000')
  .then((r) => {
    return r.json()
  }).then(data => {
    cachePokemon = data.results
  })

  await Promise.all([lessons, pokemon])

  app.listen(3000, () =>
    console.log(`🚀 Server ready at https://localhost:3009${server.graphqlPath}`)
  )
}


startApp()
