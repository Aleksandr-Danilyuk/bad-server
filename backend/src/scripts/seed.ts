/**
 * Скрипт для инициализации базы данных тестовыми данными
 * Запуск: npx ts-node src/scripts/seed.ts
 */
import mongoose from 'mongoose'
import { DB_ADDRESS } from '../config'
import User from '../models/user'
import Product from '../models/product'

const usersData = [
    {
        _id: '66ed71ce9c59262364955b3e',
        name: 'Admin',
        email: 'admin@mail.ru',
        password: '$2a$10$V47OXEQ60mJt5GOgSNti5Opn1YTWKP1Q1/RkPLN/1iGmSMhQXSlIe', // bcrypt от "password"
        roles: ['admin'],
        lastOrderDate: null,
        lastOrder: null,
        totalAmount: 0,
        orderCount: 0,
        orders: [],
        tokens: [],
        createdAt: new Date('2024-09-20T12:59:58.737Z'),
        updatedAt: new Date('2024-09-20T18:03:56.272Z'),
    },
    {
        _id: '66ed725a9c59262364955b5f',
        name: 'First Customer',
        email: 'user1@mail.ru',
        password: '$2a$10$BljhzvXGr8OdLvl8y8rU4ObCAm0vIpWIh6RKNoWuayzCxwn//KyZO', // bcrypt от "password1"
        roles: ['customer'],
        lastOrderDate: null,
        lastOrder: null,
        totalAmount: 0,
        orderCount: 0,
        orders: [],
        tokens: [],
        createdAt: new Date('2024-09-20T13:02:18.404Z'),
        updatedAt: new Date('2024-09-20T13:02:18.408Z'),
    },
]

const productsData = [
    {
        _id: '66ed72b69c59262364955b82',
        title: 'Хлеб',
        price: 50,
        category: 'bread',
        description: 'Свежий хлеб',
        image: {
            fileName: 'bread.png',
            originalName: 'bread.png',
        },
        createdAt: new Date('2024-09-20T13:03:50.116Z'),
        updatedAt: new Date('2024-09-20T13:03:50.116Z'),
    },
    {
        _id: '66ed72b69c59262364955b83',
        title: 'Молоко',
        price: 100,
        category: 'dairy',
        description: 'Натуральное молоко',
        image: {
            fileName: 'milk.png',
            originalName: 'milk.png',
        },
        createdAt: new Date('2024-09-20T13:03:50.116Z'),
        updatedAt: new Date('2024-09-20T13:03:50.116Z'),
    },
]

async function seed() {
    try {
        console.log('Подключение к базе данных...')
        await mongoose.connect(DB_ADDRESS)
        console.log('Успешное подключение к MongoDB')

        // Очищаем существующие данные
        console.log('Очистка коллекции users...')
        await User.deleteMany({})
        console.log('Очистка коллекции products...')
        await Product.deleteMany({})

        // Вставляем пользователей
        console.log('Добавление пользователей...')
        await User.insertMany(usersData)
        console.log('Пользователи добавлены:')
        console.log('  - admin@mail.ru / password (admin)')
        console.log('  - user1@mail.ru / password1 (customer)')

        // Вставляем продукты
        console.log('Добавление продуктов...')
        await Product.insertMany(productsData)
        console.log(`Добавлено ${productsData.length} продуктов`)

        console.log('\nБаза данных успешно инициализирована!')
        process.exit(0)
    } catch (error) {
        console.error('Ошибка инициализации базы данных:', error)
        process.exit(1)
    }
}

seed()
