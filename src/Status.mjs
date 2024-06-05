class Status {
    /**
     * @constructor
     * @private
     * @param {string} status Status name.
     * @param {string?} reason Reason for error.
     * @param {string?} where Where an error occurred.
     */
    constructor(status, reason, where) {
        this.status = status;
        this.reason = reason;
        this.where = where;
    }

    /**
     * Notify operation executed successfully.
     * @returns {Status} Status info.
     */
    static ok() {
        return new this('ok');
    }

    /**
     * Notify operation failed and include error information in status.
     * @param {Error} error Error/exception that caused the fail.
     * @param {boolean?} includeWhere Should the location of the error be included.
     * @returns {Status} Status info.
     */
    static error(error, includeWhere = true) {
        const reason = error.message;
        const where = includeWhere ? 'N/A' : undefined;
        return new this('error', reason, where);
    }

    /**
     * Send an error page.
     * @param {Response} res Route response.
     * @param {Error} e Error to display.
     * @returns Rendered error page.
     */
    static async errorPage(res, e) {
        console.error(e);
        return await res.viewAsync(Status.errorPageTemplate, {
            reason: e,
        });
    }

    static errorPageTemplate = 'error.hbs';
}

export { Status };
