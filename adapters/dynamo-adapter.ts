let DynamoDB = require('aws-sdk/clients/dynamodb')

let docClient = new DynamoDB.DocumentClient({ endpoint: "http://localhost:8000/", region: "us-west-2" })

export function getItem (table_name: string, id: string) {

}

export function getItems (table_name: string, ids?: Array<Object>) {
    // IMPORTANT: scan operation is limited to 1MB of data
    let params = {
        TableName: table_name
    }
   /* try {
      let res = await docClient.scan(params).promise()
      return res.Items
    }
    catch(err) {
      return err
    }*/
  
      /*.then((res: any) => {
        console.log('promise resolved')
        return Promise.resolve(res.Items)
      }, (err: Error) => {
        console.log('promise rejected')
        return Promise.reject(err)
      })*/

      return docClient.scan(params).promise()
              .then((res: any) => {
                return res.Items
              }, (err: Error) => {
                return Promise.reject(err)
              })
}

export function putItem (table_name: string, item: Object) {
  
}

export function putItems (table_name: string, items: Array<Object>) {

}

export function deleteItem (table_name: string, id: string) {

}

export function deleteItems (table_name: string, ids: Array<string>) {

}

