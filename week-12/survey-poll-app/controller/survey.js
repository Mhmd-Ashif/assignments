const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const result = await prisma.survey.findMany({
      include: {
        question: {
          include: {
            options: true,
          },
        },
      },
    });
    res.status(200).json({
      allSurveys: result,
    });
  } catch (error) {
    res.json({
      PrismaError: "some error in the prisma ",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    let { title, questions } = req.body;

    // Map questions to extract text
    const surveyQuestionsData = questions.map((q) => ({ text: q.text }));

    // Map options for each question
    const optionsData = questions.map((q) => ({
      options: q.options.map((option) => ({ text: option.text })),
    }));
    // Create the survey with questions and options
    const result = await prisma.survey.create({
      data: {
        title: title,
        question: {
          create: surveyQuestionsData.map((question, index) => ({
            ...question,
            options: { create: optionsData[index].options },
          })),
        },
      },
      include: {
        question: {
          include: {
            options: true,
          },
        },
      },
    });

    res.json({
      posted: result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      prismaError: error,
    });
  }
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  try {
    const findPost = await prisma.survey.findFirst({
      where: {
        id,
      },
      include: {
        question: {
          include: {
            options: true,
          },
        },
      },
    });
    if (findPost) {
      res.json({
        post: findPost,
      });
    } else {
      res.json({
        msg: "no post found at the id of " + id,
      });
    }
  } catch (err) {
    res.json({
      prismaError: err,
    });
  }
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  const { title, questions } = req.body;

  try {
    const existingSurvey = await prisma.survey.findFirst({
      where: {
        id: id,
      },
      select: {
        question: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!existingSurvey) {
      return res.status(404).json({
        error: "Survey not found",
      });
    }

    // Update survey title
    await prisma.survey.update({
      where: { id },
      data: { title },
    });

    for (let i = 0; i < questions.length; i++) {
      const question = existingSurvey.question[i];
      const existingQuestion = existingSurvey.question.find(
        (q) => q.id === question.id
      );

      // Update or create question
      await prisma.questions.updateMany({
        where: { id: existingQuestion.id },
        data: { text: questions[i].text },
      });

      // Update or create options
      for (let j = 0; j < question.options.length; j++) {
        const option = question.options[j];
        const existingOption = existingQuestion.options.find(
          (o) => o.id === option.id
        );

        await prisma.options.update({
          where: { id: existingOption.id },
          data: { text: questions[i].options[j].text },
        });
      }
    }

    res.status(200).json({ message: "Survey updated successfully" });
  } catch (error) {
    console.error("Error updating survey:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the survey" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params["id"]);
    const result = await prisma.survey.delete({
      where: {
        id,
      },
    });
    res.json({
      surveyDeleted: result,
    });
  } catch (error) {
    res.json({
      prismaError: error,
    });
  }
});

module.exports = router;
