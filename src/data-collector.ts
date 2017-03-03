import * as _ from 'lodash'
import { getItems, getItem, putItem, putItems, deleteItem, deleteItems} from './adapters/mock-adapter'
// let adapter= require('./adapters/dynamo-adapter')*/

// export function loadAdapter(name: string) {
//     adapter = require('./adapters/' + name)
// }

let promises: any = {}
let error: any
let solution: Array<Promise<Array<Object> | Object | string | number>> = []

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
    where: function (attribute: string, value?: string | number, comparator?: string) {
        let _comparator = comparator || '='
        
        if(solution[0])
            solution[0] = solution[0].then((res: Array<Object>) => {
                if(Array.isArray(res)) { 
                    if(value) {
                        switch(_comparator) {
                            case '=':
                                return _.filter(res, [attribute, value])
                            case '!=':
                                return _.filter(res, (o: any) => !_.isEqual(o[attribute], value))
                            case '<':
                                return _.filter(res, (o: any) => o[attribute] < value)
                            case '>':
                                return _.filter(res, (o: any) => o[attribute] > value)
                            case '<=':
                                return _.filter(res, (o: any) => o[attribute] <= value)
                            case '>=':
                                return _.filter(res, (o: any) => o[attribute] >= value)
                            case 'has':
                                return _.filter(res, (o: any) => _.indexOf(o[attribute], value) > -1)
                            default:
                                return Promise.reject('Invalid comparator in where operation')
                        }
                    }
                    else
                        return _.filter(res, (o) => _.has(o, attribute))
                }
                return Promise.reject('Invalid use of where operation')
            })
           
        return this
    },
    orderBy: function (attribute: string, order?: string) {
        let _order = (order === 'asc' || order === 'desc') ? order : 'asc'

        if(solution[0])
            solution[0] = solution[0].then((res: Array<Object>) => {
                if(Array.isArray(res)) 
                   return _.orderBy(res, attribute, _order)
                return Promise.reject('Invalid use of orderBy operation')
            })

        return this
    },
    first: function(quantity?: number) {
        let _quantity = (quantity && quantity > 1) ? quantity : 1

        if(solution[0])
            solution[0] = solution[0].then((res: Array<Object>) => {
                if(Array.isArray(res)) 
                   return _.slice(res, 0, _quantity)
                return Promise.reject('Invalid use of first operation')
            })

        return this
    },
    count: function () {
        if(solution[0])
            solution[0] = solution[0].then((res: Array<Object>) => {
                if(Array.isArray(res))
                    return res.length
                return Promise.reject('Invalid use of count operation')
            })
        return this
    },
    project: function (...attributes: Array<string | Array<string>>) {
        if(solution[0])
            solution[0] = solution[0].then((res: Array<Object>) => {
                if(Array.isArray(res) && attributes.length > 0)
                    return _.reduceRight(res, (result: Array<Object>, o: Object) => {
                        result.push(_.pick(o, attributes))
                        return result
                    }, [])
                return Promise.reject('Invalid use of project operation')
            })
        return this
    },
    reduce: function (iteratee: _.ObjectIterator<Object, any>, accumulator: Array<any> | Object | number) {
        if(solution[0])
            solution[0] = solution[0].then((res: _.Dictionary<string>) => {
                if(Array.isArray(res))
                    return _.reduceRight(res, iteratee, accumulator)
                return Promise.reject('Invalid use of each operation')
            })
        return this
    },
    insert: function (table_name: string, items: Object | Array<Object>) {
        if(Array.isArray(items))
            solution[0] = putItems(table_name, items)
        else
            solution[0] = putItem(table_name, items)

        return this
    },
    delete: function (table_name: string, ids: string | Array<string>) {
         if(Array.isArray(ids))
            solution[0] = deleteItems(table_name, ids)
        else
            solution[0] = deleteItem(table_name, ids)

        return this
    },
    join: function (accessor1: string, accessor2: string) {
        console.log('join the first 2 tables ' + solution)
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
        return this
    },
    then: function (result: Function, reject: Function) {
        let promise: Promise<string | Array<Object>> = solution[0]
        if(error) {
            if(reject) {
                promise = reject(error)
            }
            else {
                promise = Promise.reject(error)
            }      
        }
        else {
            if(result && reject) {
                promise = solution[0]
                    .then((res: any) => {
                        return result(res)
                    }, (err: Error) => {
                        return reject(err)
                    })
            }
            else if (result) {
                promise = solution[0]
                    .then((res: any) => {
                        return result(res)
                    })
            }
            else if (reject) {
                promise = solution[0]
                    .catch((err: Error) => {
                        return reject(err)
                    })
            }
        }
        error = undefined
        solution = []
        return promise
    }
}