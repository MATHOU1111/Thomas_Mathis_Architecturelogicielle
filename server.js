const tournament = require("./container");
const { createApi } = require("./api");

const app = createApi(tournament);

async function start() {
  await tournament.init();
  app.listen(3000, () => {
    console.log("Arena Tournament disponible sur http://localhost:3000");
  });
}

start().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
