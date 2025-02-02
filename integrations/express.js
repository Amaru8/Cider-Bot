const express = require('express');
const port = require('../local').port();
const url = require('../local').expressurl();
const { clientId, clientSecret } = require('../local').auth;

const fetch = require('node-fetch');

const app = express();

app.get('/', async (request, response) => {
    const code = request.query.code || null;
    const transactionId = request.query.transaction_id || null
    if (code) {
        try {
            const oauthResult = await fetch('https://discord.com/api/oauth2/token', {
                method: 'POST',
                body: new URLSearchParams({
                    client_id: clientId(),
                    client_secret: clientSecret(),
                    code: code,
                    grant_type: 'authorization_code',
                    redirect_uri: `http://${url}`,
                    scope: 'identify',
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const oauthData = await oauthResult.json();
            console.log(oauthData);
            response.send(oauthData);
        } catch (error) {
            // NOTE: An unauthorized token will not throw an error;
            // it will return a 401 Unauthorized response in the try block above
            console.error(error);
        }
    //} else if (transactionId) {
    //    response.redirect('/verify')
    } else {
        response.redirect('https://cdn.cryptofyre.org/Videos/lagtrain.mp4');
    }
});
app.get('/verify', (request, response) => {
    response.redirect(`https://discord.com/api/oauth2/authorize?client_id=921475709694771252&redirect_uri=http%3A%2F%2F${url}&response_type=code&scope=identify`)
});

app.listen(port, () => console.log(`App listening at http://${url}`));
