import fn from './index';
import dynamo from './adapters/fn-dynamo';
import s3 from './adapters/fn-s3';
import cognito from './adapters/fn-cognito';
import * as fs from 'fs';

// Dynamo
fn.setDB(dynamo);

fn.table('employees')
    .then((res: object[]) => {
        console.log('\nTable employees');
        console.log(res);
    }, (err: Error) => {
        console.log(err);
    });

fn.table('departments')
    .then((res: object[]) => {
        console.log('\nTable departments');
        console.log(res);
    }, (err: Error) => {
        console.log(err);
    });

fn.insert('employees', {id: '5', firstname: 'Pepe', surname: 'Chocolatero', department: '1'})
    .then((res: string) => {
        console.log('\nInsert of the employee: {id: "5", firstname: "Pepe", surname: "Chocolatero", department: "1"}');
        console.log(res);
    }, (err: Error) => {
        console.log(err);
    });

fn.delete('employees', '1')
    .then((res: string) => {
        console.log('\nDelete of the employee with id 1');
        console.log(res);
    }, (err: Error) => {
        console.log(err);
    });

fn.table('employees')
    .then((res: object[]) => {
        console.log('\nThe table employees after the insert and delete');
        console.log(res);
    }, (err: Error) => {
        console.log(err);
    });

fn.table('employees')
    .table('departments')
    .join('department', 'id')
    .then((res: object[]) => {
        console.log('\nJoin of the table employees and departments');
        console.log(res);
    }, (err: Error) => {
        console.log(err);
    });

fn.table('departments')
    .reduce((result: any[], o: any) => {
        if (o.floor.length === 2)
            result.push(o);
        return result;
    })
    .count()
    .then((res: number) => {
        console.log('\nThe number of departments that are located in 2 different floors');
        console.log(res);
    }, (err: Error) => {
        console.log(err);
    });

fn.table('employees')
    .reduce((result: any[], o: any) => {
        if (o.firstname[0] === 'P' || o.firstname[0] === 'p')
            result.push(o);
        return result;
    })
    .orderBy('firstname', 'desc')
    .first(2)
    .then((res: object[]) => {
        console.log('\nFind the last 2 employees which names start with the letter "P"');
        console.log(res);
    }, (err: Error) => {
        console.log(err);
    });

fn.table('employees')
    .table('departments')
    .join('department', 'id')
    .where('dept_name', 'Logistic')
    .project('firstname', 'surname')
    .orderBy('firstname')
    .then((res: object[]) => {
        console.log('\nFind the name and surname of the employees in the logistic department, ordered ascendingly by the name');
        console.log(res);
    }, (err: Error) => {
        console.log(err);
    });

// S3
fn.setStorage(s3);

fn.bucket('devonfactory-odr')
    .then((res: string[]) => {
        console.log('\nListing the objects of the bucket devonfactory-odr');
        console.log(res);
    }, (err: Error) => {
        console.log(err);
    });

fs.readFile('./README.md', async (err, data) => {
    if (err)
        console.log(err);
    else {
        try {
            let res = await fn.upload('oasp4fn', 'README.md', data, 'text/plain').promise()
            console.log('\nReading a file and updloading to s3');
            console.log(res);
            res = await fn.bucket('oasp4fn', 'README.md').promise()
            console.log('\nGetting the object README.md from oasp4fn');
            console.log(res);
            res = await fn.deleteObject('oasp4fn', 'README.md').promise();
            console.log('\nDeleting the object README.md from oasp4fn');
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    }
});

// Cognito
fn.setAuth(cognito);

let cognitoAsyncOps = async () => {
    let tokens = await fn.login('user', 'password', {clientId: '7i7cv6peukkugtcjvnhvmc4moe', userPoolId: 'us-west-2_1511o0vuo'}).promise()
    console.log('\nLogin with cognito');
    console.log(tokens);
    tokens = await fn.refresh((<{RefreshToken: string}>tokens).RefreshToken, {clientId: '7i7cv6peukkugtcjvnhvmc4moe', userPoolId: 'us-west-2_1511o0vuo'}).promise();
    console.log('\nRefreshing tokens with cognito');
    console.log(tokens);
}

cognitoAsyncOps();
