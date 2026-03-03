import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import dbConnect from '../../../lib/mongodb';
import Application from '../../../models/Application';

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        const query = { userId: session.user.id };
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { company: { $regex: search, $options: 'i' } },
                { position: { $regex: search, $options: 'i' } },
            ];
        }

        const applications = await Application.find(query)
            .sort({ updatedAt: -1 })
            .populate('contacts');

        return NextResponse.json(applications);
    } catch (error) {
        console.error('GET /api/applications error:', error);
        return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const body = await request.json();
        const application = await Application.create({
            ...body,
            userId: session.user.id,
        });

        return NextResponse.json(application, { status: 201 });
    } catch (error) {
        console.error('POST /api/applications error:', error);
        return NextResponse.json({ error: 'Failed to create application' }, { status: 500 });
    }
}
