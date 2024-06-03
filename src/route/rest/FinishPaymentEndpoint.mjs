import { Logging } from '../../Logging.mjs';
import { ReplyType, Route } from '../../Route.mjs';
import UserModel from '../../model/UserModel.mjs';
import { Session } from '../../Session.mjs';
import PaymentModel from '../../model/PaymentModel.mjs';

const FinishPaymentEndpoint = new Route(
    'POST', '/finish_payment', ReplyType.JSON,
    async (req, _res) => {
        const paymentToken = req.body.paymentToken;

        const User = UserModel.use();
        const Payment = PaymentModel.use();

        try {
            const sessionToken = req.unsignCookie(req.cookies.currentSession);
            const session = Session.fromCookie(sessionToken);

            const user = await User.findOne(session.byRef());
            const userId = user.id;

            const payment = await Payment.findOne({
                where: {
                    token: paymentToken,
                    userId: userId,
                },
            });

            if (payment === null) {
                Logging.logInfo('Payment finish attempt - no such payment', 'Payment');
                return Status.ok();
            }

            payment.update('isPaid', true);
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
