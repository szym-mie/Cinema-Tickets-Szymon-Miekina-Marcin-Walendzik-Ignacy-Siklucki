import { ModelManager } from './src/ModelManager.mjs';

import LogModel from './src/model/LogModel.mjs';
import MovieModel from './src/model/MovieModel.mjs';
import PaymentModel from './src/model/PaymentModel.mjs';
import RoomModel from './src/model/RoomModel.mjs';
import ShowModel from './src/model/ShowModel.mjs';
import TicketModel from './src/model/TicketModel.mjs';
import UserModel from './src/model/UserModel.mjs';

import TicketUserAssoc from './src/assoc/TicketUserAssoc.mjs';
import TicketShowAssoc from './src/assoc/TicketShowAssoc.mjs';
import TicketPaymentAssoc from './src/assoc/TicketPaymentAssoc.mjs';
import ShowMovieAssoc from './src/assoc/ShowMovieAssoc.mjs';
import ShowRoomAssoc from './src/assoc/ShowRoomAssoc.mjs';

import { RouteManager } from './src/RouteManager.mjs';

import handlebars from 'handlebars';

import IndexRoute from './src/route/html/IndexRoute.mjs';
import LoginRoute from './src/route/html/LoginRoute.mjs';
import LogoutRoute from './src/route/html/LogoutRoute.mjs';
import SignUpRoute from './src/route/html/SignUpRoute.mjs';
import ProfileRoute from './src/route/html/ProfileRoute.mjs';
import LogsRoute from './src/route/html/LogsRoute.mjs';
import MovieRoute from './src/route/html/MovieRoute.mjs';
import ShowsRoute from './src/route/html/ShowsRoute.mjs';
import BookShowRoute from './src/route/html/BookShowRoute.mjs';
import RebookShowRoute from './src/route/html/RebookShowRoute.mjs';
import PaymentRoute from './src/route/html/PaymentRoute.mjs';

import LoginEndpoint from './src/route/rest/LoginEndpoint.mjs';
import LogoutEndpoint from './src/route/rest/LogoutEndpoint.mjs';
import SignUpEndpoint from './src/route/rest/SignUpEndpoint.mjs';
import BookShowEndpoint from './src/route/rest/BookShowEndpoint.mjs';
import UnbookShowEndpoint from './src/route/rest/UnbookShowEndpoint.mjs';
import RebookShowEndpoint from './src/route/rest/RebookShowEndpoint.mjs';
import DeleteUserEndpoint from './src/route/rest/DeleteUserEndpoint.mjs';
import DeleteTicketEndpoint from './src/route/rest/DeleteTicketEndpoint.mjs';
import FinishPaymentEndpoint from './src/route/rest/FinishPaymentEndpoint.mjs';

import { DemoDataLoader, demoData } from './src/DemoData.mjs';

// Database
const modelManager = new ModelManager({
    database: 'cinema',
    username: 'postgres',
    password: /* process.env.ORM_PASSWORD */ 'zaq1@WSX',
    dialect: 'postgres',
    log: 'line',
});

modelManager.addAssoc(TicketShowAssoc);
modelManager.addAssoc(TicketUserAssoc);
modelManager.addAssoc(TicketPaymentAssoc);
modelManager.addAssoc(ShowMovieAssoc);
modelManager.addAssoc(ShowRoomAssoc);

modelManager.addModel(LogModel);
modelManager.addModel(MovieModel);
modelManager.addModel(PaymentModel);
modelManager.addModel(RoomModel);
modelManager.addModel(ShowModel);
modelManager.addModel(TicketModel);
modelManager.addModel(UserModel);

// DB connecting
try {
    await modelManager.connect();
    await modelManager.nukeData();
    await modelManager.init(true);

    // await addShows();
    console.log('connected to database.');

    // DB data adding
    const dataLoader = new DemoDataLoader();
    await dataLoader.load(demoData(Date.now()));
}
catch (e) {
    console.error('cannot connect to database: ' + e);
}

// HTTP
const routeManager = new RouteManager({
    port: 3000,
});

routeManager.withStatic({
    root: './public/',
    prefix: '/public/',
});

routeManager.withView({
    root: './template/',
    engine: 'handlebars',
    plugin: handlebars,
    extra: {
        partials: {
            header: 'header.hbs',
            navbar: 'navbar.hbs',
            footer: 'footer.hbs',
        },
    },
});

routeManager.withCookie({
    secret: /* process.env.COOKIE_SECRET */ 'abcdefgh01234567',
    default: { maxAge: 604_800, sameSite: 'lax' },
    default: { maxAge: 604_800, sameSite: 'lax' },
});

routeManager.withContext({ modelManager: modelManager });

routeManager.addRoute(IndexRoute);
routeManager.addRoute(LoginRoute);
routeManager.addRoute(LogoutRoute);
routeManager.addRoute(SignUpRoute);
routeManager.addRoute(ProfileRoute);
routeManager.addRoute(PaymentRoute);
routeManager.addRoute(LogsRoute);
routeManager.addRoute(MovieRoute);
routeManager.addRoute(ShowsRoute);
routeManager.addRoute(BookShowRoute);
routeManager.addRoute(RebookShowRoute);

routeManager.addRoute(LoginEndpoint);
routeManager.addRoute(LogoutEndpoint);
routeManager.addRoute(SignUpEndpoint);
routeManager.addRoute(BookShowEndpoint);
routeManager.addRoute(UnbookShowEndpoint);
routeManager.addRoute(RebookShowEndpoint);
routeManager.addRoute(DeleteUserEndpoint);
routeManager.addRoute(DeleteTicketEndpoint);
routeManager.addRoute(FinishPaymentEndpoint);

await routeManager.startServer();
