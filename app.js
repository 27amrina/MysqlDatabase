const tasks = [
  {
    id:1, title:'Membuat Database', section:'DDL', points:5,
    concept:'Database adalah wadah utama yang menyimpan tabel dan data. Pada proyek ini seluruh tabel kependudukan ditempatkan di dalam database kependudukan_db.',
    objective:'Buat database bernama <b>kependudukan_db</b>, kemudian aktifkan database tersebut.',
    syntax:'CREATE DATABASE nama_database;\nUSE nama_database;',
    hints:['Gunakan CREATE DATABASE untuk membuat database.','Setelah dibuat, aktifkan database menggunakan USE.','Nama database yang diminta adalah kependudukan_db.'],
    solution:'CREATE DATABASE kependudukan_db;\nUSE kependudukan_db;'
  },
  {
    id:2, title:'Tabel Agama', section:'DDL', points:5,
    concept:'Tabel referensi menyimpan data yang dipakai berulang. Tabel agama akan menjadi tabel induk bagi data penduduk.',
    objective:'Buat tabel <b>agama</b> dengan id_agama INT Primary Key Auto Increment, nama_agama VARCHAR(30) NOT NULL, dan keterangan VARCHAR(100) boleh kosong.',
    syntax:'CREATE TABLE nama_tabel (\n  id INT PRIMARY KEY AUTO_INCREMENT,\n  nama VARCHAR(30) NOT NULL\n);',
    hints:['Pastikan database sudah aktif sebelum CREATE TABLE.','Gunakan PRIMARY KEY dan AUTO_INCREMENT pada id_agama.','nama_agama harus NOT NULL.'],
    solution:'CREATE TABLE agama (\n  id_agama INT PRIMARY KEY AUTO_INCREMENT,\n  nama_agama VARCHAR(30) NOT NULL,\n  keterangan VARCHAR(100)\n);'
  },
  {
    id:3, title:'Tabel Kelurahan', section:'DDL', points:5,
    concept:'Tabel kelurahan menyimpan lokasi domisili. Satu kelurahan nantinya dapat dimiliki oleh banyak penduduk.',
    objective:'Buat tabel <b>kelurahan</b>: id_kelurahan INT Primary Key Auto Increment, nama_kelurahan VARCHAR(50) NOT NULL, kecamatan VARCHAR(50) NOT NULL.',
    syntax:'CREATE TABLE kelurahan ( ... );',
    hints:['id_kelurahan menjadi Primary Key.','Gunakan AUTO_INCREMENT pada id_kelurahan.','nama_kelurahan dan kecamatan wajib NOT NULL.'],
    solution:'CREATE TABLE kelurahan (\n  id_kelurahan INT PRIMARY KEY AUTO_INCREMENT,\n  nama_kelurahan VARCHAR(50) NOT NULL,\n  kecamatan VARCHAR(50) NOT NULL\n);'
  },
  {
    id:4, title:'Tabel Penduduk & Relasi', section:'DDL', points:10,
    concept:'Tabel penduduk merupakan tabel utama. Relasi yang digunakan adalah agama (1)–(N) penduduk dan kelurahan (1)–(N) penduduk. NIK harus unik.',
    objective:'Buat tabel <b>penduduk</b> dengan field: id_penduduk INT, nik VARCHAR(16), nama_lengkap VARCHAR(100), id_agama INT, id_kelurahan INT, jenis_kelamin VARCHAR(10), tanggal_lahir DATE, status_perkawinan VARCHAR(20). Terapkan Primary Key, UNIQUE pada NIK, dan Foreign Key.',
    syntax:'FOREIGN KEY (id_agama) REFERENCES agama(id_agama)\nFOREIGN KEY (id_kelurahan) REFERENCES kelurahan(id_kelurahan)',
    hints:['id_penduduk sebaiknya PRIMARY KEY AUTO_INCREMENT.','Tambahkan UNIQUE pada nik.','Buat dua FOREIGN KEY: id_agama → agama dan id_kelurahan → kelurahan.'],
    solution:'CREATE TABLE penduduk (\n  id_penduduk INT PRIMARY KEY AUTO_INCREMENT,\n  nik VARCHAR(16) UNIQUE NOT NULL,\n  nama_lengkap VARCHAR(100) NOT NULL,\n  id_agama INT,\n  id_kelurahan INT,\n  jenis_kelamin VARCHAR(10),\n  tanggal_lahir DATE,\n  status_perkawinan VARCHAR(20),\n  FOREIGN KEY (id_agama) REFERENCES agama(id_agama),\n  FOREIGN KEY (id_kelurahan) REFERENCES kelurahan(id_kelurahan)\n);'
  },
  {
    id:5, title:'ALTER TABLE', section:'DDL', points:5,
    concept:'ALTER TABLE digunakan untuk mengubah struktur tabel yang sudah ada tanpa membuat ulang tabel.',
    objective:'Tambahkan kolom <b>pekerjaan VARCHAR(100)</b> dan <b>no_kk VARCHAR(16)</b> ke tabel penduduk.',
    syntax:'ALTER TABLE nama_tabel\nADD COLUMN kolom_baru VARCHAR(100);',
    hints:['Gunakan ALTER TABLE penduduk.','Anda dapat menambahkan dua kolom dalam satu perintah ALTER TABLE.','Kolom yang diminta: pekerjaan dan no_kk.'],
    solution:'ALTER TABLE penduduk\nADD COLUMN pekerjaan VARCHAR(100),\nADD COLUMN no_kk VARCHAR(16);'
  },
  {
    id:6, title:'INSERT Data Agama', section:'DML', points:5,
    concept:'INSERT INTO digunakan untuk menambahkan record baru ke tabel.',
    objective:'Masukkan minimal 5 agama: <b>Islam, Kristen, Katolik, Hindu, Buddha</b>.',
    syntax:"INSERT INTO agama (nama_agama) VALUES ('Islam');",
    hints:['Gunakan INSERT INTO agama.','Anda boleh memasukkan beberapa VALUES sekaligus.','Pastikan kelima nama agama tersedia.'],
    solution:"INSERT INTO agama (nama_agama) VALUES\n('Islam'),('Kristen'),('Katolik'),('Hindu'),('Buddha');"
  },
  {
    id:7, title:'INSERT Data Kelurahan', section:'DML', points:5,
    concept:'Satu perintah INSERT dapat menambahkan beberapa baris data sekaligus.',
    objective:'Masukkan: <b>Sungai Miai – Banjarmasin Utara</b>, <b>Pemurus Dalam – Banjarmasin Selatan</b>, <b>Kuripan – Banjarmasin Timur</b>, <b>Teluk Dalam – Banjarmasin Tengah</b>.',
    syntax:"INSERT INTO kelurahan (nama_kelurahan, kecamatan) VALUES ('...', '...');",
    hints:['Kolom yang diperlukan: nama_kelurahan dan kecamatan.','Gunakan 4 kelompok VALUES.','Urutan data akan membantu menentukan id_kelurahan untuk soal berikutnya.'],
    solution:"INSERT INTO kelurahan (nama_kelurahan,kecamatan) VALUES\n('Sungai Miai','Banjarmasin Utara'),\n('Pemurus Dalam','Banjarmasin Selatan'),\n('Kuripan','Banjarmasin Timur'),\n('Teluk Dalam','Banjarmasin Tengah');"
  },
  {
    id:8, title:'INSERT Data Penduduk', section:'DML', points:10,
    concept:'Pada tabel yang memiliki Foreign Key, nilai id_agama dan id_kelurahan harus merujuk record yang sudah ada pada tabel induk.',
    objective:`Masukkan 6 data berikut ke tabel penduduk. Gunakan id agama dan kelurahan yang sesuai.
      <div class="result-wrap"><table class="result-table"><thead><tr><th>NIK</th><th>Nama</th><th>Agama</th><th>Kelurahan</th><th>JK</th><th>Tgl Lahir</th><th>Status</th><th>No. KK</th><th>Pekerjaan</th></tr></thead><tbody>
      <tr><td>6371000000000001</td><td>Ardiansyah Noor</td><td>Islam</td><td>Sungai Miai</td><td>L</td><td>2008-01-12</td><td>Belum Kawin</td><td>6371000000001001</td><td>Pelajar</td></tr>
      <tr><td>6371000000000002</td><td>Maya Lestari</td><td>Islam</td><td>Pemurus Dalam</td><td>P</td><td>2007-05-21</td><td>Belum Kawin</td><td>6371000000001002</td><td>Pelajar</td></tr>
      <tr><td>6371000000000003</td><td>Bima Pratama</td><td>Kristen</td><td>Kuripan</td><td>L</td><td>1987-11-03</td><td>Kawin</td><td>6371000000001003</td><td>Karyawan Swasta</td></tr>
      <tr><td>6371000000000004</td><td>Citra Wulandari</td><td>Katolik</td><td>Teluk Dalam</td><td>P</td><td>1990-02-14</td><td>Kawin</td><td>6371000000001004</td><td>Guru</td></tr>
      <tr><td>6371000000000005</td><td>Raka Saputra</td><td>Hindu</td><td>Sungai Miai</td><td>L</td><td>1985-08-17</td><td>Kawin</td><td>6371000000001005</td><td>Wirausaha</td></tr>
      <tr><td>6371000000000006</td><td>Nina Amelia</td><td>Buddha</td><td>Kuripan</td><td>P</td><td>1998-12-02</td><td>Belum Kawin</td><td>6371000000001006</td><td>Perawat</td></tr>
      </tbody></table></div>`,
    syntax:'Gunakan SHOW TABLES, DESC, atau SELECT * FROM agama/kelurahan untuk memastikan ID referensi sebelum INSERT.',
    hints:['Jika agama dimasukkan sesuai urutan soal, Islam=1, Kristen=2, Katolik=3, Hindu=4, Buddha=5.','Jika kelurahan dimasukkan sesuai urutan soal, Sungai Miai=1, Pemurus Dalam=2, Kuripan=3, Teluk Dalam=4.','Pastikan kolom pekerjaan dan no_kk sudah dibuat melalui ALTER TABLE.'],
    solution:"INSERT INTO penduduk (nik,nama_lengkap,id_agama,id_kelurahan,jenis_kelamin,tanggal_lahir,status_perkawinan,no_kk,pekerjaan) VALUES\n('6371000000000001','Ardiansyah Noor',1,1,'L','2008-01-12','Belum Kawin','6371000000001001','Pelajar'),\n('6371000000000002','Maya Lestari',1,2,'P','2007-05-21','Belum Kawin','6371000000001002','Pelajar'),\n('6371000000000003','Bima Pratama',2,3,'L','1987-11-03','Kawin','6371000000001003','Karyawan Swasta'),\n('6371000000000004','Citra Wulandari',3,4,'P','1990-02-14','Kawin','6371000000001004','Guru'),\n('6371000000000005','Raka Saputra',4,1,'L','1985-08-17','Kawin','6371000000001005','Wirausaha'),\n('6371000000000006','Nina Amelia',5,3,'P','1998-12-02','Belum Kawin','6371000000001006','Perawat');"
  },
  {
    id:9, title:'Tambah Penduduk Baru', section:'DML', points:5,
    concept:'Kadang data referensi harus ditambahkan lebih dahulu agar Foreign Key pada data utama valid.',
    objective:'Tambahkan <b>Fajar Hidayat</b> (NIK 6371000000000007), agama Konghucu, Teluk Dalam, L, 2000-09-10, Belum Kawin, KK 6371000000001007, pekerjaan Desainer. Jika Konghucu belum ada, tambahkan dahulu.',
    syntax:'INSERT tabel referensi dahulu → cari ID → INSERT penduduk.',
    hints:['Tambahkan agama Konghucu terlebih dahulu.','Cek id Konghucu dan id Teluk Dalam dengan SELECT.','Lalu INSERT Fajar Hidayat ke tabel penduduk.'],
    solution:"INSERT INTO agama (nama_agama) VALUES ('Konghucu');\nINSERT INTO penduduk (nik,nama_lengkap,id_agama,id_kelurahan,jenis_kelamin,tanggal_lahir,status_perkawinan,no_kk,pekerjaan) VALUES ('6371000000000007','Fajar Hidayat',6,4,'L','2000-09-10','Belum Kawin','6371000000001007','Desainer');"
  },
  {
    id:10, title:'UPDATE Pekerjaan', section:'UPDATE/DELETE', points:5,
    concept:'UPDATE mengubah data yang sudah ada. WHERE wajib digunakan agar record lain tidak ikut berubah.',
    objective:'Ubah pekerjaan <b>Maya Lestari</b> dari Pelajar menjadi <b>Mahasiswa</b>.',
    syntax:"UPDATE penduduk SET pekerjaan='...' WHERE ...;",
    hints:['Gunakan UPDATE penduduk.','SET pekerjaan = Mahasiswa.','Batasi dengan WHERE berdasarkan NIK atau nama_lengkap.'],
    solution:"UPDATE penduduk SET pekerjaan='Mahasiswa' WHERE nik='6371000000000002';"
  },
  {
    id:11, title:'UPDATE Status', section:'UPDATE/DELETE', points:5,
    concept:'Kondisi WHERE yang spesifik memastikan hanya data yang dituju yang berubah.',
    objective:'Ubah status perkawinan <b>Nina Amelia</b> dari Belum Kawin menjadi <b>Kawin</b>.',
    syntax:"UPDATE penduduk SET status_perkawinan='Kawin' WHERE ...;",
    hints:['Gunakan nama atau NIK Nina sebagai kondisi.','Kolom yang diubah: status_perkawinan.','Terminal memblokir UPDATE tanpa WHERE.'],
    solution:"UPDATE penduduk SET status_perkawinan='Kawin' WHERE nik='6371000000000006';"
  },
  {
    id:12, title:'UPDATE Beberapa Kolom', section:'UPDATE/DELETE', points:5,
    concept:'Satu UPDATE dapat mengubah beberapa kolom dengan memisahkan pasangan kolom=nilai menggunakan koma.',
    objective:'Fajar Hidayat pindah dari Teluk Dalam ke <b>Sungai Miai</b> dan pekerjaan berubah menjadi <b>Programmer</b>. Gunakan satu UPDATE.',
    syntax:"UPDATE penduduk SET kolom1=nilai1, kolom2=nilai2 WHERE ...;",
    hints:['Cari id_kelurahan Sungai Miai.','Ubah id_kelurahan dan pekerjaan sekaligus.','Gunakan WHERE untuk Fajar Hidayat saja.'],
    solution:"UPDATE penduduk SET id_kelurahan=1, pekerjaan='Programmer' WHERE nik='6371000000000007';"
  },
  {
    id:13, title:'DELETE Data Percobaan', section:'UPDATE/DELETE', points:5,
    concept:'DELETE menghapus record. Dalam media ini DELETE tanpa WHERE sengaja diblokir sebagai latihan keamanan.',
    objective:'Tambahkan data percobaan dengan NIK <b>9999999999999999</b> dan nama <b>Data Percobaan</b>, kemudian hapus menggunakan DELETE dan WHERE.',
    syntax:"DELETE FROM penduduk WHERE nik='...';",
    hints:['INSERT data percobaan terlebih dahulu.','Kolom minimal harus memenuhi struktur tabel yang wajib.','Setelah berhasil masuk, DELETE menggunakan NIK sebagai kondisi.'],
    solution:"INSERT INTO penduduk (nik,nama_lengkap,id_agama,id_kelurahan,jenis_kelamin,tanggal_lahir,status_perkawinan,no_kk,pekerjaan) VALUES ('9999999999999999','Data Percobaan',1,1,'L','2000-01-01','Belum Kawin','9999999999999999','Percobaan');\nDELETE FROM penduduk WHERE nik='9999999999999999';"
  },
  {
    id:14, title:'SELECT Seluruh Data', section:'DQL', points:5,
    concept:'SELECT membaca data tanpa mengubah isi tabel. ORDER BY mengatur urutan hasil.',
    objective:'Tampilkan seluruh data tabel penduduk dan urutkan berdasarkan <b>nama_lengkap ASC</b>.',
    syntax:'SELECT * FROM nama_tabel ORDER BY kolom ASC;',
    hints:['Gunakan SELECT * untuk seluruh kolom.','FROM penduduk.','Tambahkan ORDER BY nama_lengkap ASC.'],
    solution:'SELECT * FROM penduduk ORDER BY nama_lengkap ASC;'
  },
  {
    id:15, title:'SELECT dengan WHERE', section:'DQL', points:5,
    concept:'WHERE menyaring baris sesuai kondisi tertentu sehingga hanya data relevan yang ditampilkan.',
    objective:"Tampilkan <b>NIK, nama_lengkap, jenis_kelamin, pekerjaan</b> untuk penduduk dengan pekerjaan <b>'Pelajar'</b>.",
    syntax:"SELECT kolom1, kolom2 FROM tabel WHERE kolom='nilai';",
    hints:['Pilih hanya 4 kolom yang diminta.','Gunakan WHERE pekerjaan = Pelajar.','Perhatikan tanda petik untuk nilai teks.'],
    solution:"SELECT nik,nama_lengkap,jenis_kelamin,pekerjaan FROM penduduk WHERE pekerjaan='Pelajar';"
  },
  {
    id:16, title:'JOIN Tiga Tabel', section:'DQL', points:5,
    concept:'JOIN menggabungkan data dari tabel yang berelasi. Foreign Key pada penduduk menjadi penghubung ke agama dan kelurahan.',
    objective:'Tampilkan <b>NIK, nama_lengkap, nama_agama, nama_kelurahan, kecamatan</b> dengan JOIN penduduk, agama, dan kelurahan.',
    syntax:'FROM penduduk\nJOIN agama ON penduduk.id_agama = agama.id_agama\nJOIN kelurahan ON penduduk.id_kelurahan = kelurahan.id_kelurahan',
    hints:['Tabel utama: penduduk.','JOIN agama melalui id_agama.','JOIN kelurahan melalui id_kelurahan.'],
    solution:'SELECT penduduk.nik,penduduk.nama_lengkap,agama.nama_agama,kelurahan.nama_kelurahan,kelurahan.kecamatan\nFROM penduduk\nJOIN agama ON penduduk.id_agama=agama.id_agama\nJOIN kelurahan ON penduduk.id_kelurahan=kelurahan.id_kelurahan;'
  },
  {
    id:17, title:'COUNT & GROUP BY', section:'DQL', points:5,
    concept:'COUNT(*) menghitung jumlah record, sedangkan GROUP BY membentuk kelompok berdasarkan nilai tertentu.',
    objective:'Hitung jumlah penduduk pada setiap kelurahan. Tampilkan <b>nama_kelurahan</b> dan <b>jumlah_penduduk</b>.',
    syntax:'SELECT ..., COUNT(*) AS jumlah_penduduk\nFROM ... JOIN ...\nGROUP BY ...;',
    hints:['JOIN penduduk dengan kelurahan.','Gunakan COUNT(*) AS jumlah_penduduk.','GROUP BY nama_kelurahan.'],
    solution:'SELECT kelurahan.nama_kelurahan, COUNT(*) AS jumlah_penduduk\nFROM penduduk\nJOIN kelurahan ON penduduk.id_kelurahan=kelurahan.id_kelurahan\nGROUP BY kelurahan.nama_kelurahan;'
  },
  {
    id:18, title:'LIKE & ORDER BY', section:'DQL', points:5,
    concept:'LIKE digunakan untuk pencarian pola teks. Tanda % berarti nol atau lebih karakter. DESC mengurutkan dari nilai terbesar/terbaru ke lebih kecil/lama.',
    objective:"Tampilkan <b>NIK, nama_lengkap, tanggal_lahir, pekerjaan</b> untuk nama yang mengandung huruf <b>'a'</b>. Urutkan tanggal lahir dari paling muda ke paling tua dengan DESC.",
    syntax:"WHERE nama_lengkap LIKE '%a%'\nORDER BY tanggal_lahir DESC;",
    hints:['LIKE harus memakai pola %a%.','Pilih hanya 4 kolom yang diminta.','ORDER BY tanggal_lahir DESC.'],
    solution:"SELECT nik,nama_lengkap,tanggal_lahir,pekerjaan FROM penduduk WHERE nama_lengkap LIKE '%a%' ORDER BY tanggal_lahir DESC;"
  }
];

