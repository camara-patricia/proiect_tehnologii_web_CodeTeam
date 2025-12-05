const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    {
        dialect: 'sqlite',
        storage : "./sqlite/prezenta.db"
    }
)

sequelize.sync({alter: true}).then(()=>{
    console.log("Yes");

    const Event = require('./models/event');
    const EventGroup = require('./models/eventGroup')
    const User = require('./models/user');

    Event.count().then(c=> {
        if (c==0){
            Event.bulkCreate([{
                name: "Conferinta Tech",
                state: "OPEN",
                groupId: 1,
                startTime: new Date("2025-12-10T10:00:00"),
                endTime: new Date("2025-12-10T12:00:00"),
                accessCode: "CONF123",
                qrCodePath: "/qrcodes/conf123.png"
            },
            {
                name: "Workshop AI",
                state: "CLOSED",
                groupId: 2,
                startTime: new Date("2025-12-15T09:00:00"),
                endTime: new Date("2025-12-15T11:00:00"),
                accessCode: "AIWORK456",
                qrCodePath: "/qrcodes/aiwork456.png"
            },
            {
                name: "Hackathon Winter",
                state: "OPEN",
                groupId: 2,
                startTime: new Date("2025-12-20T08:00:00"),
                endTime: new Date("2025-12-20T20:00:00"),
                accessCode: "HACK789",
                qrCodePath: "/qrcodes/hack789.png"
            }
            ])
        }
    })

    EventGroup.count().then(c=> {
        if (c==0){
            EventGroup.bulkCreate([])
        }
    })

    User.count().then(c=>{
        if (c==0){
            User.bulkCreate([{
                firstName: "Ana",
                lastName: "Popa",
                email: "ana.popa@example.com",
                eventPlanner: true,
                password: "parola1"
            },
            {
                firstName: "Mihai",
                lastName: "Ionescu",
                email: "mihai.ionescu@example.com",
                eventPlanner: false,
                password: "secret2"
            },
            {
                firstName: "Elena",
                lastName: "Marin",
                email: "elena.marin@example.com",
                eventPlanner: true,
                password: "pass33"
            }
            ])
        }
    })
})

module.exports = sequelize; 