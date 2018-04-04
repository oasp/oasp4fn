export enum ProjectType {
    Serverless = 'serverless',
    Nestjs = 'nestjs'
}

export interface NewProjectOptions {
    projectName: string;
    path: string;
    force?: boolean;
    provider?: string;
    name: string;
    email: string;
}

export interface NewHandlerOptions {
    provider: string;
    event: string;
    trigger: string;
    'handler-name': string;
    path?: string;
    bucket?: string;
}