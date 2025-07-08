import { PrismaClient } from '@prisma/client'
import { Chance } from 'chance'

const chance = new Chance()
const prisma = new PrismaClient()

// =====================================================
// COMPREHENSIVE DATABASE SEEDING
// =====================================================

// Sample data arrays for more realistic seeding
const pokemonTypes = [
  'fire',
  'water',
  'grass',
  'electric',
  'psychic',
  'ice',
  'dragon',
  'dark',
  'fighting',
  'poison',
  'ground',
  'flying',
  'bug',
  'rock',
  'ghost',
  'steel',
  'fairy',
  'normal',
]

const pokemonAbilities = [
  'Blaze',
  'Torrent',
  'Overgrow',
  'Static',
  'Synchronize',
  'Clear Body',
  'Natural Cure',
  'Serene Grace',
  'Swift Swim',
  'Chlorophyll',
  'Solar Power',
  'Flash Fire',
  'Water Absorb',
  'Volt Absorb',
  'Levitate',
  'Pressure',
  'Intimidate',
  'Trace',
  'Download',
  'Adaptability',
  'Technician',
]

const categoryNames = [
  'Technology',
  'Programming',
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'Artificial Intelligence',
  'Design',
  'UI/UX',
  'Graphic Design',
  'Photography',
  'Art',
  'Business',
  'Marketing',
  'Finance',
  'Startup',
  'Entrepreneurship',
  'Health',
  'Fitness',
  'Nutrition',
  'Mental Health',
  'Wellness',
  'Education',
  'Science',
  'Research',
  'Innovation',
  'Tutorial',
  'Gaming',
  'Entertainment',
  'Music',
  'Movies',
  'Books',
  'Travel',
  'Food',
  'Cooking',
  'Lifestyle',
  'Fashion',
  'Sports',
  'News',
  'Politics',
  'Environment',
  'Sustainability',
]

const postTitles = [
  'Getting Started with TypeScript in 2024',
  'The Future of Web Development',
  'Best Practices for API Design',
  'Understanding Database Optimization',
  'A Deep Dive into GraphQL',
  'Machine Learning for Beginners',
  'The Art of Code Review',
  'Building Scalable Applications',
  'Modern CSS Techniques',
  'JavaScript Performance Tips',
  'React vs Vue: Which to Choose?',
  'Mastering Git Workflows',
  'Database Design Patterns',
  'API Security Best Practices',
  'The Evolution of Frontend Frameworks',
  'Debugging Techniques Every Developer Should Know',
  'Microservices Architecture Explained',
  'Building Real-time Applications',
  'The Importance of Testing',
  'DevOps for Developers',
]

const pokemonNames = [
  'Charizard',
  'Blastoise',
  'Venusaur',
  'Pikachu',
  'Raichu',
  'Alakazam',
  'Machamp',
  'Golem',
  'Lapras',
  'Dragonite',
  'Mewtwo',
  'Mew',
  'Typhlosion',
  'Feraligatr',
  'Meganium',
  'Lugia',
  'Ho-Oh',
  'Celebi',
  'Blaziken',
  'Swampert',
  'Sceptile',
  'Rayquaza',
  'Kyogre',
  'Groudon',
  'Infernape',
  'Empoleon',
  'Torterra',
  'Dialga',
  'Palkia',
  'Giratina',
  'Serperior',
  'Emboar',
  'Samurott',
  'Reshiram',
  'Zekrom',
  'Kyurem',
  'Greninja',
  'Talonflame',
  'Goodra',
  'Xerneas',
  'Yveltal',
  'Zygarde',
]

// Utility functions
const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)]
}

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const getRandomFloat = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

const generatePokemonImageUrl = (name: string): string => {
  return `https://img.pokemondb.net/artwork/large/${name.toLowerCase()}.jpg`
}

// Seeding functions
async function seedUsers(count = 50) {
  console.log(`🧑 Seeding ${count} users...`)

  const users = []
  for (let i = 0; i < count; i++) {
    users.push({
      email: chance.email().toLowerCase(),
      name: Math.random() > 0.1 ? chance.name() : null, // 10% chance of null name
    })
  }

  const createdUsers = await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  })

  console.log(`   ✅ Created ${createdUsers.count} users`)

  // Retrieve actual created users with their IDs
  const allUsers = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: count,
  })

  return allUsers
}

async function seedProfiles(users: any[], coveragePercentage = 0.7) {
  const profileCount = Math.floor(users.length * coveragePercentage)
  console.log(`👤 Seeding ${profileCount} profiles (${Math.round(coveragePercentage * 100)}% coverage)...`)

  const selectedUsers = chance.shuffle(users).slice(0, profileCount)

  const profiles = selectedUsers.map((user) => ({
    bio: Math.random() > 0.2 ? chance.paragraph({ sentences: getRandomInt(1, 3) }) : null, // 20% chance of null bio
    userId: user.id,
  }))

  const createdProfiles = await prisma.profile.createMany({
    data: profiles,
    skipDuplicates: true,
  })

  console.log(`   ✅ Created ${createdProfiles.count} profiles`)

  return await prisma.profile.findMany({
    include: { user: true },
  })
}

