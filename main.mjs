import { Sequelize } from 'sequelize';
import { ModelManager } from './src/ModelManager.mjs';

import MovieModel from './src/model/MovieModel.mjs';
import RoomModel from './src/model/RoomModel.mjs';
import ShowModel from './src/model/ShowModel.mjs';
import TicketModel from './src/model/TicketModel.mjs';
import UserModel from './src/model/UserModel.mjs';


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

// TODO: Add associations for ticket and show tables.
// modelManager.addAssociation();
// modelManager.addAssociation();
// modelManager.addAssociation();
// modelManager.addAssociation();

await modelManager.init(db, false);

const Movie = MovieModel.use();
const Room = RoomModel.use();
const Show = ShowModel.use();
const Ticket = TicketModel.use();
const User = UserModel.use();

await User.create({
    Login: 'jp2137',
    Password: 'zaq1@WSX',
    Email: 'jp2@wadowice.pl'
});

const users = await User.findAll();
console.log(users.map(v => v.dataValues));

db.close();
