# OASP4fn

> ### NOTE:
>
> *OASP has been superseded by devonfw*, the Open Source Standard Software Development Platform for state of the art Cloud Native Micro Service and Multi Platform Rich Web Apps, supported by Capgemini.
>
> See http://devonfw.com and on Github http://github.com/devonfw
>
> Individual products within OASP have been renamed to a corresponding one in devonfw. 
>
> For example:
>
> - OAPS4j -> devon4j
> - OASP4js -> devon4ng
> - OASP4NET -> devon4NET
>
> devonfw® is an exclusive and registered (European Trademark) product of Capgemini. Capgemini reserves all intellectual and industrial property rights over devonfw but publishes it under the Apache License, Version 2 – like OASP-  which makes devonfw 100% Open Source.
> See: https://tldrlegal.com/license/apache-license-2.0-(apache-2.0)

Oasp4fn will help you to develop your javascript cloud backend in a fast and easy way, thanks to his intuitive API and his query-style usage and making use of the [serverless framework](https://serverless.com/) and the [webpack](https://webpack.github.io/) build tool in the deployment. You only have to choose the services you want to use with your desired options and it will be ready to use.

For more information and examples, please check out our [github wiki](https://github.com/oasp/oasp4fn/wiki).

## Branch structure

The branch strategy in Oasp4fn, is strongly focused on the different provider used and the command line interface as described below:

- **master**: The current release.
- **develop**: The pre-release, all the code related to the new functionalities to be in the next release. 
- **develop-aws**: The development of all the stuff related to the AWS provider.
- **develop-kubeless**: The development of all the stuff related to the kubeless framework.
- **develop-cli**:  The command line interface development.

