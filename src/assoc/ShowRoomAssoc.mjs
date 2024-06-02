import { Association, AssociationTypes } from '../Association.mjs';
import ShowModel from '../model/ShowModel.mjs';
import RoomModel from '../model/RoomModel.mjs';

const ShowRoomAssoc = new Association(
    'Show<-Room',
    {
        type: AssociationTypes.OneToMany,
        from: RoomModel,
        fromGetterField: 'shows',
        to: ShowModel,
        toGetterField: 'room',
        field: 'roomId',
    },
);

export default ShowRoomAssoc;
