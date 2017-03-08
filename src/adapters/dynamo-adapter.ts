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
      })
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

export function putItem (table_name: string, item: any) {
  let params = {
    TableName: table_name,
    Item: item
  }
  return docClient.put(params).promise()
           .then((res: any) => {
             return item.id
           }, (err: Error) => {
             return Promise.reject(err)
           })
}

export function putItems (table_name: string, items: Array<Object>) {
  let params = {
    RequestItems: {}
  }
  let item_list = _.reduceRight(items, (result: any, item: Object) => {
    result.push({PutRequest:{Item: item}})
    return result
  }, [])
  params.RequestItems = Object.defineProperty(params.RequestItems, table_name, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: item_list
      }) 
  return docClient.batchWrite(params).promise()
         .then((res: any) => {
           return res.ItemCollectionMetrics[table_name].ItemCollectionKey
         }, (err: Error) => {
           return Promise.reject(err)
         })
}

export function deleteItem (table_name: string, id: string) {
  let params = {
    TableName: table_name,
    Key: {
      id: id
    },
    ReturnValues: 'ALL_OLD'
  }
  return docClient.delete(params).promise()
           .then((res: any) => {
             if(res.Attributes === undefined)
               return Promise.reject('The item with id: ' + id + ' doesn\'t exist')
             return res.Attributes.id
           }, (err: Error) => {
             return Promise.reject(err)
           })
}

export function deleteItems (table_name: string, ids: Array<any>) {
  let params = {
    RequestItems: {}
  }
  let key_list = _.reduceRight(ids, (result: any, id: string) => {
    result.push({DeleteRequest:{Key:{ id: id }}})
    return result
  }, [])
  params.RequestItems = Object.defineProperty(params.RequestItems, table_name, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: key_list
      }) 
  return docClient.batchWrite(params).promise()
         .then((res: any) => {
           return res.ItemCollectionMetrics[table_name].ItemCollectionKey
         }, (err: Error) => {
           return Promise.reject(err)
         })
}

