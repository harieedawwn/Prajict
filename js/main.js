fetch('data/projects.json?'+Date.now(),{cache:'no-store'}).then(r=>r.json()).then(j=>{P=j.projects||[];render()}).catch(()=>render());
gl($('#top'),20,40);document.querySelectorAll('#tools .bt').forEach(b=>gl(b,12,24));
