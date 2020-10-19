const express = require("express");
const router = express.Router();
const path = require("path");
const config = require("config");
const nodemailer = require("nodemailer");
const { check, validationResult } = require("express-validator");

const auth = require("../middleware/auth");

const Confirance = require("../models/maghrebconference");
const Users = require("../models/Users");

const multer = require("multer");
const { AddResearch, getResearchs, AddReviewerToResearch, UpdateStatus, AddPaperAfterEdit } = require("../control/researchers");
const { IamAgree, getReviwers, RejectToReviewPaper, AddFileToReviewers, DeleteReviewer } = require("../control/reviewers");

//===============
//upload image
//===============
const dirname = path.join(__dirname, "../");
const storage = multer.diskStorage({
  destination: `${dirname}/${config.get("dire")}/uploads/`,
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

function checkFileType(file, cb) {
  // allow files
  const filetypes = / |doc|pdf|docx|jpeg|jpg| /;
  // check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  //check mime types
  const mimetype = filetypes.test(file.mimetype);

  if (extname) {
    return cb(null, true);
  } else {
    cb("Error : Images Only");
  }
}

////// Login to Email
var smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    type: "login", // default
    user: "autoreply@zu.edu.ly",
    pass: config.get("emailPassword"), //process.env.GMAILPW
  },
});

// @route   api/ficv
// @desc    get all researches
// @access  Private
router.get("/", getResearchs);

// @route   api/researchs/:id/imagree
// @desc    agreement true
// @access  Private
router.put("/:id/imagree", auth, IamAgree);

// @route   api/researchs
// @desc    add a research to database
// @access  Public
router.post(
  "/",
  [
    upload.single("Paper"),
    [check("researchName", "Please Enter researchName ").not().isEmpty()],
  ],
  AddResearch
);

// @route    api/ficv/:id/reviewer
// @desc     Add Reviewers to Research
// @access   private
router.post("/:id/reviewer", auth, AddReviewerToResearch);


// @route    api/ficv/:id/status
// @desc     update Status
// @access   private
router.post("/:id/status", auth, UpdateStatus);

// @route   api/ficv/Revewer
// @desc    get all Reviewr
// @access  Private
router.get("/reviewers",auth, getReviwers);


// @route   api/researchs/addpaperafteredit/:id
// @desc    add Paper After Edit
// @access  Private
router.put(
  "/addpaperafteredit/:id",
  [upload.single("Paper"), auth],
  AddPaperAfterEdit
);

// @route   api/researchs/:id/rejectoreview/:reviewer_id
// @desc    Rejecte to Review some Paper
// @access  Private
router.put("/:id/rejectoreview/:reviewer_id", auth,RejectToReviewPaper );

// @route   api/researchs/fileto/:reviewer_id
// @desc    add image to Reviewers
// @access  Private
router.put("/fileto/:id",upload.array("File", 4),AddFileToReviewers)

// @route   api/researchs/deleteAccount
// @desc    delete Account
// @access  Private
router.delete("/deleteaccount/:id" , auth, DeleteReviewer)
module.exports = router;
