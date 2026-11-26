// Each specimen has its own process: never force passive or feedback devices
// into a transistor's on/off model. Geometry and captions share one phase state.
const make=(name,sub,architecture,stages,steps,electrical,formula,caveat,uses)=>({name,sub,architecture,stages,steps,electrical,formula,caveat,uses});
const extra={
resistor:make('电阻 / 金属膜电阻','SCATTERING → HEAT','切开展示陶瓷基体上的电阻膜及两端金属电极；微观窗口放大载流子与晶格作用。',['无外加电压','施加电压','稳定电流','撤去电压','余热散去'],[
['无定向漂移','导电材料内的电子仍有热运动，但没有外电场造成的净漂移。','蓝点代表电子；规则点阵代表晶格背景，不是电子停止运动。'],
['电场建立，出现净漂移','电子在热运动上叠加定向漂移，与晶格振动、杂质等发生散射。电源持续提供能量。','电子净漂移向右，对应常规电流向左。'],
['电能转化为内能','在近似欧姆条件下，电流与电压成正比；能量经散射传给材料，并以热传向环境。','橙色晶格振动幅度强调加热，振幅不按比例。'],
['电流停止，温度仍高','撤去外加电压后，净漂移迅速消失，但电阻尚有余热。热运动不会因此停止。','电流变化与冷却不是同一个时间尺度。'],
['接近环境温度','余热散去，回到初始热平衡。电阻不是储存并释放电荷的元件。','材料和温度会改变电阻值。']],
'近似欧姆、固定温度条件；电子漂移与常规电流反向。','I = V/R；P = I²R','只画一种金属膜结构；散射示意不是电子沿规定折线逐个碰撞原子的真实轨迹。','限流、分压、偏置'),
capacitor:make('电容 / 平行板模型','CHARGE SEPARATION → ELECTRIC FIELD','两块金属电极之间夹绝缘介质；外部经电阻接电源充电，再切换到电阻负载放电。',['未充电','经 R 充电','充电完成','经 R 放电','放电完成'],[
['两极板无净电荷差','初始电压为零。这里展示理想电容，不考虑漏电和介质吸收。','两侧电极由介质隔开，没有穿过介质的电子通道。'],
['电源使两侧电荷分离','电子从左极板被移走，并通过外部电路补到右极板。左侧带正电，右侧带负电，介质中建立电场。','电子只经外部导线移动；介质中的场变化对应位移电流。'],
['电压接近电源电压','直流充电电流趋近零，极板仍保持分离的电荷，能量储存在电场中。','“有电压”不等于“持续有直流电流穿过介质”。'],
['改接负载，释放场能','断开充电电源并接上电阻负载。右极板的过剩电子经外部负载流向左极板，电场逐渐减弱。','外部电子流反向；介质仍绝缘。'],
['两侧电荷差消失','极板间电压趋近零，储存的电场能量主要在放电电阻中转成热。','动画终点以零近似；理想 RC 指数衰减在有限时间不严格到零。']],
'充电与放电均有外接电阻限流；不演示带电电容短路。','Q = CV；W = ½CV²；τ = RC','平行板是通用概念模型，实际陶瓷、薄膜、电解电容结构和极性要求不同。','去耦、滤波、耦合、定时'),
inductor:make('电感 / 绕线线圈','CURRENT → MAGNETIC ENERGY','绕线线圈及其磁场；外部为受控供电回路，断开电源时保留二极管与电阻组成的续流路径。',['电流为零','电流上升','电流近稳态','闭路续流','磁能释放完'],[
['尚无电流','初始线圈电流为零，忽略残磁。磁场图显示的是线圈产生的增量磁场。','线圈是连续导线；图中铜色线圈不是电荷容器。'],
['电流增长，建立磁场','外加电压使电流上升。感应电压反抗电流的变化，输入能量逐渐转为磁场能。','磁力线逐渐增强，不表示磁场只在线圈内部存在。'],
['电流近稳态','在直流电压及串联电阻作用下，电流趋近稳态；理想电感两端电压趋近零，但仍有磁场能。','实际绕组有电阻，持续电流仍会产生铜损。'],
['电源撤去，原方向续流','电流不能突变；线圈端电压反向以维持原方向电流。能量经二极管、电阻闭路释放，电流下降。','续流时电流方向不反转，电压极性反转。'],
['电流衰减至近零','储存的磁能耗散后，增量磁场消失。若没有续流或钳位通路，断流可能产生很高的电压。','终点以零近似，不暗示可以随意开路带电电感。']],
'展示闭路续流；以常规电流箭头标方向。','vL = L·di/dt；W = ½LI²','忽略磁饱和、寄生电容及磁滞；磁力线是场的示意，不是粒子轨道。','电源储能、滤波、扼流'),
transformer:make('变压器 / 双绕组铁芯','CHANGING FLUX → INDUCED VOLTAGE','闭合铁芯上有相互绝缘的原、副边绕组；原边接交流源，副边接电阻负载。示例匝数比 N₂/N₁ = 1/2。',['从零磁通起','磁通上升','磁通正峰值','磁通反向变化','回到零磁通'],[
['交流周期的起点','选择磁通 Φ = 0、向正方向变化的时刻。此时感应电压并非零；电压取决于磁通变化率。','“磁通为零”与“电压为零”不是同一件事。'],
['变化的磁通耦合两组线圈','原边交变电压建立变化的磁通，穿过副边的磁通变化产生感应电压，带动负载电流。','两组铜线没有电连接，耦合通过磁场发生。'],
['磁通峰值，变化率为零','磁通到达正峰值瞬间，dΦ/dt = 0，所以理想感应电压在这一瞬间过零。','磁场强，不等于此刻感应电压大。'],
['磁通下降并转向负值','磁通变化率变为负，感应电压极性反转；副边电阻负载中的电流也反向。','箭头表示有符号的磁通方向，不表示电子穿过铁芯。'],
['一个磁通周期完成','磁通回到零并继续上升，交流过程重复。持续直流不能维持这种变压过程，反而可能使铁芯饱和和过热。','本过程是周期，不是“关断”。']],
'理想变压器、电阻负载；绕组方向按同名端约定。','v = N·dΦ/dt；V₂/V₁ ≈ N₂/N₁','忽略漏磁、磁滞、励磁电流与损耗。窗口给出有符号 Φ 和 dΦ/dt，不能仅凭流动点快慢读电压。','交流变压、隔离、阻抗变换'),
relay:make('继电器 / 常开电磁继电器','MAGNETIC FORCE → CONTACT MOTION','线圈绕在铁芯上，衔铁带动常开触点；复位弹簧在断电后把衔铁拉回。线圈侧与触点负载侧电气隔离。',['线圈未通电','磁力吸合','触点闭合','退磁与释放','触点断开'],[
['常开触点分离','弹簧使衔铁保持在释放位置，常开触点不接通负载回路。','线圈电路与触点电路是两套电路。'],
['电磁力克服弹簧力','线圈电流建立磁场，铁芯吸引衔铁，衔铁带动动触点接近静触点。','上方衔铁移动；没有电子从线圈跳到触点。'],
['触点接通负载回路','动、静触点接触，负载电流经金属触点流动。线圈持续通电维持吸合。','线圈用小控制功率操纵独立的触点回路。'],
['线圈断电，弹簧复位','本例使用抑制回路释放线圈磁能。磁力降低后，弹簧拉开衔铁和触点；释放具有机械延迟。','不是一撤电触点就瞬间分开；续流二极管还可能延长释放时间。'],
['恢复常开','触点分离，负载回路断开。实际机械触点可能出现弹跳、磨损及拉弧。','这里只画常开单稳态继电器，不包含磁保持型。']],
'线圈有钳位／续流保护；负载供电与线圈供电独立。','线圈电流 → 磁力 → 衔铁位移','不模拟触点弹跳、拉弧或精确吸合阈值；负载额定值需查手册。','电气隔离、负载切换'),
crystal:make('石英晶体 / 无源谐振器','PIEZOELECTRICITY ↔ MECHANICAL RESONANCE','石英薄片的两面镀电极；示例为 AT 切厚度剪切模态。片层相对横移被放大，以展示电—机械耦合。',['无外部激励','交流电场激励','共振响应','撤去激励','振铃衰减'],[
['热平衡状态','没有外部驱动，未形成可见的宏观受迫振动。石英晶体本身不提供持续振荡所需能量。','这是无源晶体，不是内部自带振荡电路的有源晶振模块。'],
['电场引起剪切形变','交流电压通过逆压电效应驱动晶体机械变形；反过来，机械变形也通过压电效应产生电信号。','上下片层相对横移，电极没有相互穿过。'],
['接近机械谐振频率','在合适频率下，周期驱动与机械模态耦合，形成显著响应。振幅由驱动及损耗决定，不是无限增大。','实际形变量很小；图中夸张放大，不展示真实频率。'],
['撤去交流激励','输入能量停止，晶体仍可短暂振铃，机械能与电能继续交换并逐渐耗散。','撤驱动后不是立刻完全静止。'],
['振动逐步消失','阻尼使振幅衰减。持续时钟需要外部放大器和反馈电路补偿损耗。','图示终点将很小振幅近似为零。']],
'只展示无源晶体的受迫响应与振铃，不是自激振荡电路。','压电耦合；常用等效模型为 Rm–Lm–Cm 支路并联 C₀','真实模态取决于切型和尺寸；此处不计算频率，不把石英形变解释成导电电流穿透介质。','时钟选频、频率基准'),
diode:make('二极管 / 硅 PN 结','BARRIER & CARRIER INJECTION','左 P 区为阳极 A，右 N 区为阴极 K；从正向偏置切到反向偏置，观察耗尽层和注入载流子。',['零偏置','正偏增加','正向导通','切换反偏','反向阻断'],[
['结内已有内建势垒','P、N 区接触后发生扩散，留下固定离子形成耗尽层。平衡时漂移与扩散电流相互抵消。','零外加电压不代表没有结电场。'],
['势垒降低，注入增强','阳极电势高于阴极时，势垒降低。电子由 N 注入 P，空穴由 P 注入 N。','两种载流子方向相反，却产生同向常规电流 A → K。'],
['持续正向电流','电子与空穴在结两侧注入、扩散并复合。电流随电压连续变化，没有统一的理想硬阈值。','外部必须限流；0.7V 不是所有二极管的固定开关点。'],
['反向恢复清除存储电荷','切成反偏后，原有注入电荷需被抽取或复合，普通 PN 二极管可能短暂流过反向恢复电流。','此段的反向载流子运动不是稳态反向导通。'],
['反偏耗尽层扩展','存储电荷清除后，耗尽层变宽，阻断反向电压；仍有小漏电，过高电压可引发击穿。','本例不进入击穿，也不代表肖特基二极管的恢复机制。']],
'正向经过电阻限流；随后外部电路施加低于击穿的反向电压。','ID ≈ IS·(exp(VD/nVT) − 1)','PN 结理想关系不覆盖全部大电流、温度和瞬态行为；粒子只表示净注入流。','整流、续流、防反接'),
zener:make('稳压二极管 / 反向击穿','REVERSE BREAKDOWN WITH CURRENT LIMIT','左 P 阳极、右 N 阴极，阴极接较高电势。外部串联电阻限制反向电流。',['低反偏','接近击穿','击穿稳压','减小电源','退出击穿'],[
['反偏但未击穿','耗尽层支撑反向电压，电流很小。稳压二极管依然是 PN 结。','阴极 K 为正，阳极 A 为负。'],
['结内电场增强','反向电压升高，结内电场增强，接近器件的击穿工作区。','不是所有稳压管都靠同一种微观机制。'],
['反向电流明显增加','可由隧穿、雪崩或二者共同造成击穿；在规定电流区间，电流明显改变时电压仅相对小幅改变。','本图仅画反向载流子收集，不把两种击穿机制混为一幅微观碰撞图。'],
['反向电流减小','减小输入电源后，串联电阻电流下降。低于稳压工作区时，稳定电压的效果变差。','稳压不是无限钳住任意电源，必须满足电流及功耗范围。'],
['回到微小漏电区','反向电压降低到击穿以下，恢复小电流状态；额定范围内的击穿可重复工作。','离开击穿不等于 PN 结消失或永久损坏。']],
'仅讨论有串联限流、额定功耗内的反向工作。','PZ = VZ·IZ；IZ 由外部限流网络决定','击穿电压随电流和温度变化；低压常以隧穿为主，高压常以雪崩为主，不能一概而论。','基准、限幅、过压钳位'),
led:make('LED / 发光二极管','INJECTION → RADIATIVE RECOMBINATION','以直接带隙材料的 PN 发光有源区为模型；电子与空穴注入后复合，部分能量以光子释放。',['未正偏','载流子注入','复合发光','撤去驱动','发光停止'],[
['没有持续注入','未施加足够正向驱动时，没有显著的电致发光。','左 P 阳极，右 N 阴极；不是灯丝加热。'],
['电子和空穴进入有源区','正向偏置降低势垒，使电子由 N 侧、空穴由 P 侧进入发光区域。','蓝色电子与橙色空穴向有源区靠近。'],
['辐射复合释放光子','电子与空穴复合，部分能量变为光。也有非辐射复合和热损耗；颜色主要由材料带隙决定。','黄色波纹代表向外传播的光子，不是电荷离开芯片。'],
['注入结束，剩余载流子复合','驱动电流减小后，剩余过剩载流子继续复合，发光随之衰减。','实际响应时间取决于器件与驱动；白光荧光粉响应还可能不同。'],
['回到无明显发光','不再持续供应载流子，电致发光停止。','需要限流驱动；不默认 LED 能承受较高反向电压。']],
'正向限流驱动，不演示反向击穿。','光子能量 E = hν ≈ Eg（概念近似）','实际 LED 常为异质结／量子阱；本图为能量转换概念模型，不是所有 LED 的真实层结构。','指示、照明、光通信'),
photodiode:make('光电二极管 / 反偏 PN 模型','PHOTON → ELECTRON–HOLE PAIR','光照进入结区；以适度反偏的 PN 光电二极管为例，结电场把光生电子与空穴分离。',['暗态反偏','入射光增强','产生光电流','遮断光照','恢复暗态'],[
['有反偏，无入射光','反偏耗尽层已存在，电场方向由 N 区指向 P 区。实际器件仍有暗电流。','不能把反偏暗态画成耗尽层消失。'],
['吸收光子产生载流子','合适能量的光子被半导体吸收，产生电子—空穴对；不是每个入射光子都被吸收并收集。','光子向内，电子与空穴在吸收位置生成。'],
['电场分离并收集电荷','电子向 N 侧移动，空穴向 P 侧移动，产生从阴极到阳极的常规反向光电流。','电子向右、空穴向左，方向与正向注入相反。'],
['光源撤去，响应衰减','新光生载流子减少，已生成的载流子被收集或复合；结电容及外部电路也影响响应。','反向偏置保持存在，不等于把电源关掉。'],
['剩余暗电流','光电流回到暗态基线，耗尽层仍支撑反偏电压。','本例省略小暗电流；不表示光照停止后结内没有电场。']],
'反向偏置保持、低于击穿；PN 模型也适用于理解 PIN 的收集原理。','Iph ≈ Rλ·Popt（在线性响应范围）','光也可能在耗尽区外被吸收，载流子扩散进入收集区；本图仅强调结区产生与分离。','光传感、光通信、测光'),
scr:make('SCR / 普通单向晶闸管','PNPN → REGENERATIVE LATCH','沿主电流方向为 P–N–P–N 四层，门极接近阴极的 P 层。以外部电路控制电流、完成换流。',['正向阻断','门极触发','建立自锁','撤门极仍导通','外部换流关断'],[
['正向电压，尚未触发','A 相对 K 为正，中央结反偏并支撑正向阻断电压；未达到击穿触发条件。','并非四层都是同向导通的 PN 结。'],
['门极注入启动再生','正的门极电流向阴极侧 P 层注入，内部等效 PNP 与 NPN 的相互作用形成再生正反馈。','门极只需启动过程，但脉冲需满足器件触发要求。'],
['主电流达到锁定条件','若阳极电流在触发期间达到锁定电流条件，内部再生维持导电。主电流由外部负载限制。','门极不负责持续供应整个阳极电流。'],
['撤去门极，仍然导通','普通 SCR 已锁定，且阳极电流高于维持电流时，撤去门极电流不能关断。','此处图仍保持导通，避免把 SCR 当成 MOS 管。'],
['电流降至维持值以下并清荷','外部换流使阳极电流降到维持电流以下，并留足器件恢复时间，清除存储电荷后恢复阻断。','关断依赖主电路条件；不是门极发一个“关”信号。']],
'普通 SCR；外部换流关断，不适用于 GTO 等可关断晶闸管。','触发需满足锁定条件；关断需 IA < IH 且恢复完成','PNPN 为概念切片；不展示全部载流子注入细节。锁定电流 IL 与维持电流 IH 含义不同。','可控整流、调功、保护'),
opamp:make('运算放大器 / 电压跟随器','DIFFERENTIAL GAIN + NEGATIVE FEEDBACK','这是内部功能结构图，不冒充芯片剖面：差分输入级 → 高增益级 → 输出级。输出直接反馈到反相输入，双电源持续供电。',['输入为零','输入向上阶跃','反馈建立','输入回到零','重新平衡'],[
['闭环处于平衡','在输入与输出范围内，反馈使反相端接近同相端。此处输入为零，输出近零；放大器仍通电。','蓝色是信号路径，橙色是反馈；不是电子穿过几个盒子的轨迹。'],
['差分误差驱动输出','同相端输入升高，瞬间出现 V+ − V− 的差，差分级和增益级推动输出升高。','输出能量来自电源，输入信号只控制输出。'],
['负反馈使误差减小','输出升高并反馈到反相端，缩小输入差。在稳定线性工作条件下，电压跟随器输出接近输入。','V+ ≈ V− 是反馈结果，不是两个输入端被短接。'],
['输入回零，输出跟随下降','输入降低后误差变负，输出级把输出拉低；带宽、压摆率和负载影响过渡过程。','“回零”不是断电，电源轨始终存在。'],
['重新接近平衡','输出回到近零，仍存在失调、偏置电流和噪声。实际不能把输入差当作严格为零。','没有负反馈或超出范围时，虚短近似不成立。']],
'选择单位增益稳定的电压反馈运放；工作点在输入共模、输出摆幅和负载允许范围内。','Vout = Aol·(V+ − V−)；闭环跟随器 Vout ≈ Vin','通用功能图不是某一型号的晶体管级电路；省略补偿细节，不保证任意运放／负载都稳定。','缓冲、放大、有源滤波')
};
const extraKeys=Object.keys(extra);
const nav=document.querySelector('.switch');
extraKeys.forEach((key,i)=>{const b=document.createElement('button');b.dataset.device=key;b.setAttribute('aria-pressed','false');b.textContent=String(i+4).padStart(2,'0')+' / '+extra[key].name.split(' / ')[0];nav.append(b);});
// Additional explanations remain beside the specimen; the original BJT/MOS/IGBT
// material below is explicitly retained as a dedicated semiconductor chapter.
const chapter=document.querySelector('.grid').parentElement;
chapter.querySelector('.eyebrow').textContent='晶体管专题 / 原有三种器件的补充说明';
document.querySelector('.caution h3').textContent='三种晶体管剖面的模型边界';
const sources=document.querySelector('main > section:last-child');
const moreSources=document.createElement('p');moreSources.innerHTML='<a href="https://www.ia.omron.com/support/guide/36/introduction.html">OMRON · 电磁继电器</a> · <a href="https://www.hamamatsu.com/eu/en/news/featured-products_and_technologies/2024/photodiodes-exposed-unlocking-the-characteristics-of-these-crucial-sensors.html">Hamamatsu · 光电二极管</a> · <a href="https://www.st.com.cn/resource/en/application_note/an4607-basics-on-the-thyristor-scr-structure-and-its-application-stmicroelectronics.pdf">ST · SCR 结构及触发</a> · <a href="https://corporate.murata.com/en-global/technology/techmag/metamorphosis19/appnote/01">Murata · 石英厚度剪切模态</a> · <a href="https://www.ti.com/lit/an/sboa092b/sboa092b.pdf">TI · 运放与负反馈</a> · <a href="https://toshiba.semicon-storage.com/ap-en/semiconductor/knowledge/faq/diode/what-are-the-characteristics-zener-voltage.html">Toshiba · 稳压二极管</a>';sources.append(moreSources);
const study=document.createElement('section');study.id='component-notes';study.className='caution';study.innerHTML='<h3 id="extra-title"></h3><p id="extra-formula" class="mono"></p><p id="extra-caveat" class="note"></p><p id="extra-uses" class="note"></p>';
document.querySelector('.controls').after(study);study.hidden=true;
const legendOriginal=document.querySelector('.legend').innerHTML;
const stageOriginal=[...document.querySelectorAll('[data-step]')].map(x=>x.textContent);
const conditionTitle=$('electrical').previousElementSibling;
const processTitle=document.querySelector('label[for=timeline]');
const standardFigure=document.querySelector('.figtop').lastElementChild;
function resetLabels(){study.hidden=true;document.querySelector('.legend').innerHTML=legendOriginal;conditionTitle.textContent='驱动与主电流';processTitle.textContent='导通 → 稳态 → 撤去驱动 → 关断';standardFigure.textContent='实体切片 / 示意剖面，非按比例';document.querySelectorAll('[data-step]').forEach((b,i)=>{b.textContent=stageOriginal[i];b.dataset.step=[0,25,48,72,100][i];});}
const stroke=(d,c='#a8bdc8',w=2,extraAttrs='')=>'<path d="'+d+'" fill="none" stroke="'+c+'" stroke-width="'+w+'" '+extraAttrs+'/>';
const circ=(x,y,r,c,attrs='')=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+c+'" '+attrs+'/>';
const sign=(x,y,s,c)=>circ(x,y,7,c)+label(x-4,y+4,s,'charge-label');
const fieldArrow=(x,y,toX,toY,c)=>{const len=Math.hypot(toX-x,toY-y)||1,ux=(toX-x)/len,uy=(toY-y)/len;return stroke('M'+x+' '+y+'L'+toX+' '+toY,c,2)+stroke('M'+(toX-6*ux+4*uy)+' '+(toY-6*uy-4*ux)+'L'+toX+' '+toY+'L'+(toX-6*ux-4*uy)+' '+(toY-6*uy+4*ux),c,2);};
const addStyle=document.createElement('style');addStyle.textContent='.charge-label{fill:#16313c;font:bold 13px monospace}.legend{min-height:38px}.extra-category{color:var(--muted)}#component-notes[hidden]{display:none}#component-notes{margin-bottom:40px}.switch button{padding:8px 13px;font-size:13px}.light .svg-small{fill:#b5c7d0}.svg-small{paint-order:stroke;stroke:#1c2e38;stroke-width:2px}';document.head.append(addStyle);
function extraModel(kind,t){const p=phase(t),up=clamp((t-10)/28),down=clamp((100-t)/35);let level=t<10?0:t<38?up:t<65?1:down;if(kind==='scr')level=t<10?0:t<38?up:t<97?1:0;if(kind==='transformer')return {p:t===0?0:t<24?1:t<=26?2:t<99?3:4,level:1,flux:Math.sin(t/100*Math.PI*2),voltage:Math.cos(t/100*Math.PI*2)};if(kind==='opamp')level=t<10?0:t<38?1-Math.exp(-(t-10)/7):t<65?1:Math.exp(-(t-65)/7);return {p,level};}
window.componentModel=extraModel;
function extraSetup(){const d=extra[type];study.hidden=false;$('extra-title').textContent=d.name+' · 模型边界';$('extra-formula').textContent=d.formula;$('extra-caveat').textContent=d.caveat;$('extra-uses').textContent='常见用途：'+d.uses;$('deviceName').textContent=d.name;$('deviceSub').textContent=d.sub;$('architecture').textContent=d.architecture;$('figure').textContent='FIG '+String(extraKeys.indexOf(type)+4).padStart(2,'0');$('svgtitle').textContent=d.name+'工作原理';$('svgdesc').textContent=d.architecture;conditionTitle.textContent='外部条件与方向';processTitle.textContent=d.stages.join(' → ');standardFigure.textContent=type==='opamp'?'功能结构 / 非芯片物理剖面':'内部结构 / 示意图，非按比例';document.querySelectorAll('[data-step]').forEach((b,i)=>{b.textContent=(i+1)+' / '+d.stages[i];b.dataset.step=(type==='transformer'?[0,12.5,25,62.5,100]:[0,25,48,72,100])[i];});for(const id of ['structure','depletion','channel','tracks','population','particles','labels'])$(id).innerHTML='';extraRender();}
function extraRender(){const d=extra[type],m=extraModel(type,time),p=m.p,a=m.level;const st=d.steps[p];$('phase').textContent='STAGE 0'+(p+1)+' / 05';$('phaseName').textContent=st[0];$('explanation').textContent=st[1];$('look').textContent=st[2];$('electrical').textContent=d.electrical;$('readout').textContent=d.stages[p];$('timeline').value=time;$('timeValue').textContent=Math.round(time)+'%';document.querySelectorAll('[data-step]').forEach((b,i)=>b.setAttribute('aria-pressed',String(p===i)));let s='',v='',l='',legend='';const e='#86e0f0',h='#ffc38e',g='#cce9a3';
if(['diode','zener','led','photodiode'].includes(type)){
 s=block(165,188,215,158,'#795a48')+block(380,188,215,158,'#335f70')+rect(142,237,23,55,'url(#metal)')+rect(595,237,23,55,'url(#metal)');l=label(210,225,'P 区 / 阳极 A')+label(420,225,'N 区 / 阴极 K');
 const reverse=type==='zener'||type==='photodiode'||type==='diode'&&p>=3;
 const dep=type==='diode'?(reverse?25+40*(1-a):35-25*a):type==='led'?35-25*a:type==='zener'?35+10*a:55;
 v+=rect(380-dep,188,dep*2,158,'url(#hatch)');
 l+=label(245,160,reverse?'A −             外加反向偏置             K +':p===0?'零外加偏置 / 内建势垒仍存在':'A +             外加正向偏置             K −','svg-small');
 const flow=type==='diode'&&p===3?a: type==='diode'&&p===4?0:a;
 if(type==='photodiode'||type==='zener'){
  for(let i=0;i<7;i++){const u=(i/7+time*.03)%1;v+='<g opacity="'+flow+'">'+sign(380+u*184,266,'−',e)+sign(380-u*184,300,'+',h)+'</g>';}
  if(type==='photodiode'){v+='<g opacity="'+a+'">'+stroke('M340 95l20 18l-10 18l20 18l-9 18l19 22','#f5db7e',3)+label(390,140,'入射光子','svg-small')+'</g>';l+=label(220,326,'空穴 ←      内建电场 N → P      → 电子','svg-small');}
  else l+=label(223,326,'反向电流 K → A · 外部串联 R 限流','svg-small');
 }else{
  const recovery=type==='diode'&&p===3;
  for(let i=0;i<7;i++){const u=(i/7+time*.03)%1;const ex=recovery?220+u*330:type==='led'?560-u*180:560-u*350,hx=recovery?550-u*330:type==='led'?200+u*180:200+u*350;v+='<g opacity="'+flow+'">'+sign(ex,type==='led'?266+6*u:266,'−',e)+sign(hx,type==='led'?300-28*u:300,'+',h)+'</g>';}
  if(type==='led'){v+='<g opacity="'+a+'">'+circ(380,272,16,'#fae59d','opacity=".6"')+stroke('M380 260l18 -14l-4 -18l18 -14l-4 -18l18 -14','#f5db7e',3)+label(430,157,'出射光子','svg-small')+'</g>';l+=label(225,326,'有源区复合发光 · 外部限流','svg-small');}
  else l+=label(212,326,recovery?'反偏清除注入电荷 · 恢复后阻断':'电子 N → P；空穴 P → N','svg-small');
 }
 legend='蓝色 −：电子；橙色 +：空穴；斜线：耗尽区'+(type.includes('diode')||type==='led'?'；黄色波纹：光（有光时）':'');
}else if(type==='resistor'){
 s=block(165,240,170,72,'#475d64')+rect(165,240,170,10,'#a17d5d')+rect(148,248,17,52,'url(#metal)')+rect(335,248,17,52,'url(#metal)')+rect(385,205,210,140,'#20343f','rx="5" stroke="#a8bdc8"');l=label(170,226,'金属电阻膜')+label(177,335,'陶瓷基体')+label(390,191,'膜层微观放大窗')+label(385,365,'电子在膜中，不在陶瓷中','svg-small')+label(180,155,p>0&&p<3?'左端 −       电场 ←       右端 +':'无外加电压','svg-small');
 const heat=p===0?0:p===1?a*.5:p===2?1:p===3?a:.03;
 for(let i=0;i<24;i++){const x=405+(i%6)*33,y=227+Math.floor(i/6)*30;v+=circ(x+Math.sin(time*1.2+i)*heat*2.5,y+Math.cos(time+i)*heat*2.5,4,'#ffc38e');}
 for(let i=0;i<12;i++){const x=400+((i*17+(p===1||p===2?time*9:0))%180),y=235+(i%3)*40+Math.sin(i+time)*4;v+=sign(x,y,'−',e);}
 l+=label(174,360,'薄膜结构 / 右侧仅放大膜层','svg-small');legend='右侧蓝色 −：电子；橙色点：膜层晶格（夸张振动）';
}else if(type==='capacitor'){
 s=block(270,165,30,190,'#6d8996')+block(460,165,30,190,'#6d8996')+rect(302,166,156,189,'#547064','opacity=".55"');l=label(300,150,'绝缘介质')+label(206,195,'左极板')+label(505,195,'右极板');
 const q=time<10?0:time<38?1-Math.exp(-(time-10)/7):time<65?1:Math.exp(-(time-65)/7);const charge=p===4?0:q;
 for(let i=0;i<7;i++)v+='<g opacity="'+charge+'">'+sign(285,184+i*24,'+',h)+sign(475,184+i*24,'−',e)+'</g>';
 for(let i=0;i<4;i++)v+='<g opacity="'+charge+'">'+fieldArrow(318,210+i*33,440,210+i*33,g)+'</g>';
 s+=stroke('M270 260H210V365H550V260H490','#9db3be',3);s+=rect(310,354,70,22,'#384e58','stroke="#a8bdc8"');s+=rect(417,351,82,28,'#20343f','rx="4"');l+=label(324,350,'外部 R','svg-small')+label(425,371,p<3?'电源接入':'负载回路','svg-small');l+=label(300,405,'电子不穿过介质','svg-small');
 if(p===1||p===3)v+=fieldArrow(p===1?390:270,365,p===1?410:250,365,e);
 legend='极板 +/−：净电荷；绿箭头：电场；底部蓝箭头：外部电子流';
}else if(type==='inductor'||type==='transformer'||type==='relay'){
 if(type==='transformer'){
  s=block(215,160,330,190,'#4c626b')+rect(283,210,194,90,'#192d36','stroke="#a3b6bd"');
  for(let j=0;j<2;j++)for(let i=0;i<(j?6:12);i++){const y=190+i*(j?23:11.5);s+=stroke('M'+(j?490:224)+' '+y+'q-16 -8 -16 3v8q0 10 16 5h38q16 -2 16 -11t-16 -10Z','#c79a70',5);}
  const flux=m.flux,volt=m.voltage;v+=stroke('M251 192H510V323H251Z',g,3,'opacity="'+(.15+.8*Math.abs(flux))+'"');v+=fieldArrow(flux>=0?335:405,192,flux>=0?405:335,192,g);l=label(174,144,'原边 N₁ = 12')+label(455,144,'副边 N₂ = 6')+label(286,255,'相互绝缘')+label(290,281,'铁芯磁通 Φ')+label(160,385,'交流源 → 原边     副边 → 电阻负载','svg-small');l+=label(218,111,'Φ = '+flux.toFixed(2)+'     dΦ/dt ∝ '+volt.toFixed(2),'svg-small');legend='绿色闭合线：磁通；箭头：磁通正负方向；匝数为示例';
 }else{
  s=block(224,240,310,54,'#4c626b');for(let i=0;i<13;i++)s+=stroke('M'+(245+i*20)+' 224q-13 -9 -13 4v69q0 14 12 8l12 -9v-67q0 -11 -11 -5Z','#c79a70',5);
  const coil=type==='relay'?a:a;v+=stroke('M220 267H535Q650 270 555 320Q380 410 215 320Q120 270 220 267',g,2,'opacity="'+coil+'"');if(coil>.02)v+=fieldArrow(348,267,410,267,g);
  if(type==='relay'){
   s+=block(216,326,50,39,'#4c626b');v+='<g transform="rotate('+(-12*(1-a))+' 242 206)">'+rect(242,197,320,14,'url(#metal)')+rect(544,211,8,15,'url(#metal)')+circ(548,233,7,'#d5cdb5')+'</g>';s+=rect(537,240,21,11,'#b6b3a4');l=label(265,180,'活动衔铁 / 弹簧复位')+label(540,277,'常开触点')+label(280,345,'线圈与铁芯')+label(185,110,'线圈电路 ≠ 触点负载电路','svg-small');v+=stroke('M255 185l8 -12l8 24l8 -24l8 24l8 -12','#b4c3c9',2);l+=label(445,316,a>.98?'触点：闭合':'触点：分离','svg-small');
  }else{l=label(286,190,'连续绝缘铜线绕组')+label(264,345,'B 随电流建立与衰减')+label(193,120,p===3?'电源断开；二极管 + R 闭路续流':'外部供电 / 串联 R 限流','svg-small');v+='<g opacity="'+a+'">'+fieldArrow(192,359,260,359,e)+'</g>';l+=label(279,363,p===3?'i 保持原方向；vL 反向':'常规电流方向 i','svg-small');}
  legend='铜色：绕线；绿色：磁场示意（不是电流轨迹）';
 }
}else if(type==='crystal'){
 const amp=p===0||p===4?0:a;const shift=Math.sin(time*.9)*amp*11;s='<path d="M'+(235+shift)+' 215H'+(525+shift)+'L525 315H235Z" fill="#64818b" stroke="#bad2dc66"/>';v='<g transform="translate('+shift+' 0)">'+block(235,190,290,25,'#a4b8bb')+rect(250,185,260,5,'#869ea9')+'</g>';s+=rect(250,315,260,6,'#869ea9');l=label(260,166,'上表面电极')+label(258,349,'下表面电极')+label(290,270,'石英薄片')+label(185,119,'厚度剪切形变 · 振幅大幅夸张','svg-small');v+='<g opacity="'+amp+'">'+fieldArrow(290,232,340,232,g)+fieldArrow(465,296,415,296,g)+'</g>';legend='上下片层相对横移：剪切模态；金属面：电极';
}else if(type==='scr'){
 const cols=['#795a48','#335f70','#795a48','#335f70'];for(let i=0;i<4;i++)s+=block(175+i*100,193,100,153,cols[i]);l=label(145,163,'A 阳极 +')+label(520,163,'K 阴极 −')+label(392,160,'G 门极');s+=rect(408,167,30,26,'url(#metal)');for(let i=0;i<4;i++)l+=label(216+i*100,276,i%2?'N':'P');
 if(p===0||p===4)v+=rect(362,193,25,153,'url(#hatch)');else{for(let i=0;i<12;i++){const x=190+((i*31+time*10)%365);v+=circ(x,305,4,g);}if(p===1)v+=fieldArrow(423,173,423,221,h);}
 l+=label(195,370,p===3?'IG = 0，但 IA > IH：保持导通':p===4?'外部使 IA < IH，并留足恢复时间':'常规主电流：A → K','svg-small');legend='绿色点：常规主电流示意；橙色箭头：门极注入；斜线：阻断结';
}else if(type==='opamp'){
 s=block(165,195,430,150,'#304954');const names=['差分输入级','高增益级','输出级'];for(let i=0;i<3;i++){s+=rect(185+i*135,235,115,55,'#4d626b','rx="5" stroke="#adc0c8"');l+=label(193+i*135,265,names[i]);if(i<2)s+=fieldArrow(301+i*135,260,317+i*135,260,e);}
 s+=stroke('M125 245H185M125 283H185M570 260H625V323H140V283',h,2);s+=stroke('M380 155V195M380 345V360','#a9bdc9',2);l+=label(117,232,'Vin → +')+label(152,302,'−')+label(558,237,'Vout')+label(368,143,'VCC+')+label(362,377,'VCC−')+label(224,319,'负反馈：Vout 回到反相端','svg-small');l+=label(182,115,'功能结构图 / 并非芯片物理剖面','svg-small');v+=label(210,220,'Vin: '+(p===0||p>=3?'0':'↑')+'       Vout: '+a.toFixed(2)+'（归一化）','svg-small');legend='蓝色箭头：信号处理；橙色线：负反馈；上下端：持续供电';
}
$('structure').innerHTML=s;$('channel').innerHTML=v;$('labels').innerHTML=l;document.querySelector('.legend').textContent=legend;
}
