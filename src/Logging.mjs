import LogModel from './model/LogModel.mjs';

class Logging {
    /**
     * Log info message in database.
     * @param {string} message info message
     * @param {string?} about topic of message
     */
    static logInfo(message, about) {
        const Log = LogModel.use();
        Log.create({
            type: 'INFO',
            message: message,
            about: about,
        });
    }

    /**
     * Log error message in database.
     * @param {string} message error message
     * @param {string?} about topic of message
     */
    static logError(message, about) {
        const Log = LogModel.use();
        Log.create({
            type: 'ERROR',
            message: message,
            about: about,
        });
    }
}

export { Logging };
