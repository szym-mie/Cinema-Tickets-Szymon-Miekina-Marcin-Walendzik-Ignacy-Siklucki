import { ReplyType, Route } from '../../Route.mjs';
import { Logging } from '../../Logging.mjs';
import { Session } from '../../Session.mjs';
import { Status } from '../../Status.mjs';

import PaymentModel from '../../model/PaymentModel.mjs';

const UnbookShowEndpoint = new Route(
    'POST', '/unbook_show', ReplyType.JSON,
    async (req, _res) => {
        const paymentToken = req.body.paymentToken;

        const Payment = PaymentModel.use();

        try {
            const user = await Session.getUser(req);

            const payment = await Payment.findOne({
                where: {
                    token: paymentToken,
                    userId: user.id,
                },
            });

            if (payment === null) {
                Logging.logInfo('Payment refuse attempt - no such payment', 'Payment');
                return Status.ok();
            }

            const transaction = await req.modelManager.newTransaction();
            await transaction.of(async (t) => {
                await payment.destroy(t.wrap());
            });

            Logging.logInfo('Payment ' + paymentToken + ' was refused', 'Payment');

            return Status.ok();
        }
        catch (e) {
            console.error(e);
            Logging.logError('Payment refuse failed - ' + e.message, 'Payment');
            return Status.error(e);
        }
    },
);

export default UnbookShowEndpoint;
