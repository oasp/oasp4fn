
import { expect } from 'chai';
import fn from '../../src/index';
import dynamo from '../../src/adapters/fn-dynamo';
import { Credentials } from 'aws-sdk';
let DynamoDB = require('aws-sdk/clients/dynamodb');

let endpoint = process.env.ENDPOINT || 'http://localhost:4569/';
let region = process.env.DEFAULT_REGION || 'us-east-1';
let dynamodb = new DynamoDB({ endpoint: endpoint, region: region });
let docClient = new DynamoDB.DocumentClient({ endpoint: endpoint, region: region });

fn.setDB(dynamo, { endpoint: endpoint, region: region });

interface Employee {
    id: string;
    firstname: string;
    surname: string;
    department: string;
}
let employees = [
    {id: '1', firstname: 'Paquito', surname: 'Chocolatero', department: '1'},
    {id: '2', firstname: 'Paquita', surname: 'Chocolatera', department: '3'},
    {id: '3', firstname: 'Paco', surname: 'Chocolatero', department: '1'},
    {id: '4', firstname: 'Fran', surname: 'Chocolatero', department: '2'}
];

interface Department {
    id: string;
    dept_name: string;
    floor: number[];
}
let departments = [
    {id: '1', dept_name: 'Logistic', floor: [1, 2]},
    {id: '2', dept_name: 'RRHH', floor: [3]},
    {id: '3', dept_name: 'Architecture', floor: [2, 3]},
    {id: '4', dept_name: 'UX', floor: [4, 5, 6]}
];

before(async function ()  {
    let creates: Promise<void>[] = [];
    let inserts: Promise<void>[] = [];
    this.timeout(0);

    let params = {
        TableName : 'employees',
        KeySchema: [
            { AttributeName: 'id', KeyType: 'HASH'}
        ],
        AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: 'S' }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
        }
    };
    try {
        await dynamodb.deleteTable({TableName: 'employees'}).promise();
    } catch (err) {
        if (err.code !== 'ResourceNotFoundException')
            return Promise.reject(err);
    }
    creates.push(dynamodb.createTable(params).promise());

    params = {
        TableName : 'departments',
        KeySchema: [
            { AttributeName: 'id', KeyType: 'HASH'}
        ],
        AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: 'S' }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
        }
    };
    try {
        await dynamodb.deleteTable({TableName: 'departments'}).promise();
    } catch (err) {
        if (err.code !== 'ResourceNotFoundException')
            return Promise.reject(err);
    }
    creates.push(dynamodb.createTable(params).promise());

    await Promise.all(creates);
    departments.forEach((department) => {
        let params = {
            TableName: 'departments',
            Item: department
        };
        inserts.push(docClient.put(params).promise());
    });
    employees.forEach((employee) => {
        let params = {
            TableName: 'employees',
            Item: employee
        };
        inserts.push(docClient.put(params).promise());
    });

    await Promise.all(inserts);
});

describe('table', () => {

     it('The function should return a reference to the self object', () => {
         expect(fn.table('employees')).to.be.an('object');
     });

     it('If the table exist, the resolution promise should return an object[]', async () => {
        const res = await fn.table('employees').promise();
        expect(res).to.be.an('array');
        expect(res).to.have.lengthOf(4);
     });

     it('If the table doesn\'t exist, the resolution promise should return an Error', () => {
        return fn.table('some_table').then((res: object[]) => {
                expect(res).to.be.undefined;
            }, (err: Error) => {
                expect(err).to.not.be.null;
         });
     });

     it('If an id is passed along with the name of the table, the corresponding item will be returned', async () => {
        const res = await fn.table('departments', '1').promise();
        expect(res).to.be.an('object');
        expect(res).to.have.property('id', '1');
     });

     it('If an array of id\'s is passed along with the name of the table, the corresponding list of items will be returned', async () => {
        const res = await fn.table('departments', ['1', '3', '4']).promise();
        expect(res).to.be.an('array');
        expect(res).to.have.lengthOf(3);
     });

     it('If an id passed doesn\'t have an item in the table, an error will be returned', () => {
        return fn.table('departments', '7')
             .then((res: Department) => {
                expect(res).to.be.undefined;
             }, (err: Error) => {
                expect(err).to.be.a('string');
             });
     });
});

