import { Association, AssociationTypes } from "../Association.mjs";
import ShowModel from "../model/ShowModel.mjs";
import RoomModel from "../model/RoomModel.mjs";

const ShowRoomAssoc = new Association(
    'Show<-Room',
    {
        type: AssociationTypes.OneToMany,
        from: RoomModel,
        to: ShowModel,
        field: 'RoomID',
    },
);

export default ShowRoomAssoc;