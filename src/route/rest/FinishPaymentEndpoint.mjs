import { ReplyType, Route } from '../../Route.mjs';
import { Logging } from '../../Logging.mjs';
import { Session } from '../../Session.mjs';
import { Status } from '../../Status.mjs';

import PaymentModel from '../../model/PaymentModel.mjs';

const FinishPaymentEndpoint = new Route(
    'POST', '/finish_payment', ReplyType.JSON,
    async (req, _res) => {
        const paymentToken = req.body.paymentToken;

        const Payment = PaymentModel.use();

        try {
            const user = await Session.getUser(req);

            await Payment.update({
                isPaid: true,
            }, {
                where: {
                    token: paymentToken,
                    userId: user.id,
                },
            });

            Logging.logInfo('Payment ' + paymentToken + ' has been paid for', 'Payment');

            return Status.ok();
        }
        catch (e) {
            console.error(e);
            Logging.logError('Payment finish failed - ' + e.message, 'Payment');
            return Status.error(e);
        }
    },
);

export default FinishPaymentEndpoint;
