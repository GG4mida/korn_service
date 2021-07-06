"use strict";

const Crypto = require("crypto");
const Cryptr = require("cryptr");

const SALT_KEY = "qwertyuiop";
const DES_KEY = "nothingelsematters";

const sha256 = (data) => {
  const hash = Crypto.createHmac("sha256", SALT_KEY)
    .update(data, "utf8")
    .digest("hex");
  return hash;
};

const md5 = (data) => {
  const md5 = Crypto.createHash("md5");
  const hash = md5.update(data).digest("hex");
  return hash;
};

const desEncrypt = (data) => {
  const cryptr = new Cryptr(DES_KEY);
  return cryptr.encrypt(data);
};

const desDecrypt = (data) => {
  const cryptr = new Cryptr(DES_KEY);
  return cryptr.decrypt(data);
};

module.exports = {
  md5,
  sha256,
  desEncrypt,
  desDecrypt,
};
