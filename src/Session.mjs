import { Security } from './Security.mjs';

class Session {
    /**
     * @constructor
     * @private
     * @param {string} token Token to use.
     * @param {string} sessionField Session field name in cookies and database.
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
     * Create new secure session token of a preselected size.
     * @returns {Session} New secure session.
     */
    static create() {
        return new this(Security.createSecureToken(96));
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
            throw new Error('Insecure token passed (required ' + Session.tokenBytes + ' bytes)');
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
