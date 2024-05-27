import { Association, AssociationTypes } from '../Association.mjs';
import TicketModel from '../model/TicketModel.mjs';
import ShowModel from '../model/ShowModel.mjs';

const TicketShowAssoc = new Association(
    'Ticket<-Show',
    {
        type: AssociationTypes.OneToMany,
        from: ShowModel,
        to: TicketModel,
        field: 'showId',
    },
);

export default TicketShowAssoc;
