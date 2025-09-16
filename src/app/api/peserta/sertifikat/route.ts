// src/app/api/certificate/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; 
export const revalidate = 0;  

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const nik = searchParams.get('nik');
    
    console.log('GET request received, NIK:', nik);
    
    if (!nik) {
      return NextResponse.json({ error: 'NIK is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('sertifikat_peserta')
      .select('nik, nomor_sertifikat')
      .eq('nik', nik);

    console.log('Supabase response:', { data, error });

    if (error) {
      return NextResponse.json({ 
        error: 'Database error', 
        detail: error.message 
      }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ 
        error: 'Certificate not found'
      }, { status: 404 });
    }

    return NextResponse.json({ data: data });
  } catch (e) {
    console.error('Server error:', e);
    return NextResponse.json({ 
      error: 'Server error', 
      detail: e.message 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const nik = body.nik;

    console.log('POST request received, NIK:', nik);

    if (!nik) {
      return NextResponse.json({ error: 'NIK is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('sertifikat_peserta')
      .select(`nik, nomor_sertifikat, peserta!sertifikat_peserta_nik_fkey (nama), sertifikat!sertifikat_peserta_nomor_sertifikat_fkey(nomor_sertifikat,jenis_kegiatan, detail_kegiatan, tanggal_terbit, status)`)
      .eq('nik', nik);

    console.log('Supabase response:', { data, error });

    if (error) {
      return NextResponse.json({ 
        error: 'Database error', 
        detail: error.message 
      }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ 
        error: 'Certificate not found'
      }, { status: 404 });
    }

    return NextResponse.json({ data: data });
  } catch (e) {
    console.error('Server error:', e);
    return NextResponse.json({ 
      error: 'Server error', 
      detail: e.message 
    }, { status: 500 });
  }
}