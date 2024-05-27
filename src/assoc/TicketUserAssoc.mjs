import { Association, AssociationTypes } from '../Association.mjs';
import TicketModel from '../model/TicketModel.mjs';
import UserModel from '../model/UserModel.mjs';

const TicketUserAssoc = new Association(
    'Ticket<-User',
    {
        type: AssociationTypes.OneToMany,
        from: UserModel,
        to: TicketModel,
        field: 'userId',
    },
);

export default TicketUserAssoc;
