'use strict';
const ui=id=>document.getElementById(id);
const el=(tag,cls,text)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=text;return x;};
const add=(box,...parts)=>{for(const p of parts)if(p)box.append(p);return box;};
const empty=box=>{box.replaceChildren();return box;};
function go(tab) {
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id==='view-'+tab));
  document.querySelectorAll('.nav-btn').forEach(v=>v.classList.toggle('active',v.dataset.view===tab));
  const url=new URL(window.location.href);url.searchParams.set('view',tab);
  history.replaceState(null,'',url.pathname+url.search);
  window.scrollTo(0,0);
}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.view)));
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
ui('refreshBtn')?.addEventListener('click',()=>window.location.reload());
ui('statCases').textContent='1';
ui('statADB').textContent='Démo';
const notice=el('div','info-strip');
notice.style.marginTop='16px';
notice.append(el('strong',null,'Dernière mise à jour : 11/11/2026'));
notice.append(el('span',null,'Version partageable 0.1 : interface de suivi, diagnostic simulé, fiche Odin, sécurité et évolution de la mallette. Actualiser avec F5 après une publication.'));
ui('view-dashboard').append(notice);
const caseData={
 id:'CAS-001-S23FE',
 model:'SM-S711U1',
 title:'Samsung Galaxy S23 FE — mise à jour Odin',
 symptom:'Mise à jour OTA refusée avant intervention. Flash Odin PASS documenté le 11/11/2026.',
 status:'Réception fonctionnelle à finaliser',
 original:'Android 15, One UI 7, bootloader 6',
 current:'Firmware S711U1UES8FZJ7, bootloader 8',
 confirm:['Modèle exact SM-S711U1','Firmware contrôlé','Odin PASS confirmé','Redémarrage et USB/MTP confirmés'],
 pending:['Écran de bienvenue et comptes','Réseau et données mobiles','Appels/SMS','Wi-Fi/Bluetooth/GPS','Caméra/capteurs','Mise à jour OTA après réparation']
};
const viewCase=empty(ui('caseList'));
const btn=el('button','case-choice selected');
btn.type='button';
add(btn,el('strong',null,caseData.title),el('span',null,'SM-S711U1 · Intervention du 11/11/2026'));
viewCase.append(btn);
const det=empty(ui('caseDetails'));
add(det,el('div','mini-eyebrow','CAS-001 / FICHE DE DÉMONSTRATION'),el('h2','case-title',caseData.title),
  el('p','micro','Historique technique anonymisé · Aucune connexion au téléphone'),
  el('span','status status-warn',caseData.status),
  el('div','case-overview','Modèle exact : SM-S711U1 · CSC XAA · Origine AT&T'),
  el('p','note',caseData.symptom),
  el('h3',null,'État initial'),
  el('p',null,caseData.original),
  el('h3',null,'Résultat de l’intervention'),
  el('p',null,caseData.current+' · Odin 3.14.4 PASS · CSC standard avec effacement des données'),
  el('h3',null,'Éléments vérifiés'));
for(const v of caseData.confirm)det.append(el('div','finding','✓ '+v));
det.append(el('h3',null,'Contrôles post-flash restant à effectuer'));
for(const v of caseData.pending)det.append(el('div','finding','○ '+v+' — non vérifié'));
const report=document.createElement('a');
report.href='./rapport_public.md';report.download='RAPPORT_PUBLIC_DEPANNTOI.md';report.className='btn btn-dark';
report.textContent='Télécharger la synthèse publique';
const actions=el('div','actions');actions.append(report);det.append(actions);
const diagD=empty(ui('deviceList'));
diagD.append(el('div','empty','Aucun accès direct aux téléphones dans cette version publique. Cliquez sur « Voir une démonstration » pour examiner les étapes du diagnostic.'));
empty(ui('usbList')).append(el('div','empty','Les périphériques Windows ne sont pas accessibles depuis le navigateur public.'));
ui('scanBtn').addEventListener('click',()=>{
 const dl=empty(ui('deviceList'));
 dl.append(el('div','micro','EXEMPLE HISTORIQUE — aucune mesure en cours'));
 const example=el('div','device-row');
 add(example,el('div','device-mark','▣'),add(el('div','grow'),
   el('strong',null,'Samsung Galaxy S23 FE (exemple)'),
   el('small',null,'Modèle SM-S711U1 · ancien relevé ADB validé')));
 dl.append(example);
 const result=empty(ui('diagnosticResult'));
 result.append(add(el('div','panel-head'),el('h2',null,'Exemple de diagnostic extrait de l’historique'),el('span','pill-neutral','Démonstration')));
 result.append(el('p',null,'Le 10/11/2026, les sondes ADB avaient permis de relever les propriétés suivantes. Elles ne représentent PAS l’état actuel du téléphone.'));
 const fields=el('div','fields');
 for(const [k,v] of [['Modèle','SM-S711U1'],['Android initial','15'],['Build initial','S711U1UEU6DYDB'],
 ['Bootloader initial','révision 6'],['CSC actif','XAA'],['Verified Boot','green'],
 ['Diagnostic OTA','version logicielle non prise en charge'],['Réparation','Odin PASS le 11/11/2026']]){
   fields.append(add(el('div','field'),el('span',null,k),el('strong',null,v)));
 }
 result.append(fields,el('div','hint','Simulation de lecture uniquement. Aucune commande ADB n’est envoyée depuis cette page.'));
});
const form=ui('firmwareForm');
form.addEventListener('submit',e=>{
 e.preventDefault();
 const data=new FormData(form), model=String(data.get('model')||'').trim().toUpperCase();
 const build=String(data.get('build')||'').trim().toUpperCase();
 const csc=String(data.get('csc')||'').trim().toUpperCase();
 const known=model==='SM-S711U1'&&build==='S711U1UES8FZJ7'&&csc==='XAA';
 const out=empty(ui('firmwareResult'));
 add(out,el('span','status '+(known?'status-good':'status-warn'),
   known?'Référence historique reconnue':'Référence non documentée'),
   el('p',null,known?'Cette combinaison correspond au cas pilote historique. Cela ne prouve PAS la compatibilité d’un téléphone réel pour un nouveau flash.'
    :'Aucune compatibilité attestée pour cette combinaison. Vérification matérielle et constructeur obligatoire.'),
   el('div','finding','La version publique ne télécharge aucun firmware et ne déclenche aucune opération système.'));
});
const directView=new URLSearchParams(location.search).get('view');
if(['dashboard','diagnostic','cases','firmware','method'].includes(directView))go(directView);
