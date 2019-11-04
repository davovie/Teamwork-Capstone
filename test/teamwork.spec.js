/* eslint-disable no-undef */
const request = require("supertest");
const { expect } = require("chai");
const moment = require("moment");
const bcrypt = require("bcrypt");
const app = require("../app");
const db = require("../api/controllers/db");
const usr = require("./data");

describe("Teamwork App", () => {
  describe("GET /", () => {
    it("responds with json", done => {
      request(app)
        .get("/api/v1/")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          if (err) return done(err);
          done();
        });
    });
  });

  // Test - admin can create an employee user account
  describe("POST /auth/create-user", () => {
    it("respond with status 201 and returns json data containing token", done => {
      request(app)
        .post("/api/v1/auth/create-user")
        .send(usr.defaultUser)
        .expect("Content-Type", /json/)
        .then(res => {
          const {
            body: {
              status,
              data: { message, token, userId }
            }
          } = res;
          expect(res.status).to.equal(201);
          expect(status).to.equal("success");
          expect(message).to.equal("User account successfully created");
          expect(token).to.be.a("string");
          expect(userId).to.be.a("number");
          expect(userId % 1).to.equal(0);
          done();
        })
        .catch(err => done(err));
    });
  });

  // Test - Admin/Employee can sign in
  describe("POST /auth/signin", () => {
    before(done => {
      bcrypt.hash(usr.testUser.password, 10).then(password => {
        const {
          firstName,
          lastName,
          email,
          gender,
          jobRole,
          department,
          address
        } = usr.testUser;
        db.one({
          text:
            "INSERT INTO employee (firstname, lastname, email, password, gender, job_role, department, address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING email, password, employeeid",
          values: [
            firstName,
            lastName,
            email,
            password,
            gender,
            jobRole,
            department,
            address
          ]
        });
        done();
      });
    });

    it("responds with status code 200", done => {
      request(app)
        .post("/api/v1/auth/signin")
        .send({
          email: "foo@bar.com",
          password: "123pass234word"
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
    });
    it("returns json data containing status success and token", done => {
      request(app)
        .post("/api/v1/auth/signin")
        .send({
          email: "foo@bar.com",
          password: "123pass234word"
        })
        .expect("Content-Type", /json/)
        .end((err, res) => {
          if (err) return done(err);
          const {
            body: {
              status,
              data: { token, userId }
            }
          } = res;
          expect(status).to.equal("success");
          expect(token).to.be.a("string");
          expect(userId).to.be.a("number");
          expect(userId % 1).to.equal(0);
          done();
        });
    });
  });

  // employees can Post gifs
  describe("POST /gifs", () => {
    it("responds with status code 200 - gif posted successfully", done => {
      request(app)
        .post("/api/v1/gifs")
        .send({
          title: "DevC Training with Andela",
          image: "image_Gif",
          date: moment()
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
    });
    // it("successfully uploads gif to cloudinary", function(done) {
    //   request(app)
    //     .post("/gifs")
    //     .set("header", "application/json")
    //     .attach("imgUrl", "./image")
    //     .end(function(err, req) {
    //       if (err) return done(err);
    //       const {
    //         body: { image }
    //       } = req;
    //       expect(image).to.be.an("url");
    //       done();
    //     });
    // });
    it("returns json object with status success", done => {
      request(app)
        .post("/api/v1/gifs")
        .set("header", "application/json")
        .send({
          title: "DevC Training with Andela",
          image: "image_Gif",
          date: moment()
        })
        .expect("Content-Type", /json/)
        .end((err, res) => {
          if (err) return done(err);
          const {
            body: {
              status,
              data: { gifid, message, createdOn, title, imageUrl }
            }
          } = res;
          expect(status).to.equal("success");
          expect(message).to.be.equal("GIF image successfully posted");
          expect(createdOn).to.be.a("string");
          expect(title).to.be.a("string");
          expect(imageUrl).to.be.a("string");
          expect(gifid).to.be.a("number");
          expect(gifid % 1).to.equal(0);
          done();
        });
    });
  });

  // employees can create article
  describe("POST /articles", () => {
    it("responds with status code 201 - creates article", done => {
      request(app)
        .post("/api/v1/articles")
        .send({
          article: "string",
          title: "string"
        })
        .expect("Content-Type", /json/)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          done();
        });
    });
    it("returns json object containing status success", done => {
      request(app)
        .post("/api/v1/articles")
        .set("header", "application/json")
        .send({
          article: "string",
          title: "string"
        })
        .expect("Content-Type", /json/)
        .end((err, res) => {
          if (err) return done(err);
          const {
            body: {
              status,
              data: { message, articleId, createdOn, title }
            }
          } = res;
          expect(status).to.equal("success");
          expect(message).to.be.equal("Article successfully posted");
          expect(createdOn).to.be.a("string");
          expect(title).to.be.a("string");
          expect(articleId).to.be.a("number");
          expect(articleId % 1).to.equal(0);
          done();
        });
    });
  });

  // employees can edit their article
  describe("PATCH /articles/<:articleId>", () => {
    it("responds with status code 200 - can edit article", done => {
      request(app)
        .patch("/api/v1/articles/:articleId")
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
    });
    it("returns json data containing status success", done => {
      request(app)
        .patch("/api/v1/articles/:articleId")
        .set("header", "application/json")
        .send({
          article: "string",
          title: "string"
        })
        .expect("Content-Type", /json/)
        .end((err, res) => {
          if (err) return done(err);
          const {
            body: {
              status,
              data: { message, title, article }
            }
          } = res;
          expect(status).to.equal("success");
          expect(message).to.be.equal("Article successfully updated");
          expect(title).to.be.a("string");
          expect(article).to.be.a("string");
          done();
        });
    });
  });

  // employees can delete their articles
  describe("DELETE /articles/<:articleId>", () => {
    it("returns json data and responds with status code 200", done => {
      request(app)
        .delete("/api/v1/articles/:articleId")
        .set("header", "application/json")
        .expect("Content-Type", /json/)
        .end((err, res) => {
          if (err) return done(err);
          const {
            body: {
              status,
              data: { message }
            }
          } = res;
          expect(res.status).to.equal(200);
          expect(status).to.equal("success");
          expect(message).to.be.equal("Article successfully deleted");
          done();
        });
    });
  });

  // employees can delete their gif
  describe("DELETE /gifs/<:gifId>", () => {
    it("responds with status code 200 and returns json object", done => {
      request(app)
        .delete("/api/v1/gifs/:gifId")
        .set("header", "application/json")
        .expect("Content-Type", /json/)
        .end((err, res) => {
          if (err) return done(err);
          const {
            body: {
              status,
              data: { message }
            }
          } = res;
          expect(res.status).to.equal(200);
          expect(status).to.equal("success");
          expect(message).to.be.equal("gif post successfully deleted");
          done();
        });
    });
  });

  // Employees can comment on other colleagues' article post
  describe("POST /articles/<:articleId>/comment", () => {
    it("responds with status code 201", done => {
      request(app)
        .post("/api/v1/articles/:articleId/comment")
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(201);
          done();
        });
    });
    it("returns json object containing comment and status success", done => {
      request(app)
        .post("/api/v1/articles/:articleId/comment")
        .set("header", "application/json")
        .send({ comment: "string" })
        .expect("Content-Type", /json/)
        .end((err, res) => {
          if (err) return done(err);
          const {
            body: {
              status,
              data: { message, createdOn, articleTitle, article, comment }
            }
          } = res;
          expect(status).to.equal("success");
          expect(message).to.be.equal("Comment successfully created");
          expect(createdOn).to.be.a("string");
          expect(articleTitle).to.be.a("string");
          expect(article).to.be.a("string");
          expect(comment).to.be.a("string");
          done();
        });
    });
  });

  // Employees can comment on other colleagues' gif post
  describe("POST /gifs/<:gifId>/comment", () => {
    it("responds with status code 201", done => {
      request(app)
        .post("/api/v1/gifs/:gifId/comment")
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(201);
          done();
        });
    });
    it("return json object with comment and status success", done => {
      request(app)
        .post("/api/v1/gifs/:gifId/comment")
        .set("header", "application/json")
        .send({ comment: "string" })
        .expect("Content-Type", /json/)
        .end((err, res) => {
          if (err) return done(err);
          const {
            body: {
              status,
              data: { message, createdOn, gifTitle, comment }
            }
          } = res;
          expect(status).to.equal("success");
          expect(message).to.be.equal("Comment successfully created");
          expect(createdOn).to.be.a("string");
          expect(gifTitle).to.be.a("string");
          expect(comment).to.be.a("string");
          done();
        });
    });
  });
});
