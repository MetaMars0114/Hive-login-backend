const utils = require("../bin/utils");
const db = require("../bin/config").db;

var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const sanitize = require("xss");
const Joi = require('joi');

const urlencodedParser = bodyParser.urlencoded({limit: '500kb', extended: true});

/**
    Gets the various trails for an user, includes trail downvotes, counter downvotes and counter upvotes
    @username - steem username
    @token - hivesigner or keychain token
    @type - hivesigner or keychain
 */
router.post('/get_trail',urlencodedParser, async function(req, res, next) {
    const username = sanitize(req.body.username);
    const token = sanitize(req.body.token);
    const type = sanitize(req.body.type);

    if (username && token && type) {

        const valid = await utils.valid_login(username, token, type);
        if (valid === true) {
            let data = await db("SELECT * FROM trail where username = ?", [username]);

            return res.send({status : "ok", data});
        } else
            return res.send({status : "ko"});
    }

    return res.send({status : "ko", data : "no_infos"});
});

/**
 Gets the whitelist for an user
 @username - steem username
 @token - hivesigner or keychain token
 @type - hivesigner or keychain
 */
router.post('/get_whitelist',urlencodedParser, async function(req, res, next) {

    const username = sanitize(req.body.username);
    const token = sanitize(req.body.token);
    const type = sanitize(req.body.type);

    if (username && token && type) {

        const valid = await utils.valid_login(username, token, type);
        if (valid === true) {
            let data = await db("SELECT * FROM whitelist where username = ?", [username]);

            return res.send({status : "ok", data});
        } else
            return res.send({status : "ko"});
    }

    return res.send({status : "ko", data : "no_infos"});
});

/**
 Gets the counter downvote blacklist for an user
 @username - steem username
 @token - hivesigner or keychain token
 @type - hivesigner or keychain
 */
router.post('/get_counter_dv_blacklist',urlencodedParser, async function(req, res, next) {

    const username = sanitize(req.body.username);
    const token = sanitize(req.body.token);
    const type = sanitize(req.body.type);

    if (username && token && type) {

        const valid = await utils.valid_login(username, token, type);
        if (valid === true) {
            let data = await db("SELECT * FROM counter_dv_blacklist where username = ?", [username]);

            return res.send({status : "ok", data});
        } else
            return res.send({status : "ko"});
    }

    return res.send({status : "ko", data : "no_infos"});
});

/**
    Gets the hitlist for an user
 @username - steem username
 @token - hivesigner or keychain token
 @type - hivesigner or keychain
 */
router.post('/get_hitlist',urlencodedParser, async function(req, res, next) {
    const username = sanitize(req.body.username);
    const token = sanitize(req.body.token);
    const type = sanitize(req.body.type);

    if (username && token && type) {

        const valid = await utils.valid_login(username, token, type);
        if (valid === true) {
            let data = await db("SELECT * FROM hitlist where username = ?", [username]);

            return res.send({status : "ok", data});
        } else
            return res.send({status : "ko"});
    }
    return res.send({status : "ko", data : "no_infos"});
});

/**
    Gets the vote history for an user
 @username - steem username
 @token - hivesigner or keychain token
 @type - hivesigner or keychain
 */
router.post('/get_vote_history',urlencodedParser, async function(req, res, next) {

    const username = sanitize(req.body.username);
    const token = sanitize(req.body.token);
    const type = sanitize(req.body.type);

    if (username && token && type) {

        const valid = await utils.valid_login(username, token, type);
        if (valid === true) {
            let data = await db("SELECT * FROM executed_votes where username = ? ORDER BY id DESC", [username]);

            return res.send({status : "ok", data});
        } else
            return res.send({status : "ko"});
    }

    return res.send({status : "ko", data : "no_infos"});
});

/**
    adds a trail to an user
 @username - steem username
 @token - hivesigner or keychain token
 @type - hivesigner or keychain
    @trailed - steem username of the trailed user
    @ratio - ratio for the vote
    @trail_type - type of the trail (trail downvotes, counter upvotes, counter downvotes)
 */
