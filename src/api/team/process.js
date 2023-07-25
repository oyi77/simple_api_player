// ---------------------------------------------------------------------------------------------
// YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// ---------------------------------------------------------------------------------------------

// In src/api/team/process.js

export default async function processTeam(req, res) {
  const requirements = req.body;
  
  // Validate the input.
  const validPositions = ['defender', 'midfielder', 'forward'];
  const validSkills = ['defense', 'attack', 'speed', 'strength', 'stamina'];
  for (let { position, mainSkill, numberOfPlayers } of requirements) {
      if (!validPositions.includes(position)) {
          res.status(400).json({ message: `Invalid value for position: ${position}` });
          return;
      }
      if (!validSkills.includes(mainSkill)) {
          res.status(400).json({ message: `Invalid value for mainSkill: ${mainSkill}` });
          return;
      }
      if (typeof numberOfPlayers !== 'number' || numberOfPlayers < 1) {
          res.status(400).json({ message: `Invalid value for numberOfPlayers: ${numberOfPlayers}. It must be a number greater than 0.` });
          return;
      }
  }
  
  // For each requirement, select the best players.
  const selectedPlayers = [];
  for (let { position, mainSkill, numberOfPlayers } of requirements) {
      // Fetch all the players with the required position.
      const players = await Player.findAll({ where: { position } });
      
      // If there are not enough players, return an error.
      if (players.length < numberOfPlayers) {
          res.status(400).json({ message: `Insufficient number of players for position: ${position}` });
          return;
      }
      
      // Fetch the skills for each player and sort them by the main skill.
      const playersWithSkills = await Promise.all(
          players.map(async player => {
              const skills = await PlayerSkill.findAll({ where: { playerId: player.id } });
              return {
                  ...player.get(),
                  playerSkills: skills.map(skill => skill.get()),
                  mainSkillValue: skills.find(skill => skill.skill === mainSkill)?.value || 0,
              };
          })
      );
      playersWithSkills.sort((a, b) => b.mainSkillValue - a.mainSkillValue);
      
      // Select the top players.
      selectedPlayers.push(...playersWithSkills.slice(0, numberOfPlayers));
  }
  
  // Send the selected players in the response.
  res.json(selectedPlayers);
}


// export default async (req, res) => {
//   res.sendStatus(500);
// }
