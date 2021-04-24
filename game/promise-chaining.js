require('../src/db/mongoose');
const User = require('../src/models/users');

const updateAgeAndGetCount = async (id,age) => {
    const user = await User.findByIdAndUpdate(id,{age : age});
    const count = await User.countDocuments({age : age});
    return count;
}

updateAgeAndGetCount("607166799e1d0051104be78a",22)
.then(count => {
    console.log(count);
})
.catch(err => {
    console.log(err);
})