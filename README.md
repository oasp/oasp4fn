# OASP4fn

Oasp4fn will help you to develop your javascript cloud backend in a fast and easy way, thanks to his intuitive API and his query-style usage. You only have to choose the services you want to use with your desired options and it will be ready to use.

## Samples

### DynamoDB

```javascript 
import oasp4fn from '@oasp/oasp4fn';
import dynamo from '@oasp/oasp4fn/dist/adapters/fn-dynamo';

oasp4fn.setDB(dynamo, {endpoint: "https://dynamodb.us-west-2.amazonaws.com"});

oasp4fn.table('employees')
    .table('departments')
    .join('department', 'id')
    .where('dept_name', 'Logistic')
    .project('firstname', 'surname')
    .orderBy('firstname')
    .then((res: object[]) => {
        console.log('\nFind the name and surname of the employees in the logistic department, ordered ascendingly by the name')
        console.log(res)
    }, (err: Error) => {
        console.log(err)
});

```

### S3
    
```javascript  
import oasp4fn from '@oasp/oasp4fn';
import s3 from '@oasp/oasp4fn/dist/adapters/fn-s3';

oasp4fn.setStorage(s3);

oasp4fn.bucket('your-bucket-name')
    .then((res: string[]) => {
        console.log('\nListing the objects of the bucket')
        console.log(res)
    }, (err: Error) => {
        console.log(err)
    });

```

### Cognito

```javascript  
import oasp4fn from '@oasp/oasp4fn';
import cognito from '@oasp/oasp4fn/dist/adapters/fn-cognito';

oasp4fn.setAuth(cognito);

oasp4fn.login('user', 'password', {clientId: 'your-client-id', userPoolId: 'your-pool-id'})
    .then((tokens: object) => {
        console.log('\nLogin with cognito');
        console.log(tokens);
    }, (err: Error) => {
        console.log(err)
    });

```