/* ---- markdown nhỏ ---- */
function md(s){const code=[];s=esc(s.replace(/\r/g,'')).replace(/```[^\n]*\n?([\s\S]*?)```/g,(_,c)=>{code.push(c);return '\u0001'+(code.length-1)+'\u0001'});
const inl=t=>t.replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/(^|\W)[*_](\S.*?)[*_](?=\W|$)/g,'$1<i>$2</i>')
.replace(/!\[([^\]]*)\]\((https?:[^)\s]+)[^)]*\)/g,'<img alt="$1" src="$2" loading="lazy">').replace(/\[([^\]]+)\]\((https?:[^)\s]+)[^)]*\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
let o='',ls=null;const end=()=>{if(ls){o+=`</${ls}>`;ls=null}};
for(const l of s.split('\n')){const u=l.match(/^\s*[-*+] (.*)/),n=l.match(/^\s*\d+[.)] (.*)/),li=u||n,t=u?'ul':'ol';
if(li){if(ls!==t){end();o+=`<${t}>`;ls=t}o+='<li>'+inl(li[1])+'</li>';continue}end();
const hh=l.match(/^(#{1,6}) (.*)/);if(hh){const k=Math.min(hh[1].length+1,4);o+=`<h${k}>${inl(hh[2])}</h${k}>`}
else if(/^\s*([-*_])\1\1+\s*$/.test(l))o+='<hr>';else if(l.startsWith('&gt; '))o+='<blockquote>'+inl(l.slice(5))+'</blockquote>';else if(l.trim())o+='<p>'+inl(l)+'</p>'}
end();return o.replace(/<p>\u0001(\d+)\u0001<\/p>|\u0001(\d+)\u0001/g,(_,a,b)=>'<pre><code>'+code[a??b]+'</code></pre>')}
