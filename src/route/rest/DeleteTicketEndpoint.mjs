import { Logging } from '../../Logging.mjs';
import { ReplyType, Route } from '../../Route.mjs';
import TicketModel from '../../model/TicketModel.mjs';
import UserModel from '../../model/UserModel.mjs';
import { Session } from '../../Session.mjs';

const DeleteTicketEndpoint = new Route(
    'POST', '/delete_ticket', ReplyType.JSON,
    async (req, _res) => {
        const ticketToken = req.body.ticketToken;

        const Ticket = TicketModel.use();
        const User = UserModel.use();

        try {
            const sessionToken = req.unsignCookie(req.cookies.currentSession);
            const session = Session.fromCookie(sessionToken);

            const user = await User.findOne(session.byRef());
            const userId = user.id;

            const ticket = await Ticket.findOne({
                where: {
                    token: ticketToken,
                    userId: userId,
                },
                include: ['payment'],
            });

            if (ticket === null) {
                Logging.logInfo('Ticket delete attempt - no such ticket', 'Ticket');
                return Status.ok();
            }

            const ticketCount = await Ticket.count({
                where: {
                    paymentId: ticket.paymentId,
                },
            });

            const transaction = await req.modelManager.newTransaction();
            await transaction.of(async (t) => {
                if (ticketCount == 1) {
                    await ticket.payment.destroy(t.wrap());
                }
                await ticket.destroy(t.wrap());
            });
            Logging.logInfo('Ticket ' + ticketToken + ' was deleted', 'Ticket');

            return Status.ok();
        }
        catch (e) {
            console.error(e);
            Logging.logError('Ticket delete failed - ' + e.message, 'Ticket');
            return Status.error(e);
        }
    },
);

export default DeleteTicketEndpoint;
