import { Association, AssociationTypes } from '../Association.mjs';
import PaymentModel from '../model/PaymentModel.mjs';
import ShowModel from '../model/ShowModel.mjs';

const PaymentShowAssoc = new Association(
    'Payment<-Show',
    {
        type: AssociationTypes.OneToMany,
        from: ShowModel,
        fromGetterField: 'payments',
        to: PaymentModel,
        toGetterField: 'show',
        field: 'showId',
    },
);

export default PaymentShowAssoc;
