import { Sequelize } from 'sequelize';
import { Transaction } from './Transaction.mjs';

class ModelManager {
    /**
     * @constructor
     * @param {object} options Connection options.
     * @param {string?} options.log Should log to console, defaults to no.
     * @param {string} options.database Database to which the ORM should connect.
     * @param {string} options.username Username for the ORM.
     * @param {string} options.password Password for the ORM.
     * @param {string?} options.host Database host, if empty then localhost.
     * @param {string} options.dialect Database dialect.
     */
    constructor(options) {
        this.options = options;
        /**
         * @public
         * @type {Map<string, Model>}
         */
        this.modelMap = new Map();
        /**
         * @public
         * @type {Map<string, Association>}
         */
        this.associationMap = new Map();

        this.sequelize = new Sequelize(
            options.database,
            options.username,
            options.password,
            {
                logging: ModelManager.logging[options.log] || false,
                host: options.host || 'localhost',
                dialect: options.dialect,
            },
        );
    }

    /**
     * Try connecting to a database and authenticating.
     * @throws On connection error.
     */
    async connect() {
        await this.sequelize.authenticate();
    }

    /**
     * Close connection to the database.
     */
    async close() {
        await this.sequelize.close();
    }

    /**
     * Add a model (uninitialized or initialized) to model collection.
     * @param {Model} model Model to be added.
     */
    addModel(model) {
        const key = model.modelName;
        if (!this.modelMap.has(key))
            this.modelMap.set(key, model);
        else
            throw new Error('Name ' + key + ' already in model collection');
    }

    /**
     * Add an association to association collection.
     * @param {Association} association Association to be added.
     */
    addAssoc(association) {
        const key = association.associationName;
        if (!this.modelMap.has(key))
            this.associationMap.set(association.associationName, association);
        else
            throw new Error('Name ' + key + ' already in association collection');
    }

    /**
     * Return all associations.
     * @returns Array of all associations.
     */
    getAllAssociations() {
        return [...this.associationMap.values()];
    }

    /**
     * Return all uninitialized models.
     * @returns Array of uninitialized models.
     */
    getUninitializedModels() {
        return [...this.modelMap.values()].filter(def => !def.isInit());
    }

    /**
     * Find a model by model name.
     * @param {string} modelName Model name.
     * @returns Maybe found model or undefined if non-existant.
     */
    getModelByName(modelName) {
        return this.modelMap.get(modelName);
    }

    /**
     * Initialize all uninitialized models.
     * @param {Sequelize} sequelize Sequlize instance.
     * @param {boolean} shouldSync Should recreate table in database.
     * @returns Array on newly initialized models.
     */
    async init(shouldSync = false) {
        // Wait for all models w/ instance to initialize.
        const initializedModels = await Promise.all(
            this.getUninitializedModels()
                .map(model => model.init(this.sequelize, shouldSync)),
        );

        // Regenerate all associations.
        this.getAllAssociations()
            .forEach(assoc => assoc.initDefault());

        if (shouldSync)
            this.sequelize.sync({ alter: true });

        return initializedModels;
    }

    async newTransaction() {
        return new Transaction(await this.sequelize.transaction());
    }

    /**
     * @private
     */
    static logging = {
        line: console.log,
        full: (...msgs) => console.log(msgs),
    };
}

export { ModelManager };
