
import db from './data-collector'

db.table('Music')
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
    .table('Configurations')
    .join()
    .then((res: Array<Object>) => {
        console.log(res)
    }, (err: Error) => {
        console.log(err)
    })


    