describe('where', () => {

     it('The function should return a reference to the self object', () => {
         expect(fn.table('employees').where('id')).to.be.an('object');
     });

     it('If the operation is succesful, the resolution should be an object[]', async () => {
        const res = await fn.table('employees')
                            .where('id', '1')
                            .promise();
        expect(res).to.be.an('array');
        expect(res).to.have.lengthOf(1);
     });

     it('If the operation fail, the resolution should be an error', () => {
        return fn.table('employees')
                 .where('id', '1', '23')
                 .then((res: Employee[]) => {
                    expect(res).to.be.undefined;

                 }, (err: Error) => {
                    expect(err).to.be.a('string');
                 });
     });
});

describe('orderBy', () => {

     it('The function should return a reference to the self object', () => {
         expect(fn.table('employees').orderBy('id')).to.be.an('object');
     });

     it("If you don't specify an order, the result array is sorted ascendingly", async () => {
        const res  = <Employee[]>await fn.table('employees')
                                         .orderBy('id')
                                         .promise();
        expect(res).to.be.an('array');
        expect(res).to.have.lengthOf(4);
        let i = res.length;
        while (--i) {
            expect(res[i].id >= res[i - 1].id).to.be.true;
        }
     });

     it("If you specify 'desc' as the order, the result array is sorted descendingly", async () => {
        const res = <Employee[]>await fn.table('employees')
                                        .orderBy('id', 'desc')
                                        .promise();
        expect(res).to.be.an('array');
        expect(res).to.have.lengthOf(4);
        let i = res.length;
        while (--i) {
            expect(res[i].id <= res[i - 1].id).to.be.true;
        }
     });

     it('If you pass more than one attribute, the result array should be sorted having in mind all the atributtes', async () => {
        const res = <Employee[]>await fn.table('employees')
                                         .orderBy(['department', 'id'], 'desc')
                                         .promise();
        expect(res).to.be.an('array');
        expect(res).to.have.lengthOf(4);
        let i = res.length;
        while (--i) {
            expect(res[i].department <= res[i - 1].department).to.be.true;
            if (res[i].department === res[i - 1].department)
                expect(res[i].id <= res[i - 1].id).to.be.true;
        }
     });

     it('If you pass more than one attribute and more than one order, the result array should be sorted having in mind all the atributtes and all orders', async () => {
        const res = <Employee[]>await fn.table('employees')
                                         .orderBy(['department', 'id'], ['desc', 'asc'])
                                         .promise();
        expect(res).to.be.an('array');
        expect(res).to.have.lengthOf(4);
        let j = res.length;
        while (--j) {
            expect(res[j].department <= res[j - 1].department).to.be.true;
            if (res[j].department === res[j - 1].department)
                expect(res[j].id >= res[j - 1].id).to.be.true;
        }
     });

     it('If you pass more orders than attributes, the first orders corresponding to the attributtes length should be used', async () => {
        const res = <Employee[]>await fn.table('employees')
                                        .orderBy(['department', 'id'], ['desc', 'asc', 'des'])
                                        .promise();
        expect(res).to.be.an('array');
        expect(res).to.have.lengthOf(4);
        let i = res.length;
        while (--i) {
            expect(res[i].department <= res[i - 1].department).to.be.true;
            if (res[i].department === res[i - 1].department)
                expect(res[i].id >= res[i - 1].id).to.be.true;
        }
     });

     it("If you pass less orders than attributes, the unspecified orders should be 'asc'", async () => {
         const res = <Employee[]>await fn.table('employees')
                                         .orderBy(['department', 'id'], ['desc'])
                                         .promise();
        expect(res).to.be.an('array');
        expect(res).to.have.lengthOf(4);
        let i = res.length;
        while (--i) {
            expect(res[i].department <= res[i - 1].department).to.be.true;
            if (res[i].department === res[i - 1].department)
                expect(res[i].id >= res[i - 1].id).to.be.true;
        }
     });

     it("If the especified attribute doesn't exist, the function return the same array", async () => {
        const res = await fn.table('employees')
                            .orderBy('error')
                            .promise();
        expect(res).to.be.an('array');
        expect(res).to.have.lengthOf(4);
     });
});

