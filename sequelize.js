const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    {
        dialect: 'sqlite',
        storage : "./sqlite/test.db"
    }
)

sequelize.sync({alter: true}).then(()=>{
    console.log("Yes");

    const Event = require('./models/event');
    const EventGroup = require('./models/eventGroup')
    const User = require('./models/user');

    Event.count().then(c=> {
        if (c==0){
            Event.bulkCreate([])
        }
    })

    EventGroup.count().then(c=> {
        if (c==0){
            EventGroup.bulkCreate([])
        }
    })

    User.count().then(c=>{
        if (c==0){
            User.bulkCreate([])
        }
    })
})