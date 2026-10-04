const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
const tpl = fs.readFileSync('cover.html','utf8');
const covers = [
 {file:'gig1-ai-solutions.png', glow:'rgba(170,90,255,.40)', tag:'AI SOLUTIONS',
  title:'I will build <span>AI chatbots</span> &amp; AI agents',
  list:['Custom AI chatbots &amp; assistants','AI agents that automate work','Chat with your documents (RAG)','OpenAI, Claude &amp; API integrations'],
  code:`<span class="k">const</span> agent = <span class="f">createAgent</span>({
  model: <span class="s">"gpt / claude"</span>,
  knowledge: <span class="s">"your-docs"</span>,
  tools: [<span class="s">"email"</span>, <span class="s">"crm"</span>],
  channels: [<span class="s">"web"</span>, <span class="s">"whatsapp"</span>]
});
<span class="cm">// ✓ answers 24/7</span>`, badge:'AI Engineer'},
 {file:'gig2-webapp.png', glow:'rgba(80,140,255,.35)', tag:'WEB &amp; MOBILE APPS',
  title:'I will build your custom <span>web or mobile app</span>',
  list:['Web apps, dashboards &amp; SaaS','Mobile-friendly &amp; modern design','Login, payments &amp; databases','TypeScript, clean &amp; tested'],
  code:`<span class="k">const</span> app: <span class="f">App</span> = <span class="f">createApp</span>({
  pages: [<span class="s">"home"</span>, <span class="s">"dashboard"</span>],
  auth: <span class="k">true</span>,
  ai: <span class="s">"assistant"</span>,
  mobile: <span class="k">true</span>
});
app.<span class="f">launch</span>(); <span class="cm">// 🚀</span>`, badge:'From $40'},
 {file:'gig3-automation.png', glow:'rgba(29,191,115,.35)', tag:'BUSINESS AUTOMATION',
  title:'I will <span>automate</span> your repetitive tasks',
  list:['Python &amp; Playwright bots','Excel, email &amp; data workflows','Web scraping &amp; API integrations','Save hours every week'],
  code:`<span class="cm"># runs every morning</span>
<span class="k">def</span> <span class="f">daily_report</span>():
  data = scrape(<span class="s">"site.com"</span>)
  sheet.update(data)
  email.send(<span class="s">"Report ready"</span>)

<span class="cm"># ✓ 3 hours saved/day</span>`, badge:'Fast delivery'},
];
(async()=>{
 const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1280,height:769}});
 for (const c of covers){
  const html = tpl.replace('VAR_GLOW',c.glow).replace('VAR_TAG',c.tag).replace('VAR_TITLE',c.title)
   .replace('VAR_LIST',c.list.map(l=>`<li>${l}</li>`).join('')).replace('VAR_CODE',c.code).replace('VAR_BADGE',c.badge);
  await p.setContent(html); await p.screenshot({path:c.file});
 }
 await b.close();
})();
