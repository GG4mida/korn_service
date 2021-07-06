"use strict";

const dayjs = require("dayjs");

const DATE_FORMATTER = "YYYY-MM-DD";
const DATETIME_FORMATTER = "YYYY-MM-DD HH:mm:ss";

const getCurrentDateTime = function() {
  return dayjs().format(DATETIME_FORMATTER);
};

const getCurrentDate = function() {
  return dayjs().format(DATE_FORMATTER);
};

const getCurrentTime = function() {
  return dayjs().valueOf();
};

const getCurrentTimeUnix = function() {
  return dayjs().unix();
};

const getPastTime = function(seconds) {
  return dayjs().subtract(seconds, "seconds").valueOf();
};

const getPastDateTime = function(seconds) {
  return dayjs().subtract(seconds, "seconds").format(DATETIME_FORMATTER);
};

const getFeatureDateTime = function(seconds) {
  return dayjs().add(seconds, "seconds").format(DATETIME_FORMATTER);
};

const getFeatureDate = function(seconds) {
  return dayjs().add(seconds, "seconds").format(DATE_FORMATTER);
};

const isBefore = function(date1, date2) {
  return dayjs(date1).isBefore(dayjs(date2));
};

const formatDateTime = function(date, formater = DATETIME_FORMATTER) {
  return dayjs(date).format(formater);
};

const formatTime = function(time, formater = DATETIME_FORMATTER) {
  return dayjs.unix(time).format(formater);
};

module.exports = {
  DATE_FORMATTER,
  DATETIME_FORMATTER,
  isBefore,
  formatTime,
  formatDateTime,
  getCurrentTime,
  getCurrentTimeUnix,
  getCurrentDate,
  getCurrentDateTime,
  getPastTime,
  getPastDateTime,
  getFeatureDate,
  getFeatureDateTime,
};
