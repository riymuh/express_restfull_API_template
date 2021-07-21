var fractal = require("fractal-transformer")();

module.exports = {
  user_id: "id",
  name: "name",
  email: "email",
  phone_number: "phone_number",
  gender: function (data) {
    return data.get("gender") ? true : false;
  },
  posts: function (data) {
    return data.get("posts") || data.get("posts") > 0
      ? fractal(data.get("posts"), {
          post_id: "id",
          title: "title",
        })
      : [];
  },
};
