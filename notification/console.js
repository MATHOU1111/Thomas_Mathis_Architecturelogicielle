async function notify(match, team1, team2) {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log(
    `Notification à ${team1.name} et ${team2.name} : match ${match.id} terminé, ` +
    `score ${match.scoreTeam1} - ${match.scoreTeam2}.`,
  );
}

module.exports = { notify };
