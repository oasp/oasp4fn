import * as _ from 'lodash'
import { getItems, getItem } from './adapters/mock-adapter'
// let adapter= require('./adapters/dynamo-adapter')*/

// export function loadAdapter(name: string) {
//     adapter = require('./adapters/' + name)
// }

let promises: any = {}
let error: any
let solution: Array<Promise<Object | string | number>> = []

export default {
    // tables: {},
    // loadAdapter: function (name: string) {
    //     adapter = require('./adapters/' + name)
    // },
    table: function (name: string, ids?: string | Array<string>) {
        if(!error)
            if(ids)
                if(typeof ids === 'string')
                    solution.push(getItem(name, ids))
                else
                    solution.push(getItems(name, <Array<string>>ids))
            else
                 solution.push(getItems(name))
                
        return this
    },
    where: function (name: string, values?: string | number, comparator?: string) {
        return this
    },
    orderBy: function (attribute: string, order?: string) {
        return this
    },
    first: function(quantity?: number) {
        return this
    },
    count: function () {
        return this
    },
    project: function (attributtes: Array<string>) {
        return this
    },
    each: function (iteratee: Function) {
        return this
    },
    reduce: function (iteratee: Function, accumulator: Array<any> | Object | number) {
        return this
    },
    insert: function (table_name: string, items: Object | Array<Object>) {
        return this
    },
    delete: function (table_name: string, ids: string | Array<string>) {
        return this
    },
    join: function (accessor1: string, accessor2: string) {
        console.log('join the first 2 tables ' + promises)
        if(_.size(promises) < 2)
            error = 'Not enough tables'
        else {
            solution.unshift(Promise.all(_.pullAt(solution, [0, 1]))
                    .then((res: Array<any>) => {
                        return (_.reduce(res, (result: Array<Object>, value: Object) => {
                            if(_.size(result) < 2)
                                result.push(value)
                            return result
                        }, []))
                    }, (err: Error) => {
                        return Promise.reject(err)
                    }))
        }
        return this
    },
    then: function (result: Function, reject: Function) {
        let promise: Promise<string | Array<Object>>
        if(error) {
            if(reject) {
                promise = reject(error)
            }
            else {
                promise = Promise.reject(error)
            }      
        }
        else {
            if(result) {
                promise = solution[0]
                    .then((res: any) => {
                        return result(res)
                    }, (error: Error) => {
                        return reject(error)
                    })
            }
            else {
                promise = result
            }
        }
        error = undefined
        solution = []
        return promise
    }
}