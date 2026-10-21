const test = require("node:test")
const assert = require("node:assert/strict")

const {
    validateCreateWallet,
    validateAmount
} = require("./wallet.validation")

const createResponse = () => {
    const response = {
        statusCode: undefined,
        body: undefined
    }
    response.status = (statusCode) => {
        response.statusCode = statusCode
        return {
            json: (body) => {
                response.body = body
                return response
            }
        }
    }
    return response
}

test("validateCreateWallet rejects missing name", () => {
    const req = { body: {} }
    const res = createResponse()
    let called = false

    validateCreateWallet(req, res, () => {
        called = true
    })

    assert.equal(called, false)
    assert.equal(res.statusCode, 400)
    assert.equal(res.body.message, "Please Enter Your Name")
})

test("validateCreateWallet rejects whitespace-only name", () => {
    const req = { body: { name: "   " } }
    const res = createResponse()
    let called = false

    validateCreateWallet(req, res, () => {
        called = true
    })

    assert.equal(called, false)
    assert.equal(res.statusCode, 400)
    assert.equal(res.body.message, "Please Enter Your Name")
})

test("validateAmount rejects string input", () => {
    const req = { body: { amount: "10" } }
    const res = createResponse()
    let called = false

    validateAmount(req, res, () => {
        called = true
    })

    assert.equal(called, false)
    assert.equal(res.statusCode, 400)
    assert.equal(res.body.message, "Please Enter Valid Amount")
})

test("validateAmount accepts positive number", () => {
    const req = { body: { amount: 10 } }
    const res = createResponse()
    let called = false

    validateAmount(req, res, () => {
        called = true
    })

    assert.equal(called, true)
    assert.equal(res.statusCode, undefined)
})
