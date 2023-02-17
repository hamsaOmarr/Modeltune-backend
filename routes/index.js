const router = require("express").Router();
const prisma = require("../prisma.js");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.get("/", async (req, res) => {
  await prisma.email
    .findMany()
    .then((emails) => {
      res.json(emails);
      console.log("Email List sent from DB");
    })
    .catch((err) => console.log(err));
});

router.post("/", async (req, res) => {
  await prisma.email
    .create({ data: { email: req.body.Email } })
    .then(async () => {
      res.json("Thank you! Your submittion has been received!");

      const msg = {
        to: req.body.Email, // Change to your recipient
        from: {
          email: "hamsa@modeltune.co",
          name: "Hamsa (Modeltune)",
        }, 
        // template_id: process.env.SENDGRID_TEMPLATE_ID,
        subject: "You've joined our Waitlist!",
        text: `Hi there,

We are so excited to see you on this list! We've been working hard to get Modeltune into your hands as soon as possible, and we hope you'll join us in Discord or reply to this email if you have any ideas for what you'd like to see from the platform. We're always open to feedback and suggestions.

Also, we are looking for individuals with high-quality fine-tuned models that they would like to see on the platform so if that is you, shoot us an email.

Thank you again for your interest in Modeltune and we look forward to hearing from you soon!

We read an reply to all user emails. 

Discord: https://discord.gg/6YyE7WWfCM

--
Hamsa Omar
Founder at Modeltune`,
      };

      await sgMail
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
