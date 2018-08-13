export const environment = {
    production: false,
    baseUrl: 'http://cryptoapi.us-west-2.elasticbeanstalk.com',
    baseApiUrl: 'http://cryptoapi.us-west-2.elasticbeanstalk.com/api/v1',
    domain: 'http://cryptoapi.us-west-2.elasticbeanstalk.com',
    api: {
        login: 'api/auth/login',
        validateToken: 'api/auth/validatetoken'
    },
    fbConfig: {
        appId: '186964375335970',
        status: false,
        cookie: false,
        xfbml: false,
        version: 'v2.8'
    },
    auth: {
        token: '',
        cred: '',
        refreshToken: ''
    }
};
