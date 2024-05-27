import Fastify from 'fastify';
import path from 'node:path';

import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import fastifyCookie from '@fastify/cookie';

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
     * Use manager with static files.
     * @param {object} options Static files options.
     * @param {string} options.root Static files root path.
     * @param {string?} options.prefix URL prefix for static files. (default '/public/')
     */
    withStatic(options) {
        this.fastify.register(fastifyStatic, {
            root: path.resolve(options.root),
            prefix: options.prefix || '/public/',
        });
    }

    /**
     * Use manager with template views.
     * @param {object} options Template engine options.
     * @param {string} options.root Template files root path.
     * @param {string} options.engine Template engine name.
     * @param {object} options.plugin Template engine plugin function.
     * @param {object?} options.extra Engine specific options.
     */
    withView(options) {
        const engine = {};
        engine[options.engine] = options.plugin;

        this.fastify.register(fastifyView, {
            root: path.resolve(options.root),
            engine: engine,
            options: options.extra,
        });
    }

    /**
     * Use manager with cookie support.
     * @param {object} options Cookie options.
     * @param {string} options.secret Cookie secret.
     * @param {string?} options.hook When to parse the cookies.
     * @param {object?} options.default Default cookie parsing methods.
     */
    withCookie(options) {
        if (options.secret === undefined)
            throw new Error('Secret token was not provided.');
        if (options.secret.length < 16)
            throw new Error('Secret token is too short.');

        const enforcedParseOptions = {
            httpOnly: true,
            signed: true,
        };

        const parseOptions = options.default || {};
        Object.assign(parseOptions, enforcedParseOptions);

        this.fastify.register(fastifyCookie, {
            secret: options.secret,
            hook: options.hook || 'onRequest',
            parseOptions: parseOptions,
        });
    }

    /**
     * Add a new route, overwriting previous route occupying this slot.
     * @param {Route} route Route to add.
     */
    addRoute(route) {
        if (!this.fastify.hasRoute(route.getSignature()))
            this.fastify.route(route.createRouteOptions());
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
