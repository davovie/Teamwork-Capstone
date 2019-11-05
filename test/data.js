const moment = require("moment");

// Employee account creation and signin data
exports.defaultUser = {
  firstname: "Peter",
  lastname: "Matthew",
  email: "pet.mat@grifon.com",
  password: "red123mond",
  gender: "Male",
  job_role: "Assistant Manager",
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

exports.defaultArticle = {
  title: "A day in development training",
  article:
    "As always, a day starts up with waking from sleep (already sweating) and wondering how to go about fixing the bug I left before falling asleep at the keys (again!!!)"
};

exports.editedArticle = {
  title: "A Day In Training @ DEVC Training with Andela",
  article:
    "As it always begins, the day starts up with thought of code (already sweating) and wondering how to fix a bug, improve a feature on code snippet left before falling asleep at the keys (sigh!!!)"
};