async function seedPokemon(count = 100) {
  console.log(`🐾 Seeding ${count} Pokemon...`)

  const pokemon = []
  const usedNames = new Set()

  for (let i = 0; i < count; i++) {
    let name
    if (i < pokemonNames.length) {
      name = pokemonNames[i]
    } else {
      // Generate unique names for additional pokemon
      do {
        name = chance.animal() + chance.animal() + getRandomInt(1, 999)
      } while (usedNames.has(name))
    }
    usedNames.add(name)

    pokemon.push({
      name,
      type: getRandomElement(pokemonTypes),
      ability: getRandomElement(pokemonAbilities),
      image: generatePokemonImageUrl(name),
    })
  }

  const createdPokemon = await prisma.pokemon.createMany({
    data: pokemon,
    skipDuplicates: true,
  })

  console.log(`   ✅ Created ${createdPokemon.count} Pokemon`)

  return await prisma.pokemon.findMany()
}

async function seedCategories() {
  console.log(`📂 Seeding ${categoryNames.length} categories...`)

  const categories = categoryNames.map((name) => ({ name }))

  const createdCategories = await prisma.category.createMany({
    data: categories,
    skipDuplicates: true,
  })

  console.log(`   ✅ Created ${createdCategories.count} categories`)

  return await prisma.category.findMany()
}

async function seedPosts(users: any[], count = 200) {
  console.log(`📝 Seeding ${count} posts...`)

  const posts = []
  for (let i = 0; i < count; i++) {
    const title = i < postTitles.length ? postTitles[i] : chance.sentence()
    const author = getRandomElement(users)

    posts.push({
      title,
      content: Math.random() > 0.1 ? chance.paragraph({ sentences: getRandomInt(2, 8) }) : null, // 10% chance of null content
      published: Math.random() > 0.3, // 70% chance of being published
      authorId: author.id,
    })
  }

  const createdPosts = await prisma.post.createMany({
    data: posts,
    skipDuplicates: true,
  })

  console.log(`   ✅ Created ${createdPosts.count} posts`)

  return await prisma.post.findMany()
}

async function seedPostCategories(posts: any[], categories: any[]) {
  console.log(`🔗 Seeding post-category relationships...`)

  const postCategories = []
  for (const post of posts) {
    const numCategories = getRandomInt(1, 3) // Each post gets 1-3 categories

    const selectedCategories = chance.shuffle(categories).slice(0, numCategories)

    for (const category of selectedCategories) {
      postCategories.push({
        postId: post.id,
        categoryId: category.id,
      })
    }
  }

  const createdPostCategories = await prisma.postCategory.createMany({
    data: postCategories,
    skipDuplicates: true,
  })

  console.log(`   ✅ Created ${createdPostCategories.count} post-category relationships`)

  return postCategories
}

async function seedLargeTable(count = 1000) {
  console.log(`📊 Seeding ${count} large table entries...`)

  const entries = []
  for (let i = 0; i < count; i++) {
    entries.push({
      name: chance.company() + ' ' + getRandomInt(1, 10000),
      value: getRandomFloat(0.01, 9999.99),
      timestamp: chance.date({
        min: new Date('2020-01-01'),
        max: new Date('2024-12-31'),
      }),
      details: chance.paragraph({ sentences: getRandomInt(1, 5) }),
    })
  }

  const createdEntries = await prisma.largeTable.createMany({
    data: entries,
    skipDuplicates: true,
  })

  console.log(`   ✅ Created ${createdEntries.count} large table entries`)

  return entries
}

async function main() {
  console.log('🚀 Starting comprehensive database seeding...')
  console.log('='.repeat(60))

  try {
    // Clear existing data (optional - comment out if you want to preserve existing data)
    console.log('🧹 Clearing existing data...')
    await prisma.postCategory.deleteMany()
    await prisma.post.deleteMany()
    await prisma.profile.deleteMany()
    await prisma.user.deleteMany()
    await prisma.category.deleteMany()
    await prisma.pokemon.deleteMany()
    await prisma.largeTable.deleteMany()
    console.log('   ✅ Existing data cleared\n')

    // Seed all entities
    const users = await seedUsers(50)
    const profiles = await seedProfiles(users, 0.7)
    const pokemon = await seedPokemon(80)
    const categories = await seedCategories()
    const posts = await seedPosts(users, 150)
    const postCategories = await seedPostCategories(posts, categories)
    const largeTableEntries = await seedLargeTable(1000)

    console.log('\n' + '='.repeat(60))
    console.log('🎉 Database seeding completed successfully!')
    console.log('\n📊 Final Statistics:')
    console.log(`   👥 Users: ${users.length}`)
    console.log(`   👤 Profiles: ${profiles.length}`)
    console.log(`   🐾 Pokemon: ${pokemon.length}`)
    console.log(`   📂 Categories: ${categories.length}`)
    console.log(`   📝 Posts: ${posts.length}`)
    console.log(`   🔗 Post-Categories: ${postCategories.length}`)
    console.log(`   📊 Large Table Entries: ${largeTableEntries.length}`)
    console.log('\n✨ Your database is now populated with realistic test data!')
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
