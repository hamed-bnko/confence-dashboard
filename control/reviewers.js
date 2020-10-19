
const Users = require("../models/Users");
const Confirance = require("../models/maghrebconference");
const config = require("config");
const nodemailer = require("nodemailer");

////// Login to Email
var smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    type: "login", // default
    user: "autoreply@zu.edu.ly",
    pass: config.get("emailPassword"), //process.env.GMAILPW
  },
});

// @desc    agreement true
exports.IamAgree =  async (req, res) => {
    let users;
    let message;
    try {
      users = await Users.findById(req.params.id);
      if (!users) return res.status(404).json("user not Found");
      users.Agreement = true;
      await users.save();
      users = await Users.findById(req.params.id);
      
      message = `<div style="text-align: center">
      <div style="padding: 2rem; border: 1px solid #8b8585; border-radius: 10px">
        <img
          src="https://fimsd2021.zu.edu.ly/img/logo.png"
          width="200"
          alt="logo"
        />
        <h4>
          
          السلام عليكم ورحمة ورحمة الله وبركاته يسعدنا   موافقتك   وارسالك للمستندات  الخاصة بالانضمام للجنة العلمية  بصفة مراجع  .
          

          يعد هذا الحساب خاص بتقييم البحوث العلمية  ويمنع منعا  باتا  مشاركة  هذا الحساب مع اي شخص آخر وفي حال حدوث اي خطأ او خلل الرجاء  إبلاغنا .
          تفضلو بالاستلام مع فائق الاحترام والتقدير 
          
          <p>اللجنة التحضيرية للمؤتمر - اللجنة التقنية</p>
          <h4>يرجى عدم الرد علي  هذه الرسالة</h4>
        </h4>
        <hr />
      </div>
    </div>`;

      // بيانات الارسال
       var mailOptions = {
        to: users.email,
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
      res.json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server Error");
    }
  }

  exports.getReviwers = async (req, res) => {
    try {
      const reviewer = await Users.find({}).select("name email rolls theHub numberOfResearchs Agreement files");
      res.json(reviewer);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("server error");
    }
  }

  exports.RejectToReviewPaper = async (req, res) => {
    let ReviwerId = req.params.reviewer_id;
  
    let research;
    console.log(ReviwerId)
    try {
      research = await Confirance.findById(req.params.id);
      if (!research) return res.status(400).json("Research not Found");
  
      if (research.Reviewer.id == ReviwerId) {
        research.Reviewer = {};
      } else if (research.Reviewer2.id == ReviwerId) {
        research.Reviewer2 = {};
      }
      research = await research.save();
      let user =await Users.findById(ReviwerId)
      if(!user) return res.status(201).json("user Not Found");
       user.numberOfResearchs = user.numberOfResearchs - 1
        await user.save()
      res.json(research);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("server error");
    }
  }

  exports.AddFileToReviewers = async (req,res)=>{
    var images = req.files
    let user
    try {
           user =await Users.findById(req.params.id)
           if(!user) return res.status(404).json("User Not Found")

           if(user.files && user.files.length > 0) return res.status(404).json("User have files")

           for(let i=0;i < images.length;i++ ){
            user.files.push("/uploads/" + images[i].filename)
           }
           await user.save()
           user =await Users.findById(req.params.id)
           res.json(user)
    } catch (error) {
      console.log(error.message);
      res.status(500).send("server error");
    }

  }

  exports.DeleteReviewer = async (req,res)=>{
  
    let user,message;

    try {
      user =await Users.findById(req.params.id)
      if (!user) return res.status(404).json("user not Found")

      console.log(user.name)
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

       نحيطكم علما أنه قد  تم إلغاء عضويتكم من اللجنة العلمية نظرا لعدم توافق المستنذات المرسلة .
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
    } catch (error) {
      console.log(error.message);
      res.status(500).send("server error");
    }
  }