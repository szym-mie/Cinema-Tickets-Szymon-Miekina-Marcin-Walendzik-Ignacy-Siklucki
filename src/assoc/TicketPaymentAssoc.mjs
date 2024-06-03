import { Association, AssociationTypes } from '../Association.mjs';
import TicketModel from '../model/TicketModel.mjs';
import PaymentModel from '../model/PaymentModel.mjs';

const TicketPaymentAssoc = new Association(
    'Ticket<-Payment',
    {
        type: AssociationTypes.OneToMany,
        from: PaymentModel,
        fromGetterField: 'tickets',
        to: TicketModel,
        toGetterField: 'payment',
        field: 'paymentId',
    },
);

export default TicketPaymentAssoc;
