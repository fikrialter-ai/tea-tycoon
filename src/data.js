export const BUSINESS = { capital:15000000, price:15000, material:6000, fixed:1250000, demand:500, weeks:4 };
export const MARKETING = [0,250000,500000,750000,1000000];
export const SCORING = {profitability:.4, accuracy:.3, cash:.2, efficiency:.1, profitGoal:10000000};
export const EVENTS = [
 {id:'viral',title:'Viral di TikTok',description:'Video Tealab tiba-tiba viral dan menarik banyak pelanggan baru.',effect:'Permintaan +30%',demand:1.3,icon:'spark'},
 {id:'rain',title:'Hujan lebat',description:'Hujan deras membuat jumlah pelanggan yang datang berkurang.',effect:'Permintaan −20%',demand:.8,icon:'rain'},
 {id:'supplier',title:'Harga supplier naik',description:'Supplier menaikkan harga bahan baku minggu ini.',effect:'Biaya bahan per gelas +15%',material:1.15,icon:'box'},
 {id:'loyal',title:'Pelanggan loyal',description:'Banyak pelanggan lama kembali membeli Tealab.',effect:'Permintaan +10%',demand:1.1,icon:'heart'},
 {id:'power',title:'Gangguan listrik',description:'Terjadi masalah listrik di outlet. Teknisi perlu segera dipanggil.',effect:'Biaya tambahan Rp250.000',expense:250000,icon:'bolt'},
 {id:'repair',title:'Peralatan rusak',description:'Salah satu peralatan utama perlu diperbaiki.',effect:'Biaya tambahan Rp300.000',expense:300000,icon:'tool'},
 {id:'festival',title:'Festival kampus',description:'Ada festival kampus minggu ini. Tealab mendapat kesempatan membuka booth tambahan.',effect:'Rp750.000 untuk permintaan +40%',decision:true,cost:750000,demand:1.4,icon:'spark'},
 {id:'influencer',title:'Tawaran influencer',description:'Kreator lokal menawarkan promosi Tealab kepada pengikutnya.',effect:'Rp400.000 untuk permintaan +20%',decision:true,cost:400000,demand:1.2,icon:'heart'}
];
export const LESSONS = [ ['Perencanaan','Anggaran membantu bisnis menetapkan target dan merencanakan penggunaan sumber daya.'],['Koordinasi','Anggaran menyelaraskan target penjualan, pembelian bahan, dan aktivitas bisnis.'],['Alokasi sumber daya','Anggaran membantu menentukan bagaimana modal digunakan.'],['Pengendalian biaya','Perbandingan anggaran dan realisasi membantu bisnis mengendalikan pengeluaran.'],['Evaluasi kinerja','Selisih anggaran membantu mengevaluasi apakah hasil aktual sesuai rencana.'] ];
