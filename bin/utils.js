const sc2 = require('sc2-sdk');
const db = require("../bin/config").db;
var dhive = require('@hivechain/dhive');
var client = new dhive.Client('https://anyx.io');


function sc_valid(username, access_token)
{
    return new Promise(resolve => {

        let api = sc2.Initialize({});

        api.setAccessToken(access_token);

        api.me(function (err, res) {
            if (err)
                return resolve([false, err]);

            if (res.name === username)
                return resolve([true]);

            return resolve([true]);
        });
    });
}

function log10(str) {
    const leadingDigits = parseInt(str.substring(0, 4));
    const log = Math.log(leadingDigits) / Math.LN10 + 0.00000001;
    const n = str.length - 1;
    return n + (log - parseInt(log));
}

const repLog10 = rep2 => {
    if (rep2 == null) return rep2;
    let rep = String(rep2);
    const neg = rep.charAt(0) === '-';
    rep = neg ? rep.substring(1) : rep;

    let out = log10(rep);
    if (isNaN(out)) out = 0;
    out = Math.max(out - 9, 0); // @ -9, $0.50 earned is approx magnitude 1
    out = (neg ? -1 : 1) * out;
    out = out * 9 + 25; // 9 points per magnitude. center at 25
    // base-line 0 to darken and < 0 to auto hide (grep rephide)
    out = parseInt(out);
    return out;
};


function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function setupSteem() {
    const steem = require('steem');
    steem.api.setOptions({url: 'https://anyx.io'});
    return steem;
}



function wait(time)
{
    return new Promise(resolve => {
        setTimeout(() => resolve('☕'), time*1000); // miliseconds to seconds
    });
}


function valid_login(username, token, type)
{
    return new Promise(async resolve => {

        let valid;

        if (type === "keychain") {
            let user = await db("SELECT * FROM user_login WHERE username = ? AND token = ?", [username, token])
            valid = user.length === 1;
        } else {
            valid = (await sc_valid(username, token))[0];
        }

        return resolve(valid);
    });
}


function vote(username, wif, author, permlink, weight) {

    return new Promise(async resolve => {

        const private_key = dsteem.PrivateKey.fromString(wif);

        await client.broadcast.vote({
            voter: username,
            author: author,
            permlink: permlink,
            weight: weight
        }, private_key).catch(async function(error) {
            if (error.message.indexOf("Can only vote once every 3 seconds") !== -1)
                console.error("Can only vote once every 3 seconds");
            else if (error.message === "HTTP 504: Gateway Time-out" || error.message === "HTTP 502: Bad Gateway" || error.message.indexOf("request to https://anyx.io failed, reason: connect ETIMEDOUT") !== -1 || error.message.indexOf("transaction tapos exception") !== -1)
                console.error("Error 504/502");
            else
                console.error(error);
            await wait(5);
            return resolve(error);
        });

        await wait(5);
        return resolve("");
    })
}



function vote_err_handled(username, wif, author, permlink, percentage)
{
    return new Promise(async resolve => {

        percentage = Math.floor(percentage);

        let result = await vote(username, wif, author, permlink, percentage);

        if (result !== "") {
            for (let k = 0; k < 10; k++) {
                console.error("vote failed for " + username + " voting on " + author + "/" + permlink);
                result = await vote(username, wif, author, permlink, percentage);
                if (result === "") {
                        console.log(`${username} unvoted @${author}/${permlink}`);
                    return resolve("");
                }
            }
            return resolve("failed")
        }

        console.log(`${username} unvoted @${author}/${permlink}`);

        return resolve("");

    });
}


module.exports = {
    sc_valid,
    repLog10,
    wait,
    valid_login,
    vote_err_handled
};