import Fastify from 'fastify';
import { Route } from './Route.mjs';

class RouteManager {
    /**
     * @constructor
     * @param {object} options Additional options.
     * @param {number} options.port Listening on port.
     * @param {boolean?} options.log Should log to console, defaults to no.
     */
    constructor(options) {
        this.options = options;
        this.fastify = Fastify({ logger: options.log || false });
    }

    /**
     * Add a new route, overwriting previous route occupying this slot.
     * @param {Route} route Route to add.
     */
    addRoute(route) {
        if (!this.fastify.hasRoute(route.getSignature()))
            this.fastify.route(route.createRouteOptions())
        else
            throw new Error('Route ' + route.getPath() + ' was already added.');
    }

    /**
     * Start listening on a port.
     */
    async startServer() {
        await this.fastify.listen({ port: this.options.port });
    }
}

export { RouteManager };