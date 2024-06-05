import { ReplyType, Route } from '../../Route.mjs';
import { Logging } from '../../Logging.mjs';
import { Session } from '../../Session.mjs';

import PaymentModel from '../../model/PaymentModel.mjs';
import UserModel from '../../model/UserModel.mjs';

const DeleteUserEndpoint = new Route(
    'POST', '/delete_user', ReplyType.JSON,
    async (req, _res) => {
        const Payment = PaymentModel.use();
        const User = UserModel.use();

        try {
            const user = await Session.getUser(req);

            const transaction = await req.modelManager.newTransaction();

            await transaction.of((t) => {
                User.destroy(t.wrap({
                    where: {
                        userId: user.id,
                    },
                }));

                Payment.destroy(t.wrap({
                    where: {
                        userId: user.id,
                    },
                }));
            });

            Logging.logInfo('User ' + data.login + ' was deleted', 'User/Payment');
            return Status.ok();
        }
        catch (e) {
            console.error(e);
            Logging.logError('User delete failed - ' + e.message, 'User/Payment');
            return Status.error(e);
        }
    },
);

export default DeleteUserEndpoint;
