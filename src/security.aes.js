﻿const crypto = require('crypto');
const md5 = require('./security.md5');
const utils = require('./utils');

// http://lollyrock.com/articles/nodejs-encryption/
// NOTE: aes-256-cbc is compatible with the .NET crypto package
let aes = {
    INVALID_IV_ERROR: "Invalid iv, 16-character string required",
    INVALID_KEY_ERROR: "Invalid key, 32-character string required",
    NULL_IV: "0000000000000000",
    algorithm: 'aes-256-cbc',

    encrypt: function (key, message, iv) {
        iv = iv || aes.NULL_IV;
        aes.validateKey(key);
        key = md5.hash(key);
        aes.validateIv(iv);
        key = Buffer.from(key);
		let cipher = crypto.createCipheriv(aes.algorithm, key, iv);
        return cipher.update(message, 'utf8', 'base64') + cipher.final('base64');
	},

    decrypt: function (key, message, iv) {
        iv = iv || aes.NULL_IV;
        aes.validateKey(key);
        key = md5.hash(key);
        aes.validateIv(iv);
        key = Buffer.from(key);
        let decipher = crypto.createDecipheriv(aes.algorithm, key, iv);
        return decipher.update(message, 'base64', 'utf8') + decipher.final('utf8');
    },

    // generated IV must be a 16 character hexadecimal string
    generateIv: function () {
        // https://stackoverflow.com/a/42485606/2860309
        // output eg. 2f6c60343819c193
        return crypto.randomBytes(16).toString('hex').slice(0, 16);
    },
    validateIv: function(iv) {
        if (!iv || iv.length != 16) {
            throw new Error(aes.INVALID_IV_ERROR);
        }
    },
    // DEPRECATED: use sfet.utils.randomstring directly instead,
    // no need to hash the result as hashing performed implicitly
    // by encrypt / decrypt
	generateKey: function () {
		return md5.hash(utils.randomstring.generate());
    },
    validateKey: function(key) {
        if (!key) {
            throw new Error(aes.INVALID_KEY_ERROR);
        }
    }
};

module.exports = aes;