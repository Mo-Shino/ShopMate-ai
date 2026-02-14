import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const adsDirectory = path.join(process.cwd(), 'public/ads');

        // Check if directory exists
        if (!fs.existsSync(adsDirectory)) {
            return NextResponse.json({ images: [] });
        }

        const files = fs.readdirSync(adsDirectory);

        // Filter for image files only
        const images = files
            .filter(file => /\.(png|jpg|jpeg|gif|webp)$/i.test(file))
            .map(file => `/ads/${file}`);

        return NextResponse.json({ images });
    } catch (error) {
        console.error('Error reading ads directory:', error);
        return NextResponse.json({ images: [] }, { status: 500 });
    }
}
