"use strict";

const { app } = require("egg-mock/bootstrap");

describe("test/app/controller/home.test.js", () => {
  it("should GET /", () => {
    return app.httpRequest().get("/").expect("hi, egg")
      .expect(200);
  });
});
