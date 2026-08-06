const express = require("express");
const mongoose = require("mongoose");
const Project = require("../models/Project");
const protect = require("../middleware/authMiddleware");
const archiverPromise = import("archiver");

const router = express.Router();
router.use(protect);

function validId(id) {
  return mongoose.isObjectIdOrHexString(id);
}
function projectFields(project) {
  return {
    id: project._id,
    title: project.title,
    prompt: project.prompt,
    code: project.code,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

router.post("/", async (req, res, next) => {
  try {
    const {title, prompt, code} = req.body;
    if (!title?.trim() || !prompt?.trim() || !code?.trim())
      return res
        .status(400)
        .json({error: "Title, prompt, and code are required."});
    const project = await Project.create({
      user: req.user._id,
      title,
      prompt,
      code,
    });
    return res.status(201).json({project: projectFields(project)});
  } catch (error) {
    return next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const projects = await Project.find({user: req.user._id}).sort({
      updatedAt: -1,
    });
    return res.json({projects: projects.map(projectFields)});
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!validId(req.params.id))
      return res.status(404).json({error: "Project not found."});
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!project) return res.status(404).json({error: "Project not found."});
    return res.json({project: projectFields(project)});
  } catch (error) {
    return next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    if (!validId(req.params.id))
      return res.status(404).json({error: "Project not found."});
    const updates = {};
    ["title", "prompt", "code"].forEach((field) => {
      if (typeof req.body[field] === "string" && req.body[field].trim())
        updates[field] = req.body[field];
    });
    const project = await Project.findOneAndUpdate(
      {_id: req.params.id, user: req.user._id},
      updates,
      {new: true, runValidators: true},
    );
    if (!project) return res.status(404).json({error: "Project not found."});
    return res.json({project: projectFields(project)});
  } catch (error) {
    return next(error);
  }
});

router.get("/:id/export", async (req, res, next) => {
  try {
    if (!validId(req.params.id))
      return res.status(404).json({error: "Project not found."});
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!project) return res.status(404).json({error: "Project not found."});

    let generatedFiles;
    try {
      generatedFiles = JSON.parse(project.code).files;
      if (!Array.isArray(generatedFiles)) throw new Error("Not a file list.");
    } catch {
      return res.status(400).json({error: "Project code is invalid."});
    }

    const baseName =
      project.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") ||
      "project";

    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${baseName}.zip"`,
    });

    const {ZipArchive} = await archiverPromise;
    const archive = new ZipArchive({zlib: {level: 9}});
    archive.on("error", (error) => next(error));
    archive.pipe(res);
    generatedFiles.forEach(({filename, content}) =>
      archive.append(Buffer.from(content), {name: filename}),
    );
    await archive.finalize();
    return res.end();
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    if (!validId(req.params.id))
      return res.status(404).json({error: "Project not found."});
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!project) return res.status(404).json({error: "Project not found."});
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
