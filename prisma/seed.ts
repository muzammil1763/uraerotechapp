import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@uraerotech.com' },
    update: {},
    create: {
      email: 'admin@uraerotech.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('Created admin user:', admin.email)

  // Create test customer
  const customerPassword = await bcrypt.hash('customer123', 10)
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      name: 'John Doe',
      password: customerPassword,
      role: 'B2C',
      phone: '+1234567890',
    },
  })
  console.log('Created B2C customer user:', customer.email)

  // Create B2B customer
  const b2bPassword = await bcrypt.hash('business123', 10)
  const b2bCustomer = await prisma.user.upsert({
    where: { email: 'business@example.com' },
    update: {},
    create: {
      email: 'business@example.com',
      name: 'Aviation Corp',
      password: b2bPassword,
      role: 'B2B',
      phone: '+1987654321',
      company: 'Aviation Solutions Inc.',
    },
  })
  console.log('Created B2B customer user:', b2bCustomer.email)

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'fasteners' },
      update: {},
      create: {
        name: 'Fasteners',
        slug: 'fasteners',
        description: 'Aircraft rivets, bolts, and fastening systems',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'tools' },
      update: {},
      create: {
        name: 'Aviation Tools',
        slug: 'tools',
        description: 'Professional aviation maintenance tools',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'structural-parts' },
      update: {},
      create: {
        name: 'Structural Parts',
        slug: 'structural-parts',
        description: 'Aircraft structural components and parts',
      },
    }),
  ])
  console.log('Created categories')

  // Create products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: 'aircraft-rivet-set-standard' },
      update: {},
      create: {
        name: 'Aircraft Rivet Set - Standard',
        slug: 'aircraft-rivet-set-standard',
        description: 'Professional grade aircraft rivets. Set includes 500 pieces of various sizes. Made from high-quality aluminum alloy.',
        categoryId: categories[0].id,
        price: 45.00,
        stock: 150,
        images: ['/products/default.jpg'],
        isFeatured: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'aviation-tool-kit-professional' },
      update: {},
      create: {
        name: 'Aviation Tool Kit Professional',
        slug: 'aviation-tool-kit-professional',
        description: 'Complete professional aviation tool kit with 120+ pieces. Includes wrenches, pliers, screwdrivers, and specialized aviation tools.',
        categoryId: categories[1].id,
        price: 299.00,
        stock: 45,
        images: ['/products/default.jpg'],
        isFeatured: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'wing-panel-structural-component' },
      update: {},
      create: {
        name: 'Wing Panel Structural Component',
        slug: 'wing-panel-structural-component',
        description: 'Certified aircraft wing panel structural component. FAA approved. Compatible with multiple aircraft models.',
        categoryId: categories[2].id,
        price: 189.00,
        stock: 25,
        images: ['/products/default.jpg'],
        isFeatured: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'torque-wrench-aviation-grade' },
      update: {},
      create: {
        name: 'Torque Wrench - Aviation Grade',
        slug: 'torque-wrench-aviation-grade',
        description: 'Precision torque wrench calibrated for aviation use. Range: 20-200 ft-lbs. Includes calibration certificate.',
        categoryId: categories[1].id,
        price: 175.00,
        stock: 60,
        images: ['/products/default.jpg'],
        isFeatured: false,
      },
    }),
  ])
  console.log('Created products')

  // Create services
  const services = await Promise.all([
    prisma.service.upsert({
      where: { slug: 'aircraft-structural-repair' },
      update: {},
      create: {
        name: 'Aircraft Structural Repair',
        slug: 'aircraft-structural-repair',
        description: 'Expert repair and restoration of aircraft structural components',
        content: 'Our certified technicians provide comprehensive structural repair services including damage assessment, corrosion treatment, and component restoration.',
        image: '/services/structural-repair.jpg',
        isActive: true,
      },
    }),
    prisma.service.upsert({
      where: { slug: 'aircraft-modification' },
      update: {},
      create: {
        name: 'Aircraft Modification',
        slug: 'aircraft-modification',
        description: 'Custom aircraft modifications to meet your specifications',
        content: 'We offer custom modification services including interior upgrades, avionics installations, and performance enhancements.',
        image: '/services/modification.jpg',
        isActive: true,
      },
    }),
  ])
  console.log('Created services')

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
