// ---------------------------------------------------------------------------------------------
// YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// ---------------------------------------------------------------------------------------------

import { Player, PlayerSkill } from '../../db/model';

export default async function updatePlayer(req, res) {
    const { playerId } = req.params;
    const { name, position, playerSkills } = req.body;
    
    // Validate the input here...
    const validPositions = ['defender', 'midfielder', 'forward'];
    const validSkills = ['defense', 'attack', 'speed', 'strength', 'stamina'];

    if (!validPositions.includes(position)) {
        res.status(400).json({ message: `Invalid value for position: ${position}` });
        return;
    }

    if (!playerSkills || playerSkills.length === 0) {
        res.status(400).json({ message: 'A player needs to have at least one skill.' });
        return;
    }

    for (let { skill, value } of playerSkills) {
        if (!validSkills.includes(skill)) {
            res.status(400).json({ message: `Invalid value for skill: ${skill}` });
            return;
        }
        if (value < 0 || value > 100) {
            res.status(400).json({ message: `Invalid value for skill value: ${value}. It must be between 0 and 100.` });
            return;
        }
    }
    
    // After validation, find the player in the database.
    const player = await Player.findByPk(playerId);
    if (!player) {
        res.status(404).json({ message: `Player not found: ${playerId}` });
        return;
    }

    // Update the player's name and position.
    await player.update({ name, position });

    // Delete the old skills.
    await PlayerSkill.destroy({ where: { playerId } });

    // Create the new skills.
    const skills = await Promise.all(
        playerSkills.map(({ skill, value }) => PlayerSkill.create({ playerId, skill, value }))
    );

    // Send the updated player and skills in the response.
    res.json({
        id: player.id,
        name: player.name,
        position: player.position,
        playerSkills: skills.map(skill => ({
            id: skill.id,
            skill: skill.skill,
            value: skill.value,
            playerId: skill.playerId,
        })),
    });
}

// export default async (req, res) => {
//   res.sendStatus(500);
// }
