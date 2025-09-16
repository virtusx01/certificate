"use client"

import React from "react"
import { useState } from "react"


export default function SertifikatForm(){
    const [nomorSertifikat, setNomorSertifikat] = useState('');
    const [jenisKegiatan, setJenisKegiatan] = useState('');
    const [detailKegiatan, setDetailKegiatan] = useState('');
    const [penyelenggara, setPeneyelenggara] = useState('');
    const [namaPenyelenggara, setNamaPenyelenggara] = useState('');
    const [jabatanPenyelenggara, setJabatanPenyelenggara] = useState('');
    const [tanggalTerbit, setTanggalTerbit] = useState('');
    const [status, setStatus] = useState('');
    const [fileURL, setFileURL] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("true");
        setSuccess("false");

        if (!nomorSertifikat || !jenisKegiatan || !detailKegiatan || !penyelenggara || !namaPenyelenggara || !jabatanPenyelenggara || !tanggalTerbit || !status || !fileURL){
            setError('Lengkapi semua field');
            setLoading(false);
            return;
        }

        const formData = {
            nomor_sertifikat: nomorSertifikat,
            jenis_kegiatan: jenisKegiatan,
            detail_kegiatan: detailKegiatan,
            penyelenggara: penyelenggara,
            nama_penyelenggara: namaPenyelenggara,
            jabatan_penyelenggara: jabatanPenyelenggara,
            tanggal_terbit: tanggalTerbit,
            status: status,
            file_url: fileURL
        }

        try {
            const response = await fetch('@api/admin/sertifikat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok){
                const errorData = await response.json();
                setError(errorData.message);
                setLoading(false);
            }


        }catch (error){
            console.log(error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }


    return (
        <div>
            <form method="POST">
                <label>Nomor Sertifikat: </label><input type="text" name="nomor_sertifikat" placeholder="Masukkan Nomor Sertifikat" value={nomorSertifikat} onChange={(e) => setNomorSertifikat(e.target.value)} required></input><br></br>
                <label>Jenis Kegiatan: </label><input type="text" name="jenis_kegiatan" placeholder="Masukkan Jenis Kegiatan" value={jenisKegiatan} onChange={(e) => setJenisKegiatan(e.target.value)} required></input><br></br>
                <label>Detail Kegiatan: </label><input type="text" name="detail_kegiatan" placeholder="Masukkan Detail Kegiatan" value={detailKegiatan} onChange={(e) => setDetailKegiatan(e.target.value)} required></input><br></br>
                <label>Penyelenggara: </label><input type="text" name="penyelenggara" placeholder="Masukkan Penyelenggara" value={penyelenggara} onChange={(e) => setPeneyelenggara(e.target.value)} required></input><br></br>
                <label>Nama Penyelenggara: </label><input type="text" name="nama_penyelenggara" placeholder="Masukkan Nama Penyelenggara" value={namaPenyelenggara} onChange={(e) => setNamaPenyelenggara(e.target.value)} required></input><br></br>
                <label>Jabatan Penyelenggara: </label><input type="text" name="jabatan_penyelenggara" placeholder="Masukkan Jabatan Penyelenggara" value={jabatanPenyelenggara} onChange={(e) => setJabatanPenyelenggara(e.target.value)} required></input><br></br>
                <label>Tanggal Terbit: </label><input type="date" name="tanggal_terbit" placeholder="Masukkan Tanggal Terbit" value={tanggalTerbit} onChange={(e) => setTanggalTerbit(e.target.value)} required></input><br></br>
                <label>Status: </label><input type="text" name="status" placeholder="Masukkan Status" value={status} onChange={(e) => setStatus(e.target.value)}></input><br></br>
                
                <button type="submit">Submit</button>"
            </form>
        </div>
    )


}