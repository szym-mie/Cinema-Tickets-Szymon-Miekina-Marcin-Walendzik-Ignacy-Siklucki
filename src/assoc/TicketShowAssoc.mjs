import { Association, AssociationTypes } from '../Association.mjs';
import TicketModel from '../model/TicketModel.mjs';
import ShowModel from '../model/ShowModel.mjs';

const TicketShowAssoc = new Association(
    'Ticket<-Show',
    {
        type: AssociationTypes.OneToMany,
        from: ShowModel,
        fromGetterField: 'tickets',
        to: TicketModel,
        toGetterField: 'show',
        field: 'showId',
    },
);

export default TicketShowAssoc;