describe('first', () => {
    let first_object: Employee;

     before(() => {
        return fn.table('employees')
             .then((res: Employee[]) => {
                 first_object = res[0];
             });
     });

     it('The function should return a reference to the self object', () => {
         expect(fn.table('employees').first()).to.be.an('object');
     });

     it('If the operation is succesful, the result is the first object of the table', async () => {
        const res = await fn.table('employees')
                            .first()
                            .promise();
        expect(res).to.be.an('array');
        expect(res).to.have.lengthOf(1);
        expect((res as any)[0]).to.deep.equal(first_object);
     });

     it("If the operation isn't done over an array, the operation should return an Error", () => {
        return fn.table('employees')
                 .count()
                 .first()
                 .then((res: Employee[]) => {
                       expect(res).to.be.undefined;
                 }, (err: Error) => {
                        expect(err).to.be.a('string');
                 });
     });
});

describe('count', () => {

     it('The function should return a reference to the self object', () => {
         expect(fn.table('employees').count()).to.be.an('object');
     });

     it('If the operation is succesful, the result is the number of items of the table', async () => {
        const res = await fn.table('employees')
                            .count()
                            .promise();
        expect(res).to.be.an('number');
        expect(res).to.be.equals(4);
     });

     it("If the operation isn't done over an array, the operation should return an error", () => {
        return fn.table('employees')
                 .count()
                 .count()
                 .then((res: number) => {
                    expect(res).to.be.undefined;
                 }, (err: Error) => {
                    expect(err).to.be.a('string');
                 });
     });
});

describe('project', () => {

     it('The function should return a reference to the self object', () => {
         expect(fn.table('employees').project('hi', 'bye')).to.be.an('object');
     });

     it('If the operation is succesful, the result is all the objects of the table but only with the specified properties', async () => {
        const res = <{ id: string, firstname: string }[]>await fn.table('employees')
                                                                 .project('id', 'firstname')
                                                                 .promise();
        expect(res).to.be.an('array');
        expect(res).to.have.lengthOf(4);
        res.forEach(o => {
            expect(o).to.be.an('object');
            expect(o).to.have.all.keys(['id', 'firstname']);
            expect(o).to.not.have.all.keys(['surname', 'department']);
        });
     });

     it('The operation can be done over a json object, and the result should be an object with the projected attributes', async () => {
        const res = <{ id: string }>await fn.table('employees', '1')
                                            .project('id')
                                            .promise();
        expect(res).to.be.an('object').that.has.all.keys('id');
        expect(res).to.not.have.all.keys(['surname', 'department', 'firstname']);
        expect(res.id).to.be.equal('1');
     });

     it('If the function is called with no parametters, the operation should return an error', () => {
        return fn.table('employees')
                 .project()
                 .then((res: undefined) => {
                        expect(res).to.be.undefined;
                    }, (err: Error) => {
                        expect(err).to.be.a('string');
                 });
     });

     it("If the operation isn't done over an array, the operation should return an error", () => {
        return fn.table('employees')
                 .count()
                 .project('id', 'firstname')
                 .then((res: {id: string, firstname: string}[]) => {
                        expect(res).to.be.undefined;
                    }, (err: Error) => {
                        expect(err).to.be.a('string');
                 });
     });
});

describe('reduce', () => {

     it('The function should return a reference to the self object', () => {
         expect(fn.table('employees').reduce((result: object[], o: any) => {
                result.push(o);
                return result;
            }, [])).to.be.an('object');
     });

     it('If the operation is succesful, the result is the table with the item changes specified by the passed function', async () => {
        const res = <Employee[]>await fn.table('employees')
                                        .reduce((result: Employee[], o: Employee) => {
                                            o.department = '1';
                                            result.push(o);
                                            return result;
                                        }, [])
                                        .promise();
        expect(res).to.be.an('array');
        expect(res).to.have.lengthOf(4);
        res.forEach(o => {
            expect(o).to.be.an('object');
            expect(o).to.have.all.keys(['id', 'firstname', 'surname', 'department']);
            expect(o.department).to.be.equal('1');
        });
     });

     it('The operation can be done over a json object, and the result should be specified by the fucntion and initial accumulator passed', async () => {
        const res = await fn.table('employees', '1')
                            .reduce((accum: string[], o: string) => {
                                if (typeof o === 'string')
                                    accum.push(o);
                                return accum;
                            })
                            .promise();
        expect(res).to.be.an('array');
        expect(res).to.have.lengthOf(4);
        expect(res).to.have.members(['1', 'Paquito', 'Chocolatero', '1']);
     });

     it("If the operation isn't done over an object, the operation should return an error", () => {
        return fn.table('employees')
                 .count()
                 .reduce((result: Employee[], o: Employee) => {
                    o.department = '1';
                    result.push(o);
                    return result;
                 }, [])
                 .then((res: object[]) => {
                    expect(res).to.be.undefined;
                 }, (err: Error) => {
                    expect(err).to.be.a('string');
                 });
     });
});

