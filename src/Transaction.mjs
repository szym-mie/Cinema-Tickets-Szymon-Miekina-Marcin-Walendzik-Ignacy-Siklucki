class Transaction {
    constructor(transaction) {
        this.transaction = transaction;
    }

    use() {
        return { transaction: this.transaction };
    }

    wrap(options) {
        return Object.assign(options, this.use());
    }

    async of(body) {
        try {
            await body(this);
            this.transaction.commit();
        }
        catch (error) {
            this.transaction.rollback();
            throw error;
        }
    }
}

export { Transaction };
