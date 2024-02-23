const SequelizeMock = require('sequelize-mock')
global.dbMock = new SequelizeMock()
jest.mock('socket.io', () => {
    return jest.fn(() => {
        return {
            on: jest.fn(),
            emit: jest.fn(),
        }
    })
})
