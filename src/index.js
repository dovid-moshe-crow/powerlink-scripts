import { config } from "dotenv";
config();

import express from "express";
import api from "api";

const sdk = api("@fireberry/v1.0#49gp1ocowlgkt7yvj");
sdk.auth(process.env.POWERLINK_TOKEN_ID);

const app = express();

app.post("/reset-bikoret-status", async (req, res) => {
  /**@type {{accountid:string}[]} */
  const ids = (
    await sdk.getAllAccounts({
      objecttype: 1,
      fields: "accountid",
      query: "pcfsystemfield298 = 1",
      sort_type: "asc",
      page_size: 500,
      page_number: 1,
    })
  ).data.data.Data;

  for (const id of ids) {
    await sdk.updateACustomObjectRecord(
      { pcfsystemfield608: "0" },
      { objectcode: "1", id: id.accountid }
    );
  }

  return res.json({ success: true });
});

app.listen(process.env.PORT, () =>
  console.log(`listening on port ${process.env.PORT}`)
);
