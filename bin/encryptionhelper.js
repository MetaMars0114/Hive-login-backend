"use strict";
var crypto = require("crypto");
var CryptoJS = require("crypto-js");

var EncryptionHelper = (function () {

    function getKeyAndIV(key) {
        return new Promise(resolve => {
            crypto.pseudoRandomBytes(16, function (err, ivBuffer) {

                var keyBuffer = (key instanceof Buffer) ? key : Buffer.from(key);

                return resolve({
                    iv: ivBuffer,
                    key: keyBuffer
                });
            });
        });
    }

    function encryptText(iv, text) {

        var encrypted = CryptoJS.AES.encrypt(text, iv);

        return encrypted;
    }

    function decryptText(iv, text) {

        var decrypted = CryptoJS.AES.decrypt(text, iv);

        return decrypted;
    }

    return {
        CIPHERS: {
            "AES_128": "aes128",          //requires 16 byte key
            "AES_128_CBC": "aes-128-cbc", //requires 16 byte key
            "AES_192": "aes192",          //requires 24 byte key
            "AES_256": "aes256"           //requires 32 byte key
        },
        getKeyAndIV: getKeyAndIV,
        encryptText: encryptText,
        decryptText: decryptText
    };
})();

module.exports = EncryptionHelper;