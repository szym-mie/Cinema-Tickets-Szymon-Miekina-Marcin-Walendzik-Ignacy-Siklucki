class Transaction {
    constructor(transaction) {
        this.transaction = transaction;
    }

    use() {
        return { transaction: this.transaction };
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
