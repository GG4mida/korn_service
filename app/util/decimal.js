"use strict";

const Decimal = require("decimal.js");

const add = (num1, num2) => {
  return new Decimal(num1).plus(new Decimal(num2)).toString();
};

const minus = function(num1, num2) {
  return new Decimal(num1).minus(new Decimal(num2)).toString();
};

const mul = (num1, num2) => {
  return new Decimal(num1).mul(new Decimal(num2)).toString();
};

const div = function(num1, num2) {
  return new Decimal(num1).div(new Decimal(num2)).toString();
};

const toFixed = function(num, fixedNum = 2) {
  return new Decimal(num).toFixed(fixedNum).toString();
};

const gt = (num1, num2) => {
  return new Decimal(num1).greaterThan(new Decimal(num2));
};

const gte = (num1, num2) => {
  return new Decimal(num1).greaterThanOrEqualTo(new Decimal(num2));
};

const lt = (num1, num2) => {
  return new Decimal(num1).lessThan(new Decimal(num2));
};

const lte = (num1, num2) => {
  return new Decimal(num1).lessThanOrEqualTo(new Decimal(num2));
};

module.exports = {
  add,
  minus,
  mul,
  div,
  toFixed,
  gt,
  gte,
  lt,
  lte,
};
