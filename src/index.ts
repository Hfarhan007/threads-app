import express from "express";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import http from 'http';

async function init() {
    const app = express();
    const httpServer = http.createServer(app); // Create HTTP server instance

    const PORT = Number(process.env.PORT) || 4000;

    app.use(express.json());

    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
                say(name: String): String
            }
        `,
        resolvers: {
            Query: {
                hello: () => `Hey there, I am a graphql server`,
                say: (_, { name }: {name:string}) => `Hey ${name}, How are you?` // Added missing backtick and fixed destructuring
            }
        }
    });

    await gqlServer.start();

    app.get('/', (req, res) => {
        res.json({ message: 'Server is up and running' });
    });

    // Apply middleware for GraphQL
    app.use('/graphql', expressMiddleware(gqlServer));

    httpServer.listen(PORT, () => {
        console.log(`Server started at PORT: ${PORT}`);
    });
}

init();
