const moment = require("moment");

// Employee account creation and signin data
exports.defaultUser = {
  firstName: "Peter",
  lastName: "Matthew",
  email: "pet.mat@grifon.com",
  password: "red123mond",
  gender: "Male",
  jobRole: "Assistant Manager",
  department: "Warehouse",
  address: "Ketu, lagos, Nigeria"
};

exports.testUser = {
  firstName: "John",
  lastName: "Carpenter",
  email: "foo@bar.com",
  password: "123pass234word",
  gender: "Male",
  jobRole: "Manager",
  department: "Human Resources",
  address: "Apapa, Lagos, Nigeria"
};

exports.userLogin = {
  email: "foo@bar.com",
  password: "123pass234word"
};

// create a gif post
exports.testGif = {
  title: "DevC Training with Andela",
  image: "image_Gif",
  date: moment()
};
