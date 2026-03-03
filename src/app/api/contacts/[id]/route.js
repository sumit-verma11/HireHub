import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import dbConnect from '../../../../lib/mongodb';
import Contact from '../../../../models/Contact';

export async function GET(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await dbConnect();
        const { id } = await params;
        const contact = await Contact.findOne({ _id: id, userId: session.user.id });
        if (!contact) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        return NextResponse.json(contact);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch contact' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await dbConnect();
        const { id } = await params;
        const body = await request.json();

        const contact = await Contact.findOneAndUpdate(
            { _id: id, userId: session.user.id },
            body,
            { new: true, runValidators: true }
        );

        if (!contact) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(contact);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await dbConnect();
        const { id } = await params;

        const contact = await Contact.findOneAndDelete({ _id: id, userId: session.user.id });
        if (!contact) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        return NextResponse.json({ message: 'Contact deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
    }
}
