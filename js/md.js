/* ---- markdown nhỏ ---- */
function md(s){const code=[];s=esc(s).replace(/```([\s\S]*?)```/g,(_,c)=>{code.push(c);return '\u0001'+(code.length-1)+'\u0001'});
const inl=t=>t.replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\*(.+?)\*/g,'<i>$1</i>').replace(/!\[([^\]]*)\]\((https?:[^)\s]+)\)/g,'<img alt="$1" src="$2">').replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
let o='',ul=false;for(const l of s.split('\n')){const li=l.match(/^\s*[-*] (.*)/);if(ul&&!li){o+='</ul>';ul=false}
if(li){if(!ul){o+='<ul>';ul=true}o+='<li>'+inl(li[1])+'</li>';continue}
const hh=l.match(/^(#{1,3}) (.*)/);if(hh){const n=hh[1].length+1;o+=`<h${n}>${inl(hh[2])}</h${n}>`}else if(l.startsWith('&gt; '))o+='<blockquote>'+inl(l.slice(5))+'</blockquote>';else if(l.trim())o+='<p>'+inl(l)+'</p>'}
if(ul)o+='</ul>';return o.replace(/\u0001(\d+)\u0001/g,(_,i)=>'<pre>'+code[i].trim()+'</pre>')}
