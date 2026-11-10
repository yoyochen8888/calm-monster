/* 啟動 */
/* init */
renderAges();
refreshHdr();
navIcons();
go(!store.age?0:!store.hero?12:10,true);
/* 新手引導：全新的使用者才自動顯示；已經在用的家庭不打擾 */
if(!store.intro){if(store.age||store.hero){store.intro=1}else showIntro()}
