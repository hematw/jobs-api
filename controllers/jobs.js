const { StatusCodes } = require("http-status-codes");
const BadRequestError = require("../errors/bad-request-error");
const Job = require("../models/Job");
const NotFoundError = require("../errors/not-found-error");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.id });
  if (!jobs.length) throw new NotFoundError(`Not Jobs found!`);
  res.status(StatusCodes.OK).json({ success: true, jobs });
};

const getJob = async (req, res) => {
  const {
    user: { id: userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findOne({ _id: jobId, createdBy: userId });
  if (!job) throw new NotFoundError(`Job NOT found with id ${id}!`);
  res.status(StatusCodes.OK).json({ success: true, job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.id;
  const job = await Job.create(req.body);
  res
    .status(StatusCodes.CREATED)
    .json({ success: true, message: "job created!", job });
};

const updateJob = async (req, res) => {
  const { id } = req.params;
  const { company, position } = req.body;
  if (!company || !position) {
    throw new BadRequestError("Company or position fields can NOT be empty!");
  }
  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    {
      company,
      position,
      createdBy: req.user._id,
    },
    { new: true }
  );
  if (!job) throw new NotFoundError(`Job NOT found with id ${id}!`);
  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Job updated!", job });
};

const deleteJob = async (req, res) => {
  const {
    params: { id: jobId },
    user: { id: userId },
  } = req;
  const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId });
  if (!job) throw new NotFoundError(`Job NOT found with id ${jobId}!`);
  res.status(StatusCodes.OK).json({ success: true, msg: "Job deleted!", job });
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
