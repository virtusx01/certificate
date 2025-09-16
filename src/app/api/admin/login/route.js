import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

export async function GET() {
  return NextResponse.json({ message: 'Login Berfungsi' }, { status: 200 });
}

export async function POST(request) {
  try {
    const { username, password, role } = await request.json().catch(() => ({}));

    if (!username   || !password || !role) {
      return NextResponse.json(
        { success: false, error: 'Invalid', message: 'Lengkapi data yang diperlukan!' },
        { status: 400 }
      );
    }

    const { data: admin, error } = await supabase
      .from('admin')
      .select('id, username, role, password')
      .eq('username', username)
      .eq('password', password)
      .single();

    // Error DB
    if (error && error.code !== 'PGRST116') {
      return NextResponse.json(
        { success: false, error: 'Database Error', detail: error.message },
        { status: 500 }
      );
    }

    // Tidak ada admin
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', message: 'Username atau password salah' },
        { status: 401 }
      );
    }

    // Cek role
    if (admin.role !== role) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', message: 'Peran tidak cocok' },
        { status: 401 }
      );
    }

    // Sukses
    return NextResponse.json({
      success: true,
      data: { id: admin.id, username: admin.username, role: admin.role }, 
      message:
        admin.role === 'admin_utama'
          ? 'Login berhasil sebagai admin utama'
          : 'Login berhasil sebagai admin tim kerja'
    });
  } catch (err) {
    console.error('Server Error', err);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', detail: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
