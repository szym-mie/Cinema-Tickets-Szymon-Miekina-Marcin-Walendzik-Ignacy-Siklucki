import { Sequelize } from "sequelize";

class Model {
    /**
     * @constructor
     * @param {string} modelName 
     * @param {object} modelDefinition 
     */
    constructor(modelName, modelDefinition) {
        this.modelName = modelName;
        this.modelDefinition = modelDefinition;
        this.modelConstructor = null;
    }

    /**
     * Check if the model has been initialized.
     * @returns {boolean} True if static ready.
     */
    isInit() {
        return this.modelConstructor !== null;
    }

    /**
     * Retrieve model static for data access/modification.
     * @throws {Error} When model is not initialized.
     * @returns {ModelStatic} Model static.
     */
    use() {
        if (this.isInit())
            return this.modelConstructor;
        else
            throw new Error('Model ' + this.modelName + ' not initialized yet');
    }

    /**
     * Intialize, by creating and returning model constructor.
     * @param {Sequelize} sequelize Sequalize instance.
     * @param {boolean} shouldSync Should recreate table in database.
     * @returns {ModelStatic} Newly created model constructor.
     */
    async init(sequelize, shouldSync = false) {
        const model = sequelize.define(
            this.modelName, 
            this.modelDefinition, 
            { freezeTableName: true });
        
        if (shouldSync) 
            await model.sync();

        this.modelConstructor = model;
        return model;
    }
}

export { Model };
