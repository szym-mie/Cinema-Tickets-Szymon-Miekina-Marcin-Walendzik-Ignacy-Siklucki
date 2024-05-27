import { Model } from './Model.mjs';

class Association {
    /**
     * @constructor
     * @param {string} associationName Association name.
     * @param {object} associationDefinition Association defintion object.
     * @param {typeof AssociationType} associationDefinition.type Type of association.
     * @param {Model} associationDefinition.from Source model.
     * @param {Model} associationDefinition.to Target model.
     * @param {string?} associationDefinition.fromName Source model name.
     * @param {string?} associationDefinition.toName Target model name.
     * @param {string} associationDefinition.field Field name for foreign key.
     * @param {string} associationDefinition.juntion Table name for junction.
     */
    constructor(associationName, associationDefinition) {
        this.associationName = associationName;
        this.associationDefinition = associationDefinition;
        this.associationInstance = null;
    }

    /**
     * @private
     * @returns Options.
     */
    getOptions() {
        const field = this.associationDefinition.field;
        const junction = this.associationDefinition.junction;

        return { field, junction };
    }

    /**
     * Get default source model reference.
     * @returns Model or model name.
     */
    getSource() {
        return this.associationDefinition.from;
    }

    /**
     * Get default target model reference.
     * @returns Model or model name.
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
            const typeConstructor = this.associationDefinition.type;
            const type = new typeConstructor(this.getOptions());
            type.apply(source, target);
        }
        else {
            throw new Error('Source or target in association ' + this.associationName + 'is undefined');
        }
    }
}

/**
 * @abstract
 */
class AssociationType {
    /**
     * @constructor
     * @param {object} options Type options.
     * @param {string} options.field Field in target model to use.
     * @param {string} options.junction Junction model name.
     */
    constructor(options) {
        this.options = options;
    }

    /**
     * Create association between two models.
     * @abstract
     * @param {Model} _source Source model.
     * @param {Model} _target Target model.
     */
    apply(_source, _target) {}
}

class OneToOne extends AssociationType {
    /**
     * Create one-to-one association between two models.
     * @param {Model} source Source model.
     * @param {Model} target Target model.
     */
    apply(source, target) {
        source.modelConstructor.hasOne(
            target.modelConstructor,
            { foreignKey: this.options.field },
        );
        target.modelConstructor.belongsTo(source.modelConstructor);
    }
}

class OneToMany extends AssociationType {
    /**
     * Create one-to-many association between two models.
     * @param {Model} source Source model.
     * @param {Model} target Target model.
     */
    apply(source, target) {
        source.modelConstructor.hasMany(
            target.modelConstructor,
            { foreignKey: this.options.field },
        );
        target.modelConstructor.belongsTo(source.modelConstructor);
    }
}

class ManyToMany extends AssociationType {
    /**
     * Create many-to-many association between two models.
     * @param {Model} source Source model.
     * @param {Model} target Target model.
     */
    apply(source, target) {
        source.modelConstructor.belongsToMany(
            target.modelConstructor,
            { through: this.options.junction },
        );
        target.modelConstructor.belongsToMany(
            source.modelConstructor,
            { through: this.options.junction },
        );
    }
}

const AssociationTypes = {
    OneToOne: OneToOne,
    OneToMany: OneToMany,
    ManyToMany: ManyToMany,
};

export { Association, AssociationTypes };
