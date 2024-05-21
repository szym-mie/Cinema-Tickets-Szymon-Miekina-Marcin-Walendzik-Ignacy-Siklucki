import { Sequelize } from 'sequelize';
import { ModelManager } from './src/ModelManager.mjs';

import MovieModel from './src/model/MovieModel.mjs';
import RoomModel from './src/model/RoomModel.mjs';
import ShowModel from './src/model/ShowModel.mjs';
import TicketModel from './src/model/TicketModel.mjs';
import UserModel from './src/model/UserModel.mjs';
import TicketUserAssoc from './src/assoc/TicketUserAssoc.mjs';
import TicketShowAssoc from './src/assoc/TicketShowAssoc.mjs';
import ShowMovieAssoc from './src/assoc/ShowMovieAssoc.mjs';
import ShowRoomAssoc from './src/assoc/ShowRoomAssoc.mjs';
import Fastify from 'fastify';


// HTTP
const fastify = Fastify({});

fastify.get('/', {}, async (req, res) => {
    // return { hello: '56' };
    res.type('text/html');
    return '<h1>hello</h1>';
});

await fastify.listen({ port: 3000 });


// DB
const db = new Sequelize('cinema', 'postgres', 'zaq1@WSX', {
    host: 'localhost',
    dialect: 'postgres'
});

try {
    await db.authenticate();
    console.log('connected to database');
} catch (error) {
    console.error('cannot connect to database: ', error);
}

const modelManager = new ModelManager()

modelManager.addModel(MovieModel);
modelManager.addModel(RoomModel);
modelManager.addModel(ShowModel);
modelManager.addModel(TicketModel);
modelManager.addModel(UserModel);

modelManager.addAssoc(TicketShowAssoc);
modelManager.addAssoc(TicketUserAssoc);
modelManager.addAssoc(ShowMovieAssoc);
modelManager.addAssoc(ShowRoomAssoc);

await modelManager.init(db, false);

const Movie = MovieModel.use();
const Room = RoomModel.use();
const Show = ShowModel.use();
const Ticket = TicketModel.use();
const User = UserModel.use();

db.close();
