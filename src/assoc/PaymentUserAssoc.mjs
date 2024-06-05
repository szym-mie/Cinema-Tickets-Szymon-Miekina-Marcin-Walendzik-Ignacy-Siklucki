import { Association, AssociationTypes } from '../Association.mjs';
import PaymentModel from '../model/PaymentModel.mjs';
import UserModel from '../model/UserModel.mjs';

const PaymentUserAssoc = new Association(
    'Payment<-User',
    {
        type: AssociationTypes.OneToMany,
        from: UserModel,
        fromGetterField: 'payments',
        to: PaymentModel,
        toGetterField: 'user',
        field: 'userId',
    },
);

export default PaymentUserAssoc;
