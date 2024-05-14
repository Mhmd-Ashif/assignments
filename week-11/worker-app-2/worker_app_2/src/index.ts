import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { env } from "hono/adapter";
import { date, z } from "zod";
import { Jwt } from "hono/utils/jwt";
import { createMiddleware } from "hono/factory";
import { connect } from "cloudflare:sockets";

const app = new Hono();

enum statusCodes {
  success = 200,
  notFound = 404,
  badRequest = 400,
  error = 500,
}

// ZOD Schema for Input Validation

const signUpSchema = z.object({
  username: z.string({ message: "Please Enter a Valid Username" }),
  email: z.string().email({ message: "It should in Email format" }),
  password: z
    .string()
    .min(8, { message: "The password length should be atleast 8 Character" }),
});

const signInSchema = z.object({
  email: z.string().email({ message: "It should in Email Format" }),
  password: z
    .string()
    .min(8, { message: "The password should be at least 8 Character" }),
});

const postSchema = z.object({
  title: z.string({ message: "it should be String" }),
  body: z.string({ message: "it should be String" }),
  tag: z.string({ message: "Please Enter An valid values" }).array().max(5),
});

// Add Post Validation for creation of post "ABOVE ⬆️"⬆

// middlewares

const auth = createMiddleware(async (c: any, next) => {
  const token = c.req.header("Authorization");
  if (token) {
    //do logic
    const { DATABASE_URL, PAYLOAD } = env<{
      DATABASE_URL: string;
      PAYLOAD: string;
    }>(c);
    const prisma = new PrismaClient({
      datasourceUrl: DATABASE_URL,
    }).$extends(withAccelerate());
    // ------------------------------

    const { username } = await Jwt.verify(token, PAYLOAD);
    const findUser = await prisma.user.findFirst({
      where: {
        username,
      },
    });
    c.userId = findUser?.id;
    await next();
  } else {
    return c.json({
      tokenError: "token didnt exist",
    });
  }
});

// middlewares

app.get("/", (c) => {
  return c.text("Hello Hono! this is worker app 2");
});

app.post("users/signup", async (c) => {
  // -----------------
  const { DATABASE_URL } = env<{ DATABASE_URL: any }>(c);
  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate());
  // -----------------
  const body = await c.req.json();
  const { success, data, error } = signUpSchema.safeParse(body);
  if (!success) {
    return c.json(
      {
        zodError: error.issues[0].message,
      },
      statusCodes.badRequest
    );
  } else {
    try {
      const result = await prisma.user.create({
        data: data,
      });
      return c.json(
        {
          success: result,
        },
        statusCodes.success
      );
    } catch (error) {
      return c.json(
        {
          PrismaError: error,
        },
        statusCodes.error
      );
    }
  }
});

app.post("/users/signin", async (c) => {
  const { DATABASE_URL, PAYLOAD } = env<{
    DATABASE_URL: string;
    PAYLOAD: string;
  }>(c);
  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate());
  // --------------
  const body = await c.req.json();
  const { success, data, error } = signInSchema.safeParse(body);
  if (!success) {
    return c.json(
      {
        zodError: error.issues[0].message,
      },
      statusCodes.badRequest
    );
  } else {
    // jwt logic
    const result = await prisma.user.findFirst({
      where: data,
      select: {
        username: true,
      },
    });
    if (result) {
      // generate token and return
      const token = await Jwt.sign(result, PAYLOAD);
      return c.json(
        {
          tokenMsg: token,
        },
        statusCodes.success
      );
    } else {
      // user didnt exist with email + pass
      return c.json(
        {
          errorPrisma: "user Didnt exist",
        },
        statusCodes.notFound
      );
    }
  }
});

app.get("/posts", async (c) => {
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate());
  // -----------------------------
  try {
    const result = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        body: true,
        userId: true,
        tag: true,
      },
    });
    return c.json(
      {
        allPosts: result,
      },
      statusCodes.success
    );
  } catch (error) {
    return c.json(
      {
        PrismaError: error,
      },
      statusCodes.error
    );
  }
});

app.post("/posts", auth, async (c: any) => {
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate());
  // -----------------------------------
  /**
   * 1. zod schema that gets, userId for indentification , body , title , tag -> array of strings
   * 1.5 - check whether the userExist if not throw an error if yes proceed
   * 2. create a post userid / body / title ----- problem : tag use "map fn"
   *
   */
  const body = await c.req.json();
  const { success, data, error } = postSchema.safeParse(body);
  const userId = c.userId;
  if (!success) {
    return c.json(
      {
        zodError: error.issues[0].message,
      },
      statusCodes.badRequest
    );
  } else {
    //do logic
    try {
      // creates and individaul tag in tag table
      const createdTags = await Promise.all(
        data.tag.map(async (t) => {
          return prisma.tag.create({
            data: {
              tag: t,
            },
          });
        })
      );

      //check if user create the same posts

      const check = await prisma.post.findFirst({
        where: {
          userId,
          title: data.title,
          body: data.body,
        },
      });

      if (!check) {
        const result = await prisma.post.create({
          data: {
            userId: userId,
            title: data.title,
            body: data.body,
            // Connect the created tags to the post
            tag: {
              connect: createdTags.map((tag) => ({ id: tag.id })),
            },
          },
          include: {
            tag: true,
          },
        });

        return c.json(
          {
            success: result,
          },
          statusCodes.success
        );
      } else {
        return c.json(
          {
            prismaError: "same post exist",
          },
          statusCodes.notFound
        );
      }
    } catch (error) {
      return c.json(
        {
          prismaError: error,
        },
        statusCodes.error
      );
    }
  }
});

app.get("/posts/:id", async (c) => {
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate());
  //-----------------------------------------------------------
  const id = Number(c.req.param("id"));

  const result = await prisma.post.findUnique({
    where: {
      id: id,
    },
    include: {
      tag: {
        select: {
          tag: true,
        },
      },
    },
  });
  if (result) {
    return c.json(
      {
        result,
      },
      statusCodes.success
    );
  } else {
    return c.json(
      {
        prismaError: "No post found at id of : " + id,
      },
      statusCodes.notFound
    );
  }
});

app.put("/posts/:id", auth, async (c) => {
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate());
  //----------------------------------------------------------
  const id = Number(c.req.param("id"));
  const data = await c.req.json();
  const findPost = await prisma.post.findFirst({
    where: {
      id,
    },
  });
  if (findPost) {
    const updated = await prisma.post.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        body: data.body,
        tag: {
          connectOrCreate: data.tag.map((t: string) => ({
            where: {
              id,
            },
            create: {
              tag: t,
            },
          })),
        },
      },
      include: {
        tag: true,
      },
    });
    return c.json(
      {
        succ: updated,
      },
      statusCodes.success
    );
  } else {
    return c.json(
      {
        prismaError: "No post found at id of : " + id,
      },
      statusCodes.notFound
    );
  }
});

app.delete("/posts/:id", auth, async (c) => {
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate());
  // --------------------------------------
  const id = Number(c.req.param("id"));
  try {
    const result = await prisma.post.delete({
      where: {
        id,
      },
      include: {
        tag: true,
      },
    });
    return c.json(
      {
        deleted: result,
      },
      statusCodes.success
    );
  } catch (error) {
    return c.json(
      {
        prismaError: "sry post didnt exist with the given id : " + id,
        error,
      },
      statusCodes.notFound
    );
  }
});

export default app;
