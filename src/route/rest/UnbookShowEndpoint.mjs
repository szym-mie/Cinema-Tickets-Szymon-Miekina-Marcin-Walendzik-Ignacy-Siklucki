import { Logging } from '../../Logging.mjs';
import { ReplyType, Route } from '../../Route.mjs';
import TicketModel from '../../model/TicketModel.mjs';
import { Session } from '../../Session.mjs';
import { Status } from '../../Status.mjs';
import PaymentModel from '../../model/PaymentModel.mjs';
import UserModel from '../../model/UserModel.mjs';

const UnbookShowEndpoint = new Route(
    'POST', '/unbook_show', ReplyType.JSON,
    async (req, _res) => {
        const paymentToken = req.body.paymentToken;

        const User = UserModel.use();
        const Ticket = TicketModel.use();
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
                Logging.logInfo('Payment refuse attempt - no such payment', 'Payment');
                return Status.ok();
            }

            const transaction = await req.modelManager.newTransaction();
            await transaction.of(async (t) => {
                await Ticket.destroy(t.wrap({
                    where: {
                        paymentId: payment.id,
                    },
                }));

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
