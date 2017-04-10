import * as _ from 'lodash'
// import { getItems, getItem, putItem, putItems, deleteItem, deleteItems} from './adapters/mock-adapter'
import { getItems, getItem, putItem, putItems, deleteItem, deleteItems} from './adapters/fn-dynamo'

let solution: Array<Promise<Array<Object> | Object | string | number>> = []

export default {
    table: function (name: string, ids?: string | Array<string>) {
        switch(typeof ids) {
            case "string":
                solution.push(getItem(name, <string>ids))
                break
            case "object":
                if(Array.isArray(ids)) {
                    solution.push(getItems(name, ids))
                    break
                }
            default:
                solution.push(getItems(name))
        }
                
        return this
    },
    where: function (attribute: string, value?: string | number | boolean, comparator?: string) {
        let _comparator = comparator || '='
        
        if(solution[0])
            solution[0] = solution[0].then((res: Array<Object>) => {
                if(Array.isArray(res)) { 
                    if(typeof value !== "undefined") {
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
    reduce: function (iteratee: _.ObjectIterator<Object, any>, accumulator?: Array<any> | Object | number) {
        let _accumulator = accumulator ? accumulator : []
        if(solution[0])
            solution[0] = solution[0].then((res: _.Dictionary<string>) => {
                if(Array.isArray(res))
                    return _.reduceRight(res, iteratee, _accumulator)
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
    join: function (accessor0: string, accessor1: string) {
        solution.unshift(Promise.all(_.pullAt(solution, [0, 1]))
                .then((res: Array<any>) => {
                    if(Array.isArray(res[0]) && Array.isArray(res[1])) {
                        let length0 = res[0].length
                        let length1 = res[1].length
                        if(length0 < 1 || length1 < 1)
                            return []
                        let index: any
                        let aux
                        if(length0 < length1) {
                            index = _.groupBy(res[0], accessor0)
                            return _.reduceRight(res[1], (result: Array<Object>, o1: any) => {
                                aux = o1[accessor1]
                                if(_.has(index, aux)) 
                                    return _.map(index[aux], o0 => _.assign({}, _.omit(o0, accessor0), _.omit(o1, accessor1))).concat(result)
                                return result
                            }, [])
                        }
                        index = _.groupBy(res[1], accessor1)
                        return _.reduceRight(res[0], (result: Array<Object>, o0: any) => {
                            aux = o0[accessor0]
                            if(_.has(index, aux)) 
                                return _.map(index[aux], o1 => _.assign({}, _.omit(o0, accessor0), _.omit(o1, accessor1))).concat(result)
                            return result
                        }, [])
                    }
                    return Promise.reject('Invalid use of function join')
                }))
        return this
    },
    then: function (result: Function | null, reject: Function | null) {
        let promise: Promise<string | Array<Object>> = solution[0]
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
        solution = []
        return promise
    },
    promise: function () {
        return solution.shift()
    }
}