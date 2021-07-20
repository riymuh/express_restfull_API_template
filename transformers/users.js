module.exports = {
  user_id: "id",
  name: "name",
  email: "email",
  phone_number: "phone_number",
  gender: function (data) {
    return data.get("gender") ? true : false;
  },
};
