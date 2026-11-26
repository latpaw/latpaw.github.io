/* ==========================================================================
   Civilization Migrations / Influence Chains & Counter-Intuitive Facts
   ========================================================================== */

window.HISTORY_FLOWS = [
  {
    id: 'xiongnu_domino',
    name: '匈奴西迁与欧亚多米诺',
    shortName: '匈奴西迁脉络',
    color: '#d9483b',
    summary: '一次源自漠北草原与大汉王朝的百年博弈，意外触发横贯整个欧亚大陆的连锁反应：南匈奴内附中原引出五胡十六国，北匈奴西迁三百年后以“匈人（Huns）”之名压垮日耳曼诸部，最终加速西罗马帝国灭亡！',
    relatedEmpires: ['xiongnu', 'west_han', 'east_han', 'kushan_sogdia', 'sixteen_north_dynasties', 'roman_empire', 'west_rome'],
    steps: [
      {
        year: -119, col: 7.5,
        title: '汉武帝漠北决战（前119）',
        desc: '卫青、霍去病深入大漠封狼居胥，“匈奴远遁，而漠南无王庭”；同时西逐大月氏至中亚，催生后来的贵霜帝国。',
        empireId: 'west_han'
      },
      {
        year: 48, col: 7.5,
        title: '匈奴正式南北分裂（48年）',
        desc: '南匈奴呼韩邪二世内附东汉迁居并州；北匈奴继续在漠北与东汉、鲜卑激战。',
        empireId: 'xiongnu'
      },
      {
        year: 89, col: 7.45,
        title: '窦宪燕然勒功·北匈奴西迁（89—155）',
        desc: '东汉联合南匈奴与鲜卑重创北匈奴，北匈奴残部越过阿尔泰山远迁中亚康居、锡尔河流域，彻底退出东亚舞台。',
        empireId: 'east_han'
      },
      {
        year: 304, col: 8.28,
        title: '分支A：南匈奴刘渊建汉赵（304）',
        desc: '内迁中原两百余年的南匈奴贵族刘渊趁西晋八王之乱起兵，拉开了中国长达135年的“五胡十六国”与衣冠南渡序幕。',
        empireId: 'sixteen_north_dynasties',
        branchFromStep: 1
      },
      {
        year: 374, col: 2.8,
        title: '分支B：匈人跨伏尔加河压垮哥特（374）',
        desc: '西迁中亚并融合沿途草原部落的匈人（Huns）越过伏尔加河，击溃阿兰人与东哥特，逼迫西哥特人逃入罗马境内，引爆欧洲民族大迁徙！',
        empireId: 'roman_empire',
        branchFromStep: 2
      },
      {
        year: 451, col: 1.75,
        title: '阿提拉横扫欧洲与西罗马覆亡（451—476）',
        desc: '“上帝之鞭”阿提拉直逼罗马与高卢，蛮族大迁徙浪潮彻底冲垮西罗马边防，476年西罗马灭亡，西欧进入中世纪！',
        empireId: 'west_rome',
        branchFromStep: 4
      }
    ]
  },
  {
    id: 'indo_european',
    name: '印欧语系大扩散（雅利安南下与西进）',
    shortName: '印欧语系迁徙',
    color: '#c98229',
    summary: '公元前3000—前1200年，驯化马匹并发明战车的草原印欧人向西、向南持续扩散，演变为希腊、拉丁、凯尔特、日耳曼、斯拉夫、波斯与印度雅利安人——今天英语、法语、俄语、波斯语与印地语/梵语竟都是同一语系远亲！',
    relatedEmpires: ['indo_european_scythian', 'celts_gaul', 'classical_greece', 'babylon_hittite', 'elam_media', 'vedic_mahajanapadas'],
    steps: [
      { year: -2800, col: 7.4, title: '黑海—里海草原驯马起源', desc: '颜那亚文化率先规模化使用马匹与车轮，获得前所未有的机动优势。', empireId: 'indo_european_scythian' },
      { year: -1800, col: 4.5, title: '赫梯人入主安纳托利亚', desc: '一支印欧人进入小亚细亚建立赫梯帝国，率先发展冶铁技术。', empireId: 'babylon_hittite', branchFromStep: 0 },
      { year: -1500, col: 2.5, title: '迈锡尼希腊与欧洲分支成形', desc: '印欧语系西进成为古希腊人、凯尔特人、意大利拉丁人与日耳曼人的共同语言源头。', empireId: 'minoan_mycenaean', branchFromStep: 0 },
      { year: -1500, col: 5.5, title: '米底与波斯人进入伊朗高原', desc: '印度—伊朗语支南下高原，“伊朗（Iran）”国名正源于“雅利安（Aryan）”。', empireId: 'elam_media', branchFromStep: 0 },
      { year: -1400, col: 6.5, title: '雅利安人越兴都库什山入印度', desc: '带来梵语与《吠陀》经典，开启印度吠陀时代并深刻塑造婆罗门教与种姓体系。', empireId: 'vedic_mahajanapadas', branchFromStep: 3 }
    ]
  },
  {
    id: 'buddhism_silkroad',
    name: '佛教东传与丝绸之路技术西传',
    shortName: '丝路与佛教传播',
    color: '#9c59b8',
    summary: '欧亚大陆双向文明动脉：佛教从印度发端，经阿富汗贵霜（融希腊雕塑创犍陀罗佛像）沿河西走廊东传中国并辐射日韩；同时中国的丝绸、造纸、印刷、指南针与火药反向西传彻底改变了欧洲！',
    relatedEmpires: ['vedic_mahajanapadas', 'maurya', 'kushan_sogdia', 'east_han', 'tang', 'heian_goryeo_shogun', 'arab_caliphate', 'hre_west_eu_medieval'],
    steps: [
      { year: -250, col: 6.5, title: '阿育王弘法（前3世纪）', desc: '孔雀帝国阿育王派使团向斯里兰卡（南传）与西北印度/中亚（北传）广传佛法。', empireId: 'maurya' },
      { year: 120, col: 7.25, title: '贵霜犍陀罗融合希腊艺术', desc: '月氏建立的贵霜帝国让佛教大乘化，并借亚历山大遗留的希腊雕塑首次造出具象佛像。', empireId: 'kushan_sogdia' },
      { year: 68, col: 8.4, title: '东汉白马寺与魏晋唐大盛', desc: '佛教经西域入洛阳长安，鸠摩罗什、玄奘译经，最终中国化诞生禅宗。', empireId: 'east_han' },
      { year: 650, col: 9.28, title: '遣唐使东传日韩', desc: '朝鲜三国与日本遣唐使、鉴真东渡将汉字、律令与佛教完整植入东北亚。', empireId: 'heian_goryeo_shogun' },
      { year: 751, col: 7.2, title: '反向西传：怛罗斯与造纸术入阿拉伯', desc: '751年唐与阿拔斯交锋后，中国造纸工匠在撒马尔罕建纸坊，纸张经巴格达、埃及传入西班牙与西欧！', empireId: 'arab_caliphate', branchFromStep: 2 },
      { year: 1250, col: 1.6, title: '四大发明反哺欧洲文艺复兴与大航海', desc: '纸张、罗盘、火药与印刷概念西传欧洲，最终催生古腾堡印刷术、帆船火炮与现代世界。', empireId: 'hre_west_eu_medieval', branchFromStep: 4 }
    ]
  },
  {
    id: 'turkic_west',
    name: '突厥西迁：从阿尔泰山到伊斯坦布尔',
    shortName: '突厥西迁脉络',
    color: '#2c8a7a',
    summary: '公元6世纪发源于蒙古高原与阿尔泰山的突厥人，历经与隋唐百年博弈、西迁中亚、皈依伊斯兰教，最终塞尔柱与奥斯曼突厥进入小亚细亚并灭亡拜占庭，跨越六千公里改变了欧亚民族版图！',
    relatedEmpires: ['gokturk_uyghur', 'tang', 'arab_caliphate', 'byzantine', 'ottoman', 'chola_medieval_india'],
    steps: [
      { year: 552, col: 7.6, title: '突厥灭柔然称霸蒙古高原（552）', desc: '原为柔然锻铁奴部的突厥崛起，建立横跨蒙古至黑海的草原大汗国。', empireId: 'gokturk_uyghur' },
      { year: 657, col: 7.25, title: '唐破东西突厥·突厥大举西移（7—8世纪）', desc: '唐军灭东、西突厥，后回鹘亦于840年西迁，大量突厥语部落进入中亚河中与草原西段。', empireId: 'tang' },
      { year: 960, col: 7.2, title: '中亚突厥伊斯兰化（10世纪）', desc: '喀喇汗国与乌古斯突厥接受伊斯兰教，成为伊斯兰世界最有力的军事卫士（马穆鲁克/加兹尼/塞尔柱）。', empireId: 'gokturk_uyghur' },
      { year: 1071, col: 4.5, title: '塞尔柱突厥入主巴格达与安纳托利亚', desc: '1071年曼齐刻尔特战役大破拜占庭，小亚细亚开始全面突厥化，同时另一支突厥南下建印度德里苏丹国。', empireId: 'byzantine' },
      { year: 1453, col: 3.3, title: '奥斯曼攻陷君士坦丁堡（1453）', desc: '一支突厥边疆公国崛起为跨洲奥斯曼帝国，终结千年拜占庭，成为现代土耳其的直接前身！', empireId: 'ottoman' }
    ]
  },
  {
    id: 'mongol_link',
    name: '蒙古西征与欧亚大联通（蒙古和平）',
    shortName: '蒙古西征与联通',
    color: '#b8761c',
    summary: '13世纪蒙古铁骑以惊人速度横扫东亚、中亚、波斯与东欧，虽伴随惨烈战火，却在四大汗国时期构建起史无前例的欧亚安全驿路，直接连接了大都（北京）、巴格达、莫斯科与威尼斯。',
    relatedEmpires: ['mongol_empire', 'song', 'arab_caliphate', 'kievan_rus', 'hre_west_eu_medieval', 'timurid_steppe'],
    steps: [
      { year: 1206, col: 7.6, title: '铁木真称成吉思汗（1206）', desc: '统一蒙古草原，建立十户百户千户军政体系。', empireId: 'mongol_empire' },
      { year: 1219, col: 7.1, title: '第一次西征灭花剌子模（1219）', desc: '因商队遇害西征中亚，打通河中与伊朗高原门户。', empireId: 'mongol_empire' },
      { year: 1240, col: 2.8, title: '拔都西征攻陷基辅·建金帐汗国', desc: '席卷东欧直至匈牙利，统治罗斯两百余年，间接塑造莫斯科集权体制。', empireId: 'kievan_rus', branchFromStep: 1 },
      { year: 1258, col: 4.6, title: '旭烈兀攻破巴格达（1258）', desc: '终结500年阿拔斯哈里发王朝，建立伊尔汗国，打通波斯与大都往来。', empireId: 'arab_caliphate', branchFromStep: 1 },
      { year: 1279, col: 8.5, title: '忽必烈定都北京·欧亚驿站贯通', desc: '灭南宋建元朝，马可波罗畅游东方，其游记点燃了欧洲寻找东方航路的梦想！', empireId: 'mongol_empire', branchFromStep: 0 }
    ]
  },
  {
    id: 'islamic_knowledge',
    name: '伊斯兰扩张与古典知识回流欧洲',
    shortName: '伊斯兰知识回流',
    color: '#2e8a57',
    summary: '鲜为人知的文明接力：西罗马灭亡后，大量古希腊科学哲学典籍在西欧失传，却被巴格达阿拉伯学者译成阿拉伯语并大幅推进，12世纪再经西班牙托莱多译回拉丁语，直接引燃了欧洲大学与文艺复兴！',
    relatedEmpires: ['classical_greece', 'arab_caliphate', 'fatimid_mamluk', 'hre_west_eu_medieval', 'spain_france_early_mod'],
    steps: [
      { year: 642, col: 3.5, title: '阿拉伯征服埃及与西亚（7世纪）', desc: '接管亚历山大城与叙利亚学术遗产，兼容希腊、波斯与印度文献。', empireId: 'arab_caliphate' },
      { year: 830, col: 4.6, title: '巴格达“智慧宫”百年翻译运动', desc: '系统翻译亚里士多德、欧几里得、托勒密与印度数学，创立代数学与实验光学。', empireId: 'arab_caliphate' },
      { year: 1000, col: 3.4, title: '开罗与西班牙科尔多瓦学术繁盛', desc: '伊斯兰西班牙拥有藏书数十万册的图书馆，与欧洲封建领地形成鲜明对比。', empireId: 'fatimid_mamluk' },
      { year: 1150, col: 1.4, title: '托莱多翻译学派反哺西欧文艺复兴', desc: '欧洲学者涌入西班牙与西西里，将阿拉伯版希腊经典与印度-阿拉伯数字译为拉丁文，直接催生中世纪大学与近代科学！', empireId: 'hre_west_eu_medieval' }
    ]
  },
  {
    id: 'columbian_exchange',
    name: '大航海与哥伦布大交换（重塑全球）',
    shortName: '大航海与白银作物',
    color: '#2970b8',
    summary: '1492年旧大陆与新大陆阔别万年重逢：美洲的玉米、番薯、马铃薯、番茄彻底消除了欧亚饥荒（助推清朝人口从1亿飙至4亿！），而秘鲁与墨西哥白银跨越太平洋汇入明清中国！',
    relatedEmpires: ['spain_france_early_mod', 'aztec', 'inca', 'colonial_americas', 'ming', 'qing', 'british_empire'],
    steps: [
      { year: 1492, col: 1.35, title: '哥伦布西航与达·伽马绕好望角（1492—1498）', desc: '奥斯曼阻断陆路后，西葡开启全球远洋航线，人类第一次进入真正的全球史。', empireId: 'spain_france_early_mod' },
      { year: 1521, col: 0.45, title: '美洲帝国覆灭与波托西银矿大开采', desc: '旧大陆天花重创美洲原住民，西班牙在墨西哥与秘鲁开采出海量白银。', empireId: 'colonial_americas' },
      { year: 1571, col: 8.5, title: '马尼拉大帆船：美洲白银涌入明清中国', desc: '“隆庆开关”后，全球约1/3到1/2的美洲白银经菲律宾换取中国丝绸与瓷器，支撑了明清白银货币体系！', empireId: 'ming', branchFromStep: 1 },
      { year: 1700, col: 8.5, title: '番薯、玉米与马铃薯引爆欧亚人口大爆炸', desc: '耐旱高产的美洲作物在清朝与欧洲普及，打破千年粮食天花板，现代人口时代由此开启。', empireId: 'qing', branchFromStep: 2 }
    ]
  }
];

