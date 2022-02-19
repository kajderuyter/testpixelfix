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
        ctx.redirect(`/?shop=${shop}&host=${host}`);
      },
    })
  );

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };
  
  let previousOrder
  server.use(bodyParser())
  router.post("/webhooks", async ctx => {
    const payload = ctx.request.body
    console.log([`Previous order number: ${previousOrder}
                  Current order number: ${payload.order_number}`])
    if (payload.order_number != previousOrder) {
      const hmac = ctx.get('X-Shopify-Hmac-Sha256')
      const topic = ctx.get('X-Shopify-Topic')
      const shop = ctx.get('X-Shopify-Shop-Domain')
      // const verified = verifyWebhook(ctx.request.body, hmac)

      // if(!verified) {
      //   console.log("Failed to verify the incoming request")
      //   ctx.response.status = 401
      //   ctx.response.message = "Could not verify request"
      //   return;
      // }
      
      const wachtwoord = 'kajSucces!'
      const external_id = payload.customer.id
      const phone_number = payload.customer.phone
      const email = payload.customer.email
      const ip = payload.client_details.browser_ip
      const user_agent = payload.client_details.user_agent
      const product_price = payload.line_items[0].price
      const quantity = payload.line_items[0].quantity
      const content_type = "Physical product"
      const content_id = payload.line_items[0].id
      const currency = payload.currency
      const value = payload.current_total_price
      const ttclid = payload.note_attributes.find(x => x.name === 'ttclid')?.value
      let callback = ''
      if(ttclid) {callback = ttclid}

      ctx.response.status = 200

      // axios.post("https://tiktok-api-fix-backend.herokuapp.com/api/testrequest", null, { params: {
      //   'wachtwoord': wachtwoord,
      //   'external_id': external_id,
      //   'phone_number': phone_number || 'leeg',
      //   'email': email,
      //   'ip': ip,
      //   'user_agent': user_agent,
      //   'product_price': product_price,
      //   'quantity': quantity,
      //   'content_type': content_type,
      //   'content_id': content_id,
      //   'currency': currency,
      //   'value': value,
      //   'callback': callback,
      // }})
      //   .then(res => {
      //     console.log(`Statuscode: ${res.status}`)
      //     console.log(res.data)
      //   })
      //   .catch(err => {
      //     console.log("begin error")
      //     console.log(err.response.data)
      //     console.log("einde error")
      //   })
      previousOrder = payload.order_number
      console.log(`New previous order: ${previousOrder}`)
    } else {
      ctx.response.status = 200
    }
  });

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
      console.log(response.status)
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

  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
