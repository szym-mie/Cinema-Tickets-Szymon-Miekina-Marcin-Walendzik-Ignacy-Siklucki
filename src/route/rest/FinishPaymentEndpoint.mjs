import { Logging } from '../../Logging.mjs';
import { ReplyType, Route } from '../../Route.mjs';
import UserModel from '../../model/UserModel.mjs';
import { Session } from '../../Session.mjs';
import { Status } from '../../Status.mjs';
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

            await Payment.update({
                isPaid: true,
            }, {
                where: {
                    token: paymentToken,
                    userId: userId,
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
