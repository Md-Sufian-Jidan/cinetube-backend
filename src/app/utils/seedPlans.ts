import { prisma } from "../lib/prisma";
import { PlanDuration } from "../../generated/prisma/enums";

const seedPlans = async () => {
    const plans = [
        {
            name: "Free Plan",
            price: 0,
            duration: PlanDuration.FREE,
            description: "Basic access with ads",
        },
        {
            name: "Monthly Subscription",
            price: 9.99,
            duration: PlanDuration.MONTHLY,
            description: "Full access to all movies and series for one month",
        },
        {
            name: "Yearly Subscription",
            price: 99.99,
            duration: PlanDuration.YEARLY,
            description: "Full access to all movies and series for one year (2 months free)",
        },
    ];

    for (const plan of plans) {
        await prisma.subscriptionPlan.upsert({
            where: { id: plan.name }, // This is just for seeding, I'll use name as a fake unique key or handle it differently
            update: {},
            create: {
                name: plan.name,
                price: plan.price,
                duration: plan.duration,
                description: plan.description,
            },
        });
    }

    console.log("Subscription plans seeded successfully!");
};

seedPlans()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