router.post('/add_trail',urlencodedParser, async function(req, res, next) {

    const username = sanitize(req.body.username);
    const token = sanitize(req.body.token);
    const type = sanitize(req.body.type);

    const trailed = sanitize(req.body.trailed);
    const ratio = sanitize(req.body.ratio);
    const trail_type = sanitize(req.body.trail_type);

    if (username && token) {

        let trailed_schema = Joi.object().keys({
            username: Joi.string().min(3).max(16).required(),
            ratio: Joi.number().min(0.01).max(2.5),
        });

        let test = Joi.validate({username : trailed, ratio : ratio}, trailed_schema);

        if (test.error !== null) {
            return res.send({status : "ko"});
        }

        const valid = await utils.valid_login(username, token, type);

        if (valid === true) {

            let data;

            if (trail_type === -1 || trail_type === 1)
                data = await db("SELECT 1 from trail where username = ? and trailed = ? and type IN (-1, 1)", [username, trailed]);
             else
                data = await db("SELECT 1 from trail where username = ? and trailed = ? and type = ?", [username, trailed, trail_type]);

            if (data.length !== 0) {
                return res.send({status: "ko", error: "already exists"});
            }

            await db("INSERT INTO trail(id, username, trailed, ratio, type) VALUE(NULL, ?, ?, ?, ?)", [username, trailed, ratio, trail_type]);

            return res.send({status : "ok"});
        } else
            return res.send({status : "ko"});
    }

    return res.send({status : "ko", data : "no_infos"});
});

/**
    adds a whitelisted user to an user
    @param username - steem username
    @param token - hivesigner or keychain token
    @param type - hivesigner or keychain
    @param trailed - steem username of the trailed user
 */
router.post('/add_whitelist',urlencodedParser, async function(req, res, next) {

    const username = sanitize(req.body.username);
    const token = sanitize(req.body.token);
    const trailed = sanitize(req.body.trailed);
    const type = sanitize(req.body.type);

    if (username && token && type) {

        let trailed_schema = Joi.object().keys({
            username: Joi.string().min(3).max(16).required(),
        });

        let test = Joi.validate({username : trailed}, trailed_schema);

        if (test.error !== null) {
            return res.send({status : "ko"});
        }

        const valid = await utils.valid_login(username, token, type);

        if (valid === true) {

            let data = await db("SELECT 1 from whitelist where username = ? and trailed = ?", [username, trailed]);
            if (data.length !== 0) {
                return res.send({status: "ko", error: "already exists"});
            }

            await db("INSERT INTO whitelist(id, username, trailed) VALUE(NULL, ?, ?)", [username, trailed]);

            return res.send({status : "ok"});
        } else
            return res.send({status : "ko"});
    }

    return res.send({status : "ko", data : "no_infos"});
});

/**
    adds an user to the counter downvote blacklist of an user
    @param username - steem username
    @param token - hivesigner or keychain token
    @param type - hivesigner or keychain
    @param trailed - steem username of the trailed user
 */
router.post('/add_counter_dv_blacklist',urlencodedParser, async function(req, res, next) {

    const username = sanitize(req.body.username);
    const token = sanitize(req.body.token);
    const trailed = sanitize(req.body.trailed);
    const type = sanitize(req.body.type);

    if (username && token && type) {

        let trailed_schema = Joi.object().keys({
            username: Joi.string().min(3).max(16).required(),
        });

        let test = Joi.validate({username : trailed}, trailed_schema);

        if (test.error !== null) {
            return res.send({status : "ko"});
        }

        const valid = await utils.valid_login(username, token, type);

        if (valid === true) {

            let data = await db("SELECT 1 from counter_dv_blacklist where username = ? and trailed = ?", [username, trailed]);
            if (data.length !== 0) {
                return res.send({status: "ko", error: "already exists"});
            }

            await db("INSERT INTO counter_dv_blacklist(id, username, trailed) VALUE(NULL, ?, ?)", [username, trailed]);

            return res.send({status : "ok"});
        } else
            return res.send({status : "ko"});
    }

    return res.send({status : "ko", data : "no_infos"});
});

/**
    adds an author to the hitlist of an user
    @username - steem username
    @token - hivesigner or keychain token
    @type - hivesigner or keychain
    @author  - steem username of the author
    @percent  - percentage to hit the author with
 */