window.HISTORY_FACTS = [
  {
    id: 'western_han_bce',
    tag: '公元前错觉',
    title: '西汉几乎整个王朝都在公元前！',
    shortDesc: '西汉（前202—公元8年）存续210年，其中202年在公元前，96%都在耶稣诞生之前！',
    detail: '很多人潜意识以为汉朝和欧洲中世纪或基督教时代很近，其实西汉几乎完全位于公元前：汉武帝北击匈奴、张骞通西域（前138年）时，罗马还只是共和国，凯撒还没出生，耶稣还要等140年才降生！',
    focusYear: -100,
    bandStart: -202,
    bandEnd: 8,
    highlightIds: ['west_han', 'roman_republic', 'xiongnu', 'ptolemaic_egypt'],
    recommendLinear: false
  },
  {
    id: 'cleopatra_iphone',
    tag: '时间深渊',
    title: '埃及艳后离 iPhone 比离胡夫金字塔更近！',
    shortDesc: '胡夫金字塔（前2560）→ 埃及艳后（前30）相隔2530年；埃及艳后 → 2026年仅2056年！',
    detail: '古埃及文明长达三千年，漫长到超乎直觉！当克里奥帕特拉（与汉元帝、凯撒同期）仰望吉萨大金字塔时，金字塔对她而言已经是两千五百年前的“远古遗址”——比今天我们看埃及艳后还要久远近五百年！切换“1:1线性真实”模式震撼更强。',
    focusYear: -1300,
    bandStart: -2560,
    bandEnd: -30,
    highlightIds: ['egypt_old', 'egypt_middle_new', 'ptolemaic_egypt'],
    recommendLinear: true
  },
  {
    id: 'oxford_aztec',
    tag: '错位同期',
    title: '英国牛津大学比阿兹特克和印加帝国更古老！',
    shortDesc: '牛津大学1096年已有教学（北宋哲宗时期），阿兹特克建城于1325年（元朝），印加建国于1438年（明朝）！',
    detail: '我们常把阿兹特克和印加想象成“遥远的上古文明”，其实它们非常年轻！牛津大学开课时，阿兹特克的首都还要等229年才会建城；印加帝国崛起并修筑马丘比丘时，郑和都已经七下西洋回来了！',
    focusYear: 1350,
    bandStart: 1096,
    bandEnd: 1438,
    highlightIds: ['hre_west_eu_medieval', 'aztec', 'inca', 'song', 'ming'],
    recommendLinear: false
  },
  {
    id: 'qin_archimedes',
    tag: '轴心交汇',
    title: '秦始皇统一中国时，阿基米德正在喊“尤里卡”！',
    shortDesc: '前221年秦灭六国同期，地中海正打第二次布匿战争，阿基米德（前287—前212）正研究浮力与杠杆！',
    detail: '在同一个十年里（前221—前212年）：东亚的秦始皇刚统一文字和度量衡，北非的汉尼拔正牵着战象翻越阿尔卑斯山突袭罗马，而西西里叙拉古的阿基米德正在用巨型杠杆和镜阵保卫城池！',
    focusYear: -218,
    bandStart: -225,
    bandEnd: -206,
    highlightIds: ['qin', 'roman_republic', 'carthage_kush', 'maurya'],
    recommendLinear: false
  },
  {
    id: 'shang_mammoth',
    tag: '史前重逢',
    title: '商朝建立、金字塔矗立千年时，猛犸象还没灭绝！',
    shortDesc: '北冰洋弗兰格尔岛的最后一群猛犸象活到了约公元前1650年！',
    detail: '猛犸象并不只属于冰河世纪山洞人！西伯利亚孤岛上最后一批猛犸象大约灭绝于公元前1650年——彼时埃及大金字塔已矗立了整整900年，汉谟拉比刚颁布法典，中国的夏商更替也已悄然展开！',
    focusYear: -1650,
    bandStart: -1800,
    bandEnd: -1550,
    highlightIds: ['neolithic_xia', 'shang', 'egypt_middle_new', 'babylon_hittite'],
    recommendLinear: false
  },
  {
    id: 'axial_age',
    tag: '人类奇迹',
    title: '孔子、老子、释迦牟尼、苏格拉底几乎同时出现！',
    shortDesc: '公元前6—5世纪，欧亚大陆彼此隔绝的四大文明突然同步爆发终极思想觉醒（轴心时代）。',
    detail: '没有任何互联网或通信联系，却在短短一两百年内：中国的孔子与老子、印度的释迦牟尼、希腊的苏格拉底与柏拉图、波斯的琐罗亚斯德教改革几乎同时确立了影响全人类至今的哲学与宗教基石！',
    focusYear: -500,
    bandStart: -600,
    bandEnd: -400,
    highlightIds: ['spring_warring', 'vedic_mahajanapadas', 'classical_greece', 'achaemenid_persia'],
    recommendLinear: false
  },
  {
    id: 'byzantine_ming',
    tag: '罗马长寿',
    title: '罗马帝国其实一直活到了中国明朝中期！',
    shortDesc: '公元476年灭亡的只是西罗马；东罗马（拜占庭）延续到了1453年——彼时朱棣已迁都北京，明英宗刚经历土木堡之变！',
    detail: '很多人以为罗马只属于汉朝三国时代，其实东罗马帝国自始至终以“罗马帝国”自居，从东汉三国一路活过南北朝、隋唐、五代、两宋、元朝，直到1453年明景泰四年才被奥斯曼巨炮终结！',
    focusYear: 1453,
    bandStart: 1368,
    bandEnd: 1460,
    highlightIds: ['byzantine', 'ming', 'ottoman'],
    recommendLinear: false
  },
  {
    id: 'ming_harvard_newton',
    tag: '命运分叉',
    title: '明朝灭亡那年，哈佛已建校8年、牛顿刚满1岁！',
    shortDesc: '1644年崇祯自缢、清军入关；1636年哈佛大学建校；1643年牛顿出生、英国内战爆发！',
    detail: '1640年代是东西方大分流的关键十年：中国深陷小冰河期旱灾与明清易代战火；英国爆发资产阶级革命，牛顿降生准备揭开万有引力；北美清教徒已在马萨诸塞创办了哈佛大学。',
    focusYear: 1644,
    bandStart: 1630,
    bandEnd: 1660,
    highlightIds: ['ming', 'qing', 'british_empire', 'colonial_americas'],
    recommendLinear: false
  },
  {
    id: 'kangxi_louis_peter',
    tag: '三帝同龄',
    title: '康熙、法国“太阳王”路易十四、彼得大帝是同龄人！',
    shortDesc: '路易十四(1638)、康熙(1654)、彼得大帝(1672)不仅活在同一时代，还发生了真实外交与科学交集！',
    detail: '三位塑造欧亚版图的传奇大帝竟同处一个时代：路易十四派“国王数学家”白晋来北京给康熙讲授几何与解剖学并送来金鸡纳霜治好康熙疟疾；康熙则与彼得大帝签署了《尼布楚条约》！',
    focusYear: 1689,
    bandStart: 1660,
    bandEnd: 1722,
    highlightIds: ['qing', 'spain_france_early_mod', 'russia_empire'],
    recommendLinear: false
  },
  {
    id: 'samurai_cowboy_subway',
    tag: '次元壁破',
    title: '日本武士、美国牛仔、晚清洋务与伦敦地铁居然同时存在！',
    shortDesc: '1863—1877年间，最后一个幕府武士可以坐蒸汽船去伦敦搭地铁，再发电报给正在西部策马的美国牛仔！',
    detail: '1863年伦敦开通全球第一条地下铁路；同年美国正处南北战争并即将进入西部牛仔黄金期；日本武士阶层直到1877年西南战争才彻底谢幕；中国曾国藩、李鸿章正大办江南制造总局！',
    focusYear: 1868,
    bandStart: 1860,
    bandEnd: 1880,
    highlightIds: ['modern_ne_se_asia', 'usa', 'british_empire', 'qing'],
    recommendLinear: false
  },
  {
    id: 'dark_ages_myth',
    tag: '打破偏见',
    title: '欧洲“中世纪黑暗期”，恰是唐宋与巴格达最辉煌的黄金时代！',
    shortDesc: '公元750—1200年间，长安、开封与巴格达“智慧宫”闪耀着当时全人类最高的科技与商业之光。',
    detail: '所谓“中世纪黑暗”仅针对西罗马崩溃后的西欧局部。同一时刻，盛唐长安万国来朝、巴格达发明代数学并抢救希腊典籍、北宋发明活字印刷与纸币交子、印度朱罗称雄印度洋！',
    focusYear: 950,
    bandStart: 750,
    bandEnd: 1200,
    highlightIds: ['tang', 'song', 'arab_caliphate', 'hre_west_eu_medieval', 'chola_medieval_india'],
    recommendLinear: false
  },
  {
    id: 'sumer_oracle',
    tag: '文字时差',
    title: '苏美尔楔形文字比殷墟甲骨文早了近两千年！',
    shortDesc: '苏美尔文字约前3200年，殷墟甲骨文约前1250年——对商朝人来说，苏美尔已是近两千年前的上古史！',
    detail: '我们常把“四大文明古国”放在同一画面里想象，但它们并非同一天起跑：苏美尔与古埃及在公元前3100年就已有成熟文字和大型城市，而殷墟甲骨文出现时，埃及都已经到了图坦卡蒙与拉美西斯二世的新王国晚期！',
    focusYear: -2500,
    bandStart: -3200,
    bandEnd: -1250,
    highlightIds: ['sumer_akkad', 'egypt_old', 'shang'],
    recommendLinear: true
  },
  {
    id: 'qin_hairline_modern_slice',
    tag: '尺度震撼',
    title: '打开 1:1 线性模式：人类整个工业现代史不过是最底部的薄薄一层！',
    shortDesc: '从瓦特蒸汽机(1769)到2026年仅257年，不到人类5500年文字文明史的 4.7%！',
    detail: '人类花了五千多年停留在农耕与马车时代，却在最后不到5%的时间里发明了火车、电灯、飞机、核能、登月、互联网与人工智能。点击下方或顶部的“1:1 线性真实”，亲眼感受历史尺度的震撼！',
    focusYear: 1850,
    bandStart: 1769,
    bandEnd: 2026,
    highlightIds: ['british_empire', 'usa', 'modern_china', 'germany_modern_weu'],
    recommendLinear: true
  }
];
