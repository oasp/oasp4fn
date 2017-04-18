# OASP4fn

Oasp4fn will help you to develop your javascript cloud backend in a fast and easy way, thanks to his intuitive API and his query-style usage. You only have to choose the services you want to use with your desired options and it will ready to use.

## Samples

### DynamoDB

```javascript 
import fn from 'oasp4fn'
import * as dynamo from 'oasp4fn/adapters/fn-dynamo'

fn.setDB(dynamo, {endpoint: "https://dynamodb.us-west-2.amazonaws.com"})

fn.table('employees')
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

```

### S3
    
```javascript  
import fn from 'oasp4fn'
import * as s3 from 'oasp4fn/adapters/fn-s3'

fn.setStorage(s3)

fn.bucket('devonfactory-odr')
    .then((res: Array<string>) => {
        console.log('\nListing the objects of the bucket devonfactory-odr')
        console.log(res)
    }, (err: Error) => {
        console.log(err)
    })

```