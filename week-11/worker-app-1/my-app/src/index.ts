import { Hono, Next } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Schema, string, z } from "zod";
import { env } from "hono/adapter";
import { Jwt } from "hono/utils/jwt";
import { createMiddleware } from "hono/factory";

const app = new Hono();

type struct = {
  username: string;
  email: string;
  password: string;
};

type post = {
  title: string;
  body: string;
};

const generalSchema = z.object({
  username: z.string({ message: "Username Must be String format" }).optional(),
  email: z
    .string()
    .email({ message: "Please enter Valid Email (check the format)" })
    .optional(),
  password: z.string().min(8).optional(),
});

const postSchema = z.object({
  title: z
    .string()
    .max(50, {
      message: "Title should be string and maximum character must be 50",
    })
    .optional(),
  body: z
    .string()
    .max(256, {
      message: "body should be string and maximum character must be 256",
    })
    .optional(),
});

enum ResponseStatus {
  Success = 200,
  NotFound = 404,
  BadRequest = 400,
  Error = 500,
}

const auth = createMiddleware(async (c, next) => {
  //get token from header
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
  // const { PAYLOAD } = env<{ PAYLOAD: string }>(c);
  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate());
  const token = c.req.header("Authorization");
  if (token == undefined) {
    return c.json({
      authMsg: "No tokens were found at headers",
    });
  } else {
    const username = Jwt.decode(token);
    const result = await prisma.user.findUnique({
      where: {
        username: username.payload,
      },
    });
    if (result) {
      console.log(result);
      await next();
    } else {
      return c.json({
        msg: "No user were found",
      });
    }
  }
});

app.get("/", (c) => c.text("Hello Cloudflare Workers from ash!"));

app.post("/users/signup", async (c) => {
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const body: struct = await c.req.json();
    const parser = generalSchema.safeParse(body);
    if (parser.success) {
      console.log(parser.data);
      const create = await prisma.user.create({
        data: body,
      });
      return c.json(
        {
          msg: create,
        },
        ResponseStatus.Success
      );
    } else {
      return c.json(
        {
          error: parser.error.issues[0].message,
        },
        ResponseStatus.BadRequest
      );
    }
  } catch (error: any) {
    return c.json(
      {
        msgError: error,
      },
      ResponseStatus.Error
    );
  }
});

app.post("/users/signin", async (c) => {
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
  const { PAYLOAD } = env<{ PAYLOAD: string }>(c);
  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    type signIn = Pick<struct, "email" | "password">;
    const body: signIn = await c.req.json();
    const parser = generalSchema.safeParse(body);
    if (parser.success) {
      const getUser = await prisma.user.findFirst({
        where: body,
      });
      if (getUser) {
        //return jwt
        const token = await Jwt.sign(getUser.username, PAYLOAD);
        return c.json({
          Tokenmsg: token,
        });
      } else {
        return c.json({
          msg: "user didn't found with Given Credentials ",
        });
      }
    } else {
      return c.json(
        {
          error: parser.error.issues[0].message,
        },
        ResponseStatus.BadRequest
      );
    }
  } catch (error) {
    return c.json(
      {
        errorMsg: error,
      },
      ResponseStatus.Error
    );
  }
});

app.get("/posts", async (c) => {
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate());
  const result = await prisma.post.findMany();
  return c.json(
    {
      posts: result,
    },
    ResponseStatus.Success
  );
});

app.post("/posts", auth, async (c) => {
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const body: post = await c.req.json();
    const parser = postSchema.safeParse(body);
    if (parser.success) {
      const result = await prisma.post.create({
        data: body,
      });
      return c.json(
        {
          postCreated: result,
        },
        ResponseStatus.Success
      );
    } else {
      return c.json(
        {
          zodMsg: parser.error.issues[0].message,
        },
        ResponseStatus.BadRequest
      );
    }
  } catch (error) {
    return c.json(
      {
        ErrorMsg: "Internal Database Error",
      },
      ResponseStatus.Error
    );
  }
});

app.get("/posts/:id", async (c) => {
  const value = c.req.param("id");
  const id = Number(value);
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate());
  const result = await prisma.post.findUnique({
    where: {
      id: id,
    },
  });
  if (result) {
    return c.json(
      {
        post: result,
      },
      ResponseStatus.Success
    );
  } else {
    return c.json(
      {
        msg: "No post found",
      },
      ResponseStatus.NotFound
    );
  }
});

app.put("/posts/:id", auth, async (c) => {
  const value = c.req.param("id");
  const id = Number(value);
  const body: post = await c.req.json();
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate());
  const result = await prisma.post.update({
    where: {
      id: id,
    },
    data: body,
  });
  if (result) {
    return c.json(
      {
        Updated: "Post Updated Successfully",
      },
      ResponseStatus.Success
    );
  } else {
    return c.json(
      {
        msg: "No post found",
      },
      ResponseStatus.NotFound
    );
  }
});

app.delete("/posts/:id", auth, async (c) => {
  const value = c.req.param("id");
  const id = Number(value);
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate());
  const result = await prisma.post.delete({
    where: {
      id: id,
    },
  });
  console.log(result);
  if (result) {
    return c.json(
      {
        deleted: "Post Deleted Successfully",
      },
      ResponseStatus.Success
    );
  } else {
    return c.json(
      {
        msg: "No post found",
      },
      ResponseStatus.NotFound
    );
  }
});

export default app;
