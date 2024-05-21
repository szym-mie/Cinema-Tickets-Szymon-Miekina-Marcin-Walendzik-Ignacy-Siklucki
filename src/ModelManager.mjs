import { Sequelize } from "sequelize";
import { Model } from "./Model.mjs";
import { Association } from "./Association.mjs";

class ModelManager {
    /**
     * @constructor
     */
    constructor() {
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
    async init(sequelize, shouldSync = false) {
        // Wait for all models w/ instance to initialize.
        const initializedModels = await Promise.all(
            this.getUninitializedModels()
            .map(model => model.init(sequelize, shouldSync))
        );

        // Regenerate all associations.
        this.getAllAssociations()
        .forEach(assoc => assoc.initDefault());

        return initializedModels;
    }
}

export { ModelManager };
