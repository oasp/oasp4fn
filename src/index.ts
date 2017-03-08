
import db from './data-collector'

db.table('employees')
    .table('departments')
    .join('department', 'id')
    .then((res: Array<Object>) => {
        console.log(res)
    }, (err: Error) => {
        console.log(err)
    })




    