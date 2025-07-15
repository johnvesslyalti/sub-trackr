import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      image: 'https://via.placeholder.com/100',
      subscriptions: {
        create: [
          {
            name: 'Netflix',
            price: 499.0,
            billingCycle: 'MONTHLY',
            nextBillingDate: new Date('2025-08-01'),
          },
          {
            name: 'Spotify',
            price: 129.0,
            billingCycle: 'MONTHLY',
            nextBillingDate: new Date('2025-07-25'),
          }
        ],
      },
    },
  })

  console.log({ user })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
