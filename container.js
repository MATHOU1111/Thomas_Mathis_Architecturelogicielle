const storage = require("./storage/memory");
const notifier = require("./notification/console");
const { createTournament } = require("./core/tournament");

module.exports = createTournament(storage, notifier);
