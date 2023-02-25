const router = require("express").Router();
const prisma = require("../prisma.js");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post("/", async (req, res) => {
  const sgMsg = {
    to: req.body.Email, // Change to your recipient
    from: {
      email: "hamsa@modeltune.co",
      name: "Hamsa (Modeltune)",
    },
    subject: "You've joined our Waitlist!",
    text: `Hi there,

We are so excited to see you on this list! We've been working hard to get Modeltune into your hands as soon as possible, and we hope you'll join us in Discord or reply to this email if you have any ideas for what you'd like to see from the platform. We're always open to feedback and suggestions.

Also, we are looking for individuals with high-quality fine-tuned models that they would like to see on the platform so if that is you, shoot us an email.

Thank you again for your interest in Modeltune and we look forward to hearing from you soon!

We read an reply to all user emails. 

Discord: https://discord.gg/V9XXAbJDKQ

--
Hamsa Omar
Founder at Modeltune`,
  };

  await prisma.email
    .create({ data: { email: req.body.Email } })
    .then(async () => {
      console.log("User email saved to DB");

      await sgMail
        .send(sgMsg)
        .then(() => {
          console.log("Email sent");
        })
        .catch((err) => {
          console.log(err);
        });
      res.json("Thank you! Your submittion has been received!");
    })
    .catch((err) => {
      if (err.code === "P2002") {
        console.log("Already in Waitlist");
        res.json("You are already in our Waitlist");
      } else {
        console.log(err);
        res.json(err);
      }
    });
});

module.exports = router;
