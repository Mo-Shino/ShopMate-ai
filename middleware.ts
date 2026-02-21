import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/survey', '/_next', '/api', '/ads', '/favicon.ico', '/ShopMate_logo.svg', '/fathallah_logo.svg', '/ShopMate_logo(light).svg', '/fathallah_logo(light).svg'];

export function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    // Always allow public/static routes
    if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // --- RESET TRIGGER ---
    // ?reset=survey → clears both cookies and sends to /survey
    if (searchParams.get('reset') === 'survey') {
        const response = NextResponse.redirect(new URL('/survey', request.url));
        response.cookies.delete('admin_access');
        response.cookies.delete('survey_completed');
        return response;
    }

    // --- ADMIN BYPASS ---
    // ?admin=shinawy → set admin cookie, remove survey_completed cookie, allow through cleanly
    if (searchParams.get('admin') === 'shinawy') {
        // Redirect to the same path without the query param for a clean URL
        const cleanUrl = new URL(pathname, request.url);
        const response = NextResponse.redirect(cleanUrl);
        response.cookies.set('admin_access', 'true', {
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
            // NOTE: NOT httpOnly — must be readable client-side by SurveyGate component
            sameSite: 'lax',
        });
        // Delete survey_completed so admin sees the full clean app
        response.cookies.delete('survey_completed');
        return response;
    }

    const adminAccess = request.cookies.get('admin_access')?.value;
    const surveyCompleted = request.cookies.get('survey_completed')?.value;

    // If admin or has completed survey, allow through
    if (adminAccess === 'true' || surveyCompleted === 'true') {
        return NextResponse.next();
    }

    // Otherwise, redirect to the survey
    return NextResponse.redirect(new URL('/survey', request.url));
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
