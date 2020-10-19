const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

const Users = require("../../models/Users");

////// Login to Email
var smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    type: "login", // default
    user: "autoreply@zu.edu.ly",
    pass: config.get("emailPassword"), //process.env.GMAILPW
  },
});

// @route   GET api/auth
// @desc    Get logged in user
// @access  Privet
router.get("/", auth, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
  }
});

// @route   GET api/auth
// @desc    Get logged in user
// @access  Privet
router.post(
  "/",
  [
    check("email", "Please enter your email").isEmail(),
    check("password", "password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await Users.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: "inValed Cretential" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "inValed Cretential" });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.log(error.message);
      res.status(500).json("server error");
    }
  }
);

// @route   GET api/auth/:id/deleteAccount
// @desc    Get logged in user
// @access  Privet
router.delete("/:id/deleteaccount", auth, async (req, res) => {
  let user;
  let message;
  try {
    user = await Users.findById(req.params.id);
    if (!user) return res.status(404).json("user Not Found");
    message = `<div style="text-align: center">
    <div style="padding: 2rem; border: 1px solid #8b8585; border-radius: 10px">
      <img
        src="https://fimsd2021.zu.edu.ly/img/logo.png"
        width="200"
        alt="logo"
      />
      <h4>
      <p>السلام عليكم ورحمة الله وبركاته</p>
      <p>السيد المحترم </p>

      نظرا لعدم قبولك لشروط الانضمام  بصفة مراجع  فنحيطكم علما أنه قد  تم إلغاء عضويتكم من اللجنة .
      <p>  نتمنى لكم التوفيق والسداد  </p>        
        <p>اللجنة التحضيرية للمؤتمر - اللجنة التقنية</p>
        <h4>يرجى عدم الرد علي  هذه الرسالة</h4>
      </h4>
      <hr />
    </div>
  </div>`;

   // بيانات الارسال
   var mailOptions = {
    to: user.email,
    from: "autoreply@zu.edu.ly",
    subject: "اللجنة التحضيرية للمؤتمر",
    html: message,
  };
  //ارسال الرسالة

  smtpTransport.sendMail(mailOptions, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("mail sent" + mailOptions.to);
    }
  });

    await user.remove();
    res.status(200).json("Account Deleted");
  } catch (err) {
    console.log(err.message);
    res.status(500).json("server error");
  }
});

module.exports = router;
