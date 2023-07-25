// ---------------------------------------------------------------------------------------------
// YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// ---------------------------------------------------------------------------------------------

import { Player, PlayerSkill } from '../../db/model';

export default async function listPlayers(req, res) {
    // Fetch all the players from the database.
    const players = await Player.findAll();
    
    // Fetch the skills for each player.
    const playersWithSkills = await Promise.all(
        players.map(async player => {
            const skills = await PlayerSkill.findAll({ where: { playerId: player.id } });
            return {
                id: player.id,
                name: player.name,
                position: player.position,
                playerSkills: skills.map(skill => ({
                    id: skill.id,
                    skill: skill.skill,
                    value: skill.value,
                    playerId: skill.playerId,
                })),
            };
        })
    );
    
    // Send the players with their skills in the response.
    res.json(playersWithSkills);
}


// export default async (req, res) => {
//   res.sendStatus(500);
// }
