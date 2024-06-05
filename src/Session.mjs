import { Security } from './Security.mjs';
import UserModel from './model/UserModel.mjs';

class Session {
    /**
     * @constructor
     * @private
     * @param {string} token Token to use.
     * @param {string?} sessionField Session field name in cookies and database.
     */
    constructor(token, sessionField) {
        this.token = token;
        this.sessionField = sessionField || Session.sessionFieldDefault;
    }

    /**
     * Get cookie data as a pair of session field and token.
     * @returns {string[]} Cookie data.
     */
    getCookie() {
        return [this.sessionField, this.token];
    }

    /**
     * Create an ORM assigment clause for referencing this session token.
     * @returns {object} Assigment clause.
     */
    getObject() {
        return { [this.sessionField]: this.token };
    }

    /**
     * Create an ORM WHERE clause for finding user with this session token.
     * @returns {object} WHERE clause.
     */
    byRef() {
        return { where: this.getObject() };
    }

    /**
     * Get session user out of request.
     * @param {Request} req Request containing cookie.
     * @param {string?} cookieName Cookie name.
     * @returns Session user.
     */
    static async getUser(req, cookieName) {
        const sessionField = cookieName || Session.sessionFieldDefault;
        const sessionToken = req.unsignCookie(req.cookies[sessionField]);
        const session = Session.fromCookie(sessionToken);
        const user = await UserModel.use().findOne(session.byRef());
        if (user === null)
            throw new Error('Invalid session token');
        return user;
    }

    /**
     * Get session and user out of request.
     * @param {Request} req Request containing cookie.
     * @param {string?} cookieName Cookie name.
     * @returns Session and user object.
     */
    static async getUserAndSession(req, cookieName) {
        const sessionField = cookieName || Session.sessionFieldDefault;
        const sessionToken = req.unsignCookie(req.cookies[sessionField]);
        const session = Session.fromCookie(sessionToken);
        const user = await UserModel.use().findOne(session.byRef());
        if (user === null)
            throw new Error('Invalid session token');
        return { user: user, session: session };
    }

    /**
     * Create new secure session token of a preselected size.
     * @returns {Session} New secure session.
     */
    static create() {
        return new this(Security.createSecureToken(96));
    }

    /**
     * Destroy secure token. Don't forget to update DB and client cookies.
     */
    destroy() {
        this.token = '';
    }

    /**
     * Import session identity token to recreate session.
     * @param {string} token Imported token.
     * @returns {Session} Remote secure session.
     */
    static fromToken(token) {
        if (Security.isTokenSecure(token, { exactSize: this.tokenBytes }))
            return new this(token);
        else
            throw new Error('Insecure token passed (required ' + Session.tokenBytes + ' bytes, passed ' + token.length / 2 + ' bytes)');
    }

    /**
     * Get token from a cookie
     * @param {object} cookie Session cookie.
     * @param {string} cookie.value Cookie token string.
     * @returns {Session} Remote secure session.
     */
    static fromCookie(cookie) {
        return Session.fromToken(cookie.value);
    }

    /**
     * Used when creating and checking incoming session tokens.
     */
    static tokenBytes = 96;
    /**
     * Default field name for session token storage.
     */
    static sessionFieldDefault = 'currentSession';
}

export { Session };
