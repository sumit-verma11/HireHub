import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import dbConnect from '../../../lib/mongodb';
import Application from '../../../models/Application';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const userId = session.user.id;

        // Status breakdown
        const statusBreakdown = await Application.aggregate([
            { $match: { userId: userId } },
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);

        // Applications over time (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const applicationsOverTime = await Application.aggregate([
            {
                $match: {
                    userId: userId,
                    appliedDate: { $gte: sixMonthsAgo },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$appliedDate' },
                        month: { $month: '$appliedDate' },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);

        // Response rate
        const total = await Application.countDocuments({ userId });
        const responded = await Application.countDocuments({
            userId,
            status: { $in: ['Interview', 'Offer', 'Rejected'] },
        });

        // Upcoming interviews
        const upcomingInterviews = await Application.find({
            userId,
            'interviews.date': { $gte: new Date() },
            'interviews.status': 'Scheduled',
        }).select('company position interviews');

        return NextResponse.json({
            statusBreakdown,
            applicationsOverTime,
            responseRate: total > 0 ? Math.round((responded / total) * 100) : 0,
            total,
            upcomingInterviews,
        });
    } catch (error) {
        console.error('Analytics error:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
