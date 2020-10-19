
const { check, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const config = require("config");

const Confirance = require("../models/maghrebconference");
const Users = require("../models/Users");


////// Login to Email
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      type: "login", // default
      user: "autoreply@zu.edu.ly",
      pass: config.get("emailPassword"), //process.env.GMAILPW
    },
  });

// @desc    get all researches
exports.getResearchs = async (req, res) => {
    try {
      const confirances = await Confirance.find({}).sort("-dateadded");
      res.json(confirances);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("server error");
    }
  }

// @desc     Add Reviewers to Research
exports.AddReviewerToResearch =   async (req, res) => {
    const { id, name, email, id2, name2, email2 } = req.body;
  
    let ReviewerFields = {};
    let research;
    let Reviewer = {};
    let Reviewer2 = {};
    let Email = [];

    try {
      research = await Confirance.findById(req.params.id);
  
      if (!research) return res.status(400).json("Research not found");
  
      if (id)
        Reviewer = {
          id: id,
          name: name,
        };
      if (id2)
        Reviewer2 = {
          id: id2,
          name: name2,
        };

  
      if (id) ReviewerFields.Reviewer = Reviewer;
      if (id2) ReviewerFields.Reviewer2 = Reviewer2;
  
      research = await Confirance.findByIdAndUpdate(
        req.params.id,
        ReviewerFields
      );
      
      if(id){
          let user = await Users.findById(id)
          if (!user) return res.status(201).json("User Not Found")
             user.numberOfResearchs = user.numberOfResearchs+ 1
             await user.save()
             var mailOptions = {
              to: email,
              from: "autoreply@zu.edu.ly",
              subject: "اللجنة التحضيرية للمؤتمر",
              html: `
              <div style="text-align: center">
              <div style="padding: 2rem; border: 1px solid #8b8585; border-radius: 10px">
                <img
                  src="https://fimsd2021.zu.edu.ly/img/logo.png"
                  width="200"
                  alt="logo"
                />
                <h3>السيد (ة) المحترم (ة) : د ${user.name} </h3>
                <h3>السلام عليكم</h3>
                <p> في الوقت الذي نحيي فيه اهتمامكم ومجهوداتكم معنا لإنجاح فعاليات المؤتمر 
                    أرسلنا لكم الورقة البحثية الموسومة :${research.researchName}
                    وذلك لغرض التقييم الكترونيا وفق النموذج المعد والخاص بالتقييم على المنصة
                    نأمل إنهاء عملية التقييم في مدة أقصاها 15 يوما من تاريخ استلامكم للبحث العلمي  
                </p>
                <p>          تقبلوا تحياتنا
                رئاسة اللجنة العلمية للمؤتمر
                </p>
              
                <h4>يرجى عدم الرد علي  هذه الرسالة</h4>
                <hr />
                <h3>Mr/Ms :Dr. ${user.name} </h3>
                <h3>السلام عليكم</h3>
                <p>While we salute your efforts with us at the conference
                We sent you the paper with the title: ${research.researchName}
                This is for the purpose of evaluation according to the form prepared for evaluation
                We hope to make the evaluation 15 days before the date you receive the scientific research 
                </p>
                <p>  Please accept our regards
                Chairing the scientific committee of the conference
                </p>
      
              `,
            };
            smtpTransport.sendMail(mailOptions, function (err) {
              if (err) {
                res.json(err);
              } else {
                console.log("email sent to  : " + email);
              }
            });
      /// end Email Send
      //   **********************



      }
      if(id2){
        let user = await Users.findById(id2)
        if (!user) return res.status(201).json("User Not Found")
          user.numberOfResearchs = user.numberOfResearchs+ 1
          await user.save()
          var mailOptions = {
            to: email,
            from: "autoreply@zu.edu.ly",
            subject: "اللجنة التحضيرية للمؤتمر",
            html: `
            <div style="text-align: center">
            <div style="padding: 2rem; border: 1px solid #8b8585; border-radius: 10px">
              <img
                src="https://fimsd2021.zu.edu.ly/img/logo.png"
                width="200"
                alt="logo"
              />
              <h3>السيد (ة) المحترم (ة) : د ${user.name} </h3>
              <h3>السلام عليكم</h3>
              <p> في الوقت الذي نحيي فيه اهتمامكم ومجهوداتكم معنا لإنجاح فعاليات المؤتمر 
                  أرسلنا لكم الورقة البحثية الموسومة :${research.researchName}
                  وذلك لغرض التقييم الكترونيا وفق النموذج المعد والخاص بالتقييم على المنصة
                  نأمل إنهاء عملية التقييم في مدة أقصاها 15 يوما من تاريخ استلامكم للبحث العلمي  
              </p>
              <p>          تقبلوا تحياتنا
              رئاسة اللجنة العلمية للمؤتمر
              </p>
            
              <h4>يرجى عدم الرد علي  هذه الرسالة</h4>
              <hr />
              <h3>Mr/Ms :Dr. ${user.name} </h3>
              <h3>السلام عليكم</h3>
              <p>While we salute your efforts with us at the conference
              We sent you the paper with the title: ${research.researchName}
              This is for the purpose of evaluation according to the form prepared for evaluation
              We hope to make the evaluation 15 days before the date you receive the scientific research 
              </p>
              <p>  Please accept our regards
              Chairing the scientific committee of the conference
              </p>
    
            `,
          };
          smtpTransport.sendMail(mailOptions, function (err) {
            if (err) {
              res.json(err);
            } else {
              console.log("email sent to  : " + email);
            }
          });
      }
  

      let updatedResearch = await Confirance.findById(req.params.id);
      
  
      
      res.json(updatedResearch);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("server error");
    }
  }