router.post('/add_hitlist',urlencodedParser, async function(req, res, next) {

    const username = sanitize(req.body.username);
    const token = sanitize(req.body.token);
    const type = sanitize(req.body.type);

    const author = sanitize(req.body.author);
    const percent = sanitize(req.body.percent);
    const min_payout = sanitize(req.body.min_payout);

    if (username && token && type) {

        let hitlist_schema = Joi.object().keys({
            username: Joi.string().min(3).max(16).required(),
            percent: Joi.number().min(0.1).max(100),
            min_payout: Joi.number().min(0.01),
        });


        let test = Joi.validate({username: author, percent, min_payout}, hitlist_schema);

        if (test.error !== null) {
            return res.send({status: "ko"});
        }

        const valid = await utils.valid_login(username, token, type);

        if (valid === true) {

            let data = await db("SELECT 1 from hitlist where username = ? and author = ?", [username, author]);


            if (data.length !== 0) {
                return res.send({status: "ko", error: "already exists"});
            }

            await db("INSERT INTO hitlist(username, author,  percent, min_payout) VALUE(?, ?, ?, ?)", [username, author, percent, min_payout]);

            return res.send({status: "ok"});
        } else
            return res.send({status: "ko"});
    }

    return res.send({status : "ko", data : "no_infos"});
});

/**
 Removes a trail on an user
 @username - steem username
 @token - hivesigner or keychain token
 @type - hivesigner or keychain
 @trailed  - steem username of the user to un-trail
 @trail_type  - Type of the trail
 */
router.post('/remove_trail',urlencodedParser, async function(req, res, next) {

    const username = sanitize(req.body.username);
    const token = sanitize(req.body.token);
    const type = sanitize(req.body.type);
    const trailed = sanitize(req.body.trailed);
    const trail_type = sanitize(req.body.trail_type);

    if (username && token && type) {

        let trailed_schema = Joi.object().keys({
            username: Joi.string().min(3).max(16).required(),
        });

        let test = Joi.validate({username : trailed}, trailed_schema);

        if (test.error !== null) {
            return res.send({status : "ko"});
        }

        const valid = await utils.valid_login(username, token, type);

        if (valid === true) {

            await db("DELETE FROM trail WHERE username = ? AND trailed = ? AND type = ?", [username, trailed, trail_type]);

            return res.send({status : "ok"});
        } else
            return res.send({status : "ko"});
    }

    return res.send({status : "ko", data : "no_infos"});
});

/**
 Removes an user from the whitelist
 @username - steem username
 @token - hivesigner or keychain token
 @type - hivesigner or keychain
 @trailed  - steem username of the user to un-whitelist
 */
router.post('/remove_whitelist',urlencodedParser, async function(req, res, next) {

    const username = sanitize(req.body.username);
    const token = sanitize(req.body.token);
    const type = sanitize(req.body.type);
    const trailed = sanitize(req.body.trailed);

    if (username && token && type) {

        let trailed_schema = Joi.object().keys({
            username: Joi.string().min(3).max(16).required(),
        });

        let test = Joi.validate({username : trailed}, trailed_schema);

        if (test.error !== null) {
            return res.send({status : "ko"});
        }

        const valid = await utils.valid_login(username, token, type);

        if (valid === true) {

            await db("DELETE FROM whitelist WHERE username = ? AND trailed = ?", [username, trailed]);

            return res.send({status : "ok"});
        } else
            return res.send({status : "ko"});
    }

    return res.send({status : "ko", data : "no_infos"});
});

/**
 Removes an user from the counter downvote blacklist
 @username - steem username
 @token - hivesigner or keychain token
 @type - hivesigner or keychain
 @trailed  - steem username of the user to un-whitelist
 */
