import * as _ from 'lodash'

let employees = [
    {id: "1", name: "Paquito", surname: "Chocolatero", department: "1"},
    {id: "2", name: "Paquita", surname: "Chocolatera", department: "3"},
    {id: "3", name: "Paco", surname: "Chocolatero", department: "1"},
    {id: "4", name: "Fran", surname: "Chocolatero", department: "2"}
]

let departments = [
    {id: "1", name: "Logistic"},
    {id: "2", name: "RRHH"},
    {id: "3", name: "Architecture"},
    {id: "4", name: "UX"}
]

export function getItem (table_name: string, id: string) {
    let item: any
    switch(table_name) {
        case 'employees':
            item = _.find(employees, ['id', id])
            if(item)
                return Promise.resolve(item)
            else
                return Promise.reject('The item with id ' + id + ' doesn\'t exist in the table ' + table_name)
        case 'departments':
           item = _.find(departments, ['id', id])
            if(item)
                return Promise.resolve(item)
            else
                return Promise.reject('The item with id ' + id + ' doesn\'t exist in the table ' + table_name)
        default:
            return Promise.reject('The table ' + table_name + ' doesn\'t exist')
    }
}

export function getItems (table_name: string, ids?: Array<Object>) {
    let fn = (table: Array<Object>) => Promise.resolve(table)
    if(ids)
        fn = (table: Array<Object>) => {
             let result = _.map(table, (o: any) => {
                 if(_.indexOf(ids, o.id) > -1)
                     return o
                })
             if(result.length !== ids.length)
                 return Promise.reject('Error returning the items')
             return Promise.resolve(result)
            }
    
    switch(table_name) {
        case 'employees':
            return Promise.resolve(fn(employees))
        case 'departments':
            return Promise.resolve(fn(departments))
        default:
            return Promise.reject('The table ' + table_name + ' doesn\'t exist')
    }
}

export function putItem (table_name: string, item: Object) {
  
}

export function putItems (table_name: string, items: Array<Object>) {

}

export function deleteItem (table_name: string, id: string) {

}

export function deleteItems (table_name: string, ids: Array<string>) {

}