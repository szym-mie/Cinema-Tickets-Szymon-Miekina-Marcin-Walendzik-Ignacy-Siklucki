export default class ModelDef {
    constructor(modelName, modelDef) {
        this.modelName = modelName;
        this.modelDef = modelDef;
    }

    async init(sequelize, shouldSync = true) {
        const instance = sequelize.define(
            this.modelName, 
            this.modelDef, 
            { freezeTableName: true });
        
        if (shouldSync) await instance.sync({ force: true });

        return instance;
    }
}