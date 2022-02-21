import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify, { ApiVersion } from "@shopify/shopify-api";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import bodyParser from 'koa-bodyparser'
import crypto from 'crypto'
import axios from 'axios'
import nodemailer from 'nodemailer'

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\/|\/$/g, ""),
  API_VERSION: ApiVersion.October20,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});
// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
let shop_name
let access_token
const ACTIVE_SHOPIFY_SHOPS = {};
app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();
  server.keys = [Shopify.Context.API_SECRET_KEY];
  server.use(
    createShopifyAuth({
      accessMode: 'offline',
      async afterAuth(ctx) {
        // Access token and shop available in ctx.state.shopify
        const { shop, accessToken, scope } = ctx.state.shopify;
        shop_name = shop
        access_token = accessToken
        const host = ctx.query.host
        ACTIVE_SHOPIFY_SHOPS[shop] = scope;

        const response = await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: "/webhooks",
          topic: "APP_UNINSTALLED",
          webhookHandler: async (topic, shop, body) =>
            delete ACTIVE_SHOPIFY_SHOPS[shop],
        });

        if (!response.success) {
          console.log(
            `Failed to register APP_UNINSTALLED webhook: ${response.result}`
          );
        }

        // Redirect to app with shop parameter upon auth
        ctx.redirect(`/?shop=${shop_name}&host=${host}`);
      },
    })
  );

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  function verifyWebhook(pl, hmac) {
    const message = pl
    const genHash = crypto
      .createHmac("sha256", process.env.SHOPIFY_API_SECRET)
      .update(message)
      .digest("base64")
      console.log(genHash)
      return genHash === hmac
  }

  router.get("/api/store/val", async ctx => {
    await axios.post("https://tiktok-api-fix-backend.herokuapp.com/api/store/validate", null, { params: {
      'store_key': access_token,
    }})
    .then(response => {
      if(response.status === 200) {
        ctx.status = 200
        ctx.body = JSON.stringify({
          store_name: shop_name,
          access_token: access_token
        })
      }
    })
    .catch(error => {
      if(error.response) {
        if(error.response.status === 401) {
          ctx.body = JSON.stringify({
            store_name: shop_name,
            access_token: access_token
          })
          ctx.status = 401
        } else {
          ctx.status = error.response.status
          ctx.body = JSON.stringify({
            store_name: shop_name,
            access_token: access_token
          })
        }
      } 
    })
  })

  router.post(
    "/graphql",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
    }
  );

  router.get("(/_next/static/.*)", handleRequest); // Static content is clear
  router.get("/_next/image", handleRequest) // Images are clear
  router.get("/_next/webpack-hmr", handleRequest); // Webpack content is clear
  router.get("(.*)", async (ctx) => {
    const shop = ctx.query.shop;
    // This shop hasn't been seen yet, go through OAuth to create a session
    if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      await handleRequest(ctx);
    }
  });

  // Email contactform
  router.post('/contact', async (ctx) => {
    const payload = ctx.request.body
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    const mailOptions = {
      from: payload.email,
      to: 'kajderuyter01@gmail.com',
      subject: payload.subject,
      html: `
      <h1>Form submission</h1><br>
      <p><b>Name: </b>${payload.name}</p>
      <p><b>Email: </b>${payload.email}</p>
      <p><b>Message: </b>${payload.message}</p>
      `
    }
    const email = async (mailConfig) => {
      const emailResult = await transporter.sendMail(mailConfig)
      return emailResult
    }
    const result = await email(mailOptions)
    if (result.accepted.length > 0) {
      ctx.status = 200
      ctx.body = JSON.stringify({message: 'Thank you for your email. We will get back to you as soon as possible.'})
    } else {
      ctx.status = 401
      ctx.body = JSON.stringify({message: 'Could not send email. Please try again.'})
    }
  })

  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
