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
            const response = await fetch('/api/user/certificate', {
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

    return (
        <main> 
            <div>
                <h1>Pencarian Sertifikat</h1>
                <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
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
                        <h2>Hasil Pencarian:</h2>
                        {results.map((result) => (
                            <div key={result.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                                <p><strong>ID:</strong> {result.id}</p>
                                <p><strong>NIK:</strong> {result.nik}</p>
                                <p><strong>Nama:</strong> {result.name}</p>
                                <p><strong>Judul Sertifikat:</strong> {result.title}</p>
                                <p><strong>Kategori:</strong> {result.category}</p>
                                <p><strong>Status:</strong> {result.status}</p>
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