import test from "node:test";
import assert from "node:assert/strict";
import requireAuth from "../src/middleware/requireAuth.js";

function mockResponse() {
    return {
        statusCode: 200,
        body: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(body) {
            this.body = body;
            return this;
        },
    };
}

test("rejects requests without a bearer token", async () => {
    const req = { headers: {} };
    const res = mockResponse();
    let nextCalled = false;

    await requireAuth(req, res, () => {
        nextCalled = true;
    });

    assert.equal(res.statusCode, 401);
    assert.equal(res.body.message, "Authentication required");
    assert.equal(nextCalled, false);
});

test("rejects unsupported authorization schemes", async () => {
    const req = { headers: { authorization: "Basic abc123" } };
    const res = mockResponse();
    let nextCalled = false;

    await requireAuth(req, res, () => {
        nextCalled = true;
    });

    assert.equal(res.statusCode, 401);
    assert.equal(nextCalled, false);
});
