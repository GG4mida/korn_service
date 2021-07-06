"use strict";

const stringRandom = require("string-random");

const Decimal = require("./decimal");

const getRandomString = (len) => {
  return stringRandom(len, {
    letters: "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789",
  });
};

const getRandomNumber = (len) => {
  return stringRandom(len, {
    letters: "0123456789",
  });
};

const getDbId = () => {
  return stringRandom(32, {
    letters: "abcdefghijkmnpqrstuvwxyz123456789",
  });
};

const formatAmount = function(amount, fixed = 2) {
  const num = parseFloat(amount, 10);
  return Decimal.toFixed(num, fixed);
};

module.exports = {
  getDbId,
  getRandomString,
  getRandomNumber,
  formatAmount,
};
