const checkValidity = (req,canUpdate) => {
    const updates = Object.keys(req.body);
    const validUpdate = updates.every(update => canUpdate.includes(update));
    return validUpdate;
}

module.exports = checkValidity;