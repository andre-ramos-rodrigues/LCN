import CarouselClient from './CarouselClient';
import prisma from '../lib/prisma';

export default async function Carousel() {
    const posts = await prisma.post.findMany({
        where: {
            carrousel: true,
            //published: true,
        },
        orderBy: {
            date: 'desc',
        },
        select: {
            id: true,
            title: true,
            excerpt: true,
            imageUrls: true,
        },
    });

    if (posts.length === 0) {
        return (
            <div className="text-center py-10 bg-gray-100 rounded-lg">
                <p className="text-text-secondary">
                    No featured posts selected.
                </p>
            </div>
        );
    }

    return <CarouselClient posts={posts} />;
}
