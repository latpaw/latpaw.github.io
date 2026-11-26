// Audited scientific corrections and an accessible, narrated teaching layer.
let motionClock=0, dwell=0, narration=true, resistorOffset=0;
const childStories={
bjt:['小开关还没打开。先看中间很薄的基区。','基极得到驱动，电子从左边出发，穿过薄薄的基区。','大部分电子到达右边；少部分在基区与空穴复合。','先把里面多出来的电荷清掉，开关才会关好。','电荷清完，电子不再持续从左穿到右。'],
mos:['栅极下面还没有连起来的小路。','栅极的电场改变硅表面，建立一条很薄的通道。','电子沿通道进入芯片，再向下到漏极。它们不穿过栅极的绝缘层。','栅极放电，通道消失，新的电子进不来了。','通道关好，器件重新阻挡电压。'],
igbt:['现在没有通道，开关关着。','上面送来电子，下面注入空穴，两种载流子一起导电。','漂移区多了电子和空穴，这一大块硅变得更容易导电。','通道先关了，可里面还有存下来的电荷，要慢慢清掉。','存下来的电荷清完，拖着的小电流也结束了。'],
resistor:['电子仍在乱动，但还没有往某个方向的净移动。','加上电压后，电子一边乱动，一边整体向右漂移。','电子把电源给的能量传给材料，电阻变热。','电压撤掉了，净漂移停止，可余热还在。','余热散去，电阻接近原来的温度。'],
capacitor:['中间是绝缘层，电子不能直接穿过去。','电源从左板拿走电子，送到右板；两边电荷分开了。','两边留下了电荷和电场，现在几乎不再有充电电流。','改接电阻负载，右边多出的电子沿外部导线回到左边。','电荷差越来越小，储存的能量在电阻里变成热。'],
inductor:['线圈里还没有电流，也没有它产生的磁场。','电流慢慢长起来，磁场也跟着增强。','电流保持时，磁场还在，能量存在磁场里。','电源撤掉，电流沿续流回路继续走，方向没有翻转。','磁场里的能量释放完，电流逐渐停下来。'],
transformer:['磁通刚经过零，但正在变化，所以电压并不为零。','第一组线圈使磁通变化，第二组线圈就产生感应电压。','磁通最强的这一瞬间，变化率是零，感应电压也过零。','看磁通怎样来回变化；电压取决于变化快慢，不只看强弱。','回到周期起点，接着重复。两组导线始终没有电连接。'],
relay:['弹簧让两个触点分开，负载回路断着。','线圈变成电磁铁，吸动上面的衔铁。','两个金属触点碰到了，另一套电路就接通了。','线圈磁力减小，弹簧把衔铁和触点拉回去。','两个触点又分开了。线圈没有和负载电路连在一起。'],
crystal:['石英片没有持续的外部激励，不会自己不停振动。','交流电场让石英片发生很小的剪切形变。','节奏合适时，振动变明显。图里把形变放大了很多。','激励撤掉后，它还会振一会儿，振幅慢慢变小。','振动衰减到很小。要持续计时，还需要外部电路补充能量。'],
diode:['P 和 N 之间本来就有一层势垒。','正向加电压，势垒变低，两种载流子向对面注入。','电子向左，空穴向右；常规电流都算向右。','改成反向电压，先把刚才存进去的电荷扫回来。','电荷清完，反向电流只剩很小的漏电流，图中省略了。'],
zener:['现在是反向接电，电压还没达到击穿工作区。','反向电压升高，结里的电场增强。','进入规定的击穿区后，电流变化很明显，电压变化相对小。','电源减小，反向电流也变小。','回到击穿以下。串联电阻一直负责限流。'],
led:['还没有持续注入载流子，所以没有明显发光。','电子和空穴从两边靠近发光区。','它们在同一处复合，部分能量变成向外传播的光。','停止送入新电荷，剩下的载流子复合后，光变弱。','明显发光结束。它不是靠一根灯丝烧热来发光的。'],
photodiode:['没有光，但反向电压和结里的电场已经存在。','光子到达吸收点，产生一对电子和空穴。','电场把它们分开：电子向右，空穴向左。','遮住光，新的载流子不再产生，已有的被收集或复合。','回到暗态。电场仍在，只剩小暗电流。'],
scr:['中央的结挡住电流，主开关还没打开。','门极给一个合适的触发，让内部的正反馈开始。','主电流达到锁定条件后，它能自己维持导通。','把门极触发撤掉，它仍然开着！普通 SCR 不能这样关。','要让外部主电路把电流降下来，并等它恢复，才能关好。'],
opamp:['电路一直通电，输出反馈回来，输入两端接近平衡。','输入升高，电路发现两端有差，就把输出往上调。','输出反馈回来，让差变小，输出接近输入。','输入回到零，输出也往零调整。电源并没有关掉。','重新接近平衡。这些箭头表示信号，不是小电子走过盒子。']};
const teaching=document.createElement('section');teaching.className='teaching';teaching.innerHTML='<div><strong>先认清图里的记号</strong><p>蓝色 − 是电子；橙色 + 是空穴（缺少电子的位置，不是一颗小正电球）。紫色箭头表示<b>常规电流</b>；浅蓝 E 表示电场；绿色 B 表示磁场。场线不是流动的粒子。</p></div><div><strong>怎么一起看</strong><p>先选元件 → 点“播放” → 跟着每一步短句看。动画会在关键位置停留；也能点步骤或拖动时间轴。</p></div>';
nav.before(teaching);
teaching.querySelector('p').innerHTML='先看每张图的图例。<b>带 − 的移动圆点</b>是电子；<b>带 + 的移动圆点</b>是空穴（缺少电子的位置）。电容极板上的 ± 只表示净电荷。标 E 的箭头是电场，标 B 的是磁场；运放箭头表示信号，石英箭头表示位移。';
const terms=document.createElement('details');terms.innerHTML='<summary>给第一次接触电路的小朋友</summary><p>电场 E 的方向按正电荷受力方向定义；电子带负电，电场力方向相反，但扩散等机制也会影响运动。P、N 是半导体的掺杂类型，不代表整块材料分别带正电、负电。紫色 I 箭头表示常规电流，它与电子净移动方向相反。动画中的空穴是有效载流子的示意，不是一颗独立的小正电球。</p>';teaching.append(terms);
const story=document.createElement('div');story.className='child-story';story.innerHTML='<span class="eyebrow">这一刻，发生了什么？</span><p id="child-text" aria-live="polite"></p><div id="direction-text"></div>';$('phase').before(story);
const professional=document.createElement('details');professional.className='professional';professional.innerHTML='<summary>展开专业解释与电路条件</summary><p id="pro-explain"></p><p id="pro-look"></p><p id="pro-condition"></p>';document.querySelector('aside').append(professional);
$('explanation').removeAttribute('aria-live');
const player=document.createElement('div');player.className='learning-tools';player.innerHTML='<label>速度 <select id="speed"><option value="2.5">慢慢看</option><option value="5">正常</option><option value="8">快速回顾</option></select></label><label><input id="narration" type="checkbox" checked> 每步停留讲解</label><button id="kid-mode" aria-pressed="true">儿童讲解：开</button><button id="zoom-diagram" aria-pressed="false">放大结构图</button><button id="next-stage">下一步 →</button>';document.querySelector('.playrow').after(player);
document.body.classList.add('kid-mode');
const css=document.createElement('style');css.textContent='.teaching{display:grid;grid-template-columns:1.2fr 1fr;gap:22px;padding:20px 24px;margin:15px 0 25px;border:1px solid var(--line);border-radius:12px;background:var(--card)}.teaching p{color:var(--muted);font-size:14px;margin-bottom:0}.child-story{border-left:3px solid var(--accent);padding:13px 15px;background:#25342c55;margin:16px 0}.child-story p{font-size:21px;line-height:1.65;margin:10px 0}.child-story #direction-text{font-size:13px;color:var(--muted)}.learning-tools{display:flex;gap:16px;flex-wrap:wrap;align-items:center;margin:20px 0}.learning-tools label{font-size:14px}.learning-tools input{accent-color:var(--accent)}select{font:inherit;border:1px solid var(--line);color:var(--ink);background:var(--card);padding:7px;border-radius:6px}.professional{margin-top:18px;color:var(--muted);font-size:14px}.professional summary{cursor:pointer;color:var(--accent)}.kid-mode aside>.lead,.kid-mode aside>.explain,.kid-mode aside>.fact{display:none}body:not(.kid-mode) .child-story,body:not(.kid-mode) .professional{display:none}.kid-mode aside h2#phaseName{font-size:20px}.kid-mode .mono#phase{margin-top:16px}.zoomed #specimen{min-height:300px}.teaching b{color:var(--ink)}@media(max-width:780px){.teaching{grid-template-columns:1fr;padding:17px;gap:12px}.child-story p{font-size:20px}.learning-tools{gap:12px}.legend{font-size:13px}.stages{grid-template-columns:1fr 1fr}.stages button{font-size:13px;padding:10px}.stages button:last-child{grid-column:1/-1}}';document.head.append(css);
const currentColor='#d3a8ff', electricColor='#8cdcf4', magneticColor='#cce9a3';
extra.resistor.electrical='假定本次温升对电阻值的影响可忽略；电子净漂移与常规电流反向。';
const pack=(opacity,markup)=>'<g opacity="'+clamp(opacity)+'">'+markup+'</g>';
const pathsAt=(start,end,count,progress,signText,color,y=275)=>Array.from({length:count},(_,i)=>{const u=(i/count+progress)%1;return sign(start+(end-start)*u,y,signText,color);}).join('');
const auditOriginalRender=render;
render=function(){auditOriginalRender();correctDiagram();updateTeaching();};
const auditOriginalSetup=setup;
setup=function(){if(type==='resistor')resistorOffset=0;auditOriginalSetup();render();};
function updateTeaching(){const p=extra[type]?extraModel(type,time).p:phase(time);const values={'child-text':type==='igbt'&&p===3?(time<74?'先让栅极放电，小路逐渐消失。接着才清掉里面存着的电荷。':'小路已经关好；现在只清除里面存下来的电荷。'):type==='mos'&&p===3?'栅极开始放电，小路逐渐消失，新的电子越来越难进来。':childStories[type][p],'pro-explain':$('explanation').textContent,'pro-look':'观察：'+$('look').textContent,'pro-condition':'条件：'+$('electrical').textContent,'direction-text':directionSummary(type,p)};for(const [id,value] of Object.entries(values))if($(id).textContent!==value)$(id).textContent=value;}
function directionSummary(k,p){if(k==='bjt')return '电子：E → C；常规电流：C → E。';if(k==='mos')return '电子：S → D；常规电流：D → S。';if(k==='igbt')return p===3&&time<74?'栅极放电阶段：沟道正在消退。':p===3?'拖尾：只清除漂移区已有电荷，不再经关闭的沟道补充电子。':'电子向下、空穴向上；常规电流：C → E。';if(k==='diode')return p>=3?'反向恢复时清除旧电荷；恢复后阻断。':'电子 N → P，空穴 P → N；结电场方向 N → P。';if(k==='photodiode'||k==='zener')return '结电场：N → P；收集电子向 N，空穴向 P。';if(k==='capacitor')return '电场：左 + → 右 −；电子只经外部回路。';if(k==='inductor')return '绕组正面电流向下；右手规则给出轴向磁场向右。';if(k==='transformer')return '磁通 Φ 与感应电压不是同一个量：电压取决于 dΦ/dt。';if(k==='scr')return '紫色是常规主电流 A → K；不是载流子轨迹。';if(k==='opamp')return '蓝色是输入信号；橙色是反馈；电源轨始终通电。';if(k==='crystal')return '上下表面向相反方向位移；形变大幅放大。';if(k==='relay')return '电磁吸力带动机械触点；线圈与负载回路绝缘。';return k==='resistor'?'电子净漂移与电场、常规电流反向。':'电子与空穴在发光区复合；黄色波纹是光。';}
function correctDiagram(){const m=extra[type]?extraModel(type,time):model(type,time),p=extra[type]?m.p:m.phase;const a=extra[type]?m.level:m.gate,e='#86e0f0',h='#ffc38e';let overlay='';
if(type==='bjt'){
 $('particles').querySelectorAll('[data-route="1"]').forEach(el=>el.style.opacity=0);const baseDrive=p===1||p===2;overlay+=pack(baseDrive?m.gate:0,fieldArrow(339,149,339,205,currentColor)+label(350,164,'基极补入空穴','svg-small'));
 const misleadingTrack=$('tracks').querySelectorAll('path')[1];if(misleadingTrack)misleadingTrack.style.opacity=0;
 if(p===3)overlay+=pack(m.stored,fieldArrow(339,225,339,178,currentColor)+label(350,200,'基极抽取电荷','svg-small'));
 if(baseDrive){for(let i=0;i<3;i++){const u=(motionClock*.22+i/3)%1;overlay+=pack((1-u)*m.gate,sign(318+u*22,291,'−',e));}}
 $('look').textContent=p===3?'清除基区等处的存储电荷，集电结再恢复阻断。':'发射区注入电子；少部分在基区与空穴复合，大部分被集电区收集。';
}else if(type==='igbt'&&p===3){
 if(m.gate>0){
  // First discharge the gate; only after the channel closes show pure stored-charge tail.
  $('particles').querySelectorAll('.moving').forEach(el=>el.style.opacity=m.gate);
  overlay+=pack(m.gate,fieldArrow(301,168,301,186,electricColor));
  $('phaseName').textContent='先放栅电荷，沟道正在消退';$('explanation').textContent='栅极正在放电，沟道逐渐消退；电子供给随之减小。沟道完全关闭后，漂移区存储电荷仍需清除，进入拖尾。';$('look').textContent='先看栅下绿色通道变弱；再看漂移区电荷清除。';
 }else{
 // No continuous fresh injection during the tail: a finite stored packet clears.
 $('particles').querySelectorAll('.moving').forEach(el=>el.style.opacity=0);
 $('tracks').querySelectorAll('path').forEach(el=>el.style.opacity=0);
 const u=clamp((time-74)/23);for(let i=0;i<12;i++){const x=220+(i%6)*53,y=275+Math.floor(i/6)*34;overlay+=pack(m.stored,sign(x,mix(y,351,u),'−',e)+sign(mix(x,198,u),mix(y,220,u),'+',h));}overlay+=label(395,311,'已有电荷 → 清除','svg-small');
 }
}else if(type==='mos'||type==='igbt'){
 overlay+=pack(m.gate,fieldArrow(301,168,301,186,electricColor)+fieldArrow(325,168,325,186,electricColor)+label(420,152,'栅电场穿过氧化层','svg-small'));
}else if(['diode','zener','led','photodiode'].includes(type)){
 // Field arrow always goes from N (right) to P (left), distinct from carrier flow.
 overlay+=fieldArrow(414,243,347,243,electricColor)+label(349,232,'结电场 E ←','svg-small');
 if(type==='led'&&p>=3){const texts=$('labels').querySelectorAll('text');for(const t of texts)if(t.textContent.includes('外加正向偏置'))t.textContent='外部驱动撤去；剩余注入电荷复合';}
 if(type==='diode'&&p===3){
  const u=clamp((time-65)/32);$('channel').innerHTML=rect(380-(15+50*u),188,30+100*u,158,'url(#hatch)');
  for(let i=0;i<6;i++){overlay+=pack(1-u,sign(mix(260+i*16,430+i*10,u),271,'−',e)+sign(mix(415+i*16,285+i*10,u),307,'+',h));}
  overlay+=label(225,330,'旧电荷被扫回，数量逐渐减少','svg-small');
 }
 if(type==='zener'){
  const current=p===2?1:p===3?clamp((90-time)/25):0;
  $('channel').innerHTML=rect(335,188,90,158,'url(#hatch)');overlay+=pack(current,pathsAt(380,560,5,motionClock*.2,'−',e,270)+pathsAt(380,200,5,motionClock*.2,'+',h,302));
  overlay+=label(205,329,p===1?'接近击穿：此处不画大电流':p===2?'额定击穿区：外部 R 限流':'反向偏置，非正向导通','svg-small');
 }
 if(type==='led'&&(p===1||p===2)){
  // One visible pair first converges; only then does a photon leave.
  const cycle=(motionClock*.28)%1,u=clamp(cycle/.6);$('channel').innerHTML=rect(366,188,28,158,'url(#hatch)');
  if(cycle<.6)overlay+=pack(a,sign(mix(558,380,u),mix(252,272,u),'−',e)+sign(mix(202,380,u),mix(300,272,u),'+',h));
  else{const f=(cycle-.6)/.4;overlay+=pack(a*(1-f*.6),circ(380+f*90,272-f*136,5,'#f5db7e')+stroke('M380 272L'+(380+f*90)+' '+(272-f*136),'#f5db7e',2));}
  overlay+=label(420,157,'光向外传播','svg-small');
 }
 if(type==='led'&&p>=3){
  const u=clamp((time-65)/32),remain=1-u;$('channel').innerHTML=rect(345,188,70,158,'url(#hatch)');
  for(let i=0;i<5;i++)overlay+=pack(remain,sign(mix(420+i*10,380,u),mix(260+i*4,272,u),'−',e)+sign(mix(340-i*10,380,u),mix(288+i*4,272,u),'+',h));
  overlay+=pack(remain,stroke('M380 262l18 -14l-4 -18l18 -14l-4 -18l18 -14','#f5db7e',3));
 }
 if(type==='photodiode'){
  $('channel').innerHTML=rect(325,188,110,158,'url(#hatch)');const amount=m.level;
  const cycle=(motionClock*.28)%1,photonU=clamp(cycle/.4),origin=[365,270];
  overlay+=pack((p===1||p===2)&&cycle<.4?amount:0,stroke('M325 104L'+mix(325,365,photonU)+' '+mix(104,270,photonU),'#f5db7e',2)+circ(mix(325,365,photonU),mix(104,270,photonU),4,'#f5db7e'));
  overlay+=pack(amount,circ(...origin,10,'none','stroke="#f5db7e"')+label(392,292,'在同一处吸收、生成','svg-small'));
  if((p===1||p===2)&&cycle>=.4){const u=(cycle-.4)/.6;overlay+=pack(amount,sign(mix(365,555,u),270,'−',e)+sign(mix(365,200,u),270,'+',h));}
  if(p===3){for(let i=0;i<4;i++){const u=clamp((time-65)/32+i*.07);overlay+=pack(amount,sign(mix(365,555,u),270,'−',e)+sign(mix(365,200,u),270,'+',h));}}
  overlay+=pack(amount,fieldArrow(456,305,416,305,electricColor));
 }
}else if(type==='resistor'){
 // Keep nonzero baseline thermal motion. The inset alone contains mobile carriers.
 const heat=p===0||p===4?.2:p===1?.2+a*.5:p===2?1:.2+a*.8;
 $('channel').innerHTML='';for(let i=0;i<24;i++){const x=405+(i%6)*33,y=227+Math.floor(i/6)*30;overlay+=circ(x+Math.sin(motionClock*5+i)*heat*2.5,y+Math.cos(motionClock*4+i)*heat*2.5,4,h);}
 for(let i=0;i<12;i++){const x=400+((i*17+resistorOffset)%178)+Math.sin(motionClock*7+i)*4,y=235+(i%3)*40+Math.cos(motionClock*6+i*2)*5;overlay+=sign(x,y,'−',e);}
 if(p===1||p===2)overlay+=fieldArrow(525,214,465,214,electricColor);
}else if(type==='capacitor'){
 $('channel').querySelectorAll('path[stroke="#cce9a3"]').forEach(el=>el.setAttribute('stroke',electricColor));
 const texts=$('labels').querySelectorAll('text');for(const t of texts)if(t.textContent==='电源接入'||t.textContent==='负载回路')t.textContent=p===0?'电源未接':p<=2?'经 R 接电源':'电源断开 → 接 R';
 // Separate charge polarity from moving particle traffic; never cross dielectric.
 const q=p===0||p===4?0:time<38?1-Math.exp(-(time-10)/7):time<65?1:Math.exp(-(time-65)/7);
 const sourceVoltage=p<=2?1:0;overlay+=label(170,123,p===0?'开关未接通':p<=2?'左板接电源 +，右板接 −':'电源隔离，接到放电电阻','svg-small');
 if(p===1||p===3){const flow=p===1?Math.exp(-(time-10)/7):q;for(let i=0;i<5;i++){const u=(motionClock*.2+i/5)%1;overlay+=pack(flow,sign(p===1?mix(220,540,u):mix(540,220,u),365,'−',e));}}
}else if(type==='inductor'){
 // The front segments carry conventional current down: right-hand rule gives B right.
 $('channel').innerHTML=pack(a,stroke('M220 267H535Q650 270 555 320Q380 410 215 320Q120 270 220 267',magneticColor,2)+fieldArrow(350,267,410,267,magneticColor)+fieldArrow(400,350,340,350,magneticColor)+fieldArrow(345,230,345,291,currentColor));
 overlay+=label(270,212,'正面绕组 i ↓','svg-small')+label(264,339,'轴向 B →；外部磁场返回','svg-small')+label(185,360,p===3?'电流原方向续流；绕组电压极性反转':'电流增长后趋近稳态','svg-small');
}else if(type==='transformer'){
 $('labels').querySelectorAll('text').forEach(el=>{if(el.textContent.startsWith('Φ ='))el.remove();});
 const flux=m.flux,volt=m.voltage,weight=Math.abs(flux);$('channel').innerHTML=pack(weight,stroke('M251 192H510V323H251Z',magneticColor,3)+fieldArrow(flux>=0?335:405,192,flux>=0?405:335,192,magneticColor));
 // Signed bars make the quadrature explicit. Values are normalized, not measurements.
 overlay+=label(160,108,'磁通 Φ','svg-small')+label(160,133,'电压 ∝ dΦ/dt','svg-small');overlay+=stroke('M385 92V139','#adc0c8',1)+rect(Math.min(385,385+flux*95),96,Math.abs(flux)*95,10,magneticColor)+rect(Math.min(385,385+volt*95),122,Math.abs(volt)*95,10,electricColor);
 if(p===3){$('phaseName').textContent=time<75?'磁通下降，电压为负':'磁通回升，电压转正';$('explanation').textContent=time<75?'磁通从正峰值下降，穿过零到负峰值，变化率为负；到负峰值瞬间感应电压再次过零。':'磁通从负峰值回升到零，变化率为正，感应电压随之转正。磁通的正负与变化率的正负要分开看。';}
}else if(type==='relay'){
 // A hinged armature over a U-yoke; the air gap closes at the right pole.
 const coil=a,position=p===0||p===4?0:p===1?clamp((time-15)/17):p===2?1:time<70?1:clamp((87-time)/17);const angle=-13*(1-position);
 let s=block(225,306,325,28,'#4c626b')+block(225,212,25,94,'#4c626b')+block(519,218,31,88,'#4c626b');
 for(let i=0;i<10;i++)s+=stroke('M'+(270+i*20)+' 292q-9 -6 -9 3v44q0 10 9 6l10 -6v-44q0 -8 -10 -3Z','#c79a70',4);
 s+=circ(238,211,9,'#9aafb8')+rect(562,248,28,11,'#beb49b');
 $('structure').innerHTML=s;$('channel').innerHTML=pack(coil,stroke('M238 218V320H535V218H238',magneticColor,3));overlay+='<g transform="rotate('+angle+' 238 211)">'+rect(238,204,344,14,'url(#metal)')+rect(572,218,8,23,'url(#metal)')+circ(576,241,7,'#e1d2b0')+'</g>';
 // Spring has a real fixed bracket and a moving endpoint on the armature.
 const rad=angle*Math.PI/180,anchor=[238+66*Math.cos(rad),211+66*Math.sin(rad)];
 overlay+=rect(226,157,16,48,'#627b88')+rect(242,157,16,12,'#627b88');
 let spring='M250 165';for(let i=1;i<=8;i++){const u=i/8;spring+='L'+mix(250,anchor[0],u)+' '+(mix(165,anchor[1],u)+(i===8?0:i%2?4:-4));}
 overlay+=stroke(spring,'#b4c3c9',2)+label(281,170,'复位弹簧','svg-small');
 $('labels').innerHTML=label(176,125,'机械位移和接触间隙均放大','svg-small')+label(180,198,'铰链')+label(540,287,'负载触点')+label(320,283,'衔铁')+label(313,365,'线圈绕在铁轭上')+label(160,394,'线圈与负载回路电气隔离','svg-small');
 overlay+=label(421,149,position===1?'触点接触：负载接通':'触点分开：负载断开','svg-small');
}else if(type==='crystal'){
 const amp=p===0||p===4?0:a,shift=Math.sin(motionClock*3)*amp*10;
 // Fundamental thickness-shear: opposite faces, stationary central plane.
 const top=shift,bottom=-shift;
 const profile=Array.from({length:21},(_,i)=>({y:215+i*5,x:shift*Math.cos(i*Math.PI/20)}));
 const outline='M'+(235+top)+' 215H'+(525+top)+profile.slice(1).map(q=>'L'+(525+q.x)+' '+q.y).join('')+profile.slice().reverse().map(q=>'L'+(235+q.x)+' '+q.y).join('')+'Z';
 $('structure').innerHTML='<path d="'+outline+'" fill="#64818b" stroke="#bad2dc66"/>'+stroke('M235 265H525','#adbfca',1,'stroke-dasharray="4 5"');
 $('channel').innerHTML=rect(235+top,207,290,8,'#a4b8bb')+rect(235+bottom,315,290,8,'#a4b8bb');overlay+=label(285,285,'中面近似不动','svg-small');
 if(Math.abs(shift)>.4)overlay+=pack(amp,fieldArrow(370,235,370+shift*4,235,'#e5edf0')+fieldArrow(390,300,390-shift*4,300,'#e5edf0'));
 document.querySelector('.legend').textContent='白箭头：相对中面的表面位移（不是速度、电流或磁场）；形变夸张放大';
}else if(type==='scr'){
 $('channel').querySelectorAll('circle').forEach(el=>el.setAttribute('fill',currentColor));
 document.querySelector('.legend').textContent='紫色点：常规主电流 A → K 的示意；橙箭头：门极驱动；斜线：阻断结';
 if(p===3)overlay+=label(180,113,'门极已撤去；主回路仍供电','svg-small');
 if(p===4)overlay+=label(175,113,'外部换流：IA < IH → 清荷恢复 → 阻断','svg-small');
}else if(type==='opamp'){
 $('channel').querySelectorAll('text').forEach(el=>{if(el.textContent.startsWith('Vin:'))el.textContent='Vin = '+(p===0||p>=3?'0':'1')+'；Vout ≈ '+a.toFixed(2)+'（归一化）';});
 overlay+=stroke('M125 245H185',e,3)+label(225,184,'电源始终接通','svg-small');
}
// A separate overlay keeps fixed structure and carrier-motion semantics distinct.
let correction=$('audited-overlay');if(!correction){correction=document.createElementNS(NS,'g');correction.id='audited-overlay';$('labels').before(correction);}correction.innerHTML=overlay;
}
$('speed').addEventListener('change',()=>{last=0;});$('narration').addEventListener('change',()=>{narration=$('narration').checked;dwell=0;});
$('kid-mode').addEventListener('click',()=>{const on=document.body.classList.toggle('kid-mode');$('kid-mode').textContent='儿童讲解：'+(on?'开':'关');$('kid-mode').setAttribute('aria-pressed',String(on));});
$('zoom-diagram').addEventListener('click',()=>{const on=$('zoom-diagram').getAttribute('aria-pressed')!=='true';$('zoom-diagram').setAttribute('aria-pressed',String(on));$('zoom-diagram').textContent=on?'恢复全图':'放大结构图';$('specimen').setAttribute('viewBox',on?'140 90 490 320':'0 0 760 490');document.body.classList.toggle('zoomed',on);});
$('next-stage').addEventListener('click',()=>{stop();dwell=0;const steps=[...document.querySelectorAll('[data-step]')].map(b=>+b.dataset.step);time=steps.find(t=>t>time+.05)??0;render();});
const auditStart=start;
start=function(){dwell=0;auditStart();};
tick=function(now){raf=0;if(!playing||!visible||document.hidden)return;const dt=last?Math.min((now-last)/1000,.05):0;last=now;motionClock+=dt;if(type==='resistor'&&(phase(time)===1||phase(time)===2))resistorOffset+=dt*15;if(dwell>0)dwell=Math.max(0,dwell-dt);else{const speed=+$('speed').value,next=[...document.querySelectorAll('[data-step]')].map(b=>+b.dataset.step).find(t=>t>time+.001);const advance=Math.min(100,time+dt*speed);if(narration&&next!==undefined&&advance>=next){time=next;dwell=2.3;}else time=advance;}render();if(time>=100&&dwell<=0)stop();else raf=requestAnimationFrame(tick);};