const $ = id => document.getElementById(id);
const engine = new MiniSQL();
const APP_VERSION = '1.4';
const STORAGE_NS = 'sql_kependudukan_v1_2';
const LEGACY_STORAGE_KEY = 'sql_kependudukan_progress';
const LAST_SESSION_KEY = `${STORAGE_NS}:last_session`;
const SESSION_INDEX_KEY = `${STORAGE_NS}:session_index`;
let state = {
  studentName:'', studentClass:'', mode:'belajar', currentTask:1, completed:{}, hints:{},
  history:[], historyIndex:0, queries:[], startAt:Date.now(), elapsedBefore:0, lastQuery:'',
  submitted:false, submittedAt:null, finalElapsed:null
};
let timerHandle = null;
let autosaveHandle = null;
let saveDebounce = null;
let currentStorageKey = null;
let restoredUi = null;

function esc(s){return String(s ?? '').replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':'&quot;',"'":"&#39;"}[c]));}
function normalize(s){return String(s||'').toLowerCase().replace(/`/g,'').replace(/\s+/g,' ').trim();}
function getTask(id=state.currentTask){return tasks.find(t=>t.id===id)}
function score(){return tasks.filter(t=>state.completed[t.id]).reduce((a,t)=>a+t.points,0)}
function completedCount(){return Object.keys(state.completed).filter(k=>state.completed[k]).length}

function storageSlug(value){
  return encodeURIComponent(String(value||'').trim().toLowerCase().replace(/\s+/g,' '));
}
function sessionKey(name=state.studentName, cls=state.studentClass){
  return `${STORAGE_NS}:session:${storageSlug(name)}:${storageSlug(cls)}`;
}
function readSessionIndex(){
  try{return JSON.parse(localStorage.getItem(SESSION_INDEX_KEY)||'{}')||{}}catch(e){return {}}
}
function writeSessionIndex(index){
  try{localStorage.setItem(SESSION_INDEX_KEY,JSON.stringify(index))}catch(e){}
}
function setSaveStatus(textValue, kind=''){
  const el=$('saveStatus'); if(!el)return;
  el.textContent=textValue; el.className=`save-status ${kind}`.trim();
}
function sessionScore(completed={}){
  return tasks.filter(t=>completed[t.id]).reduce((sum,t)=>sum+t.points,0);
}
function savedPayloadFor(name,cls){
  try{
    const raw=localStorage.getItem(sessionKey(name,cls));
    return raw?JSON.parse(raw):null;
  }catch(e){return null}
}
function updateSavedSessionInfo(){
  const el=$('savedSessionInfo'); if(!el)return;
  const name=$('studentName')?.value.trim()||''; const cls=$('studentClass')?.value.trim()||'';
  let p=(name&&cls)?savedPayloadFor(name,cls):null;
  if(p?.state){
    const done=Object.values(p.state.completed||{}).filter(Boolean).length;
    const sc=sessionScore(p.state.completed||{});
    const when=p.savedAt?new Date(p.savedAt).toLocaleString('id-ID'):'';
    el.classList.add('has-save');
    el.innerHTML=`💾 <b>Progres tersimpan ditemukan.</b> ${done}/18 soal • ${sc}/100${when?` • terakhir ${esc(when)}`:''}. Pilih <b>Lanjutkan progres tersimpan</b>.`;
    return;
  }
  const index=readSessionIndex(); const lastKey=localStorage.getItem(LAST_SESSION_KEY); const last=lastKey?index[lastKey]:null;
  el.classList.remove('has-save');
  if(last){
    const when=last.savedAt?new Date(last.savedAt).toLocaleString('id-ID'):'';
    el.innerHTML=`💾 Progres tersimpan otomatis di browser ini. Progres terakhir: <b>${esc(last.studentName||'-')} • ${esc(last.studentClass||'-')}</b>${when?` • ${esc(when)}`:''}.`;
  }else{
    el.textContent='💾 Progres, database, query, draft terminal, dan jawaban akan tersimpan otomatis di LocalStorage browser ini.';
  }
}
function buildSavePayload(includeTerminal=true){
  const output=$('terminalOutput');
  return {
    version:APP_VERSION,
    savedAt:new Date().toISOString(),
    state:{...state,elapsedBefore:getElapsed()},
    engine:engine.snapshot(),
    ui:{
      sqlDraft:$('sqlInput')?.value||'',
      terminalHTML:includeTerminal?(output?.innerHTML||''):'',
      terminalReady:output?.dataset?.ready||'',
      previewTable:$('previewSelect')?.value||''
    }
  };
}
function save(){
  if(!state.studentName||!state.studentClass)return false;
  currentStorageKey=currentStorageKey||sessionKey();
  setSaveStatus('● Menyimpan…','saving');
  try{
    let payload=buildSavePayload(true);
    try{
      localStorage.setItem(currentStorageKey,JSON.stringify(payload));
    }catch(quotaError){
      // Jika riwayat terminal terlalu besar, simpan seluruh progres tanpa HTML terminal.
      payload=buildSavePayload(false);
      localStorage.setItem(currentStorageKey,JSON.stringify(payload));
    }
    localStorage.setItem(LAST_SESSION_KEY,currentStorageKey);
    const index=readSessionIndex();
    index[currentStorageKey]={
      studentName:state.studentName,studentClass:state.studentClass,mode:state.mode,
      completed:completedCount(),score:score(),submitted:!!state.submitted,savedAt:payload.savedAt
    };
    writeSessionIndex(index);
    const now=new Date(payload.savedAt).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
    setSaveStatus(`● Tersimpan ${now}`,'saved');
    updateSavedSessionInfo();
    return true;
  }catch(e){
    setSaveStatus('● Gagal menyimpan','error');
    return false;
  }
}
function scheduleSave(delay=500){
  setSaveStatus('● Menunggu simpan…','saving');
  clearTimeout(saveDebounce);
  saveDebounce=setTimeout(save,delay);
}
function load(name,cls){
  try{
    const key=sessionKey(name,cls);
    let raw=localStorage.getItem(key);
    let p=raw?JSON.parse(raw):null;
    // Migrasi otomatis dari versi lama jika identitasnya cocok.
    if(!p){
      const legacyRaw=localStorage.getItem(LEGACY_STORAGE_KEY);
      const legacy=legacyRaw?JSON.parse(legacyRaw):null;
      if(legacy?.state && String(legacy.state.studentName||'').trim().toLowerCase()===String(name).trim().toLowerCase() && String(legacy.state.studentClass||'').trim().toLowerCase()===String(cls).trim().toLowerCase()){
        p=legacy;
        try{localStorage.removeItem(LEGACY_STORAGE_KEY)}catch(e){}
      }
    }
    if(!p?.state||!p?.engine)return false;
    currentStorageKey=key;
    state={...state,...p.state,startAt:Date.now()};
    engine.restore(p.engine);
    restoredUi=p.ui||{};
    return true;
  }catch(e){return false}
}
function restoreSavedUi(){
  const ui=restoredUi||{};
  if(ui.sqlDraft!=null && $('sqlInput')) $('sqlInput').value=ui.sqlDraft;
  const out=$('terminalOutput');
  if(out && ui.terminalHTML){
    out.innerHTML=ui.terminalHTML;
    out.dataset.ready=ui.terminalReady||'1';
    out.scrollTop=out.scrollHeight;
  }else printWelcome();
  if(ui.previewTable && $('previewSelect') && [...$('previewSelect').options].some(o=>o.value===ui.previewTable)){
    $('previewSelect').value=ui.previewTable; renderPreview();
  }
  restoredUi=null;
}
function removeStoredSession(key=currentStorageKey||sessionKey()){
  try{
    localStorage.removeItem(key);
    const index=readSessionIndex(); delete index[key]; writeSessionIndex(index);
    if(localStorage.getItem(LAST_SESSION_KEY)===key)localStorage.removeItem(LAST_SESSION_KEY);
  }catch(e){}
}
function getElapsed(){
  if(state.submitted && Number.isFinite(state.finalElapsed)) return state.finalElapsed;
  return (state.elapsedBefore||0)+(Date.now()-state.startAt);
}
function fmtTime(ms){const s=Math.floor(ms/1000),m=Math.floor(s/60),h=Math.floor(m/60);return h?`${String(h).padStart(2,'0')}:${String(m%60).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`:`${String(m).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`}

function startApp(){
  const name=$('studentName').value.trim(); const cls=$('studentClass').value.trim();
  if(!name||!cls){toast('Isi nama siswa dan kelas terlebih dahulu.','bad');return;}
  const wantsContinue=$('session').value==='lanjut';
  let loaded=false;
  if(wantsContinue){
    loaded=load(name,cls);
    if(!loaded){toast('Belum ada progres LocalStorage untuk nama dan kelas ini. Pilih Mulai sesi baru terlebih dahulu.','bad');return;}
  }
  if(!loaded){
    const existing=savedPayloadFor(name,cls);
    if(existing && !confirm('Progres tersimpan untuk nama dan kelas ini sudah ada. Mulai sesi baru akan mengganti progres tersebut. Lanjutkan?'))return;
    currentStorageKey=sessionKey(name,cls);
    restoredUi=null;
    engine.reset();
    state={studentName:name,studentClass:cls,mode:$('mode').value,currentTask:1,completed:{},hints:{},history:[],historyIndex:0,queries:[],startAt:Date.now(),elapsedBefore:0,lastQuery:'',submitted:false,submittedAt:null,finalElapsed:null};
  } else {
    // Saat melanjutkan sesi, mode lama dipertahankan agar Mode Ujian tidak dapat dibuka sebagai Mode Belajar.
    state.studentName=state.studentName||name;
    state.studentClass=state.studentClass||cls;
    state.submitted=!!state.submitted;
    if(state.finalElapsed==null) state.finalElapsed=null;
  }
  $('startScreen').classList.add('hidden'); $('app').classList.remove('hidden');
  $('studentLabel').textContent=`${state.studentName} • ${state.studentClass}`;
  $('modePill').textContent=state.mode==='belajar'?'Mode Belajar':state.mode==='latihan'?'Mode Latihan':'Mode Ujian';
  renderAll();
  restoreSavedUi();
  applySessionLock();
  clearInterval(timerHandle); clearInterval(autosaveHandle);
  $('timerPill').textContent=fmtTime(getElapsed());
  if(!state.submitted){
    timerHandle=setInterval(()=>{$('timerPill').textContent=fmtTime(getElapsed())},1000);
    autosaveHandle=setInterval(save,10000);
  }
  save();
  if(!state.submitted) $('sqlInput').focus();
}

function renderAll(){renderTaskList();renderLesson();renderTaskNav();renderExplorer();renderProgress();updatePrompt();}
function setCurrentTask(taskId,{scroll=true}={}){
  const idx=tasks.findIndex(t=>t.id===Number(taskId));
  if(idx<0)return;
  state.currentTask=tasks[idx].id;
  state.hints[state.currentTask]=state.hints[state.currentTask]||0;
  renderTaskList();
  renderLesson();
  renderTaskNav();
  scheduleSave(120);
  if(scroll){
    const lesson=document.querySelector('.lesson');
    if(lesson){
      try{lesson.scrollTo({top:0,behavior:'smooth'});}catch(e){lesson.scrollTop=0;}
      if(window.matchMedia('(max-width:760px)').matches){
        setTimeout(()=>lesson.scrollIntoView({behavior:'smooth',block:'start'}),40);
      }
    }
  }
}
function navigateTask(step){
  const idx=tasks.findIndex(t=>t.id===state.currentTask);
  if(idx<0)return;
  const next=Math.max(0,Math.min(tasks.length-1,idx+step));
  if(next===idx)return;
  setCurrentTask(tasks[next].id);
}
function renderTaskNav(){
  const idx=tasks.findIndex(t=>t.id===state.currentTask);
  const pos=idx<0?0:idx;
  const t=tasks[pos]||tasks[0];
  if($('taskPosition'))$('taskPosition').textContent=`Soal ${pos+1} dari ${tasks.length}`;
  if($('taskPositionTitle'))$('taskPositionTitle').textContent=t?.title||'';
  if($('backTaskBtn'))$('backTaskBtn').disabled=pos<=0;
  if($('nextTaskBtn'))$('nextTaskBtn').disabled=pos>=tasks.length-1;
}

function renderTaskList(){
  const reveal=state.mode!=='ujian'||state.submitted;
  $('taskList').innerHTML=tasks.map(t=>{const done=reveal&&state.completed[t.id];return `<button class="task-btn ${state.currentTask===t.id?'active':''} ${done?'done':''}" data-id="${t.id}"><span class="task-num">${done?'✓':t.id}</span><span class="task-title"><b>${esc(t.title)}</b><br><span style="color:#6f879d">${esc(t.section)}</span></span><span class="task-score">${state.mode==='ujian'&&!state.submitted?'•':t.points}</span></button>`}).join('');
  document.querySelectorAll('.task-btn').forEach(b=>b.onclick=()=>setCurrentTask(Number(b.dataset.id)));
}
function renderLesson(){
  const t=getTask(); const h=state.hints[t.id]||0; const done=!!state.completed[t.id];
  if(state.mode==='ujian'){
    const submittedNote=state.submitted?'<p><b>Ujian telah dikumpulkan dan terminal dikunci.</b> Buka tombol Hasil Ujian untuk melihat nilai dan pembahasan.</p>':'<p>Mode Ujian: materi, hint, status benar/salah, dan nilai disembunyikan sampai ujian dikumpulkan.</p>';
    $('lessonContent').innerHTML=`<div class="eyebrow">Soal ${t.id} • ${t.section} • ${t.points} poin</div><h2>${esc(t.title)}</h2><div class="task-box">${t.objective}</div>${submittedNote}`;
    $('hintBtn').disabled=true; return;
  }
  const showConcept=state.mode==='belajar';
  $('hintBtn').disabled=false;
  $('lessonContent').innerHTML=`<div class="eyebrow">Soal ${t.id} • ${t.section} • ${t.points} poin</div><h2>${esc(t.title)} ${done?'<span style="color:#4ade80">✓ Selesai</span>':''}</h2>${showConcept?`<p><b>Penjelasan.</b> ${t.concept}</p>`:''}<div class="task-box"><b>Tugas</b><br>${t.objective}</div>${showConcept?`<div class="syntax">${esc(t.syntax)}</div>`:''}${h?`<div class="hint-box"><b>Hint ${Math.min(h,t.hints.length)}/${t.hints.length}</b><br>${esc(t.hints[Math.min(h,t.hints.length)-1])}</div>`:''}`;
}
function renderProgress(){
  const done=completedCount(); const sc=score(); const hidden=state.mode==='ujian'&&!state.submitted;
  $('progressBar').style.width=hidden?'0%':`${done/tasks.length*100}%`;
  $('progressText').textContent=hidden?'Penilaian terkunci':`${done}/${tasks.length}`;
  $('scoreMini').textContent=hidden?'Nilai: •••':`${sc}/100`;
  $('queryCount').textContent=`${state.queries.length} query`;
  $('dbStatus').textContent=`DB: ${engine.activeDb||'belum dipilih'}`;
}
function updatePrompt(){$('prompt').textContent=engine.activeDb?`mysql [${engine.activeDb}]>`:'mysql>'}

function renderExplorer(){
  const root=$('dbTree'); const select=$('previewSelect');
  if(!engine.activeDb || !engine.databases[engine.activeDb]){root.innerHTML='<div class="dbnode">○ Belum ada database aktif</div>';select.innerHTML='<option value="">Lihat data tabel...</option>';$('dataPreview').innerHTML='';return;}
  const db=engine.databases[engine.activeDb];
  let html=`<div class="dbnode">▾ 🗃 ${esc(engine.activeDb)}</div>`;
  for(const [name,t] of Object.entries(db.tables)){
    html+=`<div class="dbnode table">▾ ${esc(name)} <span style="float:right;color:#69839a">${t.rows.length} rows</span></div>`;
    for(const c of t.schema.order){const info=t.schema.columns[c];const fk=t.schema.foreignKeys.some(x=>x.column===c);html+=`<div class="dbnode col ${info.primary?'pk':''} ${fk?'fk':''}">${info.primary?'🔑 ':fk?'🔗 ':'• '}${esc(c)} <span style="color:#546c82">${esc(info.type)}</span></div>`}
  }
  root.innerHTML=html;
  const old=select.value; select.innerHTML='<option value="">Lihat data tabel...</option>'+Object.keys(db.tables).map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('');if(db.tables[old])select.value=old;renderPreview();
}
function renderPreview(){
  const name=$('previewSelect').value; const box=$('dataPreview');
  if(!name||!engine.activeDb){box.innerHTML='';return} const t=engine.databases[engine.activeDb].tables[name]; if(!t){box.innerHTML='';return}
  const cols=t.schema.order; const rows=t.rows.slice(0,20); box.innerHTML=`<table><thead><tr>${cols.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows.length?rows.map(r=>`<tr>${cols.map(c=>`<td>${esc(r[c])}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="${cols.length}">Belum ada data</td></tr>`}</tbody></table>`;
}

function printWelcome(){
  const out=$('terminalOutput');
  if(out.dataset.ready) return;
  out.dataset.ready='1';
  out.innerHTML=`<div style="color:#67e8f9">MySQL Learning Terminal 1.4 — Sistem Kependudukan</div><div class="out-muted">Ketik HELP untuk daftar perintah. Gunakan <span class="kbd">Ctrl</span> + <span class="kbd">Enter</span> untuk menjalankan query.</div><div class="out-muted">Beberapa perintah dapat dijalankan sekaligus dengan pemisah titik koma (;).</div><div class="out-muted">Keamanan belajar aktif: UPDATE/DELETE tanpa WHERE akan diblokir.</div>`;
}
function appendCommand(q){const d=document.createElement('div');d.className='out-command';d.innerHTML=`<span style="color:#5eead4">${esc(engine.activeDb?`mysql [${engine.activeDb}]>`:'mysql>')}</span> ${esc(q)}`;$('terminalOutput').appendChild(d)}
function appendResult(res){
  const out=$('terminalOutput');
  if(res.type==='clear'){out.innerHTML='';delete out.dataset.ready;printWelcome();return}
  if(res.type==='table'){
    const wrap=document.createElement('div');wrap.className='result-wrap';const table=document.createElement('table');table.className='result-table';table.innerHTML=`<thead><tr>${res.columns.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${res.rows.map(r=>`<tr>${r.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody>`;wrap.appendChild(table);out.appendChild(wrap);const m=document.createElement('div');m.className='out-muted';m.textContent=`${res.rows.length} row${res.rows.length===1?'':'s'} in set (${res.elapsed.toFixed(3)} sec)`;out.appendChild(m);
  }else{const d=document.createElement('div');d.className=res.type==='ok'?'out-ok':'out-muted';d.textContent=(res.message||'')+(res.type==='ok'?` (${res.elapsed.toFixed(3)} sec)`:'');out.appendChild(d)}
  out.scrollTop=out.scrollHeight;
}
function appendError(e){const d=document.createElement('div');d.className='out-error';d.textContent=`ERROR ${e.sqlCode||1064} (${e.sqlState||'42000'}): ${e.message}`;$('terminalOutput').appendChild(d);$('terminalOutput').scrollTop=$('terminalOutput').scrollHeight}

function runQuery(){
  if(state.mode==='ujian'&&state.submitted){toast('Ujian sudah dikumpulkan. Terminal telah dikunci.','bad');return;}
  const input=$('sqlInput'); const raw=input.value.trim(); if(!raw)return;
  const statements=engine.splitStatements(raw);
  if(!statements.length)return;
  state.history.push(raw); state.historyIndex=state.history.length;
  let allNew=[]; let hadError=false;

  for(const q of statements){
    appendCommand(q+';');
    state.queries.push(q+';'); state.lastQuery=q;
    try{
      const res=engine.execute(q); appendResult(res);
      const newly=checkProgress(q,res);
      allNew.push(...newly);
    }catch(e){
      appendError(e); hadError=true; toast('Eksekusi berhenti pada query yang error. Baca pesan terminal lalu perbaiki.','bad'); break;
    }
  }
  if(!hadError) input.value='';
  renderAll();
  if(allNew.length){
    const unique=[...new Set(allNew)];
    if(state.mode==='ujian'&&!state.submitted){
      toast('Query berhasil dijalankan. Status penilaian disembunyikan selama ujian.','good');
    }else{
      toast(`✓ Soal ${unique.join(', ')} berhasil. Nilai sementara ${score()}/100.`,'good');
      autoAdvance();
    }
  }
  save(); updatePrompt(); renderExplorer(); renderProgress();
}

function dbTable(name){try{return engine.databases.kependudukan_db?.tables?.[name]||null}catch(e){return null}}
function hasColumns(tableName, cols){const t=dbTable(tableName);return !!t&&cols.every(c=>t.schema.columns[c])}
function findBy(tableName,col,val){const t=dbTable(tableName);return t?.rows.find(r=>String(r[col]).toLowerCase()===String(val).toLowerCase())}
function religionId(name){return findBy('agama','nama_agama',name)?.id_agama}
function kelId(name){return findBy('kelurahan','nama_kelurahan',name)?.id_kelurahan}
function mark(id,newly){if(!state.completed[id]){state.completed[id]=true;newly.push(id)}}
function colOK(tableName,col,type,opts={}){
  const c=dbTable(tableName)?.schema?.columns?.[col]; if(!c||c.type!==type)return false;
  if(opts.primary!==undefined&&!!c.primary!==opts.primary)return false;
  if(opts.unique!==undefined&&!!c.unique!==opts.unique)return false;
  if(opts.auto!==undefined&&!!c.autoIncrement!==opts.auto)return false;
  if(opts.nullable!==undefined&&!!c.nullable!==opts.nullable)return false;
  return true;
}
function exactRow(tableName,keyCol,keyVal,expected){
  const r=findBy(tableName,keyCol,keyVal); if(!r)return false;
  return Object.entries(expected).every(([k,v])=>String(r[k]??'')===String(v??''));
}
function rowsFromResult(res){
  if(!res||res.type!=='table')return [];
  return res.rows.map(row=>Object.fromEntries(res.columns.map((c,i)=>[c,row[i]])));
}
function sameScalar(a,b){return String(a??'')===String(b??'')}
function sameResult(res,columns,expectedRows,{unordered=false}={}){
  if(!res||res.type!=='table')return false;
  if(res.columns.length!==columns.length||!columns.every((c,i)=>res.columns[i]===c))return false;
  const actual=res.rows.map(r=>r.map(v=>v??null));
  const expected=expectedRows.map(r=>r.map(v=>v??null));
  const key=r=>JSON.stringify(r.map(v=>String(v??'')));
  if(unordered){actual.sort((a,b)=>key(a).localeCompare(key(b)));expected.sort((a,b)=>key(a).localeCompare(key(b)));}
  if(actual.length!==expected.length)return false;
  return actual.every((r,i)=>r.length===expected[i].length&&r.every((v,j)=>sameScalar(v,expected[i][j])));
}
function hasCorrectJoin(n,table,left,right){
  const reEsc=x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const pair=(a,b)=>new RegExp(`${reEsc(a)}\\s*=\\s*${reEsc(b)}`).test(n);
  return new RegExp(`join\\s+${reEsc(table)}\\s+on\\s+`).test(n)&&(pair(left,right)||pair(right,left));
}
function expectedForTask(id){
  const p=dbTable('penduduk'), a=dbTable('agama'), k=dbTable('kelurahan'); if(!p)return null;
  if(id===14){
    const cols=p.schema.order.slice();
    const rows=p.rows.slice().sort((x,y)=>String(x.nama_lengkap).localeCompare(String(y.nama_lengkap))).map(r=>cols.map(c=>r[c]));
    return {cols,rows};
  }
  if(id===15){
    const cols=['nik','nama_lengkap','jenis_kelamin','pekerjaan'];
    const rows=p.rows.filter(r=>r.pekerjaan==='Pelajar').map(r=>cols.map(c=>r[c]));
    return {cols,rows};
  }
  if(id===16&&a&&k){
    const cols=['nik','nama_lengkap','nama_agama','nama_kelurahan','kecamatan'];
    const rows=p.rows.map(r=>{const ar=a.rows.find(x=>String(x.id_agama)===String(r.id_agama));const kr=k.rows.find(x=>String(x.id_kelurahan)===String(r.id_kelurahan));return [r.nik,r.nama_lengkap,ar?.nama_agama,kr?.nama_kelurahan,kr?.kecamatan]}).filter(r=>r[2]!==undefined&&r[3]!==undefined);
    return {cols,rows};
  }
  if(id===17&&k){
    const cols=['nama_kelurahan','jumlah_penduduk']; const counts=new Map();
    for(const r of p.rows){const kr=k.rows.find(x=>String(x.id_kelurahan)===String(r.id_kelurahan));if(kr)counts.set(kr.nama_kelurahan,(counts.get(kr.nama_kelurahan)||0)+1)}
    return {cols,rows:[...counts.entries()].map(([name,count])=>[name,count]),unordered:true};
  }
  if(id===18){
    const cols=['nik','nama_lengkap','tanggal_lahir','pekerjaan'];
    const rows=p.rows.filter(r=>String(r.nama_lengkap).toLowerCase().includes('a')).sort((x,y)=>String(y.tanggal_lahir).localeCompare(String(x.tanggal_lahir))).map(r=>cols.map(c=>r[c]));
    return {cols,rows};
  }
  return null;
}
function checkProgress(q,res){
  const newly=[]; const db=engine.databases.kependudukan_db;
  if(db && engine.activeDb==='kependudukan_db') mark(1,newly);

  const a=dbTable('agama');
  if(a&&colOK('agama','id_agama','INT',{primary:true,auto:true,nullable:false})&&colOK('agama','nama_agama','VARCHAR(30)',{nullable:false})&&colOK('agama','keterangan','VARCHAR(100)'))mark(2,newly);

  const k=dbTable('kelurahan');
  if(k&&colOK('kelurahan','id_kelurahan','INT',{primary:true,auto:true,nullable:false})&&colOK('kelurahan','nama_kelurahan','VARCHAR(50)',{nullable:false})&&colOK('kelurahan','kecamatan','VARCHAR(50)',{nullable:false}))mark(3,newly);

  const p=dbTable('penduduk');
  if(p&&
     colOK('penduduk','id_penduduk','INT',{primary:true,auto:true,nullable:false})&&
     colOK('penduduk','nik','VARCHAR(16)',{unique:true,nullable:false})&&
     colOK('penduduk','nama_lengkap','VARCHAR(100)',{nullable:false})&&
     colOK('penduduk','id_agama','INT')&&colOK('penduduk','id_kelurahan','INT')&&
     colOK('penduduk','jenis_kelamin','VARCHAR(10)')&&colOK('penduduk','tanggal_lahir','DATE')&&colOK('penduduk','status_perkawinan','VARCHAR(20)')){
    const fks=p.schema.foreignKeys;
    if(fks.some(x=>x.column==='id_agama'&&x.refTable==='agama'&&x.refColumn==='id_agama')&&fks.some(x=>x.column==='id_kelurahan'&&x.refTable==='kelurahan'&&x.refColumn==='id_kelurahan'))mark(4,newly);
  }
  if(p&&colOK('penduduk','pekerjaan','VARCHAR(100)')&&colOK('penduduk','no_kk','VARCHAR(16)'))mark(5,newly);

  if(a&&['Islam','Kristen','Katolik','Hindu','Buddha'].every(x=>findBy('agama','nama_agama',x)))mark(6,newly);
  const kelExpected={'Sungai Miai':'Banjarmasin Utara','Pemurus Dalam':'Banjarmasin Selatan','Kuripan':'Banjarmasin Timur','Teluk Dalam':'Banjarmasin Tengah'};
  if(k&&Object.entries(kelExpected).every(([name,kec])=>exactRow('kelurahan','nama_kelurahan',name,{kecamatan:kec})))mark(7,newly);

  const expected=[
    ['6371000000000001',{nama_lengkap:'Ardiansyah Noor',agama:'Islam',kel:'Sungai Miai',jenis_kelamin:'L',tanggal_lahir:'2008-01-12',status_perkawinan:'Belum Kawin',no_kk:'6371000000001001',pekerjaan:'Pelajar'}],
    ['6371000000000002',{nama_lengkap:'Maya Lestari',agama:'Islam',kel:'Pemurus Dalam',jenis_kelamin:'P',tanggal_lahir:'2007-05-21',status_perkawinan:'Belum Kawin',no_kk:'6371000000001002',pekerjaan:'Pelajar'}],
    ['6371000000000003',{nama_lengkap:'Bima Pratama',agama:'Kristen',kel:'Kuripan',jenis_kelamin:'L',tanggal_lahir:'1987-11-03',status_perkawinan:'Kawin',no_kk:'6371000000001003',pekerjaan:'Karyawan Swasta'}],
    ['6371000000000004',{nama_lengkap:'Citra Wulandari',agama:'Katolik',kel:'Teluk Dalam',jenis_kelamin:'P',tanggal_lahir:'1990-02-14',status_perkawinan:'Kawin',no_kk:'6371000000001004',pekerjaan:'Guru'}],
    ['6371000000000005',{nama_lengkap:'Raka Saputra',agama:'Hindu',kel:'Sungai Miai',jenis_kelamin:'L',tanggal_lahir:'1985-08-17',status_perkawinan:'Kawin',no_kk:'6371000000001005',pekerjaan:'Wirausaha'}],
    ['6371000000000006',{nama_lengkap:'Nina Amelia',agama:'Buddha',kel:'Kuripan',jenis_kelamin:'P',tanggal_lahir:'1998-12-02',status_perkawinan:'Belum Kawin',no_kk:'6371000000001006',pekerjaan:'Perawat'}]
  ];
  if(p&&expected.every(([nik,e])=>{const r=findBy('penduduk','nik',nik);return !!r&&r.nama_lengkap===e.nama_lengkap&&String(r.id_agama)===String(religionId(e.agama))&&String(r.id_kelurahan)===String(kelId(e.kel))&&r.jenis_kelamin===e.jenis_kelamin&&r.tanggal_lahir===e.tanggal_lahir&&r.status_perkawinan===e.status_perkawinan&&r.no_kk===e.no_kk&&r.pekerjaan===e.pekerjaan}))mark(8,newly);

  const f=findBy('penduduk','nik','6371000000000007');
  if(f&&f.nama_lengkap==='Fajar Hidayat'&&String(f.id_agama)===String(religionId('Konghucu'))&&String(f.id_kelurahan)===String(kelId('Teluk Dalam'))&&f.jenis_kelamin==='L'&&f.tanggal_lahir==='2000-09-10'&&f.status_perkawinan==='Belum Kawin'&&f.no_kk==='6371000000001007'&&f.pekerjaan==='Desainer')mark(9,newly);

  const maya=findBy('penduduk','nik','6371000000000002'); if(maya&&maya.pekerjaan==='Mahasiswa')mark(10,newly);
  const nina=findBy('penduduk','nik','6371000000000006'); if(nina&&nina.status_perkawinan==='Kawin')mark(11,newly);

  const n=normalize(q);
  if(state.currentTask===12&&res?.type==='ok'&&res.affected===1&&/^update penduduk set /.test(n)&&/ where /.test(n)){
    const setPart=n.match(/^update penduduk set (.+) where /)?.[1]||'';
    const hasTwo=setPart.split(',').map(x=>x.trim().split('=')[0].trim());
    const targetsFajar=/where .*nik\s*=\s*['"]?6371000000000007['"]?/.test(n)||/where .*nama_lengkap\s*=\s*['"]fajar hidayat['"]/.test(n);
    const fNow=findBy('penduduk','nik','6371000000000007');
    if(hasTwo.includes('id_kelurahan')&&hasTwo.includes('pekerjaan')&&targetsFajar&&fNow&&String(fNow.id_kelurahan)===String(kelId('Sungai Miai'))&&fNow.pekerjaan==='Programmer')mark(12,newly);
  }
  if(engine.audit.insertedTrial&&engine.audit.deletedTrial&&!findBy('penduduk','nik','9999999999999999'))mark(13,newly);

  if(state.currentTask>=14&&state.currentTask<=18&&res?.type==='table'){
    const id=state.currentTask, exp=expectedForTask(id);
    if(exp){
      let shapeOK=false;
      if(id===14) shapeOK=/^select \* from penduduk\b/.test(n)&&!(/\bwhere\b/.test(n))&&/order by nama_lengkap asc\b/.test(n);
      if(id===15) shapeOK=/^select /.test(n)&&/ from penduduk /.test(` ${n} `)&&/where pekerjaan\s*=\s*['"]pelajar['"]/.test(n);
      if(id===16) shapeOK=/^select /.test(n)&&/from penduduk/.test(n)&&hasCorrectJoin(n,'agama','penduduk.id_agama','agama.id_agama')&&hasCorrectJoin(n,'kelurahan','penduduk.id_kelurahan','kelurahan.id_kelurahan');
      if(id===17) shapeOK=/count\s*\(\s*\*\s*\)\s+as\s+jumlah_penduduk/.test(n)&&hasCorrectJoin(n,'kelurahan','penduduk.id_kelurahan','kelurahan.id_kelurahan')&&/group by kelurahan\.nama_kelurahan\b/.test(n);
      if(id===18) shapeOK=/from penduduk/.test(n)&&/where nama_lengkap\s+like\s*['"]%a%['"]/.test(n)&&/order by tanggal_lahir desc\b/.test(n);
      if(shapeOK&&sameResult(res,exp.cols,exp.rows,{unordered:!!exp.unordered}))mark(id,newly);
    }
  }
  return newly;
}
function autoAdvance(){
  if(state.mode==='ujian'&&!state.submitted)return;
  const t=getTask();if(state.completed[t.id]&&t.id<tasks.length){setTimeout(()=>setCurrentTask(t.id+1),650)}
}

function showHint(){if(state.mode==='ujian')return;const t=getTask();state.hints[t.id]=Math.min((state.hints[t.id]||0)+1,t.hints.length);renderLesson();save()}
function toast(msg,type=''){const el=$('toast');el.textContent=msg;el.className=`toast ${type}`;clearTimeout(el._t);el._t=setTimeout(()=>el.classList.add('hidden'),3000)}
function clearTerminal(){$('terminalOutput').innerHTML='';delete $('terminalOutput').dataset.ready;printWelcome()}
function resetAll(){
  if(state.mode==='ujian'){toast('Reset dinonaktifkan pada Mode Ujian. Mulai sesi baru dari halaman awal bila diperlukan.','bad');return;}
  if(!confirm('Reset seluruh database, query, progres, dan nilai sesi ini?'))return;
  engine.reset();state.completed={};state.hints={};state.history=[];state.historyIndex=0;state.queries=[];state.currentTask=1;state.startAt=Date.now();state.elapsedBefore=0;state.lastQuery='';state.submitted=false;state.submittedAt=null;state.finalElapsed=null;
  removeStoredSession();
  clearTerminal();renderAll();applySessionLock();save();toast('Sesi berhasil direset dan kondisi kosong disimpan ke LocalStorage.','good')
}

function exportSQL(){
  const header=`-- SQL Praktik Basis Data - Sistem Kependudukan\n-- Nama: ${state.studentName}\n-- Kelas: ${state.studentClass}\n-- Nilai sementara: ${score()}/100\n-- Waktu: ${fmtTime(getElapsed())}\n\n`;
  const blob=new Blob([header+state.queries.join('\n\n')+'\n'],{type:'text/sql'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`kependudukan_${state.studentName.toLowerCase().replace(/[^a-z0-9]+/g,'_')}.sql`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)
}

function applySessionLock(){
  const locked=state.mode==='ujian'&&state.submitted;
  $('sqlInput').disabled=locked;
  $('runBtn').disabled=locked;
  $('clearBtn').disabled=locked;
  $('resetBtn').disabled=state.mode==='ujian';
  $('hintBtn').disabled=state.mode==='ujian'||locked;
  $('finishBtn').textContent=locked?'Hasil Ujian':'Selesai';
  $('sqlInput').placeholder=locked?'Ujian telah dikumpulkan — terminal dikunci.':'Ketik perintah SQL di sini... (Ctrl+Enter untuk menjalankan)';
}

function finish(){
  if(state.mode==='ujian'&&!state.submitted){
    if(!confirm('Kumpulkan ujian sekarang? Setelah dikumpulkan, terminal akan dikunci dan jawaban tidak dapat diubah.'))return;
    state.finalElapsed=getElapsed();
    state.submitted=true;
    state.submittedAt=Date.now();
    clearInterval(timerHandle); clearInterval(autosaveHandle);
    $('timerPill').textContent=fmtTime(state.finalElapsed);
    save(); applySessionLock(); renderAll();
  }else save();

  const done=completedCount(),sc=score();const bySection={};for(const t of tasks){if(!bySection[t.section])bySection[t.section]={got:0,total:0};bySection[t.section].total+=t.points;if(state.completed[t.id])bySection[t.section].got+=t.points}
  const canReview=state.mode!=='ujian'||state.submitted;
  $('finishContent').innerHTML=`<div class="eyebrow">${state.mode==='ujian'?'Hasil Ujian':'Hasil Praktik'}</div><h2>${esc(state.studentName)} — ${esc(state.studentClass)}</h2><div class="score-big">${sc}<span style="font-size:22px;color:#7890a6">/100</span></div><div class="summary-grid">${Object.entries(bySection).map(([k,v])=>`<div class="summary-card"><span>${esc(k)}</span><b>${v.got}/${v.total}</b></div>`).join('')}</div><p style="color:#8aa0b8">Selesai ${done}/18 soal • ${state.queries.length} query • ${fmtTime(getElapsed())}</p>${state.mode==='ujian'?'<p style="color:#4ade80"><b>✓ Ujian telah dikumpulkan. Terminal terkunci.</b></p>':''}<div style="display:flex;gap:8px;flex-wrap:wrap">${canReview?'<button id="reviewBtn" class="btn primary">Lihat Pembahasan</button>':''}<button id="exportModalBtn" class="btn">Ekspor .sql</button><button id="closeModalBtn" class="btn">Kembali</button></div><div id="reviewBox"></div>`;
  $('finishModal').classList.remove('hidden');
  $('closeModalBtn').onclick=()=>$('finishModal').classList.add('hidden');
  $('exportModalBtn').onclick=exportSQL;
  if(canReview)$('reviewBtn').onclick=renderReview;
}

function renderReview(){
  const box=$('reviewBox'); box.innerHTML='<h3 style="margin-top:20px">Pembahasan & Contoh Query</h3>'+tasks.map(t=>`<div class="review-item ${state.completed[t.id]?'done':''}"><b>Soal ${t.id} — ${esc(t.title)}</b> <span style="float:right;color:${state.completed[t.id]?'#4ade80':'#fbbf24'}">${state.completed[t.id]?'✓ Benar':'Belum selesai'}</span><p style="color:#9fb2c5;font-size:12px">${t.concept}</p><div class="syntax">${esc(t.solution)}</div></div>`).join('');
}

$('startBtn').onclick=startApp;$('runBtn').onclick=runQuery;$('clearBtn').onclick=()=>{clearTerminal();save()};$('hintBtn').onclick=showHint;$('backTaskBtn').onclick=()=>navigateTask(-1);$('nextTaskBtn').onclick=()=>navigateTask(1);$('resetBtn').onclick=resetAll;$('exportBtn').onclick=exportSQL;$('finishBtn').onclick=finish;
$('previewSelect').onchange=()=>{renderPreview();scheduleSave(150)};
$('studentName').addEventListener('input',updateSavedSessionInfo);
$('studentClass').addEventListener('input',updateSavedSessionInfo);
$('sqlInput').addEventListener('input',()=>scheduleSave(600));
$('sqlInput').addEventListener('keydown',e=>{
  if(e.key==='Enter'&&e.ctrlKey){e.preventDefault();runQuery();return}
  if(e.key==='ArrowUp'&&!e.shiftKey&&$('sqlInput').selectionStart===0){e.preventDefault();if(state.history.length){state.historyIndex=Math.max(0,state.historyIndex-1);$('sqlInput').value=state.history[state.historyIndex]||''}}
  if(e.key==='ArrowDown'&&!e.shiftKey){e.preventDefault();if(state.history.length){state.historyIndex=Math.min(state.history.length,state.historyIndex+1);$('sqlInput').value=state.history[state.historyIndex]||''}}
});
document.addEventListener('keydown',e=>{if(e.ctrlKey&&e.key.toLowerCase()==='l'&&!$('app').classList.contains('hidden')){e.preventDefault();clearTerminal();save()}});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&!$('app').classList.contains('hidden'))save()});
window.addEventListener('pagehide',()=>{if(!$('app').classList.contains('hidden'))save()});
window.addEventListener('beforeunload',()=>{if(!$('app').classList.contains('hidden'))save()});
updateSavedSessionInfo();
