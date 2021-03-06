const pepipostAPI = process.env.PEPIPOST_API_KEY;

var http = require("https");

var options = {
  method: "POST",
  hostname: "api.pepipost.com",
  port: null,
  path: "/v5/mail/send",
  headers: {
    api_key: pepipostAPI,
    "content-type": "application/json",
  },
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

const sendWelcomeEmail = (email, name) => {
  req.write(
    JSON.stringify({
      from: {
        email: "confirmation@pepisandbox.com",
        name: "Task App by Kleva Saki",
      },
      subject: "Our Beta Version of Task App",
      content: [
        {
          type: "html",
          value: `Hello ${name}, let us know how you are getting along with our Task Manager App`,
        },
      ],
      personalizations: [
        {
          to: [{ email: email, name: name }],
        },
      ],
    })
  );

  req.end();
};

module.exports = {
  sendWelcomeEmail,
};
