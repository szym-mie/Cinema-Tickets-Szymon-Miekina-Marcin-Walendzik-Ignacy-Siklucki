class Route {
    /**
     * @constructor
     * @param {string} method Method of this route.
     * @param {string} url URL of this route.
     * @param {string} replyType MIME type of response.
     * @param {function(Request,Response):Promise<any>} handler Route handler.
     */
    constructor(method, url, replyType, handler) {
        this.method = method;
        this.url = url;
        this.replyType = replyType;
        this.handler = handler;
    }

    /**
     * Get a signature of this route - method and URL.
     * @returns Signature of this route.
     */
    getSignature() {
        return {
            url: this.url,
            method: this.method,
        };
    }

    /**
     * Get this route signature as a path.
     * @returns Path in a form of METHOD::URL
     */
    getPath() {
        return this.method + '::' + this.url;
    }

    /**
     * Set reply MIME type on handler.
     * @private
     * @param {Request} _req Request
     * @param {Response} res Response
     */
    async setReplyType(_req, res) {
        res.type(this.replyType);
    }

    /**
     * Create route options for use with register functions.
     * @returns Route options.
     */
    createRouteOptions() {
        return {
            url: this.url,
            method: this.method,
            preHandler: this.setReplyType.bind(this),
            handler: this.handler.bind(this),
        };
    }
}

class ReplyType {
    static JSON = 'application/json';
    static HTML = 'text/html';
}

export { Route, ReplyType };
