/* ---- cấu hình: để trống = tự đoán từ địa chỉ github.io ---- */
const CFG={owner:'harieedawwn',repo:'Prajict',branch:'main'};
const HASH='69a521283de55297b319fe407061d849000daa1abef79538104ea490c7e27c97',h=location.hostname.split('.');
const O=CFG.owner||h[0],R=CFG.repo||location.pathname.split('/')[1]||h[0]+'.github.io',BR=CFG.branch;
const COLS=['#1d3b63','#e2512d','#2f7d5b','#7a4fa3','#c98a0a'];
let P=[],adm=false,TOK=null,curT=null;
