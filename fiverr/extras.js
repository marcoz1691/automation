const { chromium } = require('/opt/node-tools/node_modules/playwright');
const base = `*{margin:0;padding:0;box-sizing:border-box}body{width:1280px;height:769px;font-family:"DejaVu Sans",Arial,sans-serif;overflow:hidden}
.c{width:1280px;height:769px;position:relative;padding:64px 72px;color:#fff;background:radial-gradient(circle at 85% 15%,rgba(170,90,255,.38) 0,transparent 45%),linear-gradient(135deg,#0b1220 0%,#111c33 60%,#0d2a2a 100%)}
.tag{display:inline-block;background:#1dbf73;color:#05130c;font-weight:700;font-size:22px;padding:9px 20px;border-radius:40px;letter-spacing:1px}
h1{font-size:58px;line-height:1.1;margin:26px 0 40px;font-weight:800}h1 span{color:#1dbf73}
.name{position:absolute;left:72px;bottom:44px;font-size:24px;color:#9fb3c8}.name b{color:#fff}`;
const pages = [
{file:'gig1-ai-experience.png', html:`<style>${base}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:22px}
.s{background:rgba(255,255,255,.06);border:2px solid #2a3a5a;border-radius:20px;padding:30px 24px;height:230px}
.s b{display:block;font-size:52px;color:#1dbf73;margin-bottom:14px}.s p{font-size:23px;line-height:1.35;color:#d6e2f0}
.row{margin-top:34px;font-size:25px;color:#c9d6e8}.row i{font-style:normal;background:#1a2540;border:1px solid #2f4268;padding:8px 16px;border-radius:10px;margin-right:10px;display:inline-block}
</style><div class="c"><div class="tag">WHY WORK WITH ME</div>
<h1>Real AI experience, <span>in production</span></h1>
<div class="grid">
<div class="s"><b>10+</b><p>years building production software</p></div>
<div class="s"><b>MSc</b><p>in Applied Artificial Intelligence</p></div>
<div class="s"><b>US</b><p>clients in banking, payments &amp; SaaS</p></div>
<div class="s"><b>EN·ES</b><p>fluent English and Spanish</p></div></div>
<div class="row"><i>GPT</i><i>Claude</i><i>RAG</i><i>AI Agents</i><i>Python</i><i>TypeScript</i></div>
<div class="name">by <b>Marco Zurita</b> · AI Engineer</div></div>`},
{file:'gig1-ai-process.png', html:`<style>${base}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:26px}
.st{background:rgba(255,255,255,.06);border:2px solid #2a3a5a;border-radius:22px;padding:34px 30px;height:330px;position:relative}
.n{width:64px;height:64px;border-radius:50%;background:#1dbf73;color:#05130c;font-weight:800;font-size:32px;display:flex;align-items:center;justify-content:center;margin-bottom:24px}
.st h3{font-size:32px;margin-bottom:14px}.st p{font-size:23px;line-height:1.45;color:#c9d6e8}
</style><div class="c"><div class="tag">HOW IT WORKS</div>
<h1>From idea to <span>working AI</span> in 3 steps</h1>
<div class="steps">
<div class="st"><div class="n">1</div><h3>Tell me your goal</h3><p>Share your business, your data and what the AI should do.</p></div>
<div class="st"><div class="n">2</div><h3>I design &amp; build</h3><p>Custom chatbot or agent, trained on your information and tools.</p></div>
<div class="st"><div class="n">3</div><h3>Tested &amp; delivered</h3><p>Checked for accurate answers, documented and ready to use.</p></div></div>
<div class="name">by <b>Marco Zurita</b> · AI Engineer</div></div>`},
];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:769}});
for(const x of pages){await p.setContent('<!doctype html><meta charset="utf-8">'+x.html);await p.screenshot({path:x.file});}await b.close();})();
