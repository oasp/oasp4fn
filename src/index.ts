
import db from './data-collector'

db.table('employees')
    .orderBy('error', 'desc')
    /*.then((res: any) => {
        return res.join()
    }, (err: Error) => {
        console.log(err)
    })
    .then((res: any) => {
        console.log
    }, (err: Error) => {
        console.log(err)
    })*/
    .table('departments')
    .join()
    .then((res: Array<Object>) => {
        console.log(res)
    }, (err: Error) => {
        console.log(err)
    })




    