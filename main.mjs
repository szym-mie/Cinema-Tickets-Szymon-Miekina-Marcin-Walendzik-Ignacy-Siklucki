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

import { RouteManager } from './src/RouteManager.mjs';

import mustache from 'mustache';

import MainRoute from './src/route/MainRoute.mjs';


// Database
const modelManager = new ModelManager({
    database: 'cinema',
    username: 'postgres',
    password: 'zaq1@WSX',
    dialect: 'postgres',
    log: 'full',
});

modelManager.addModel(MovieModel);
modelManager.addModel(RoomModel);
modelManager.addModel(ShowModel);
modelManager.addModel(TicketModel);
modelManager.addModel(UserModel);

modelManager.addAssoc(TicketShowAssoc);
modelManager.addAssoc(TicketUserAssoc);
modelManager.addAssoc(ShowMovieAssoc);
modelManager.addAssoc(ShowRoomAssoc);

try {
    await modelManager.connect();
    await modelManager.init(false);
    console.log('connected to database.');
} catch (e) {
    console.error('cannot connect to database: ' + e);
}


// HTTP
const routeManager = new RouteManager({
    port: 3000,
});

routeManager.withStatic({
    root: './public/',
    prefix: '/public/'
});

routeManager.withView({
    root: './template/',
    engine: 'mustache',
    plugin: mustache
})

routeManager.addRoute(MainRoute);

await routeManager.startServer();
