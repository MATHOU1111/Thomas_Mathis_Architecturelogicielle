const tournament = require("./container");
const { createApi } = require("./api");
const { startCli } = require("./cli");

const app = createApi(tournament);

async function start() {
  await tournament.init();
  app.listen(3000, () => {
    console.log("Arena Tournament disponible sur http://localhost:3000");
    startCli(tournament);
  });
}

start().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
