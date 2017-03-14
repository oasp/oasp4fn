
import db from './data-collector'


db.table('employees')
    .then((res: Array<Object>) => {
        console.log('Table employees')
        console.log(res)
    }, (err: Error) => {
        console.log(err)
    })

db.table('departments')
    .then((res: Array<Object>) => {
        console.log('\nTable departments')
        console.log(res)
    }, (err: Error) => {
        console.log(err)
    })

db.table('employees')
    .table('departments')
    .join('department', 'id')
    .then((res: Array<Object>) => {
        console.log('\nJoin of the table employees and departments')
        console.log(res)
    }, (err: Error) => {
        console.log(err)
    })

db.table('employees')
    .table('departments')
    .join('department', 'id')
    .where('dept_name', 'Logistic')
    .project('firstname', 'surname')
    .orderBy('firstname')
    .then((res: Array<Object>) => {
        console.log('\nFind the name and surname of the employees in the logistic department, ordered ascendingly by the name')
        console.log(res)
    }, (err: Error) => {
        console.log(err)
    })


db.table('employees')
    .reduce((result: Array<any>, o: any) => {
        if (o.firstname[0] === 'P' || o.firstname[0] === 'p')
            result.push(o) 
        return result
    })
    .orderBy('firstname', 'desc')
    .first(2)
    .then((res: Array<Object>) => {
        console.log('\nFind the last 2 employees which names start with the letter "P"')
        console.log(res)
    }, (err: Error) => {
        console.log(err)
    })