var target = require("../index.js");

const expect = (_result, _expect) => {
  if (_result != _expect) {
    throw "Case failed: Expect=" + _expect + ", Actual=" + _result;
  }
};

describe("Abnormal case1: No query string", () => {
  it("TestCase1", async () => {
    let req = {
      query: {}
    };
    let res = {
      payload: null,
      statusCode: 0,
      setHeader: () => {},
      send(data) {
        this.payload = data;
        return this;
      },
      status(s) {
        this.statusCode = s;
        return this;
      }
    };
    await target(req, res);
    expect(res.statusCode, 400);
  }).timeout(2000);
});

describe("Abnormal case2: Invalid url", () => {
  it("TestCase1", async () => {
    let req = {
      query: {
        url: 'this_is_not_url'
      }
    };
    let res = {
      payload: null,
      statusCode: 0,
      setHeader: () => {},
      send(data) {
        this.payload = data;
        return this;
      },
      status(s) {
        this.statusCode = s;
        return this;
      }
    };
    await target(req, res);
    expect(res.statusCode, 200);
    expect(res.payload.status, "err");

  }).timeout(2000);
});

describe("Abnormal case3: valid url but wrong hostname", () => {
  it("TestCase1", async () => {
    let req = {
      query: {
        url: 'https://www.facebook.com/123123'
      }
    };
    let res = {
      payload: null,
      statusCode: 0,
      setHeader: () => {},
      send(data) {
        this.payload = data;
        return this;
      },
      status(s) {
        this.statusCode = s;
        return this;
      }
    };
    await target(req, res);
    expect(res.statusCode, 200);
    expect(res.payload.status, "err");

  }).timeout(2000);
});

describe("Normal case1: single pic with no all=1", () => {
  it("TestCase1", async () => {
    let req = {
      query: {
        url: "https://www.instagram.com/p/B3Z4FWLBZ_i/"
      }
    };
    let res = {
      payload: null,
      statusCode: 0,
      setHeader: () => {},
      send(data) {
        this.payload = data;
        return this;
      },
      status(s) {
        this.statusCode = s;
        return this;
      }
    };
    await target(req, res);
    expect(res.statusCode, 200);
    expect(res.payload.status, "ok");
    expect(res.payload.data.length, 1);
    expect(Array.isArray(res.payload.data[0]), false);
  }).timeout(30000);
});

describe("Normal case2: multi pic with no all=1", () => {
  it("TestCase1", async () => {
    let req = {
      query: {
        url: "https://www.instagram.com/p/B2znCG_gUt-/"
      }
    };
    let res = {
      payload: null,
      statusCode: 0,
      setHeader: () => {},
      send(data) {
        this.payload = data;
        return this;
      },
      status(s) {
        this.statusCode = s;
        return this;
      }
    };
    await target(req, res);
    expect(res.statusCode, 200);
    expect(res.payload.status, "ok");
    expect(res.payload.data.length, 5);
    expect(Array.isArray(res.payload.data[0]), false);
  }).timeout(30000);
});

describe("Normal case3: single pic with all=1", () => {
  it("TestCase1", async () => {
    let req = {
      query: {
        url: "https://www.instagram.com/p/B3Z4FWLBZ_i/",
        all: "1"
      }
    };
    let res = {
      payload: null,
      statusCode: 0,
      setHeader: () => {},
      send(data) {
        this.payload = data;
        return this;
      },
      status(s) {
        this.statusCode = s;
        return this;
      }
    };
    await target(req, res);
    expect(res.statusCode, 200);
    expect(res.payload.status, "ok");
    expect(res.payload.data.length, 1);
    expect(Array.isArray(res.payload.data[0]), true);
    expect(res.payload.data[0].length, 3);
  }).timeout(30000);
});

describe("Normal case4: multi pic with all=1", () => {
  it("TestCase1", async () => {
    let req = {
      query: {
        url: "https://www.instagram.com/p/B2znCG_gUt-/",
        all: "1"
      }
    };
    let res = {
      payload: null,
      statusCode: 0,
      setHeader: () => {},
      send(data) {
        this.payload = data;
        return this;
      },
      status(s) {
        this.statusCode = s;
        return this;
      }
    };
    await target(req, res);
    expect(res.statusCode, 200);
    expect(res.payload.status, "ok");
    expect(res.payload.data.length, 5);
    expect(Array.isArray(res.payload.data[0]), true);
    expect(res.payload.data[0].length, 3);
  }).timeout(30000);
});