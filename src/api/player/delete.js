// ---------------------------------------------------------------------------------------------
// YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// ---------------------------------------------------------------------------------------------

import { Player, PlayerSkill } from '../../db/model';

export default async function deletePlayer(req, res) {
    const { playerId } = req.params;
    
    // Check the authorization header.
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.slice(7) !== 'SkFabTZibXE1aE14ckpQUUxHc2dnQ2RzdlFRTTM2NFE2cGI4d3RQNjZmdEFITmdBQkE=') {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    
    // Find the player in the database.
    const player = await Player.findByPk(playerId);
    if (!player) {
        res.status(404).json({ message: `Player not found: ${playerId}` });
        return;
    }

    // Delete the player and their skills.
    await PlayerSkill.destroy({ where: { playerId } });
    await player.destroy();

    // Send a success response.
    res.json({ message: `Player deleted: ${playerId}` });
}


// export default async (req, res) => {
//   res.sendStatus(500);
// }