router.post('/remove_counter_dv_blacklist',urlencodedParser, async function(req, res, next) {

    const username = sanitize(req.body.username);
    const token = sanitize(req.body.token);
    const type = sanitize(req.body.type);
    const trailed = sanitize(req.body.trailed);

    if (username && token && type) {

        let trailed_schema = Joi.object().keys({
            username: Joi.string().min(3).max(16).required(),
        });

        let test = Joi.validate({username : trailed}, trailed_schema);

        if (test.error !== null) {
            return res.send({status : "ko"});
        }

        const valid = await utils.valid_login(username, token, type);

        if (valid === true) {

            await db("DELETE FROM counter_dv_blacklist WHERE username = ? AND trailed = ?", [username, trailed]);

            return res.send({status : "ok"});
        } else
            return res.send({status : "ko"});
    }

    return res.send({status : "ko", data : "no_infos"});
});

/**
 Removes an user from the hitlist
 @username - steem username
 @token - hivesigner or keychain token
 @type - hivesigner or keychain
 @author  - steem username of the author to un-hitlist
 */
router.post('/remove_hitlist',urlencodedParser, async function(req, res, next) {

    const username = sanitize(req.body.username);
    const token = sanitize(req.body.token);
    const type = sanitize(req.body.type);
    const author = sanitize(req.body.author);

    if (username && token && type) {

        let author_schema = Joi.object().keys({
            username: Joi.string().min(3).max(16).required(),
        });

        let test = Joi.validate({username : author}, author_schema);

        if (test.error !== null) {
            return res.send({status : "ko"});
        }

        const valid = await utils.valid_login(username, token, type);

        if (valid === true) {
            await db("DELETE FROM hitlist WHERE username = ? AND author = ?", [username, author]);

            return res.send({status : "ok"});
        } else
            return res.send({status : "ko"});
    }

    return res.send({status : "ko", data : "no_infos"});
});

/**
 Removes an user from the hitlist
 @username - steem username
 @token - hivesigner or keychain token
 @type - hivesigner or keychain
 @settings  - Json object containing the user settings
 */
router.post('/update_user_settings',urlencodedParser, async function(req, res, next) {

    const username = sanitize(req.body.username);
    const token = sanitize(req.body.token);
    const type = sanitize(req.body.type);
    let settings = sanitize(req.body.settings);

    const valid = await utils.valid_login(username, token, type);

    if (valid === true) {

        try {
            settings = JSON.parse(settings)
        } catch (e) {
            console.error("Can't parse settings from user "+username+" settings : "+settings);
            return res.send({status : "ko"});
        }

        if (username && token && type) {

            let schema = Joi.object().keys({
                dv_threshold: Joi.number().min(0).max(100).required(),
                vp_threshold: Joi.number().min(0).max(100).required(),
                min_payout: Joi.number().min(0).required(),
                revote: Joi.boolean().required(),
            });

            let test = Joi.validate(settings, schema);

            if (test.error !== null) {
                return res.send({status : "ko"});
            }

            await db("UPDATE user_data SET dv_threshold = ?, vp_threshold = ?, min_payout = ?, revote = ? WHERE username = ?",
                [settings.dv_threshold, settings.vp_threshold ,settings.min_payout, settings.revote, username]);

            return res.send({status : "ok"});
        } else
            return res.send({status : "ko"});
    }

    return res.send({status : "ko", data : "no_infos"});
});

/**
 Unvote, used to undo executed votes
 @username - steem username
 @token - hivesigner or keychain token
 @type - hivesigner or keychain
 @author - author of the post to unvote
 @permlink  - permlink of the post to unvote
 */
router.post('/unvote',urlencodedParser, async function(req, res, next) {

    const username = sanitize(req.body.username);
    const token = sanitize(req.body.token);
    const type = sanitize(req.body.type);
    const author = sanitize(req.body.author);
    const permlink = sanitize(req.body.permlink);

    if (username && token && type) {
        const valid = await utils.valid_login(username, token, type);

        if (valid === true) {

            let result = await utils.vote_err_handled(username, process.env.WIF, author, permlink, 0);
            if (result === "") {
                await db("DELETE FROM executed_votes WHERE username = ? AND author = ? AND permlink = ?", [username, author, permlink]);

                return res.send({status: "ok"});
            } else
            {
                return res.send({status: "ko", data : "Error when unvoting, please try again"});
            }
        } else
            return res.send({status : "ko"});
    }

    return res.send({status : "ko", data : "no_infos"});
});



module.exports = router;