exports.AddResearch = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log({ errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.files === null) {
      return res.status(400).json({ msg: "No File Uploaded" });
    }
    var file = req.file;

    const {
      researchName,
      abstruct,
      theHub,
      author,
      email,
      phone,
      country,
      Organization,
      Qualification,
      TypeOfParticipation,
      Degree,
      author1,
      email1,
      author2,
      email2,
    } = req.body;

    const researchFields = {};
    if (file) researchFields.paper = "/uploads/" + file.filename;
    if (researchName) researchFields.researchName = researchName;
    if (abstruct) researchFields.abstruct = abstruct;
    if (theHub) researchFields.theHub = theHub;
    if (author) researchFields.author = author;
    if (email) researchFields.email = email;
    if (phone) researchFields.phone = phone;
    if (country) researchFields.country = country;
    if (Organization) researchFields.Organization = Organization;
    if (Qualification) researchFields.Qualification = Qualification;
    if (TypeOfParticipation)
      researchFields.TypeOfParticipation = TypeOfParticipation;
    if (Degree) researchFields.Degree = Degree;
    if (author1) researchFields.author1 = author1;
    if (email1) researchFields.email1 = email1;
    if (author2) researchFields.author2 = author2;
    if (email2) researchFields.email2 = email2;
    let confirance;
    let message;
    try {
      confirance = await Confirance.findOne({ email });

      if (confirance) {
        confirance = await Confirance.findByIdAndUpdate(
          confirance._id,
          researchFields
        );
        message = ` <div style="text-align: center">
        <div style="padding: 2rem; border: 1px solid #8b8585; border-radius: 10px">
          <img
            src="https://fimsd2021.zu.edu.ly/img/logo.png"
            width="200"
            alt="logo"
          />
      
          <h4>
            <h3>عزيزنا الباحث</h3>
            تم التعديل علي ورقتكم العلمية تحت الرقم المعرف ${confirance._id} وسنوافيكم
            بالرد في موعد أقصاه 01-01-2021.
            <p>اللجنة العلمية للمؤتمر</p>
            <h4>يرجى عدم الرد علي  هذه الرسالة</h4>
          </h4>
          <hr />
          <h4>
            <h3>Dear researcher</h3>
            Your research contribution has been successfully received under the
            identification number : ${confirance._id} and we will provide you with response on
            01/01/2021.
      
            <h4>Please do not replay on this Email</h4>
          </h4>
          <hr />
          <h4>
            <h3>Cher Chercheur</h3>
            Nous accusons la réception de votre article scientifique sous le numéro
            d'identification : ${confirance._id} Nous reviendrons vers vous au plus tard le 1
            Janvier 2021
            <p>Le Comité scientifique de la Conférence</p>
      
            <h4>Ce Message est automatique, Merci de ne pas répondre Cordialement</h4>
          </h4>
        </div>
      </div>`;
      } else {
        const newConfirance = new Confirance(researchFields);
        confirance = await newConfirance.save();
        message = `<div style="text-align: center">
        <div style="padding: 2rem; border: 1px solid #8b8585; border-radius: 10px">
          <img
            src="https://fimsd2021.zu.edu.ly/img/logo.png"
            width="200"
            alt="logo"
          />
      
          <h4>
            <h3>عزيزنا الباحث</h3>
            تم بنجاح استلام ورقتكم العلمية تحت الرقم المعرف ${confirance._id}  وسنوافيكم
            بالرد في موعد أقصاه 01-01-2021.
            <p>اللجنة العلمية للمؤتمر</p>
            <h4>يرجى عدم الرد علي  هذه الرسالة</h4>
          </h4>
          <hr />
          <h4>
            <h3>Dear researcher</h3>
            Your research contribution has been successfully received under the
            identification number : ${confirance._id} and we will provide you with response on
            01/01/2021.
      
            <h4>Please do not replay on this Email</h4>
          </h4>
          <hr />
          <h4>
            <h3>Cher Chercheur</h3>
            Nous accusons la réception de votre article scientifique sous le numéro
            d'identification : ${confirance._id} Nous reviendrons vers vous au plus tard le 1
            Janvier 2021
            <p>Le Comité scientifique de la Conférence</p>
      
            <h4>Ce Message est automatique, Merci de ne pas répondre Cordialement</h4>
          </h4>
        </div>
      </div>`;
      }

      // بيانات الارسال
      var mailOptions = {
        to: email,
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
      res.json(confirance);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("server error");
    }
  }


  exports.UpdateStatus = async (req, res) => {
    const { status, Notes, status2, Notes2 } = req.body;
    const ResearchFields = {};
  
    if (status) ResearchFields.status = status;
    if (Notes) ResearchFields.Notes = Notes ;
    if (status2) ResearchFields.status2 = status2;
    if (Notes2) ResearchFields.Notes2 = Notes2;
    let user = await Users.findById(req.user.id);
  
    if (user) ResearchFields.statusChange = user.name;
    try {
      let research = await Confirance.findById(req.params.id);
  
      if (!research) return res.status(400).json("Research not found");
      if (status) ResearchFields.finalResualt =  research.finalResualt + status ;
      if (status2) ResearchFields.finalResualt =  research.finalResualt + status2 ;
  
      research = await Confirance.findByIdAndUpdate(
        req.params.id,
        ResearchFields
      );


      let updatedResearch = await Confirance.findById(req.params.id);
      

      res.json(updatedResearch);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("server error");
    }
  }

   // @desc    add Paper After Edit
  exports.AddPaperAfterEdit = async (req, res) => {
    if (req.files === null) {
      return res.status(400).json({ msg: "No File Uploaded" });
    }
    var file = req.file;
    let research;

    try {
      research = await Confirance.findById(req.params.id);
      research.paperAfterEdit = "/uploads/" + file.filename;
      research = await research.save();
      res.json(research);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("server error");
    }
  }