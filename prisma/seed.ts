/*import { PrismaClient, Prisma, UserRole } from "../app/generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'
import { hash } from 'bcryptjs'
import 'dotenv/config'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
});

const userData: Prisma.UserCreateInput[] = [
  {
    name: "Ana Clara Bertholasce",
    email: "anaclarabertholasce@gmail.com",
    password: "admin@2026", // Will be hashed
    role: UserRole.Admin,
  },
  {
    name: "Admin",
    email: "andre.augusto.ramrod@gmail.com",
    password: "admin@2026", // Will be hashed
    role: UserRole.Admin,
  },
];

const postsData: Prisma.PostCreateInput[] = [
  {
    title: 'Understanding Anxiety: A Deep Dive',
    author: 'Dr. Evelyn Reed',
    date: new Date('2024-05-15T10:00:00Z'),
    excerpt: 'Anxiety is a common human experience, but when does it become a disorder? This post explores the nuances of anxiety and offers coping strategies.',
    content: '## What is Anxiety?\n\nAnxiety is your body\'s natural response to stress. It\'s a feeling of fear or apprehension about what\'s to come. The first day of school, going to a job interview, or giving a speech may cause most people to feel fearful and nervous.\n\nBut if your feelings of anxiety are extreme, last for longer than six months, and are interfering with your life, you may have an anxiety disorder.',
    imageUrls: ['https://images.unsplash.com/photo-1594122230689-45899d9e6f69?q=80&w=2070&auto=format&fit=crop'],
    carrousel: true,
  },
  {
    title: 'The Power of Mindfulness in Daily Life',
    author: 'Dr. Marcus Thorne',
    date: new Date('2024-05-20T14:30:00Z'),
    excerpt: 'Discover how practicing mindfulness can reduce stress, improve focus, and enhance your overall well-being. Simple exercises to get you started.',
    content: 'Mindfulness is the basic human ability to be fully present, aware of where we are and what we\'re doing, and not overly reactive or overwhelmed by what\'s going on around us. This article will guide you through some simple exercises.',
    imageUrls: ['https://images.unsplash.com/photo-1474418397713-7e15e4d5e154?q=80&w=2070&auto=format&fit=crop'],
    carrousel: true,
  },
  {
    title: 'Navigating Grief and Loss',
    author: 'Dr. Evelyn Reed',
    date: new Date('2024-06-01T09:00:00Z'),
    excerpt: 'Grief is a profound and personal journey. We discuss the stages of grief and healthy ways to process loss and find a path toward healing.',
    content: 'Grief is a natural response to loss. It\'s the emotional suffering you feel when something or someone you love is taken away. The more significant the loss, the more intense your grief will be. You may associate grieving with the death of a loved one—which is often the cause of the most intense type of grief—but any loss can cause grief.',
    imageUrls: ['https://images.unsplash.com/photo-1533923233102-038c190238a8?q=80&w=2070&auto=format&fit=crop'],
    carrousel: true,
  },
];

const commentsData = [
  {
    postIndex: 0,
    author: 'John Doe',
    content: 'This was very insightful. Thank you!',
    isApproved: true,
  },
  {
    postIndex: 0,
    author: 'Jane Smith',
    content: 'Great article!',
    isApproved: false,
  },
  {
    postIndex: 1,
    author: 'John Doe',
    content: 'This was very insightful. Thank you!',
    isApproved: true,
  },
  {
    postIndex: 1,
    author: 'Jane Smith',
    content: 'Great article!',
    isApproved: false,
  },
  {
    postIndex: 2,
    author: 'John Doe',
    content: 'This was very insightful. Thank you!',
    isApproved: true,
  },
  {
    postIndex: 2,
    author: 'Jane Smith',
    content: 'Great article!',
    isApproved: false,
  },
];

const themeData: Prisma.ThemeCreateInput = {
  primaryColor: '#6366f1',
  secondaryColor: '#ec4899',
  accentColor: '#10b981',
  base100Color: '#ffffff',
  textPrimaryColor: '#1f2937',
  textSecondaryColor: '#6b7280',
  headerText: 'Wellness Journey',
  footerText: '© 2024 Wellness Journey. All rights reserved.',
};

export async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.comment.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.theme.deleteMany({});

  // Create users with hashed passwords
  console.log('Creating users...');
  const usersWithHashedPasswords = await Promise.all(
    userData.map(async (u) => ({
      ...u,
      password: await hash(u.password, 10),
    }))
  );
  
  const users = await Promise.all(
    usersWithHashedPasswords.map(u => prisma.user.create({ data: u }))
  );
  console.log(`Created ${users.length} users`);

  // Create posts
  console.log('Creating posts...');
  const posts = await Promise.all(
    postsData.map(p => prisma.post.create({ data: p }))
  );
  console.log(`Created ${posts.length} posts`);

  // Create comments
  console.log('Creating comments...');
  for (const comment of commentsData) {
    await prisma.comment.create({
      data: {
        author: comment.author,
        content: comment.content,
        isApproved: comment.isApproved,
        timestamp: new Date(),
        post: { connect: { id: posts[comment.postIndex].id } },
        user: { connect: { id: users[0].id } },
      },
    });
  }
  console.log(`Created ${commentsData.length} comments`);

  // Create theme
  console.log('Creating theme...');
  await prisma.theme.create({ data: themeData });
  console.log('Created theme');

  console.log('Seed completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });*/