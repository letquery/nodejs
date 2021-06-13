var request = require('request');

function let_query(url, query, options = null) {
    if (options === null) {
        options = {
            url: url,
            qs: query,
            headers: {
                'User-Agent': 'Node.js'
            },
            basic_auth: null,
            auth: null,
            delay: 1000
        };
    }
    const delay = options.delay;

    if (options.basic_auth) {
        const [user, pass] = options.basic_auth.split(':');
        options.auth = {
            user,
            pass
        };
    }

    return new Promise(function (resolve, reject) {
        request(options, function (error, res, body) {
            if (res.statusCode == 200) {
                resolve(JSON.parse(body));
            } else if (+res.headers['x-ratelimit-remaining'] == 0) {
                const date = new Date(+res.headers['x-ratelimit-reset'] * delay);
                reject('Rate limit util ' + date);
            } else {
                reject('Error code ' + res.statusCode);
            }
        });
    });
}

module.exports = let_query;
