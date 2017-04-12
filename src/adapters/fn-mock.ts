import * as _ from 'lodash'

let employees = [
    {id: "1", firstname: "Paquito", surname: "Chocolatero", department: "1"},
    {id: "2", firstname: "Paquita", surname: "Chocolatera", department: "3"},
    {id: "3", firstname: "Paco", surname: "Chocolatero", department: "1"},
    {id: "4", firstname: "Fran", surname: "Chocolatero", department: "2"}
]

let departments = [
    {id: "1", dept_name: "Logistic", floor: [1, 2]},
    {id: "2", dept_name: "RRHH", floor: [3]},
    {id: "3", dept_name: "Architecture", floor: [2, 3]},
    {id: "4", dept_name: "UX", floor: [4, 5, 6]}
]

let sample_bucket = [ 
    { Key: "Project info.docx", }
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
             let result = _.reduceRight(table, (result: Array<Object>, o: any) => {
                 if(_.indexOf(ids, o.id) > -1)
                     result.push(o)
                 return result
                }, [])
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

export function putItem (table_name: string, item: any) {
    let index: number
    switch(table_name) {
        case 'employees':
            if(item.id){
               index = _.findIndex(employees, ['id', item.id])
               if(index < 0)
                   employees.push(item)
                else
                    employees[index] = item 
               return Promise.resolve(item.id)
            }
            else
                return Promise.reject('Item is malformed, unable to insert the item')
        case 'departments':
             if(item.id){
               index = _.findIndex(departments, ['id', item.id])
               if(index < 0)
                   departments.push(item)
                else
                    departments[index] = item
               return Promise.resolve(item.id)
            }
            else
                return Promise.reject('Item is malformed, unable to insert the item')
        default:
            return Promise.reject('The table ' + table_name + ' doesn\'t exist')
    }
}

export function putItems (table_name: string, items: Array<any>) {
    let result = []
    let i = items.length
    let index: number
    switch(table_name) {
        case 'employees':
            while(i--){
                if(!items[i].id)
                    return Promise.reject('A item is malformed, the insert operation fail')
               index = _.findIndex(employees, ['id', items[i].id])
               if(index < 0)
                   employees.push(items[i])
                else
                    employees[index] = items[i]
                result.push(items[i].id)
            }
                return Promise.resolve(result)
        case 'departments':
            while(i--){
                if(!items[i].id)
                    return Promise.reject('A item is malformed, the insert operation fail')
               index = _.findIndex(departments, ['id', items[i].id])
               if(index < 0)
                   departments.push(items[i])
                else
                    departments[index] = items[i]
                result.push(items[i].id)
            }
                return Promise.resolve(result)
        default:
            return Promise.reject('The table ' + table_name + ' doesn\'t exist')
    }
}

export function deleteItem (table_name: string, id: string) {
    let removed_length: number
    switch(table_name) {
        case 'employees':
            removed_length = _.remove(employees, (o: any) => o.id === id).length
            if(removed_length === 1){
               return Promise.resolve(id)
            }
            else
                return Promise.reject('Unable to delete the item: ' + id)
        case 'departments':
            removed_length = _.remove(departments, (o: any) => o.id === id).length
            if(removed_length === 1){
               return Promise.resolve(id)
            }
            else
                return Promise.reject('Unable to delete the item: ' + id)
        default:
            return Promise.reject('The table ' + table_name + ' doesn\'t exist')
    }
}

export function deleteItems (table_name: string, ids: Array<string>) {
    let removed_length: number
    switch(table_name) {
        case 'employees':
            removed_length = _.remove(employees, (o: any) => _.indexOf(ids, o.id) > -1).length
            if(removed_length ===  ids.length) {
               return Promise.resolve(ids)
            }
            else
                return Promise.reject('Unable to delete the items')
        case 'departments':
            removed_length = _.remove(departments, (o: any) => _.indexOf(ids, o.id) > -1).length
            if(removed_length === ids.length){
               return Promise.resolve(ids)
            }
            else
                return Promise.reject('Unable to delete the items')
        default:
            return Promise.reject('The table ' + table_name + ' doesn\'t exist')
    }
}
