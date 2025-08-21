import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const houseguests = [
  { firstName: 'Adrian', lastName: 'Rocha', slug: 'adrian-rocha' },
  { firstName: 'Amy', lastName: 'Bingham', slug: 'amy-bingham' },
  { firstName: 'Ashley', lastName: 'Hollis', slug: 'ashley-hollis' },
  { firstName: 'Ava', lastName: 'Pearl', slug: 'ava-pearl' },
  { firstName: 'Cliffton', lastName: 'Williams', slug: 'cliffton-williams' },
  { firstName: 'Isaiah', lastName: 'Frederich', slug: 'isaiah-frederich' },
  { firstName: 'Jimmy', lastName: 'Heagerty', slug: 'jimmy-heagerty' },
  { firstName: 'Katherine', lastName: 'Woodman', slug: 'katherine-woodman' },
  { firstName: 'Keanu', lastName: 'Soto', slug: 'keanu-soto' },
  { firstName: 'Kelley', lastName: 'Jorgensen', slug: 'kelley-jorgensen' },
  { firstName: 'Lauren', lastName: 'Domingue', slug: 'lauren-domingue' },
  { firstName: 'Mickey', lastName: 'Lee', slug: 'mickey-lee' },
  { firstName: 'Morgan', lastName: 'Pope', slug: 'morgan-pope' },
  { firstName: 'Rylie', lastName: 'Jeffries', slug: 'rylie-jeffries' },
  { firstName: 'Vince', lastName: 'Panaro', slug: 'vince-panaro' },
  { firstName: 'Zach', lastName: 'Cornell', slug: 'zach-cornell' },
  { firstName: 'Rachel', lastName: 'Reilly', slug: 'rachel-reilly' },
]

async function main() {
  console.log('Seeding houseguests...')
  
  for (const houseguest of houseguests) {
    await prisma.houseguest.upsert({
      where: { slug: houseguest.slug },
      update: {},
      create: {
        ...houseguest,
        status: 'IN',
        hohWins: [],
        povWins: [],
        blockbusterWins: [],
        onTheBlockWeeks: [],
      },
    })
  }
  
  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