describe('map', () => {

     it('The function should return a reference to the self object', () => {
         expect(fn.table('employees').map((o: Employee) => o.id)).to.be.an('object');
     });

     it('If the operation is succesful, the result are the items of the table but mapped by the specified function', async () => {
        const res = <string[]>await fn.table('employees')
                                      .map('id')
                                      .promise();
        expect(res).to.be.an('array');
        expect(res).to.have.lengthOf(4);
        res.forEach(o => {
            expect(o).to.be.a('string');
            expect(Number.parseInt(o)).to.be.within(1, 4);
        });
     });

     it('The operation can be done over a json object, and the result should be an array', async () => {
        const res = await fn.table('employees', '1')
                            .map((o: string, key: string) => key)
                            .promise();
        expect(res).to.be.an('array');
        expect(res).to.have.lengthOf(4);
        expect(res).to.have.members(['firstname', 'id', 'department', 'surname']);
     });

     it("If the operation isn't done over an object, the operation should return an error", () => {
        return fn.table('employees')
                 .count()
                 .map((o: Employee) => o.id)
                 .then((res: object[]) => {
                        expect(res).to.be.undefined;
                    }, (err: Error) => {
                        expect(err).to.be.a('string');
                 });
     });
});

describe('filter', () => {

     it('The function should return a reference to the self object', () => {
         expect(fn.table('employees').filter('id')).to.be.an('object');
     });

     it('If the operation is succesful, the result are the items of the table that pass the filter', async () => {
        const res = <Employee[]>await fn.table('employees')
                                        .filter('id')
                                        .promise();
        expect(res).to.be.an('array');
        expect(res).to.have.lengthOf(4);
        res.forEach(o => {
            expect(o).to.be.an('object');
            expect(o).to.have.all.keys(['id', 'firstname', 'surname', 'department']);
        });
     });

     it('The operation can be done over a json object, and the result should be an array', async () => {
        const res = await fn.table('employees', '1')
                            .filter((o: string, key: string) => key === 'id')
                            .promise();
        expect(res).to.be.an('array');
        expect(res).to.have.lengthOf(1);
        expect(res).to.have.members(['1']);
     });

     it("If the operation isn't done over an object, the operation should return an error", () => {
        return fn.table('employees')
                 .count()
                 .map((o: Employee) => o.id)
                 .then((res: object[]) => {
                        expect(res).to.be.undefined;
                    }, (err: Error) => {
                        expect(err).to.be.a('string');
                 });
     });
});

describe('join', () => {

     it('The function should return a reference to the self object', () => {
         expect(fn.table('employees').table('departments').join('department', 'id')).to.be.an('object');
     });

     it('If the operation is succesful, the result is a joined table', async () => {
        const res = await fn.table('employees')
                            .table('departments')
                            .join('department', 'id')
                            .promise();
        expect(res).to.be.an('array');
        expect(res).to.have.lengthOf(4);
     });

     it('If the operation fail, the resolution should be an error', () => {
        return fn.table('employees')
                 .join('department', 'id')
                 .then((res: object[]) => {
                    expect(res).to.be.undefined;
                 }, (err: Error) => {
                    expect(err).to.not.be.null;
                 });
     });
});

