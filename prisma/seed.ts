import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Create Users
  for (let i = 0; i < 10000; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.name.fullName(),
        email: faker.internet.email(),
      },
    });

    // Create Jobs for each user
    for (let j = 0; j < 2; j++) {
      // Assuming each user has 2 jobs
      const job = await prisma.job.create({
        data: {
          name: faker.name.jobTitle(),
          description: faker.lorem.sentence(),
          userId: user.id,
        },
      });

      // Create Job Configurations for each job
      for (let k = 0; k < 3; k++) {
        // Assuming each job has 3 configurations
        await prisma.jobConfiguration.create({
          data: {
            jobId: job.id,
            configKey: faker.database.column(),
            configValue: faker.random.word(),
          },
        });
      }

      // Create Job Schedules for each job
      await prisma.jobSchedule.create({
        data: {
          jobId: job.id,
          cronExpression: '*/5 * * * *', // Every 5 minutes
          startTime: faker.date.future(),
          endTime: faker.date.future(),
        },
      });

      // Create Job Logs for each job
      for (let l = 0; l < 5; l++) {
        // Assuming each job has 5 logs
        await prisma.jobLog.create({
          data: {
            jobId: job.id,
            status: faker.helpers.arrayElement(['Success', 'Failed']),
            message: faker.lorem.sentence(),
            timestamp: faker.date.recent(),
          },
        });
      }
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
