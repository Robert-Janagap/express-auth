const request = require("supertest");
const expect = require("chai").expect;
const app = require("../../server");

const Users = require("../../models/Users");

let user;

before(done => {
  user = Users.create({
    name: "test",
    email: "test@gmail.com",
    password: "password"
  }).then(() => done());
});

describe("Users routes", () => {
  describe("post /users/register", () => {
    it("Should register or create new user", done => {
      request(app)
        .post("/users/register")
        .send({
          name: "test",
          email: "test@gmail.com",
          password: "password",
          password2: "password"
        })
        .end((err, res) => {
          expect(res.status).to.eq(200);
          done();
        });
    });
  });

  describe("get /users/current", () => {
    it("Should get specific user", done => {
      request(app)
        .get("/users/current")
        .end((err, res) => {
          expect(res.status).to.eq(200);
          done();
        });
    });
  });

  describe("post /users/login", () => {
    it("Should login user", done => {
      request
        .agent(app)
        .post("/users/login")
        .send({
          email: "test@gmail.com",
          password: "password"
        })
        .end((err, res) => {
          console.log(res.body);
          expect(res.status).to.eq(200);
          done();
        });
    });
  });
});

after(done => {
  Users.remove({}).deleteMany();
  done();
});
