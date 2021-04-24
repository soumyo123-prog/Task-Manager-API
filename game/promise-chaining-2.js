require('../src/db/mongoose');
const Task = require('../src/models/tasks');

const deleteTaskAndCount = async (id,completed) => {
    const deletedTask = await Task.findByIdAndRemove(id);
    const count = await Task.countDocuments({completed});
    return count;
};

deleteTaskAndCount("607049e25785f64d344a3794",false)
.then(res => {
    console.log(res);
})
.catch(err => {
    console.log(err);
})