describe('insert', () => {

     it('The function should return a reference to the self object', () => {
         expect(fn.insert('departments', [{id: '7', name: 'Sales'}, {id: '5', name: 'Comercial'}])).to.be.an('object');
     });

     it('If the operation is performed over an array of items, the result is an array of ids', async () => {
        const res = await fn.insert('departments', [{ id: '7', name: 'Sales' }, { id: '5', name: 'Comercial' }])
                                 .promise();
        expect(res).to.be.an('array');
        expect(res).to.have.lengthOf(2);
     });

     it('If the operation is performed over a single object, the result is an id', async () => {
        const res = await fn.insert('departments', { id: '8', name: 'Sales' })
                                  .promise();
        expect(res).to.be.a('string').equal('8');
     });

     it('If the operation is not starter, the operation insert the items on which we are operating', async () => {
        const res = await fn.table('departments')
                            .map((o: Department) => {
                                o.id = (Number.parseInt(o.id) + 8).toString();
                                return o;
                            })
                            .insert()
                            .promise();
        expect(res).to.be.an('array');
        expect(res).to.have.lengthOf(7);
     });

     it('If an empty array is passed to the operation, the result should be an empty array', async () => {
        const res = await fn.insert('employees', [])
                             .promise();
        expect(res).to.be.an('array').empty;
     });

     it('If the operation is done over an empty array, the result should be an empty array', async () => {
        const res = await fn.table('employees')
                             .where('id', 'x', '=')
                             .insert()
                             .promise();
        expect(res).to.be.an('array').empty;
     });

     it('If the operation fail, the resolution should be an error', () => {
        return fn.insert('employee', {id: '7', name: 'Sales'})
                 .then((res: string) => {
                    expect(res).to.be.undefined;
                 }, (err: Error) => {
                    expect(err).to.not.be.null;
                });
     });
});

describe('delete', () => {

     it('The function should return a reference to the self object', () => {
         expect(fn.delete('employees', '1')).to.be.an('object');
     });

     it('If an array is passed to the operation, the result is an array of ids', async () => {
        const res = await fn.delete('departments', ['5', '7'])
                                 .promise();
        expect(res).to.be.an('array');
        expect(res).to.have.lengthOf(2);
        expect(res).to.have.members(['5', '7']);
     });

     it('If the operation is succesful, the result is an id', async () => {
        const res = await fn.delete('departments', '8')
                                  .promise();
        expect(res).to.be.a('string').equals('8');
     });

     it('If the operation is not starter, and it\'s performed over a single element, the operation will delete that item', async () => {
        const res = await fn.table('departments', '9')
                       .project('id')
                       .delete()
                       .promise();
        expect(res).to.be.an('string').equal('9');
     });

     it('If the operation is not starter, and it\'s performed over an array of elements, the operation will delete these items', async () => {
        const res = await fn.table('departments', ['10', '11', '12'])
                       .project('id')
                       .delete()
                       .promise();
        expect(res).to.be.an('array');
        expect(res).to.have.lengthOf(3);
        expect(res).to.have.members(['10', '11', '12']);
     });

     it('If the operation is not starter, it\'s possible to get the item to delete reducing the object which we want to delete', async () => {
        const res = await fn.table('departments', '13')
                       .reduce((accum: string, o: string | number[], key: string) => {
                            if (key === 'id')
                                return o;
                            else
                                return accum;
                        }, '')
                        .delete()
                        .promise();
        expect(res).to.be.an('string').equal('13');
     });

    it('If the operation is not starter, it\'s possible to get the items to delete reducing an array of objects', async () => {
        const res = await fn.table('departments')
                             .reduce((accum: string[], o: Department) => {
                                if (Number.parseInt(o.id) > 13)
                                    accum.push(o.id);
                                return accum;
                             })
                             .delete()
                             .promise();
        expect(res).to.be.an('array');
        expect(res).to.have.lengthOf(2);
        expect(res).to.have.members(['15', '16']);
     });

     it('If an empty array is passed to the operation, the result should be an empty array', async () => {
        const res = await fn.delete('employees', [])
                            .promise();
        expect(res).to.be.an('array').empty;
     });

     it('If the operation is done over an empty array, the result should be an empty array', async () => {
        const res = await fn.table('employees')
                             .where('id', 'x')
                             .delete()
                             .promise();
        expect(res).to.be.an('array').empty;
     });

     it('If the operation is performed over an inexisten table, the resolution should be an error', () => {
        return fn.delete('employee', '3')
             .then((res: string) => {
                    expect(res).to.be.undefined;
                }, (err: Error) => {
                    expect(err).to.not.be.null;
             });

     });

     it('If the operation tries to delete an inexistent item, the resolution should be an error', () => {
        return fn.delete('employees', 'hola')
            .then((res: string) => {
                expect(res).to.be.undefined;
            }, (err: Error) => {
                expect(err).to.not.be.null;
            });
     });
});
