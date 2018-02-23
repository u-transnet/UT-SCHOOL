/**
 * Created by superpchelka on 23.02.18.
 */

import {Apis} from "bitsharesjs-ws";
import {ChainValidation} from "bitsharesjs";
import {ChainTypes, ChainStore} from "bitsharesjs";
const {object_type} = ChainTypes;
let op_history   = parseInt(object_type.operation_history, 10);


class BitsharesApiExtends{

    static _fetchHistory(account, limit = 100, opType, stop, start, operationsList){
        if(typeof stop === 'undefined')
            stop = "1." + op_history + ".0";
        if(typeof start === 'undefined')
            start = "1." + op_history + ".0";

        return new Promise( (resolve, reject) => {
            Apis.instance().history_api().exec("get_account_history",
                [ account.get("id"), stop, limit, start])
                .then( operations => {
                    for(let operation of operations) {
                        if (operation.op[0] == opType || typeof opType == 'undefined')
                            operationsList.push(operation);
                    }

                    if(operations.length == limit)
                        this._fetchHistory(account, limit, opType, undefined, operations[0].id, operationsList);
                    else
                        resolve(operationsList);
                });
        });
    }

    static fetchHistory(account, limit = 100, opTypeName, stop, start)
    {
        // console.log( "get account history: ", account )
        /// TODO: make sure we do not submit a query if there is already one
        /// in flight...
        let account_id = account;
        if( !ChainValidation.is_object_id(account_id) && account.toJS )
            account_id = account.get("id");

        if( !ChainValidation.is_object_id(account_id)  )
            return;

        account = ChainStore.objects_by_id.get(account_id);
        if( !account ) return;

        let opTypeId = ChainTypes.operations[opTypeName];
        if (typeof opTypeName != 'undefined' && opTypeId === undefined)
            throw new Error(`unknown operation: ${opTypeName}`);

        return this._fetchHistory(account, limit, opTypeId, stop, start, []);
    }


}

export {BitsharesApiExtends}