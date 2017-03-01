import * as _ from 'lodash'
let DynamoDB = require('aws-sdk/clients/dynamodb')

let docClient = new DynamoDB.DocumentClient({ endpoint: "http://localhost:8000/", region: "us-west-2" })

export function getItem (table_name: string, id: string) {
  let params = {
        TableName: table_name,
        Key: {
          id: id
        }
    }

    return docClient.get(params).promise()
            .then((res: any) => {
              return res.Item
            }, (err: Error) => {
              return Promise.reject(err)
            })
}

export function getItems (table_name: string, ids?: Array<Object>) {
    // IMPORTANT: scan operation is limited to 1MB of data

    if (ids) {
      let params = {
        RequestItems: {}
      } 
      let keys = _.reduce(ids, (result: Array<Object>, id: string) => {
        result.push({id: id})
        return result
      }, [])
      params.RequestItems = Object.defineProperty(params.RequestItems, table_name, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: { keys: keys }
      });
      return docClient.batchGet(params).promise()
              .then((res: any) => {
                return res.Items
              }, (err: Error) => {
                return Promise.reject(err)
              })
    }
    else {
      let params = {
        TableName: table_name
      }  
      return docClient.scan(params).promise()
              .then((res: any) => {
                return res.Items
              }, (err: Error) => {
                return Promise.reject(err)
              })
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

