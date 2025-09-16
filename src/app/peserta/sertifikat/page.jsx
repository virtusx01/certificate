'use client';

import { useState } from 'react';

export default function CertificateSearch() {
    const [nik, setNIK] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    async function handleSearch(event) {
        event.preventDefault();
        
        if (!nik.trim()) {
            setError('Please enter a NIK');
            return;
        }

        setLoading(true);
        setError(null);
        setResults(null);

        try {
            const response = await fetch('@/api/peserta/sertifikat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nik: nik.trim() })
            });

            const json = await response.json();
            
            if (!response.ok) {
                setError(json.error || 'An error occurred');
                setResults(null);
            } else {
                setResults(json.data);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Network error occurred');
        } finally {
            setLoading(false);
        }
    }

    async function handleDownload(certificateId) {
        alert(`Download certificate with ID: ${certificateId}`);
    }

    return (
        <main> 
            <div>
                <h1 className='text-center'>Pencarian Sertifikat</h1>
                <form sty onSubmit={handleSearch} style={{ marginBottom: '20px', textAlign: 'center', marginTop: '20px' }}>
                    <div>
                        <input 
                            type='text' 
                            value={nik} 
                            onChange={(e) => setNIK(e.target.value)} 
                            placeholder='Masukkan NIK'
                            disabled={loading}
                        />
                        <button type='submit'disabled={loading}>
                            {loading ? 'Mencari...' : 'Cari'}
                        </button>
                    </div>
                </form>

                {error && (
                    <div >
                        Error: {error}
                    </div>
                )}

                {results && results.length > 0 ? (
                    <div>
                        <h2 className=''>Hasil Pencarian:</h2>
                        {results.map((result) => (
                            <div key={result.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                                <p><strong>Nomor Sertifikat:</strong> {result.nomor_sertifikat}</p>
                                <p><strong>NIK:</strong> {result.nik}</p>
                                <p><strong>Nama:</strong> {result.peserta.nama}</p>
                                <p><strong>Jenis Kegiatan:</strong> {result.sertifikat.jenis_kegiatan}</p>
                                <p><strong>Detail Kegiatan:</strong> {result.sertifikat.detail_kegiatan}</p>
                                <p><strong>Tanggal Terbit:</strong> {result.sertifikat.tanggal_terbit}</p>
                                <p><strong>Status:</strong> {result.sertifikat.status ? "Aktif" : "Tidak Aktif"}</p>
                                <button onClick={() => handleDownload(result.sertifikat.file_url)}
                                    disabled={!result.sertifikat.status}
                                    className={result.sertifikat.status ? 'button-download' : 'button-invalid'}>
                                        {result.sertifikat.status ? 'Download' : 'Tidak Valid'}
                                    </button>
                            </div>
                        ))}
                    </div>
                ) : results && results.length === 0 ? (
                    <div>Sertifikat tidak ditemukan.</div>
                ) : null}
            </div>
        </main>
    );
}