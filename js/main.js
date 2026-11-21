fetch('data/projects.json?'+Date.now()).then(r=>r.json()).then(j=>{P=j.projects||[];render()}).catch(()=>render());
gl($('#top'),20,40);
