import { Model } from "./Model.mjs";

class Association {
    /**
     * 
     * @param {string} associationName 
     * @param {object} associationDefinition 
     */
    constructor(associationName, associationDefinition) {
        this.associationName = associationName;
        this.associationDefinition = associationDefinition;
    }

    /**
     * @private
     * @returns {object} Options.
     */
    getOptions() {
        const field = this.associationDefinition.field;
        const junction = this.associationDefinition.junction;

        return { field, junction };
    }

    /**
     * Get source model reference.
     * @returns {Model|string} Model or model name.
     */
    getSource() {
        return this.associationDefinition.from;        
    }

    /**
     * Get target model reference.
     * @returns {Model|string} Model or model name.
     */
    getTarget() {
        return this.associationDefinition.to;
    }

    /**
     * Initialize using default models.
     */
    initDefault() {
        this.initWithExternal(this.getSource(), this.getTarget());
    }

    /**
     * Initialize with external models.
     * @param {Model} source Source model override.
     * @param {Model} target Target model override.
     */
    initWithExternal(source, target) {
        if (source !== undefined && target !== undefined) {
            const type = this.associationDefinition.type;
            type(source, target, this.getOptions());
        } else {
            throw new Error('Source or target in association ' + this.associationName + 'is undefined');
        }
    }

    /**
     * Setup one to many relation from source model to target model.
     * @static
     * @param {Model} source Source model.
     * @param {Model} target Target model.
     * @param {object} options Additional options.
     * @param {string} options.field Field in target model to use.
     */
    static setOneToOne(source, target, options) {
        source.modelConstructor.hasOne(
            target.modelConstructor,
            { foreignKey: options.field }
        );
        target.modelConstructor.belongsTo(source.modelConstructor);
    }

    /**
     * Setup one to many relation from source model to target model.
     * @static
     * @param {Model} source Source model.
     * @param {Model} target Target model.
     * @param {object} options Additional options.
     * @param {string} options.field Field in target model to use.
     */
    static setOneToMany(source, target, options) {
        source.modelConstructor.hasMany(
            target.modelConstructor,
            { foreignKey: options.field }
        );
        target.modelConstructor.belongsTo(source.modelConstructor);
    }

    /**
     * Setup many to many relation from source model to target model.
     * @static
     * @param {Model} source Source model.
     * @param {Model} target Target model.
     * @param {object} options Additional options.
     * @param {string} options.junction Junction model name.
     */
    static setManyToMany(source, target, options) {
        source.modelConstructor.belongsToMany(
            target.modelConstructor,
            { through: options.junction }
        );
        target.modelConstructor.belongsToMany(
            source.modelConstructor,
            { through: options.junction }
        );
    }

    static OneToOne = Association.setOneToOne;
    static OneToMany = Association.setOneToMany;
    static ManyToMany = Association.setManyToMany;
}

export { Association };
