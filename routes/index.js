const router = require("express").Router();
const prisma = require("../prisma.js");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.get("/", async (req, res) => {
  // await prisma.email
  //   .findMany()
  //   .then((emails) => {
  //     res.json(emails);
  //     console.log("Email List sent from DB");
  //   })
  //   .catch((err) => console.log(err));
});

router.post("/", async (req, res) => {
  await prisma.email
    .create({ data: { email: req.body.Email } })
    .then(() => {
      res.json("Thank you! Your submittion has been received!");

      const msg = {
        to: "test-sx7ibok5t@srv1.mail-tester.com", // Change to your recipient
        from: {
          email: "hamsa@modeltune.co",
          name: "Hamsa (Modeltune)",
        }, // Change to your verified sender
        template_id: process.env.SENDGRID_TEMPLATE_ID,
      };

      sgMail
        .send(msg)
        .then(() => {
          console.log("Email sent");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      if (err.code === "P2002") {
        res.json("You are already in our Waitlist");
      } else {
        console.log(err);
        res.json(err);
      }
    });
});

router.delete("/", async (req, res) => {
  await prisma.email
    .deleteMany()
    .then(() => {
      res.json("All Emails have been Deleted");
      console.log("All Emails have been Deleted");
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

module.exports = router;
