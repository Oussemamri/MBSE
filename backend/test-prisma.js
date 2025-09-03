import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testPrismaClient() {
  console.log('Available models:', Object.keys(prisma));
  
  // Try to access the block model
  try {
    console.log('Testing block model...');
    const blocks = await prisma.block.findMany();
    console.log('Block model works! Found', blocks.length, 'blocks');
  } catch (error) {
    console.error('Block model error:', error.message);
  }
  
  await prisma.$disconnect();
}

testPrismaClient().catch(console.error);
