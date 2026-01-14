const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    {
        dialect: 'sqlite',
        storage : "./sqlite/prezenta.db"
    }
)

sequelize.sync().then(async ()=>{
    console.log("Yes");

    const Event = require('./models/event');
    const EventGroup = require('./models/eventGroup')
    const User = require('./models/user');
    const EventUser = require('./models/eventUser');

    // 1. Mai întâi EventGroups (părinte pentru Events)
    const groupCount = await EventGroup.count();
    if (groupCount == 0) {
        await EventGroup.bulkCreate([
            { name: "Tehnologii Web", description: "Evenimente legate de tehnologiile web." },
            { name: "Inteligenta Artificiala", description: "Evenimente despre AI si invatare automata." }
        ]);
    }

    // 2. Users (independent, dar necesar pentru EventUser)
    const userCount = await User.count();
    if (userCount == 0) {
        await User.bulkCreate([{
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
        ]);
    }

    // 3. Events (au nevoie de EventGroups)
    const eventCount = await Event.count();
    if (eventCount == 0) {
        await Event.bulkCreate([{
            id: 1,
            name: "Conferinta Tech",
            state: "OPEN",
            groupId: 1,
            startTime: new Date("2025-12-10T10:00:00"),
            endTime: new Date("2025-12-10T12:00:00"),
            accessCode: "CONF123",
            qrCodePath: "/qrcodes/conf123.png"
        },
        {
            id: 2,
            name: "Workshop AI",
            state: "CLOSED",
            groupId: 2,
            startTime: new Date("2025-12-15T09:00:00"),
            endTime: new Date("2025-12-15T11:00:00"),
            accessCode: "AIWORK456",
            qrCodePath: "/qrcodes/aiwork456.png"
        },
        {
            id: 3,
            name: "Hackathon Winter",
            state: "OPEN",
            groupId: 2,
            startTime: new Date("2025-12-20T08:00:00"),
            endTime: new Date("2025-12-20T20:00:00"),
            accessCode: "HACK789",
            qrCodePath: "/qrcodes/hack789.png"
        }
        ]);
    }
    
    // 4. La final EventUser (are nevoie de Events și Users)
    const eventUserCount = await EventUser.count();
    if (eventUserCount == 0) {
        await EventUser.bulkCreate([
            {  eventId: 1, userId: 1 },  
            {  eventId: 1, userId: 2 }, 
            {  eventId: 1, userId: 3 },  
            {  eventId: 2, userId: 1 },  
            {  eventId: 2, userId: 3 },  
            {  eventId: 3, userId: 2 },  
            {  eventId: 3, userId: 3 }   
        ]);
    }
})

module.exports = sequelize; 