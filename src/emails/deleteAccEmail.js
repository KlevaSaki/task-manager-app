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

const sendDeleteAccMessage = (email, name) => {
  req.write(
    JSON.stringify({
      from: {
        email: "confirmation@pepisandbox.com",
        name: "Task App by Kleva Saki",
      },
      subject: "GoodByes are difficult!",
      content: [
        {
          type: "html",
          value: `Hello ${name}, we hate to see you leave, but we would love to know how we could have made your experince better, Please get in touch by replying to this email`,
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
  sendDeleteAccMessage,
};
