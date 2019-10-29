const app = require("../teamApp");
const request = require("supertest");
const { expect } = require("chai");

describe("Teamwork App", () => {
  let server;
  beforeAll(() => {
    server = require("../server");
  });

  describe("GET /", function() {
    it("responds with json", function() {
      return request(app)
        .get("/")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200);
      // .then(response => {
      //     assert(response.body.email, 'foo@bar.com')
      // })
    });
  });

  // Test admin can create an employee user account
  describe("POST /auth/create-user", function() {
    it("responds with json", function(done) {
      request(app)
        .post("/auth/create-user")
        .send({
          firstName: "John",
          lastName: "Mark",
          email: "foo@bar.com",
          password: "12bac3",
          gender: "male",
          jobRole: "driver",
          department: "Logistics",
          address: "Agege, Lagos"
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .end(function(err, res) {
          if (err) return done(err);
          const {
            body: {
              status,
              data: { message, token, userId }
            }
          } = res;
          expect(res.status).to.equal(201);
          expect(status).to.equal("success");
          expect(message).to.equal("User account successfully created!");
          expect(token).to.be.a("string");
          expect(userId).to.be.a("number");
          expect(userId % 1).to.equal(0);
          done();
        });
    });
  });

  describe("Admin/Employees can sign in", function() {
    it("Put some of your user data in your token’s payload", function(done) {
      request(app)
        .post("/auth/signin")
        .send({
          email: "foo@bar.com",
          password: "12bac3"
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200, {
          message: "Logged in successfully!"
        })
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
  });
});
