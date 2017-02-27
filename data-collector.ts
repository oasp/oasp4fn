import * as _ from 'lodash'
import {getItems} from './adapters/dynamo-adapter'

let promises = {}
let error: string
let solution: any

export default {
    // tables: {},
    table: function (name: string) {
        // console.log(this)
        /*try {
            this.tables.name = await getItems(name)
        } catch (err) {
            console.log(err)
        }*/
        
       /* getItems(name)
        .then((res: Array<Object>) => {
            console.log(tables)
            tables[name] = res
            console.log(tables)
        }, (err: Error) => {
            console.log(err)
        })*/
    
        // promises.push(getItems(name))

        promises[name] = getItems(name)
        
        console.log(promises)
        return this
    },
    join: function () {
        console.log('join the first 2 tables ' + promises)
        if(_.size(promises) < 2)
            error = 'Not enough tables'
        else {
            solution = Promise.all(_.values(promises))
                    .then((res: Array<Object>) => {
                        return (_.reduce(res, (result, value) => {
                            if(_.size(result) < 2)
                                result.push(value)
                            return result
                        }, []))
                    }, (err: Error) => {
                        return Promise.reject(err)
                    })
        }
        return this
    },
    then: function (result, reject) {
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
                promise = solution
                    .then((res: any) => {
                        return result(res)
                    })
            }
            else {
                promise = result
            }
        }
        error = undefined
        solution = undefined
        return promise
    }
}