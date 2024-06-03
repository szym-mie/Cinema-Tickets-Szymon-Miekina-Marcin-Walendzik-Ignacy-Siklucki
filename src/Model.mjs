import { Sequelize } from 'sequelize';

class Model {
    /**
     * @constructor
     * @param {string} modelName Name of this model.
     * @param {object} modelDefinition Definition for this model.
     */
    constructor(modelName, modelDefinition) {
        this.modelName = modelName;
        this.modelDefinition = modelDefinition;
        this.modelConstructor = null;
    }

    /**
     * Check if the model has been initialized.
     * @returns True if static ready.
     */
    isInit() {
        return this.modelConstructor !== null;
    }

    /**
     * Retrieve model static for data access/modification.
     * @throws {Error} When model is not initialized.
     * @returns Model static.
     */
    use() {
        if (this.modelConstructor !== null)
            return this.modelConstructor;
        else
            throw new Error('Model ' + this.modelName + ' not initialized yet');
    }

    /**
     * Intialize, by creating and returning model constructor.
     * @param {Sequelize} sequelize Sequalize instance.
     * @param {boolean} shouldSync Should create table in database.
     * @param {boolean} shouldNuke Should nuke all data force syncing
     * @returns Newly created model constructor.
     */
    async init(sequelize, shouldSync = false, shouldNuke = false) {
        const model = sequelize.define(
            this.modelName,
            this.modelDefinition,
            { freezeTableName: true });

        if (shouldSync)
            await model.sync({ alter: true, force: shouldNuke });

        this.modelConstructor = model;
        return model;
    }
}

export { Model };
