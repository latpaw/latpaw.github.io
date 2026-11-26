/* ==========================================================================
   World Empires, Dynasties & Civilizations Dataset (3500 BCE – 2026 CE)
   Columns:
   0: 美洲 | 1: 西欧 | 2: 地中海与东欧 | 3: 北非与尼罗河 | 4: 两河与西亚
   5: 伊朗高原 | 6: 南亚次大陆 | 7: 草原与中亚 | 8: 中华与中原 | 9: 日韩与东南亚
   ========================================================================== */

window.HISTORY_EMPIRES = [
  /* ===================== COL 0: 美洲 (Americas) ===================== */
  {
    id: 'olmec',
    name: '奥尔梅克文明',
    enName: 'Olmec Civilization',
    colStart: 0.04, colEnd: 0.96,
    startYear: -1500, endYear: -400,
    color: '#d9c69e',
    religionTags: ['古代多神'],
    capital: '特诺奇蒂特兰',
    sphere: '墨西哥湾沿岸（拉文塔、圣洛伦索）',
    summary: '中美洲“母体文明”，以巨型石雕人头像、美洲虎崇拜、橡胶球赛和早期历法著称，深刻影响了后来的玛雅与阿兹特克。',
    civilization: '最早在中美洲使用零的概念雏形、象形符号与大型祭祀金字塔平台。',
    religionDetail: '崇拜雨神、羽蛇神原型与“人虎神”，祭司阶层掌握历法与农事。',
    keyFigures: [
      { name: '拉文塔祭司王', role: '统治阶层', years: '约前900—前400', note: '组织巨石运输与祭祀中心营造' }
    ],
    periods: [
      { id: 'early', name: '圣洛伦索与拉文塔兴盛', startYear: -1500, endYear: -400, capital: '特诺奇蒂特兰', territoryDesc: '控制墨西哥湾热带低地及黑曜石贸易网。', mapRegions: ['mesoamerica'], highlights: '雕凿数十吨重的玄武岩巨型头像，奠定中美洲历法与神庙建筑传统。' }
    ]
  },
  {
    id: 'maya',
    name: '玛雅文明',
    enName: 'Maya Civilization',
    colStart: 0.04, colEnd: 0.42,
    startYear: -300, endYear: 1525,
    color: '#9ec5ab',
    religionTags: ['古代多神'],
    capital: '特诺奇蒂特兰',
    sphere: '尤卡坦半岛、危地马拉与中美洲雨林城邦',
    summary: '未曾形成单一中央帝国，而是由蒂卡尔、帕伦克、奇琴伊察等数十个城邦构成的灿烂文明，天文学与数学极度发达。',
    civilization: '发明精确的“长纪年历”与太阳历，独立发明“0”的符号，拥有美洲最成熟的象形文字系统。',
    religionDetail: '多神教，崇拜羽蛇神（库库尔坎）、玉米神与太阳神，祭祀仪式与天文周期高度绑定。',
    keyFigures: [
      { name: '巴加尔二世', role: '帕伦克国王', years: '603—683', note: '修建著名的铭文神庙，留下精美的石棺浮雕' },
      { name: '雅克·努恩·艾因', role: '蒂卡尔统治者', years: '4世纪末', note: '开启古典期玛雅城邦争霸' }
    ],
    periods: [
      { id: 'classic', name: '古典期城邦鼎盛', startYear: 250, endYear: 900, capital: '特诺奇蒂特兰', territoryDesc: '蒂卡尔、卡拉克穆尔、科潘等雨林城邦林立。', mapRegions: ['mesoamerica'], highlights: '金字塔神庙、星象观测与象形碑铭达到巅峰，约900年因干旱与战争南部城邦衰落。' },
      { id: 'postclassic', name: '后古典期（尤卡坦）', startYear: 900, endYear: 1520, capital: '特诺奇蒂特兰', territoryDesc: '重心北移至奇琴伊察与玛雅潘。', mapRegions: ['mesoamerica'], highlights: '吸收托尔特克武士文化，直到16世纪遭遇西班牙殖民者。' }
    ]
  },
  {
    id: 'aztec',
    name: '阿兹特克',
    enName: 'Aztec Empire',
    colStart: 0.42, colEnd: 0.69,
    startYear: 1325, endYear: 1521,
    color: '#d99a6c',
    religionTags: ['古代多神'],
    capital: '特诺奇蒂特兰',
    sphere: '墨西哥谷地至中美洲大部',
    summary: '建立在特斯科科湖心岛上的水上奇迹帝国，由墨西加人主导三国同盟。注意：其建城晚于英国牛津大学两百多年！',
    civilization: '奇南帕斯（浮动农田）支撑起20万以上人口的超级大都市，拥有发达的商业市场、水利堤坝与义务教育制度。',
    religionDetail: '崇拜太阳与战神维齐洛波奇特利及羽蛇神，深信宇宙需靠献祭维系运行。',
    keyFigures: [
      { name: '蒙特祖马二世', role: '末代全盛皇帝', years: '1466—1520', note: '帝国疆域极盛时遭遇西班牙科尔特斯远征军' },
      { name: '伊兹科瓦特尔', role: '奠基君主', years: '1427—1440在位', note: '缔结三国同盟，开启阿兹特克扩张' }
    ],
    periods: [
      { id: 'peak', name: '三国同盟与全盛期', startYear: 1428, endYear: 1521, capital: '特诺奇蒂特兰', territoryDesc: '统辖墨西哥中部至太平洋与墨西哥湾两岸贡赋区。', mapRegions: ['mesoamerica'], highlights: '1521年被西班牙殖民者联合周边敌对部落及天花疫情摧毁。' }
    ]
  },
  {
    id: 'inca',
    name: '印加帝国',
    enName: 'Inca Empire',
    colStart: 0.69, colEnd: 0.96,
    startYear: 1438, endYear: 1533,
    color: '#e0b86b',
    religionTags: ['古代多神'],
    capital: '库斯科',
    sphere: '安第斯山脉全境（秘鲁、厄瓜多尔、玻利维亚、智利）',
    summary: '前哥伦布时期美洲疆域最辽阔的帝国，在没有铁器、马匹和文字的条件下，用结绳记事与4万公里驿道治理千万人口。',
    civilization: '奇普（结绳记事）、精密无灰浆巨石建筑（马丘比丘）、高山梯田、冻干马铃薯技术与高效国家仓储体系。',
    religionDetail: '太阳神因蒂（Inti）为核心的国教，皇帝自称“太阳之子”。',
    keyFigures: [
      { name: '帕查库蒂', role: '帝国缔造者', years: '1438—1471在位', note: '将库斯科王国扩张为大帝国，修建马丘比丘' },
      { name: '阿塔瓦尔帕', role: '末代君主', years: '约1502—1533', note: '内战获胜后遭西班牙皮萨罗诱捕处决' }
    ],
    periods: [
      { id: 'tawantinsuyu', name: '四方帝国全盛期', startYear: 1438, endYear: 1533, capital: '库斯科', territoryDesc: '纵贯安第斯山脉南北逾4000公里。', mapRegions: ['andes'], highlights: '建立完善的驿站信使制度（查斯基），1533年被西班牙征服。' }
    ]
  },
  {
    id: 'colonial_americas',
    name: '美洲殖民时代',
    enName: 'Colonial Americas',
    colStart: 0.04, colEnd: 0.96,
    startYear: 1533, endYear: 1776,
    color: '#c9b49a',
    dashed: true,
    religionTags: ['基督教'],
    capital: '特诺奇蒂特兰',
    sphere: '西班牙新西班牙/秘鲁副王区、葡属巴西、英法北美殖民地',
    summary: '欧洲殖民者摧毁印第安帝国，波托西白银源源不断流向欧洲与明清中国，美洲作物改变全球人口格局。',
    civilization: '种植园经济、大西洋三角贸易、跨太平洋马尼拉大帆船贸易。',
    religionDetail: '天主教在拉丁美洲全面扎根，清教徒与新教塑造北美早期社会。',
    keyFigures: [
      { name: '本杰明·富兰克林', role: '北美启蒙思想家', years: '1706—1790', note: '科学家与美国建国元勋之一' }
    ],
    periods: [
      { id: 'colonial', name: '白银与种植园殖民期', startYear: 1533, endYear: 1776, capital: '特诺奇蒂特兰', territoryDesc: '西班牙、葡萄牙、英国、法国瓜分南北美洲。', mapRegions: ['north_america', 'mesoamerica', 'andes', 'south_america_east'], highlights: '美洲天花导致原住民锐减；玉米、马铃薯、番薯传遍欧亚。' }
    ]
  },
  {
    id: 'usa',
    name: '美利坚合众国与独立美洲',
    enName: 'USA & Independent Americas',
    colStart: 0.04, colEnd: 0.96,
    startYear: 1776, endYear: 2026,
    color: '#7da5d4',
    religionTags: ['基督教'],
    capital: '华盛顿',
    sphere: '北美核心及全球超级大国体系 + 拉美独立诸国',
    summary: '1776年美国独立开启现代宪政共和先河，19世纪西进扩张与二次工业革命跃居世界第一经济体，二战后成为全球主导力量。',
    civilization: '三权分立成文宪法、流水线工业、电力与航空革命、互联网与人工智能技术中心。',
    religionDetail: '新教文化底色与政教分离原则并存，拉美以天主教为主。',
    keyFigures: [
      { name: '乔治·华盛顿', role: '开国总统', years: '1732—1799', note: '领导独立战争，确立两届任期先例' },
      { name: '亚伯拉罕·林肯', role: '总统', years: '1809—1865', note: '打赢南北战争，废除奴隶制' },
      { name: '富兰克林·罗斯福', role: '总统', years: '1882—1945', note: '推行新政并领导反法西斯同盟与战后秩序建立' },
      { name: '西蒙·玻利瓦尔', role: '拉美解放者', years: '1783—1830', note: '领导南美洲多国脱离西班牙独立' }
    ],
    periods: [
      { id: 'westward', name: '立国与西进/南北战争', startYear: 1776, endYear: 1898, capital: '华盛顿', territoryDesc: '从大西洋十三州扩张至太平洋彼岸，西部牛仔时代。', mapRegions: ['north_america'], highlights: '1865年废奴，1894年工业产值跃居世界第一。' },
      { id: 'superpower', name: '世界大战与冷战超级大国', startYear: 1898, endYear: 1991, capital: '华盛顿', territoryDesc: '布雷顿森林体系与全球同盟网络。', mapRegions: ['north_america', 'mesoamerica'], highlights: '赢得二战、登月、主导信息革命，1991年冷战胜出。' },
      { id: 'contemporary', name: '全球化与AI时代', startYear: 1991, endYear: 2026, capital: '华盛顿', territoryDesc: '全球科技、金融与多极博弈核心之一。', mapRegions: ['north_america'], highlights: '互联网、移动计算与大模型浪潮重塑全球格局。' }
    ]
  },

  /* ===================== COL 1: 西欧 (Western Europe) ===================== */
  {
    id: 'celts_gaul',
    name: '凯尔特与高卢诸部',
    enName: 'Celts & Gaul',
    colStart: 1.04, colEnd: 1.96,
    startYear: -1200, endYear: -50,
    color: '#a8bfa0',
    dashed: true,
    religionTags: ['古代多神'],
    capital: '巴黎',
    sphere: '高卢（今法国）、不列颠、伊比利亚与中欧',
    summary: '铁器时代欧洲大陆最具活力的族群网络，以哈尔施塔特和拉坦诺文化闻名，精通冶铁、战车与金银工艺。',
    civilization: '精良的长铁剑与锁子甲技术，曾攻入罗马与希腊德尔菲。',
    religionDetail: '德鲁伊教（自然与橡树崇拜），口述传承知识与律法。',
    keyFigures: [
      { name: '维钦托利', role: '高卢联军统帅', years: '约前82—前46', note: '阿莱西亚战役中英勇抵抗凯撒' }
    ],
    periods: [
      { id: 'latene', name: '拉坦诺文化与高卢战争', startYear: -450, endYear: -50, capital: '巴黎', territoryDesc: '横跨英法德至多瑙河流域的部落联盟。', mapRegions: ['west_europe', 'britain', 'iberia'], highlights: '公元前58—前50年凯撒征服高卢，西欧全面罗马化。' }
    ]
  },
  {
    id: 'frankish',
    name: '法兰克王国 / 查理曼帝国',
    enName: 'Frankish & Carolingian Empire',
    colStart: 1.04, colEnd: 1.96,
    startYear: 481, endYear: 843,
    color: '#88aed0',
    religionTags: ['基督教'],
    capital: '亚琛',
    sphere: '法国、德国西部、低地国家与意大利北部',
    summary: '西罗马灭亡后西欧最强大的日耳曼王国，查理曼加冕为“罗马人的皇帝”，奠定了法、德、意三国的雏形。',
    civilization: '采邑制确立欧洲封建社会基础；“加洛林文艺复兴”抢救并抄录了大量拉丁古典文献。',
    religionDetail: '克洛维皈依罗马天主教，开启世俗王权与教皇联盟的中古欧洲格局。',
    keyFigures: [
      { name: '克洛维一世', role: '墨洛温开国君主', years: '466—511', note: '统一高卢并皈依天主教' },
      { name: '查理·马特', role: '宫相', years: '688—741', note: '732年普瓦捷战役阻挡阿拉伯帝国北进西欧' },
      { name: '查理大帝（查理曼）', role: '欧洲之父', years: '742—814', note: '800年圣诞夜由教皇加冕，一统西欧大部' }
    ],
    periods: [
      { id: 'merovingian', name: '墨洛温王朝', startYear: 481, endYear: 751, capital: '巴黎', territoryDesc: '高卢与莱茵河流域。', mapRegions: ['west_europe'], highlights: '融合罗马行省制度与日耳曼军事贵族。' },
      { id: 'carolingian', name: '查理曼帝国鼎盛', startYear: 751, endYear: 843, capital: '亚琛', territoryDesc: '横跨西欧与中欧，与唐朝、阿拔斯王朝遥相呼应。', mapRegions: ['west_europe', 'italy'], highlights: '843年《凡尔登条约》一分为三，演变为法国、德国与意大利。' }
    ]
  },
  {
    id: 'hre_west_eu_medieval',
    name: '英·法·神圣罗马与中世纪西欧',
    enName: 'Medieval England, France & HRE',
    colStart: 1.04, colEnd: 1.96,
    startYear: 843, endYear: 1492,
    color: '#9db4c8',
    religionTags: ['基督教'],
    capital: '巴黎',
    sphere: '法兰西、英格兰、神圣罗马帝国、伊比利亚、意大利城邦',
    summary: '封建割据、骑士制度、十字军东征与早期大学（博洛尼亚1088、牛津1096、巴黎）兴起的时代；后期经黑死病与文艺复兴破茧而出。',
    civilization: '哥特式大教堂、行会自治城市、英国《大宪章》（1215）、意大利银行业与文艺复兴启蒙。',
    religionDetail: '罗马天主教会达到权力顶峰，教皇与神圣罗马皇帝长期争夺叙任权。',
    keyFigures: [
      { name: '征服者威廉', role: '英格兰国王', years: '1028—1087', note: '1066年诺曼征服改写英国语言与制度' },
      { name: '腓特烈一世（红胡子）', role: '神圣罗马皇帝', years: '1122—1190', note: '德意志封建盛世代表，参与第三次十字军' },
      { name: '圣女贞德', role: '法兰西英雄', years: '1412—1431', note: '百年战争中扭转法军战局，激发民族意识' },
      { name: '但丁 / 达·芬奇', role: '文艺复兴先驱', years: '13—15世纪', note: '以人文主义打破中世纪思想禁锢' }
    ],
    periods: [
      { id: 'high_medieval', name: '封建盛期与大学诞生', startYear: 843, endYear: 1300, capital: '巴黎', territoryDesc: '封建王国林立，牛津大学(1096)与巴黎大学相继创立。', mapRegions: ['west_europe', 'britain', 'italy'], highlights: '《大宪章》、十字军东征、托马斯·阿奎那经院哲学。' },
      { id: 'renaissance', name: '黑死病、百年战争与文艺复兴', startYear: 1300, endYear: 1492, capital: '罗马', territoryDesc: '意大利城邦成为商业与艺术引擎。', mapRegions: ['west_europe', 'britain', 'italy', 'iberia'], highlights: '1450年古腾堡活字印刷术引爆知识革命，伊比利亚完成收复失地运动。' }
    ]
  },
  {
    id: 'spain_france_early_mod',
    name: '西班牙帝国 / 波旁法国',
    enName: 'Spanish Empire & Bourbon France',
    colStart: 1.04, colEnd: 1.50,
    startYear: 1492, endYear: 1815,
    color: '#d9b176',
    religionTags: ['基督教'],
    capital: '巴黎',
    sphere: '伊比利亚、低地、法兰西及海外美洲殖民帝国',
    summary: '西班牙开启首个“日不落”殖民帝国，随后路易十四将法国推向欧洲霸主，最终在法国大革命与拿破仑战争中彻底撼动欧洲旧秩序。',
    civilization: '全球白银贸易、启蒙运动（伏尔泰/卢梭/孟德斯鸠）、《人权宣言》与《拿破仑法典》。',
    religionDetail: '宗教改革引发三十年战争，最终以《威斯特伐利亚和约》（1648）确立现代主权国家体系。',
    keyFigures: [
      { name: '腓力二世', role: '西班牙国王', years: '1527—1598', note: '西班牙“无敌舰队”与全球殖民极盛时代' },
      { name: '路易十四（太阳王）', role: '法国国王', years: '1638—1715', note: '修建凡尔赛宫，与康熙、彼得大帝同龄' },
      { name: '拿破仑·波拿巴', role: '法兰西第一帝国皇帝', years: '1769—1821', note: '横扫欧洲大陆，将现代民法与民族主义播撒全欧' }
    ],
    periods: [
      { id: 'habsburg_spain', name: '西班牙黄金世纪', startYear: 1492, endYear: 1648, capital: '马德里', territoryDesc: '控制西班牙、尼德兰、南意及几乎整个中南美洲。', mapRegions: ['iberia', 'italy', 'mesoamerica', 'andes'], highlights: '麦哲伦环球航行，美洲白银涌入世界市场。' },
      { id: 'sun_king', name: '路易十四与启蒙/拿破仑', startYear: 1648, endYear: 1815, capital: '巴黎', territoryDesc: '法兰西称雄欧陆，拿破仑一度控制大半个欧洲。', mapRegions: ['west_europe', 'italy', 'iberia'], highlights: '1789年法国大革命开启现代政治纪元。' }
    ]
  },
  {
    id: 'british_empire',
    name: '大英帝国（日不落）',
    enName: 'British Empire',
    colStart: 1.50, colEnd: 1.96,
    startYear: 1558, endYear: 1947,
    color: '#e2887c',
    religionTags: ['基督教'],
    capital: '伦敦',
    sphere: '不列颠、印度、北美/加拿大、澳新、非洲纵贯线，极盛占地球陆地近1/4',
    summary: '从伊丽莎白一世击败无敌舰队起航，率先完成光荣革命与第一次工业革命，成为19世纪“世界工厂”与人类史上面积最大的帝国。',
    civilization: '议会君主立宪、蒸汽机与铁路工业革命、牛顿经典力学、达尔文进化论、全球金本位与现代金融。',
    religionDetail: '英国国教（圣公会）与清教并存，宗教宽容促进科学社团（皇家学会）蓬勃发展。',
    keyFigures: [
      { name: '伊丽莎白一世', role: '女王', years: '1533—1603', note: '击败西班牙无敌舰队，开启莎士比亚与海上崛起时代' },
      { name: '艾萨克·牛顿', role: '科学巨匠', years: '1643—1727', note: '《自然哲学的数学原理》奠定现代物理学基石' },
      { name: '詹姆斯·瓦特', role: '发明家', years: '1736—1819', note: '改良蒸汽机，引爆工业革命' },
      { name: '维多利亚女王', role: '女王', years: '1819—1901', note: '日不落帝国鼎盛期的象征' },
      { name: '温斯顿·丘吉尔', role: '首相', years: '1874—1965', note: '二战中领导英国死守反法西斯战线' }
    ],
    periods: [
      { id: 'tudor_stuart', name: '海上崛起与光荣革命', startYear: 1558, endYear: 1760, capital: '伦敦', territoryDesc: '不列颠统一，建立东印度公司与北美殖民地。', mapRegions: ['britain', 'north_america'], highlights: '1688年光荣革命与《权利法案》确立议会主权。' },
      { id: 'victorian', name: '工业革命与日不落鼎盛', startYear: 1760, endYear: 1914, capital: '伦敦', territoryDesc: '殖民地遍布五大洲，1863年建成世界首条地铁。', mapRegions: ['britain', 'india_north', 'india_south', 'egypt', 'sub_saharan_africa', 'oceania', 'north_america'], highlights: '蒸汽轮船、电报、铁路重塑全球贸易，主宰19世纪世界秩序。' },
      { id: 'decolonization', name: '两次大战与帝国解体', startYear: 1914, endYear: 1947, capital: '伦敦', territoryDesc: '两战消耗国力，1947年印度独立标志帝国落幕。', mapRegions: ['britain', 'india_north', 'egypt', 'oceania'], highlights: '转化为英联邦，霸权交棒美国。' }
    ]
  },
  {
    id: 'germany_modern_weu',
    name: '德意志·欧洲列强与欧盟',
    enName: 'Germany & Modern Western Europe / EU',
    colStart: 1.04, colEnd: 1.50,
    startYear: 1815, endYear: 2026,
    rects: [
      { colStart: 1.04, colEnd: 1.50, startYear: 1815, endYear: 1947, label: '德法意列强' },
      { colStart: 1.04, colEnd: 1.96, startYear: 1947, endYear: 2026, label: '现代西欧与欧盟' }
    ],
    color: '#7aa6c2',
    religionTags: ['基督教'],
    capital: '柏林',
    sphere: '欧洲西部与中部（德、法、英、意及欧盟27国）',
    summary: '19世纪民族国家统一与第二次工业革命中心，历经两次世界大战惨烈浩劫后，痛定思痛走向欧洲一体化与福利社会。',
    civilization: '现代化学/电气/汽车工业、相对论与量子力学诞生核心区、现代福利国家与欧盟超国家机制。',
    religionDetail: '基督教传统与现代世俗人文主义并存。',
    keyFigures: [
      { name: '奥托·冯·俾斯麦', role: '铁血宰相', years: '1815—1898', note: '1871年统一德意志，首创现代社会保险制度' },
      { name: '阿尔伯特·爱因斯坦', role: '物理学家', years: '1879—1955', note: '提出相对论，改写人类对时空的理解' },
      { name: '夏尔·戴高乐', role: '法国总统', years: '1890—1970', note: '推动法德和解与欧洲独立自主' }
    ],
    periods: [
      { id: 'imperial_ww', name: '民族国家崛起与两次世界大战', startYear: 1815, endYear: 1945, capital: '柏林', territoryDesc: '德意志帝国与欧洲列强争霸导致1914—1945大灾难。', mapRegions: ['west_europe', 'italy', 'east_europe'], highlights: '殖民体系顶峰与彻底崩塌。' },
      { id: 'eu', name: '法德和解与欧盟一体化', startYear: 1945, endYear: 2026, capital: '巴黎', territoryDesc: '欧盟单一市场与欧元区覆盖欧洲大部。', mapRegions: ['west_europe', 'iberia', 'italy', 'greece_balkans'], highlights: '实现欧洲历史上最长久的和平期。' }
    ]
  },

  /* ===================== COL 2: 地中海与东欧 (Med & E. Europe) ===================== */
  {
    id: 'minoan_mycenaean',
    name: '克里特·迈锡尼文明',
    enName: 'Minoan & Mycenaean Greece',
    colStart: 2.04, colEnd: 2.96,
    startYear: -2600, endYear: -1150,
    color: '#91c1c9',
    religionTags: ['古代多神'],
    capital: '雅典',
    sphere: '克里特岛、爱琴海与伯罗奔尼撒半岛',
    summary: '欧洲最早的青铜时代宫殿文明，孕育了荷马史诗《伊利亚特》与特洛伊战争的古老记忆，终结于青铜时代大崩溃。',
    civilization: '克诺索斯迷宫宫殿、线形文字A/B、精美的海洋壁画与青铜航海贸易。',
    religionDetail: '母神与公牛崇拜，晚期出现奥林匹斯诸神原型。',
    keyFigures: [
      { name: '阿伽门农（传说）', role: '迈锡尼国王', years: '约前1250', note: '史诗中率希腊联军远征特洛伊的统帅' }
    ],
    periods: [
      { id: 'aegean', name: '爱琴海青铜宫殿期', startYear: -2600, endYear: -1150, capital: '雅典', territoryDesc: '克里特岛至希腊本土与爱琴海诸岛。', mapRegions: ['greece_balkans'], highlights: '公元前1200年前后遭遇海上民族冲击与文明断层。' }
    ]
  },
  {
    id: 'classical_greece',
    name: '古希腊城邦',
    enName: 'Classical Greece',
    colStart: 2.48, colEnd: 2.96,
    startYear: -800, endYear: -336,
    color: '#76b5d6',
    religionTags: ['古代多神'],
    capital: '雅典',
    sphere: '希腊本土、爱琴海、小亚细亚西岸、西西里与南意',
    summary: '西方哲学、民主政治、历史学、戏剧、几何学与奥林匹克精神的摇篮，处于与春秋战国完全同步的“轴心时代”。',
    civilization: '雅典民主制、希罗多德历史学、欧几里得几何先声、帕特农神庙建筑美学。',
    religionDetail: '奥林匹斯十二主神神话体系，同时孕育出追求理性与自然法则的哲学传统。',
    keyFigures: [
      { name: '伯里克利', role: '雅典政治家', years: '前495—前429', note: '雅典民主与黄金时代的缔造者' },
      { name: '苏格拉底 / 柏拉图 / 亚里士多德', role: '希腊三贤', years: '前469—前322', note: '奠定西方哲学、逻辑学与科学分类基础' },
      { name: '希罗多德', role: '历史之父', years: '前484—前425', note: '著《历史》记录希波战争' }
    ],
    periods: [
      { id: 'archaic', name: '城邦兴起与希波战争', startYear: -800, endYear: -479, capital: '雅典', territoryDesc: '雅典、斯巴达崛起，马拉松与萨拉米斯战役击退波斯。', mapRegions: ['greece_balkans', 'italy'], highlights: '荷马史诗定型，地中海沿岸广建殖民城邦。' },
      { id: 'golden', name: '雅典黄金时代与伯罗奔尼撒战争', startYear: -479, endYear: -336, capital: '雅典', territoryDesc: '提洛同盟与伯罗奔尼撒同盟争霸。', mapRegions: ['greece_balkans'], highlights: '哲学、戏剧与雕塑极盛；内耗后被北方马其顿统一。' }
    ]
  },
  {
    id: 'alexander_empire',
    name: '亚历山大帝国（马其顿）',
    enName: 'Macedonian Empire (Alexander)',
    colStart: 2.48, colEnd: 5.96,
    startYear: -336, endYear: -301,
    rects: [
      { colStart: 2.48, colEnd: 2.96, startYear: -336, endYear: -301, label: '马其顿' },
      { colStart: 3.46, colEnd: 5.96, startYear: -330, endYear: -301, label: '亚历山大帝国（横跨亚非欧）' }
    ],
    color: '#c988c6',
    darkTextOff: true,
    zIndex: 16,
    religionTags: ['古代多神'],
    capital: '巴比伦',
    sphere: '横跨欧亚非：希腊、埃及、两河、波斯、中亚直至印度河流域',
    summary: '亚历山大大帝仅用11年便灭亡波斯、征服从多瑙河到印度河的广袤土地，开启长达300年的“希腊化时代”，让希腊雕塑直接催生了印度犍陀罗佛像！',
    civilization: '希腊语成为东地中海与西亚通用语，建亚历山大城与图书馆，打通地中海至印度文化大融合。',
    religionDetail: '推行希腊与东方神祇融合，促进跨文明宗教交流。',
    keyFigures: [
      { name: '亚历山大大帝', role: '马其顿国王', years: '前356—前323', note: '亚里士多德学生，战无不胜，32岁英年早逝' },
      { name: '腓力二世', role: '马其顿国王', years: '前382—前336', note: '创立马其顿长矛方阵，统一希腊' }
    ],
    periods: [
      { id: 'conquest', name: '东征波斯与印度河', startYear: -336, endYear: -323, capital: '巴比伦', territoryDesc: '高加米拉大破波斯，直抵印度旁遮普。', mapRegions: ['greece_balkans', 'anatolia', 'levant', 'egypt', 'mesopotamia', 'iran', 'central_asia', 'india_north'], highlights: '缔造人类史上首个横跨希腊、埃及、波斯与印度的超级帝国。' }
    ]
  },
  {
    id: 'roman_republic',
    name: '罗马共和国',
    enName: 'Roman Republic',
    colStart: 2.04, colEnd: 2.48,
    startYear: -509, endYear: -27,
    rects: [
      { colStart: 2.04, colEnd: 2.48, startYear: -509, endYear: -146, label: '罗马共和国' },
      { colStart: 2.04, colEnd: 2.96, startYear: -146, endYear: -27, label: '罗马共和国（称霸地中海）' }
    ],
    color: '#d97f73',
    religionTags: ['古代多神'],
    capital: '罗马',
    sphere: '意大利半岛扩张至西地中海、西班牙、高卢、希腊与小亚细亚',
    summary: '元老院、执政官与公民大会并立的混合政体；通过三次布匿战争摧毁迦太基称霸地中海，与中国的战国、秦、西汉几乎完全同步！',
    civilization: '《十二铜表法》开创罗马法传统、军团制度、混凝土穹顶、高架引水渠与条条大路通罗马的公路网。',
    religionDetail: '吸收希腊神话体系的罗马多神教，重视国家祭典与祖先美德。',
    keyFigures: [
      { name: '大西庇阿', role: '执政官/统帅', years: '前236—前183', note: '扎马战役击败汉尼拔，奠定罗马地中海霸权' },
      { name: '尤利乌斯·凯撒', role: '独裁官', years: '前100—前44', note: '征服高卢、改革儒略历，遇刺后终结共和' },
      { name: '西塞罗', role: '演说家/哲学家', years: '前106—前43', note: '拉丁散文与共和宪政思想巅峰' }
    ],
    periods: [
      { id: 'punic', name: '征服意大利与布匿战争', startYear: -509, endYear: -146, capital: '罗马', territoryDesc: '与迦太基血战百年，同期秦始皇统一中国、阿基米德在叙拉古。', mapRegions: ['italy', 'iberia', 'greece_balkans'], highlights: '公元前146年同时毁灭迦太基与科林斯，独霸地中海。' },
      { id: 'late_rep', name: '共和危机与凯撒时代', startYear: -146, endYear: -27, capital: '罗马', territoryDesc: '凯撒征服高卢，庞培平定东地中海，同期西汉武帝盛世。', mapRegions: ['italy', 'west_europe', 'iberia', 'greece_balkans', 'anatolia', 'levant', 'north_africa'], highlights: '内战频仍，最终由屋大维建立元首制帝国。' }
    ]
  },
  {
    id: 'roman_empire',
    name: '罗马帝国（环地中海大一统）',
    enName: 'Roman Empire',
    colStart: 1.04, colEnd: 4.46,
    startYear: -27, endYear: 395,
    color: '#c95c52',
    darkTextOff: true,
    zIndex: 15,
    religionTags: ['古代多神', '基督教'],
    capital: '罗马',
    sphere: '横跨西欧、不列颠、地中海、北非、埃及与西亚（地中海成为内湖）',
    summary: '西方古典文明的顶峰，“罗马和平”持续两百年；与大汉帝国遥隔欧亚大陆东西两端，构成人类古典时代双子星。',
    civilization: '罗马法体系、大竞技场与万神殿、城市下水道与公共浴场、212年全帝国自由民获公民权。',
    religionDetail: '早期崇拜多神与皇帝崇拜；313年《米兰敕令》基督教合法化，380年定为国教。',
    keyFigures: [
      { name: '奥古斯都（屋大维）', role: '开国皇帝', years: '前63—14', note: '终结内战，开启两百年罗马和平' },
      { name: '图拉真', role: '五贤帝之一', years: '53—117', note: '帝国疆域达到历史最大极盛' },
      { name: '马可·奥勒留', role: '哲学家皇帝', years: '121—180', note: '著《沉思录》，遣使节（大秦王安敦）抵东汉' },
      { name: '君士坦丁大帝', role: '皇帝', years: '272—337', note: '迁都君士坦丁堡，推动基督教合法化' }
    ],
    periods: [
      { id: 'pax_romana', name: '奥古斯都与五贤帝盛世', startYear: -27, endYear: 180, capital: '罗马', territoryDesc: '环绕整个地中海，北至莱茵/多瑙河与不列颠，东至两河。', mapRegions: ['west_europe', 'britain', 'iberia', 'italy', 'greece_balkans', 'north_africa', 'egypt', 'anatolia', 'levant'], highlights: '贸易繁荣、法制完备，166年罗马使团抵洛阳。' },
      { id: 'crisis_split', name: '三世纪危机与基督教国教化', startYear: 180, endYear: 395, capital: '君士坦丁堡', territoryDesc: '戴克里先四帝共治、君士坦丁建新都，395年永久分裂为东西罗马。', mapRegions: ['west_europe', 'iberia', 'italy', 'greece_balkans', 'north_africa', 'egypt', 'anatolia', 'levant'], highlights: '匈人西迁引发蛮族大举压境，基督教重塑西方精神世界。' }
    ]
  },
  {
    id: 'west_rome',
    name: '西罗马帝国',
    enName: 'Western Roman Empire',
    colStart: 1.04, colEnd: 2.04,
    startYear: 395, endYear: 476,
    color: '#d98a7c',
    religionTags: ['基督教'],
    capital: '罗马',
    sphere: '意大利、高卢、西班牙、不列颠与西属北非',
    summary: '面对匈人（阿提拉）西侵引发的日耳曼民族大迁徙浪潮，西罗马节节败退，476年亡于日耳曼雇佣兵，西欧进入中世纪。',
    civilization: '拉丁语和罗马教会制度在废墟中存续，成为西欧文明黏合剂。',
    religionDetail: '罗马天主教廷（教皇）权威在世俗帝国崩溃后反而迅速上升。',
    keyFigures: [
      { name: '埃提乌斯', role: '最后的名将', years: '391—454', note: '451年沙隆战役联手西哥特击退“上帝之鞭”阿提拉' }
    ],
    periods: [
      { id: 'fall', name: '蛮族入侵与476年覆亡', startYear: 395, endYear: 476, capital: '罗马', territoryDesc: '不列颠、高卢、北非相继丧失，最终仅余意大利。', mapRegions: ['italy', 'west_europe', 'iberia'], highlights: '与匈奴西迁引发的欧亚多米诺骨牌直接相连。' }
    ]
  },
  {
    id: 'byzantine',
    name: '东罗马帝国（拜占庭）',
    enName: 'Byzantine Empire (Eastern Rome)',
    colStart: 2.04, colEnd: 2.66,
    startYear: 395, endYear: 1453,
    color: '#9b7bc4',
    darkTextOff: true,
    religionTags: ['基督教'],
    capital: '君士坦丁堡',
    sphere: '巴尔干半岛、安纳托利亚、早期含埃及与意大利',
    summary: '罗马帝国的正统延续，竟一直存活到中国明朝中期（1453年）！守卫欧亚十字路口逾千年，完整保存了古希腊罗马典籍与东正教传统。',
    civilization: '《查士丁尼法典》（民法大全）、圣索菲亚大教堂、希腊火、双头鹰徽记与丝绸技术西传。',
    religionDetail: '东正教核心，1054年与罗马天主教正式大分裂，深刻塑造东欧与俄罗斯文明。',
    keyFigures: [
      { name: '查士丁尼一世', role: '大帝', years: '482—565', note: '编纂罗马法大全，建圣索菲亚大教堂，一度收复罗马与北非' },
      { name: '巴西尔二世', role: '马其顿王朝皇帝', years: '958—1025', note: '中兴拜占庭，使基辅罗斯皈依东正教' },
      { name: '君士坦丁十一世', role: '末代皇帝', years: '1405—1453', note: '1453年君士坦丁堡陷落时战死城头' }
    ],
    periods: [
      { id: 'justinian', name: '查士丁尼复兴期', startYear: 395, endYear: 640, capital: '君士坦丁堡', territoryDesc: '收复意大利、北非、南西班牙，重现环地中海荣光。', mapRegions: ['greece_balkans', 'anatolia', 'italy', 'north_africa', 'egypt', 'levant'], highlights: '编纂《民法大全》，但大瘟疫与波斯/阿拉伯战争令疆域收缩。' },
      { id: 'middle_byz', name: '马其顿中兴与十字军劫掠', startYear: 640, endYear: 1261, capital: '君士坦丁堡', territoryDesc: '稳固巴尔干与小亚细亚，向斯拉夫世界传播东正教。', mapRegions: ['greece_balkans', 'anatolia'], highlights: '1071年曼齐刻尔特惨败于塞尔柱突厥，1204年遭第四次十字军洗劫。' },
      { id: 'late_byz', name: '巴列奥略王朝与1453落幕', startYear: 1261, endYear: 1453, capital: '君士坦丁堡', territoryDesc: '退缩为君士坦丁堡及周边，学者携带希腊古籍西逃引发意大利文艺复兴高潮。', mapRegions: ['greece_balkans'], highlights: '1453年奥斯曼苏丹穆罕默德二世攻破城墙，中世纪正式落幕。' }
    ]
  },
  {
    id: 'kievan_rus',
    name: '基辅罗斯',
    enName: 'Kievan Rus',
    colStart: 2.66, colEnd: 2.96,
    startYear: 882, endYear: 1240,
    color: '#88b3a8',
    religionTags: ['基督教'],
    capital: '基辅',
    sphere: '第聂伯河至诺夫哥罗德（俄、乌、白俄罗斯共同源头）',
    summary: '维京瓦良格人与东斯拉夫人融合建立的贸易大公国，988年接受拜占庭东正教与西里尔字母，1240年亡于蒙古西征。',
    civilization: '瓦良格—希腊商路、西里尔字母普及、《罗斯法典》。',
    religionDetail: '弗拉基米尔大公“罗斯受洗”确立东正教信仰。',
    keyFigures: [
      { name: '弗拉基米尔一世', role: '基辅大公', years: '958—1015', note: '988年正式引入东正教' },
      { name: '智者雅罗斯拉夫', role: '基辅大公', years: '978—1054', note: '基辅罗斯文化与法制黄金时代' }
    ],
    periods: [
      { id: 'rus_peak', name: '罗斯受洗与商路繁盛', startYear: 882, endYear: 1240, capital: '基辅', territoryDesc: '控制波罗的海至黑海河运商路。', mapRegions: ['east_europe'], highlights: '1240年拔都西征攻陷基辅，罗斯诸公国臣服金帐汗国两百余年。' }
    ]
  },
  {
    id: 'russia_empire',
    name: '俄罗斯沙皇国 / 帝国',
    enName: 'Tsardom & Russian Empire',
    colStart: 2.25, colEnd: 2.96,
    startYear: 1480, endYear: 1917,
    color: '#6ca17d',
    darkTextOff: true,
    religionTags: ['基督教'],
    capital: '圣彼得堡',
    sphere: '东欧平原、西伯利亚直抵太平洋、高加索与中亚',
    summary: '莫斯科大公国摆脱蒙古统治后自称“第三罗马”，百年间跨越西伯利亚抵达太平洋，彼得大帝与叶卡捷琳娜二世将其打造成欧陆超级帝国。',
    civilization: '西伯利亚大铁路、俄罗斯文学与音乐黄金时代（托尔斯泰/陀思妥耶夫斯基/柴可夫斯基）、元素周期表（门捷列夫）。',
    religionDetail: '俄罗斯东正教会与沙皇专制紧密结合。',
    keyFigures: [
      { name: '伊凡四世（雷帝）', role: '首位沙皇', years: '1530—1584', note: '加冕沙皇，开始向伏尔加与西伯利亚扩张' },
      { name: '彼得大帝', role: '帝国缔造者', years: '1672—1725', note: '强力西化改革，建圣彼得堡，与康熙、路易十四同期' },
      { name: '叶卡捷琳娜二世', role: '女皇', years: '1729—1796', note: '打通黑海出海口，瓜分波兰，帝国疆域大增' }
    ],
    periods: [
      { id: 'tsardom', name: '莫斯科崛起与东扩西伯利亚', startYear: 1480, endYear: 1689, capital: '莫斯科', territoryDesc: '1480年摆脱金帐汗国，哥萨克东进至黑龙江畔与清朝签《尼布楚条约》。', mapRegions: ['east_europe', 'russia_steppe', 'siberia'], highlights: '成为横跨欧亚的陆权巨兽。' },
      { id: 'imperial_rus', name: '彼得西化与欧陆列强', startYear: 1689, endYear: 1917, capital: '圣彼得堡', territoryDesc: '击败拿破仑、挺进中亚与远东，1917年十月革命终结帝制。', mapRegions: ['east_europe', 'russia_steppe', 'siberia', 'central_asia'], highlights: '文化科学璀璨，但农奴制改革滞后与一战引发革命。' }
    ]
  },
  {
    id: 'ussr_russia',
    name: '苏联与现代俄罗斯/东欧',
    enName: 'USSR & Modern Eastern Europe',
    colStart: 2.04, colEnd: 2.96,
    startYear: 1917, endYear: 2026,
    color: '#c95c5c',
    darkTextOff: true,
    religionTags: ['基督教'],
    capital: '莫斯科',
    sphere: '横跨欧亚11个时区（苏联15加盟国及华约体系）',
    summary: '世界首个社会主义大国，迅速工业化并在二战东线付出巨大牺牲粉碎纳粹主力；冷战中发射首颗卫星与首位宇航员，1991年解体。',
    civilization: '重工业与航天先驱（斯普特尼克1号、加加林）、计划经济实验、核物理与数学强国。',
    religionDetail: '苏联时期推行无神论，解体后东正教在东欧与俄罗斯复兴。',
    keyFigures: [
      { name: '弗拉基米尔·列宁', role: '苏联缔造者', years: '1870—1924', note: '领导十月革命，建立苏维埃政权' },
      { name: '尤里·加加林', role: '首位宇航员', years: '1934—1968', note: '1961年完成人类首次载人太空飞行' },
      { name: '米哈伊尔·戈尔巴乔夫', role: '末代苏联领导人', years: '1931—2022', note: '推动改革与冷战结束，1991年苏联解体' }
    ],
    periods: [
      { id: 'ussr', name: '苏联与冷战两极格局', startYear: 1917, endYear: 1991, capital: '莫斯科', territoryDesc: '东欧至太平洋的超级大国阵营。', mapRegions: ['east_europe', 'russia_steppe', 'siberia', 'central_asia'], highlights: '二战胜利、太空竞赛，1991年和平解体为15国。' },
      { id: 'post_soviet', name: '后苏联与当代地缘变局', startYear: 1991, endYear: 2026, capital: '莫斯科', territoryDesc: '俄罗斯联邦及独立东欧各国。', mapRegions: ['russia_steppe', 'siberia'], highlights: '东欧多国融入欧盟，欧亚地缘秩序持续重组。' }
    ]
  },

  /* ===================== COL 3: 北非与尼罗河 (N. Africa & Egypt) ===================== */
  {
    id: 'egypt_old',
    name: '古埃及·早王朝与古王国',
    enName: 'Old Kingdom Egypt',
    colStart: 3.04, colEnd: 3.96,
    startYear: -3150, endYear: -2181,
    color: '#e5c97a',
    religionTags: ['古代多神'],
    capital: '孟菲斯',
    sphere: '尼罗河三角洲与上下埃及',
    summary: '美尼斯统一上下埃及开启法老时代！吉萨大金字塔建于约公元前2560年——比中国商朝早一千年，比埃及艳后早两千五百年！',
    civilization: '圣书体象形文字、莎草纸、365天太阳历、巨石金字塔工程与高超几何测绘。',
    religionDetail: '太阳神拉（Ra）与来世永生信仰，木乃伊防腐技术成熟。',
    keyFigures: [
      { name: '美尼斯（纳尔迈）', role: '统一者法老', years: '约前3150', note: '统一上下埃及，建立第一王朝' },
      { name: '伊姆霍特普', role: '建筑师/宰相', years: '约前2650', note: '设计世界首座阶梯金字塔，被后世尊为医神' },
      { name: '胡夫', role: '第四王朝法老', years: '约前2589—前2566在位', note: '建造吉萨大金字塔，保持人类最高建筑纪录近3800年' }
    ],
    periods: [
      { id: 'pyramids', name: '金字塔黄金时代', startYear: -2686, endYear: -2181, capital: '孟菲斯', territoryDesc: '尼罗河谷高度中央集权的神权国家。', mapRegions: ['egypt'], highlights: '胡夫、哈夫拉、孟卡拉三大金字塔与狮身人面像落成。' }
    ]
  },
  {
    id: 'egypt_middle_new',
    name: '古埃及·中王国与新王国',
    enName: 'Middle & New Kingdom Egypt',
    colStart: 3.04, colEnd: 3.96,
    startYear: -2055, endYear: -1069,
    color: '#dfb75b',
    religionTags: ['古代多神'],
    capital: '底比斯',
    sphere: '埃及、努比亚（苏丹）及叙利亚—迦南走廊',
    summary: '古埃及军事、艺术与外交最辉煌的帝国时代：哈特谢普苏特女王、图坦卡蒙黄金面具、拉美西斯二世卡迭石和约皆出于此。',
    civilization: '卡纳克/卢克索神庙群、帝王谷壁画、马拉双轮战车、人类史上最早保存完整的国际和平条约（埃赫和约）。',
    religionDetail: '阿蒙神崇拜鼎盛；阿肯那顿曾短暂推行人类最早的一神教改革（阿顿太阳圆盘）。',
    keyFigures: [
      { name: '哈特谢普苏特', role: '传奇女法老', years: '前1479—前1458在位', note: '派遣庞特远洋商队，大兴神庙建筑' },
      { name: '图坦卡蒙', role: '十八王朝法老', years: '前1341—前1323', note: '其未被盗掘的陵墓揭示了新王国惊人财富' },
      { name: '拉美西斯二世', role: '大帝法老', years: '前1303—前1213', note: '在位66年，建阿布辛贝神庙，与赫梯缔结和平条约' }
    ],
    periods: [
      { id: 'middle', name: '中王国文艺复兴', startYear: -2055, endYear: -1650, capital: '底比斯', territoryDesc: '重归统一并经营努比亚金矿。', mapRegions: ['egypt', 'nubia_east_africa'], highlights: '古典埃及语文学巅峰；后遭喜克索斯人入侵带来青铜战车。' },
      { id: 'new_kingdom', name: '新王国超级帝国', startYear: -1550, endYear: -1069, capital: '底比斯', territoryDesc: '北抵幼发拉底河，南至努比亚第四瀑布。', mapRegions: ['egypt', 'nubia_east_africa', 'levant'], highlights: '与赫梯、巴比伦、亚述并列青铜时代四大强国。' }
    ]
  },
  {
    id: 'carthage_kush',
    name: '迦太基与后期埃及/库施',
    enName: 'Carthage, Kush & Late Egypt',
    colStart: 3.04, colEnd: 3.96,
    startYear: -1069, endYear: -146,
    rects: [
      { colStart: 3.04, colEnd: 3.96, startYear: -1069, endYear: -525, label: '后期埃及·库施·迦太基' },
      { colStart: 3.04, colEnd: 3.46, startYear: -525, endYear: -146, label: '迦太基' }
    ],
    color: '#d4a66a',
    religionTags: ['古代多神'],
    capital: '迦太基',
    sphere: '西地中海北非沿岸（迦太基）+ 尼罗河谷（库施/塞易斯）',
    summary: '腓尼基人在北非建立商业霸主迦太基，掌控西地中海航运；尼罗河上游的努比亚黑人法老也曾入主埃及。',
    civilization: '迦太基环形军港、远洋商船探险西非海岸、先进农业论著。',
    religionDetail: '迦太基信奉巴力哈蒙与塔尼特女神，埃及延续传统神庙信仰。',
    keyFigures: [
      { name: '汉尼拔·巴卡', role: '迦太基军神', years: '前247—前183', note: '率战象翻越阿尔卑斯山，坎尼战役重创罗马军团' }
    ],
    periods: [
      { id: 'carthage_sea', name: '迦太基海上霸权', startYear: -814, endYear: -146, capital: '迦太基', territoryDesc: '突尼斯、北非海岸、西西里、撒丁岛与西班牙南部。', mapRegions: ['north_africa', 'iberia'], highlights: '与罗马爆发三次布匿战争，公元前146年城毁国灭。' }
    ]
  },
  {
    id: 'ptolemaic_egypt',
    name: '托勒密埃及（希腊化）',
    enName: 'Ptolemaic Egypt',
    colStart: 3.46, colEnd: 3.96,
    startYear: -305, endYear: -30,
    rects: [
      { colStart: 3.46, colEnd: 3.96, startYear: -305, endYear: -146, label: '托勒密埃及' },
      { colStart: 3.04, colEnd: 3.96, startYear: -146, endYear: -30, label: '托勒密埃及（埃及艳后）' }
    ],
    color: '#c99ec4',
    religionTags: ['古代多神'],
    capital: '亚历山大',
    sphere: '埃及、昔兰尼加、塞浦路斯与爱琴海据点',
    summary: '亚历山大部将托勒密建立的希腊化王朝。亚历山大港灯塔与大图书馆成为当时全人类的科学大脑；末代女王克里奥帕特拉离iPhone比离大金字塔更近！',
    civilization: '亚历山大图书馆、欧几里得《几何原本》、埃拉托色尼精确测算地球周长、罗塞塔石碑。',
    religionDetail: '希腊文化精英与埃及法老传统并存，创造塞拉皮斯融合神祇。',
    keyFigures: [
      { name: '托勒密一世', role: '开国君主', years: '前367—前283', note: '创建亚历山大博学园与图书馆' },
      { name: '克里奥帕特拉七世（埃及艳后）', role: '末代女王', years: '前69—前30', note: '通晓多国语言，与凯撒、安东尼结盟，亡后埃及归入罗马' }
    ],
    periods: [
      { id: 'alexandria', name: '亚历山大科学中心与埃及艳后', startYear: -305, endYear: -30, capital: '亚历山大', territoryDesc: '尼罗河粮仓与东地中海贸易枢纽。', mapRegions: ['egypt', 'levant'], highlights: '公元前30年屋大维征服埃及，延续三千年的古埃及独立历史画上句号。' }
    ]
  },
  {
    id: 'fatimid_mamluk',
    name: '法蒂玛王朝 / 马穆鲁克苏丹国',
    enName: 'Fatimid & Mamluk Egypt',
    colStart: 3.04, colEnd: 3.96,
    startYear: 909, endYear: 1517,
    color: '#7ab892',
    religionTags: ['伊斯兰教'],
    capital: '开罗',
    sphere: '埃及、叙利亚、汉志圣城及北非马格里布',
    summary: '法蒂玛王朝建开罗城与爱资哈尔大学；萨拉丁的阿尤布王朝与随后的马穆鲁克奴隶骑兵在1260年艾因贾鲁特战役中，历史上首次正面击溃蒙古大军！',
    civilization: '爱资哈尔大学（970年建，现存最古老大学之一）、马穆鲁克建筑美学、红海—印度洋香料贸易枢纽。',
    religionDetail: '法蒂玛为什叶派伊斯玛仪派；萨拉丁与马穆鲁克恢复逊尼派主导，守护麦加与麦地那。',
    keyFigures: [
      { name: '萨拉丁', role: '阿尤布苏丹', years: '1137—1193', note: '1187年收复耶路撒冷，以骑士风度赢得东西方敬重' },
      { name: '拜巴尔一世', role: '马穆鲁克苏丹', years: '1223—1277', note: '击退蒙古伊尔汗国与十字军，奠定埃及250年稳固统治' }
    ],
    periods: [
      { id: 'fatimid', name: '法蒂玛建开罗', startYear: 909, endYear: 1171, capital: '开罗', territoryDesc: '北非至埃及、叙利亚与西西里。', mapRegions: ['north_africa', 'egypt', 'levant'], highlights: '建立开罗与爱资哈尔大学，海商网络繁盛。' },
      { id: 'mamluk', name: '萨拉丁与马穆鲁克时代', startYear: 1171, endYear: 1517, capital: '开罗', territoryDesc: '埃及、黎凡特与红海沿岸。', mapRegions: ['egypt', 'levant', 'arabia'], highlights: '1260年阻挡蒙古西征，1517年被奥斯曼帝国吞并。' }
    ]
  },
  {
    id: 'modern_africa',
    name: '非洲殖民抗争与现代非洲',
    enName: 'Colonial & Modern Africa',
    colStart: 3.04, colEnd: 3.96,
    startYear: 1805, endYear: 2026,
    color: '#b7a983',
    religionTags: ['伊斯兰教', '基督教'],
    capital: '开罗',
    sphere: '埃及、北非及撒哈拉以南54国',
    summary: '从穆罕默德·阿里近代化改革、苏伊士运河通航，经历欧洲“瓜分非洲”，二战后1960“非洲独立年”掀起民族解放浪潮。',
    civilization: '苏伊士运河（1869）重塑全球航运、非盟一体化与全球最年轻的人口增长区。',
    religionDetail: '北非以伊斯兰教为主，撒哈拉以南基督教、伊斯兰教与本土信仰交融。',
    keyFigures: [
      { name: '纳赛尔', role: '埃及总统', years: '1918—1970', note: '收回苏伊士运河主权，推动阿拉伯民族复兴' },
      { name: '纳尔逊·曼德拉', role: '南非总统', years: '1918—2013', note: '终结种族隔离制度，推动和平和解' }
    ],
    periods: [
      { id: 'scramble', name: '运河通航与殖民瓜分', startYear: 1805, endYear: 1956, capital: '开罗', territoryDesc: '英法等列强控制非洲大部，仅埃塞俄比亚等少数维持独立。', mapRegions: ['north_africa', 'egypt', 'sub_saharan_africa'], highlights: '1884柏林会议瓜分非洲，二战后反殖民浪潮高涨。' },
      { id: 'independent_africa', name: '独立建国与非盟时代', startYear: 1956, endYear: 2026, capital: '开罗', territoryDesc: '54个主权国家共同迈向工业化与数字化。', mapRegions: ['north_africa', 'egypt', 'sub_saharan_africa'], highlights: '1960年17国同一年独立；南非1994年废除种族隔离。' }
    ]
  },

  /* ===================== COL 4: 两河与西亚 (Mesopotamia & W. Asia) ===================== */
  {
    id: 'sumer_akkad',
    name: '苏美尔与阿卡德帝国',
    enName: 'Sumer & Akkadian Empire',
    colStart: 4.04, colEnd: 4.96,
    startYear: -3500, endYear: -2004,
    color: '#d4a373',
    religionTags: ['古代多神'],
    capital: '乌鲁克',
    sphere: '幼发拉底河与底格里斯河下游（今伊拉克南部）',
    summary: '人类文明最早的黎明！发明楔形文字、车轮、犁、60进制（今天1小时=60分、圆周=360°的源头）以及世界第一部史诗《吉尔伽美什》。',
    civilization: '乌鲁克城邦、楔形文字泥板书、六十进制天文历法、阿卡德萨尔贡建立人类史上首个跨城邦多民族帝国。',
    religionDetail: '城邦守护神体系，修建高耸的阶梯形“齐古拉特”（通天塔原型）。',
    keyFigures: [
      { name: '吉尔伽美什', role: '乌鲁克国王', years: '约前2700', note: '人类首部英雄史诗主角' },
      { name: '阿卡德的萨尔贡', role: '开国君主', years: '约前2334—前2279在位', note: '建立人类历史上公认的第一个统一帝国' }
    ],
    periods: [
      { id: 'sumer_cities', name: '苏美尔城邦与文字发明', startYear: -3500, endYear: -2334, capital: '乌鲁克', territoryDesc: '乌鲁克、乌尔、拉格什等苏美尔城邦。', mapRegions: ['mesopotamia'], highlights: '约前3200年出现楔形文字，早于殷墟甲骨文近两千年！' },
      { id: 'akkad_ur3', name: '阿卡德帝国与乌尔第三王朝', startYear: -2334, endYear: -2004, capital: '乌鲁克', territoryDesc: '统一两河流域直达波斯湾与叙利亚。', mapRegions: ['mesopotamia', 'levant'], highlights: '颁布人类已知最早法典《乌尔纳姆法典》。' }
    ]
  },
  {
    id: 'babylon_hittite',
    name: '古巴比伦与赫梯帝国',
    enName: 'Old Babylon & Hittite Empire',
    colStart: 4.04, colEnd: 4.96,
    startYear: -1894, endYear: -1178,
    color: '#c98e63',
    religionTags: ['古代多神'],
    capital: '巴比伦',
    sphere: '两河流域（巴比伦）+ 安纳托利亚（赫梯）',
    summary: '汉谟拉比统一两河并刻下闻名世界的成文法典石柱；北方安纳托利亚的赫梯人率先掌握成熟冶铁术，开启人类铁器时代。',
    civilization: '《汉谟拉比法典》、“以眼还眼”、赫梯冶铁与轻型马拉战车、巴比伦代数与二次方程求解。',
    religionDetail: '马杜克成为巴比伦至高神；赫梯自称“千神之国”，兼容并蓄。',
    keyFigures: [
      { name: '汉谟拉比', role: '巴比伦国王', years: '前1792—前1750在位', note: '颁布282条成文法典，确立司法与契约规范' },
      { name: '苏庇路里乌玛一世', role: '赫梯大王', years: '前1344—前1322在位', note: '将赫梯推向与埃及分庭抗礼的霸权巅峰' }
    ],
    periods: [
      { id: 'hammurabi', name: '汉谟拉比时代与赫梯争霸', startYear: -1894, endYear: -1178, capital: '巴比伦', territoryDesc: '巴比伦主导两河，赫梯控制小亚细亚与叙利亚北部。', mapRegions: ['mesopotamia', 'anatolia', 'levant'], highlights: '前1274年赫梯与埃及爆发人类首个详实记载的大会战——卡迭石战役。' }
    ]
  },
  {
    id: 'assyria_neobabylon',
    name: '亚述帝国与新巴比伦',
    enName: 'Assyrian & Neo-Babylonian Empires',
    colStart: 4.04, colEnd: 4.96,
    startYear: -911, endYear: -539,
    color: '#b87654',
    darkTextOff: true,
    religionTags: ['古代多神'],
    capital: '尼尼微',
    sphere: '整个肥沃新月地带、埃及、伊朗西部与安纳托利亚',
    summary: '人类史上首个靠铁制武器与常备军建立的超级军事帝国，建起世界第一座系统收藏文献的“亚述巴尼拔图书馆”；随后新巴比伦兴建伊什塔尔门与空中花园。',
    civilization: '铁器攻城器械、国家驿站邮政、亚述巴尼拔三万块泥板图书馆、巴比伦七天一星期制度与黄道十二宫。',
    religionDetail: '亚述主神阿舒尔；新巴比伦“巴比伦之囚”意外催生了犹太教《希伯来圣经》经典编纂。',
    keyFigures: [
      { name: '亚述巴尼拔', role: '亚述大帝', years: '前668—前627在位', note: '建立尼尼微皇家图书馆，保存了《吉尔伽美什》史诗' },
      { name: '尼布甲尼撒二世', role: '新巴比伦国王', years: '前605—前562在位', note: '修建巴比伦伊什塔尔门与传说中的空中花园' }
    ],
    periods: [
      { id: 'assyria', name: '新亚述超级帝国', startYear: -911, endYear: -609, capital: '尼尼微', territoryDesc: '首创行省总督制，一度囊括埃及与整个西亚。', mapRegions: ['mesopotamia', 'levant', 'anatolia', 'egypt'], highlights: '军事与官僚制度为波斯帝国奠基。' },
      { id: 'neobabylon', name: '新巴比伦与巴比伦之囚', startYear: -609, endYear: -539, capital: '巴比伦', territoryDesc: '两河与黎凡特重焕荣光，539 BCE被波斯居鲁士和平占领。', mapRegions: ['mesopotamia', 'levant'], highlights: '建筑艺术与天文学登峰造极。' }
    ]
  },
  {
    id: 'arab_caliphate',
    name: '阿拉伯帝国（四大哈里发·倭马亚·阿拔斯）',
    enName: 'Islamic Caliphates (Umayyad & Abbasid)',
    colStart: 3.04, colEnd: 5.96,
    startYear: 632, endYear: 1258,
    rects: [
      { colStart: 3.04, colEnd: 4.48, startYear: 632, endYear: 651, label: '四大哈里发' },
      { colStart: 3.04, colEnd: 5.96, startYear: 651, endYear: 909, label: '阿拉伯帝国（倭马亚·盛期阿拔斯）' },
      { colStart: 4.04, colEnd: 5.96, startYear: 909, endYear: 1258, label: '阿拔斯哈里发与塞尔柱' }
    ],
    color: '#4f9d76',
    darkTextOff: true,
    zIndex: 14,
    religionTags: ['伊斯兰教'],
    capital: '巴格达',
    sphere: '极盛横跨西班牙、北非、埃及、西亚、伊朗直至中亚撒马尔罕与印度河',
    summary: '伊斯兰文明的黄金时代！当西欧处于封建割据之时，巴格达“智慧宫”翻译保存古希腊科学、引入中国造纸术与印度数字，缔造了代数学、光学与现代医学先声。',
    civilization: '百年翻译运动、花剌子模《代数学》、伊本·西那《医典》、阿拉伯数字西传、中国造纸术经撒马尔罕传向欧洲。',
    religionDetail: '伊斯兰教（《古兰经》与圣训）奠定庞大文明圈，早期对“有经人”实行宗教宽容。',
    keyFigures: [
      { name: '穆罕默德', role: '先知', years: '570—632', note: '创立伊斯兰教并统一阿拉伯半岛' },
      { name: '哈伦·拉希德', role: '阿拔斯哈里发', years: '763—809', note: '《一千零一夜》的时代背景，与查理曼互派使节' },
      { name: '花剌子模 / 伊本·西那', role: '科学巨匠', years: '9—11世纪', note: '分别奠定现代代数学/算法（Algorithm）与医学典范' }
    ],
    periods: [
      { id: 'rashidun_umayyad', name: '急速扩张与倭马亚王朝', startYear: 632, endYear: 750, capital: '大马士革', territoryDesc: '灭亡波斯萨珊，夺取拜占庭叙利亚/埃及/北非，西抵西班牙，东抵中亚。', mapRegions: ['arabia', 'levant', 'mesopotamia', 'egypt', 'north_africa', 'iberia', 'iran', 'central_asia'], highlights: '751年怛罗斯之战与唐朝交锋，中国造纸工匠开启纸张西传之路。' },
      { id: 'abbasid', name: '阿拔斯黄金时代（巴格达）', startYear: 750, endYear: 1258, capital: '巴格达', territoryDesc: '建圆形和平城巴格达，成为当时世界最大科学贸易中心之一。', mapRegions: ['mesopotamia', 'arabia', 'levant', 'iran', 'egypt'], highlights: '“智慧宫”照亮中古世界；1258年旭烈兀蒙古军攻陷巴格达。' }
    ]
  },
  {
    id: 'ottoman',
    name: '奥斯曼土耳其帝国',
    enName: 'Ottoman Empire',
    colStart: 3.04, colEnd: 4.96,
    startYear: 1299, endYear: 1922,
    rects: [
      { colStart: 4.04, colEnd: 4.96, startYear: 1299, endYear: 1517, label: '奥斯曼崛起' },
      { colStart: 3.04, colEnd: 4.96, startYear: 1517, endYear: 1805, label: '奥斯曼帝国（跨欧亚非全盛）' },
      { colStart: 2.04, colEnd: 2.25, startYear: 1453, endYear: 1878, label: '巴尔干' },
      { colStart: 4.04, colEnd: 4.96, startYear: 1805, endYear: 1922, label: '奥斯曼晚期' }
    ],
    color: '#c96f53',
    darkTextOff: true,
    zIndex: 13,
    religionTags: ['伊斯兰教'],
    capital: '伊斯坦布尔',
    sphere: '安纳托利亚、巴尔干东南欧、西亚、埃及与北非',
    summary: '西迁突厥人建立的跨洲火药大帝国！1453年攻克君士坦丁堡终结拜占庭，阻断欧亚传统商路，间接逼出了欧洲大航海时代。',
    civilization: '耶尼切里火枪军团、巨型乌尔班大炮、希南清真寺建筑、米勒特宗教自治社区制度。',
    religionDetail: '逊尼派伊斯兰哈里发帝国，同时通过米勒特制度允许东正教与犹太社区自治。',
    keyFigures: [
      { name: '穆罕默德二世（征服者）', role: '苏丹', years: '1432—1481', note: '1453年攻陷君士坦丁堡，年仅21岁' },
      { name: '苏莱曼大帝（立法者）', role: '苏丹', years: '1494—1566', note: '帝国政治、军事与法制全盛期，兵临维也纳城下' },
      { name: '凯末尔·阿塔图尔克', role: '现代土耳其国父', years: '1881—1938', note: '废除苏丹制，建立世俗共和国' }
    ],
    periods: [
      { id: 'rise', name: '崛起与1453攻克君士坦丁堡', startYear: 1299, endYear: 1520, capital: '伊斯坦布尔', territoryDesc: '横跨黑海两岸与东地中海，吞并马穆鲁克埃及。', mapRegions: ['anatolia', 'greece_balkans', 'levant', 'egypt'], highlights: '掌握东西方商路咽喉，迫使西欧探索绕道非洲与美洲航线。' },
      { id: 'suleiman', name: '苏莱曼盛世与欧洲角逐', startYear: 1520, endYear: 1700, capital: '伊斯坦布尔', territoryDesc: '北至匈牙利，南至也门，西至阿尔及利亚，东至两河。', mapRegions: ['anatolia', 'greece_balkans', 'levant', 'mesopotamia', 'egypt', 'north_africa', 'arabia'], highlights: '1683年维也纳之战失利成为盛衰转折。' },
      { id: 'decline', name: '坦志麦特改革与一战解体', startYear: 1700, endYear: 1922, capital: '伊斯坦布尔', territoryDesc: '逐步丧失巴尔干与北非，1922年解体为土耳其及现代中东诸国。', mapRegions: ['anatolia', 'levant', 'mesopotamia'], highlights: '其遗产深刻塑造了当代中东格局。' }
    ]
  },
  {
    id: 'modern_middle_east',
    name: '现代中东与阿拉伯诸国',
    enName: 'Modern Middle East',
    colStart: 4.04, colEnd: 4.96,
    startYear: 1922, endYear: 2026,
    color: '#c7a47c',
    religionTags: ['伊斯兰教'],
    capital: '巴格达',
    sphere: '土耳其、沙特、海湾诸国、伊拉克、叙利亚、以色列等',
    summary: '奥斯曼解体与中东石油大发现重塑世界能源与地缘版图；21世纪海湾国家正加速向科技与贸易枢纽转型。',
    civilization: '全球石油化工枢纽、航空与金融中转中心。',
    religionDetail: '伊斯兰教、犹太教与基督教三大一神教发源地与核心圣城所在。',
    keyFigures: [
      { name: '伊本·沙特', role: '沙特建国君主', years: '1875—1953', note: '统一阿拉伯半岛大部，开启石油经济时代' }
    ],
    periods: [
      { id: 'oil_modern', name: '石油经济与现代地缘格局', startYear: 1922, endYear: 2026, capital: '巴格达', territoryDesc: '西亚与阿拉伯半岛主权国家体系。', mapRegions: ['anatolia', 'levant', 'mesopotamia', 'arabia'], highlights: '欧佩克与全球能源博弈核心区。' }
    ]
  },

  /* ===================== COL 5: 伊朗高原 (Iranian Plateau) ===================== */
  {
    id: 'elam_media',
    name: '埃兰文明与米底王国',
    enName: 'Elam & Media',
    colStart: 5.04, colEnd: 5.96,
    startYear: -2700, endYear: -550,
    color: '#c9a684',
    religionTags: ['古代多神'],
    capital: '波斯波利斯',
    sphere: '伊朗西南部（苏萨）与扎格罗斯山脉',
    summary: '与苏美尔、巴比伦并存两千年的伊朗古老文明，后由南下的印欧雅利安分支米底人统一高原并联合巴比伦灭亡亚述。',
    civilization: '苏萨古城、早期埃兰文字、青铜冶炼与高原骑兵战术。',
    religionDetail: '本土多神教逐步演变为琐罗亚斯德教（拜火教/祆教）的早期传统。',
    keyFigures: [
      { name: '基亚克萨雷斯', role: '米底国王', years: '前625—前585在位', note: '灭亡亚述帝国，缔造伊朗高原首个统一王国' }
    ],
    periods: [
      { id: 'elam', name: '埃兰与米底崛起', startYear: -2700, endYear: -550, capital: '波斯波利斯', territoryDesc: '扎格罗斯山脉与伊朗高原。', mapRegions: ['iran'], highlights: '为波斯阿契美尼德帝国铺平道路。' }
    ]
  },
  {
    id: 'achaemenid_persia',
    name: '波斯第一帝国（阿契美尼德）',
    enName: 'Achaemenid Persian Empire',
    colStart: 3.46, colEnd: 5.96,
    startYear: -550, endYear: -330,
    rects: [
      { colStart: 5.04, colEnd: 5.96, startYear: -550, endYear: -539, label: '波斯' },
      { colStart: 4.04, colEnd: 5.96, startYear: -539, endYear: -525, label: '波斯扩张' },
      { colStart: 3.46, colEnd: 5.96, startYear: -525, endYear: -330, label: '波斯第一帝国（阿契美尼德）' }
    ],
    color: '#b883c7',
    darkTextOff: true,
    zIndex: 14,
    religionTags: ['古代多神'],
    capital: '波斯波利斯',
    sphere: '人类史上第一个横跨亚非欧的超级世界帝国（埃及至印度河）',
    summary: '居鲁士大帝与大流士一世建立的超级帝国，以宗教宽容、御道驿站、统一金币与行省总督制闻名，同期中国正值春秋战国。',
    civilization: '居鲁士圆柱（早期人权与宗教宽容宣言）、2700公里“波斯御道”、坎儿井灌溉、达里克金币与行省制。',
    religionDetail: '琐罗亚斯德教（善恶二元论、天堂地狱与末日审判思想深远影响了犹太教、基督教与伊斯兰教！）。',
    keyFigures: [
      { name: '居鲁士大帝', role: '开国大帝', years: '约前600—前530', note: '灭米底、吕底亚与新巴比伦，释放犹太人返乡重建圣殿' },
      { name: '大流士一世', role: '万王之王', years: '前550—前486', note: '完善行省与御道制度，建波斯波利斯，发动希波战争' }
    ],
    periods: [
      { id: 'cyrus_darius', name: '居鲁士与大流士极盛期', startYear: -550, endYear: -330, capital: '波斯波利斯', territoryDesc: '占当时全球人口逾40%，西至爱琴海与埃及，东抵印度河与中亚。', mapRegions: ['iran', 'mesopotamia', 'levant', 'anatolia', 'egypt', 'central_asia', 'india_north'], highlights: '前330年亡于亚历山大东征。' }
    ]
  },
  {
    id: 'seleucid_parthia',
    name: '塞琉古与帕提亚（安息帝国）',
    enName: 'Seleucid & Parthian Empire',
    colStart: 4.48, colEnd: 5.96,
    startYear: -301, endYear: 224,
    color: '#9c7eb3',
    darkTextOff: true,
    religionTags: ['古代多神'],
    capital: '泰西封',
    sphere: '伊朗高原、两河流域与丝绸之路西段咽喉',
    summary: '中国史书称“安息”。由中亚草原帕尼人建立，凭“回马箭”绝技在卡莱战役大败罗马克拉苏，成为连接大汉与罗马丝绸贸易的黄金中介！',
    civilization: '重装具装骑兵与“帕提亚回马箭”、丝绸之路陆上中转枢纽、汉武帝遣使通安息。',
    religionDetail: '融合琐罗亚斯德教、希腊神祇与两河信仰，高度宽容；安息王子安世高来洛阳翻译佛经！',
    keyFigures: [
      { name: '米特里达梯一世', role: '安息大王', years: '前171—前132在位', note: '将安息打造为匹敌罗马的东方强权' },
      { name: '安世高', role: '安息王子/译经家', years: '2世纪', note: '放弃王位东来东汉洛阳，成为中国早期佛经翻译宗师' }
    ],
    periods: [
      { id: 'seleucid', name: '塞琉古希腊化时期', startYear: -301, endYear: -141, capital: '巴比伦', territoryDesc: '亚历山大继承者帝国，连接希腊与波斯。', mapRegions: ['iran', 'mesopotamia', 'levant'], highlights: '兴建安条克城，向东方传播希腊城市文化。' },
      { id: 'parthia', name: '安息帝国与丝路黄金中介', startYear: -141, endYear: 224, capital: '泰西封', territoryDesc: '把控丝绸之路西亚段，与西汉、东汉互通使节。', mapRegions: ['iran', 'mesopotamia'], highlights: '前53年卡莱战役击败罗马三巨头克拉苏，令罗马帝国止步幼发拉底河。' }
    ]
  },
  {
    id: 'sassanid',
    name: '萨珊波斯帝国',
    enName: 'Sasanian Empire',
    colStart: 4.48, colEnd: 5.96,
    startYear: 224, endYear: 651,
    color: '#8865a8',
    darkTextOff: true,
    religionTags: ['古代多神'],
    capital: '泰西封',
    sphere: '伊朗高原、两河、高加索与中亚边缘',
    summary: '波斯古典文明的最后辉煌，与罗马/拜占庭激战四百年；其丝绸织锦、金银器、马球与摩尼教深刻影响了中国北朝与大唐风尚！',
    civilization: '波斯金银器与联珠纹织锦风靡唐朝、宫廷马球传入中国、贡迪沙普尔医学院、摩尼教诞生。',
    religionDetail: '定琐罗亚斯德教（祆教）为国教；亦诞生摩尼教（明教），随粟特商人传入长安。',
    keyFigures: [
      { name: '沙普尔一世', role: '万王之王', years: '240—270在位', note: '生俘罗马皇帝瓦勒良，震动西方' },
      { name: '霍斯劳一世', role: '贤君', years: '531—579在位', note: '收留雅典流亡哲学家，缔造萨珊文化学术顶峰' },
      { name: '卑路斯', role: '末代王子', years: '636—679', note: '亡国后流亡唐朝长安，获唐高宗封波斯都督' }
    ],
    periods: [
      { id: 'sassanid_peak', name: '波斯复兴与盛唐交流', startYear: 224, endYear: 651, capital: '泰西封', territoryDesc: '伊朗与两河核心，长期与拜占庭争霸。', mapRegions: ['iran', 'mesopotamia'], highlights: '与拜占庭长期消耗后，651年亡于新兴阿拉伯帝国。' }
    ]
  },
  {
    id: 'safavid_iran',
    name: '萨非王朝与近现代伊朗',
    enName: 'Safavid, Qajar & Modern Iran',
    colStart: 5.04, colEnd: 5.96,
    startYear: 1501, endYear: 2026,
    color: '#7c96b8',
    religionTags: ['伊斯兰教'],
    capital: '伊斯法罕',
    sphere: '伊朗高原、高加索南部与波斯湾北岸',
    summary: '萨非王朝于1501年重建伊朗统一民族帝国并确立什叶派国教地位，与奥斯曼、莫卧儿并称“三大伊斯兰火药帝国”。',
    civilization: '伊斯法罕“半天下”建筑奇迹、波斯细密画与地毯艺术、丝绸国家贸易。',
    religionDetail: '伊斯玛仪一世确立十二伊玛目什叶派为国教，塑造了延续至今的伊朗身份认同。',
    keyFigures: [
      { name: '阿拔斯大帝', role: '萨非沙阿', years: '1571—1629', note: '迁都伊斯法罕，改革火枪军团，迎来波斯文艺复兴' }
    ],
    periods: [
      { id: 'safavid', name: '萨非火药帝国鼎盛', startYear: 1501, endYear: 1736, capital: '伊斯法罕', territoryDesc: '伊朗高原与外高加索。', mapRegions: ['iran'], highlights: '伊斯法罕蓝瓷穹顶与波斯艺术极盛。' },
      { id: 'modern_iran', name: '恺加、巴列维与现代伊朗', startYear: 1736, endYear: 2026, capital: '德黑兰', territoryDesc: '现代伊朗版图，1979年伊斯兰革命后建立共和国。', mapRegions: ['iran'], highlights: '中东石油与地缘政治关键节点。' }
    ]
  },

  /* ===================== COL 6: 南亚次大陆 (South Asia) ===================== */
  {
    id: 'indus_valley',
    name: '印度河文明（哈拉帕）',
    enName: 'Indus Valley Civilization',
    colStart: 6.04, colEnd: 6.96,
    startYear: -2600, endYear: -1900,
    color: '#d9b589',
    religionTags: ['古代多神'],
    capital: '白沙瓦',
    sphere: '印度河流域（摩亨佐-达罗、哈拉帕）',
    summary: '拥有令人惊叹的城市规划与卫生系统：棋盘街道、烧砖排水沟、室内浴室、标准化度量衡，与古埃及古王国、苏美尔贸易往来。',
    civilization: '最早栽培棉花并织布、高度标准化砖块与砝码、尚未破译的印度河印章文字。',
    religionDetail: '出土疑似湿婆原型（兽主印章）与母神雕像。',
    keyFigures: [
      { name: '哈拉帕城市规划者', role: '匿名匠人', years: '约前2500', note: '修建了当时全人类最先进的城市给排水体系' }
    ],
    periods: [
      { id: 'harappa', name: '成熟哈拉帕期', startYear: -2600, endYear: -1900, capital: '白沙瓦', territoryDesc: '覆盖今巴基斯坦与印度西北部百万平方公里。', mapRegions: ['india_north'], highlights: '约前1900年因气候干旱与河道改道神秘衰落。' }
    ]
  },
  {
    id: 'vedic_mahajanapadas',
    name: '吠陀时代与列国（佛教诞生）',
    enName: 'Vedic Age & Mahajanapadas',
    colStart: 6.04, colEnd: 6.96,
    startYear: -1500, endYear: -322,
    color: '#e5c17c',
    religionTags: ['印度教', '佛教'],
    capital: '华氏城',
    sphere: '印度河向恒河平原拓展的十六大国',
    summary: '中亚雅利安人南下带来梵语与《吠陀》经典，确立婆罗门教与种姓制度；公元前6—5世纪轴心时代，释迦牟尼在此创立佛教！',
    civilization: '《梨俱吠陀》、《奥义书》、两大史诗《摩诃婆罗多》《罗摩衍那》源头、梵语语法体系。',
    religionDetail: '婆罗门教主导下，沙门思潮兴起，诞生佛教与耆那教，主张众生平等与解脱轮回。',
    keyFigures: [
      { name: '释迦牟尼（乔达摩·悉达多）', role: '佛教创始人', years: '约前563—前483', note: '几乎与孔子同龄，创立深刻改变整个东亚与东南亚的佛教' },
      { name: '大雄（筏驮摩那）', role: '耆那教创立者', years: '前6世纪', note: '倡导彻底的非暴力（阿希姆萨）理念' }
    ],
    periods: [
      { id: 'vedic', name: '吠陀与雅利安南下', startYear: -1500, endYear: -600, capital: '德里', territoryDesc: '从旁遮普推进至恒河中下游。', mapRegions: ['india_north'], highlights: '梵语、铁器农耕与瓦尔纳种姓制度成型。' },
      { id: 'buddha_era', name: '十六大国与佛教诞生', startYear: -600, endYear: -322, capital: '华氏城', territoryDesc: '摩揭陀王国称霸恒河流域。', mapRegions: ['india_north'], highlights: '释迦牟尼觉悟传法，与春秋战国、古希腊哲学同步爆发。' }
    ]
  },
  {
    id: 'maurya',
    name: '孔雀帝国（阿育王）',
    enName: 'Maurya Empire',
    colStart: 6.04, colEnd: 6.96,
    startYear: -322, endYear: -185,
    color: '#c98856',
    darkTextOff: true,
    religionTags: ['佛教', '印度教'],
    capital: '华氏城',
    sphere: '几乎统一整个南亚次大陆及阿富汗东部',
    summary: '印度历史上第一个大一统超级帝国！阿育王经历羯陵伽血战后痛悟皈依佛教，派遣使团四方弘法，将佛教从印度地方信仰变为世界宗教。',
    civilization: '考底利耶《政事论》（印度版《韩非子》）、阿育王石柱铭文（印度国徽四狮柱头来源）、全国驿道与医院。',
    religionDetail: '阿育王尊崇佛教并倡导一切教派宽容共处，派遣儿子摩哂陀将佛教传入斯里兰卡（南传上座部源头）。',
    keyFigures: [
      { name: '月护王（旃陀罗笈多）', role: '开国皇帝', years: '前322—前298在位', note: '趁亚历山大东撤统一北印，击败塞琉古军队' },
      { name: '阿育王', role: '大帝', years: '前268—前232在位', note: '以“正法”治国，推动佛教走向世界' }
    ],
    periods: [
      { id: 'ashoka', name: '阿育王大一统与佛教外传', startYear: -322, endYear: -185, capital: '华氏城', territoryDesc: '囊括阿富汗至德干高原南端，恰逢中国战国末期至秦汉之际。', mapRegions: ['india_north', 'india_south'], highlights: '立石柱宣扬仁政、禁杀生、建公共驿站与医馆。' }
    ]
  },
  {
    id: 'gupta',
    name: '笈多帝国（印度古典黄金时代）',
    enName: 'Gupta Empire',
    colStart: 6.04, colEnd: 6.96,
    startYear: 320, endYear: 550,
    color: '#d49e4a',
    religionTags: ['印度教', '佛教'],
    capital: '华氏城',
    sphere: '北印度全境与德干高原朝贡圈',
    summary: '印度科学、数学与文学的古典巅峰！正式发明带“0”的十进制位值计数法（后经阿拉伯传遍全球称“阿拉伯数字”）及国际象棋原型；东晋法显曾亲历并记录其繁盛。',
    civilization: '十进制与“0”的系统运算、阿耶波多提出地球自转与圆周率近似值、阿旃陀石窟壁画、那烂陀大学、国际象棋雏形。',
    religionDetail: '印度教（毗湿奴、湿婆崇拜）定型复兴，佛教大乘学术中心那烂陀寺享誉亚洲。',
    keyFigures: [
      { name: '超日王（旃陀罗笈多二世）', role: '皇帝', years: '375—415在位', note: '法显访印时在位，盛赞其国富民安、刑罚宽仁' },
      { name: '阿耶波多', role: '数学/天文学家', years: '476—550', note: '创立三角函数正弦概念并推算地球自转' },
      { name: '迦梨陀娑', role: '诗圣/剧作家', years: '4—5世纪', note: '著《沙恭达罗》，被誉为印度莎士比亚' }
    ],
    periods: [
      { id: 'gupta_gold', name: '超日王盛世与那烂陀学术', startYear: 320, endYear: 550, capital: '华氏城', territoryDesc: '控制恒河至印度河流域，后期遭中亚嚈哒（白匈奴）入侵解体。', mapRegions: ['india_north'], highlights: '印度数字、医学、梵语文学达到巅峰。' }
    ]
  },
  {
    id: 'chola_medieval_india',
    name: '戒日王朝·朱罗海洋帝国与德里苏丹国',
    enName: 'Harsha, Chola & Delhi Sultanate',
    colStart: 6.04, colEnd: 6.96,
    startYear: 606, endYear: 1526,
    color: '#c9a66b',
    religionTags: ['印度教', '伊斯兰教', '佛教'],
    capital: '德里',
    sphere: '北印戒日/德里苏丹国 + 南印朱罗（注辇）海上帝国',
    summary: '唐玄奘西行求法正值戒日王治世；南印朱罗王朝建立强大海军远征东南亚；1206年起中亚突厥穆斯林在北印建立德里苏丹国，印度进入伊斯兰—印度教长期交融期。',
    civilization: '玄奘《大唐西域记》留存印度信史、朱罗青铜舞王湿婆雕塑、德里库图卜宣礼塔、印地/乌尔都语萌芽。',
    religionDetail: '佛教在印度本土渐衰（外传东亚/藏区/东南亚），印度教与伊斯兰教成为次大陆两大主体信仰。',
    keyFigures: [
      { name: '戒日王', role: '北印霸主', years: '606—647在位', note: '礼遇唐朝高僧玄奘，派遣使节通唐太宗' },
      { name: '拉金德拉一世', role: '朱罗皇帝', years: '1014—1044在位', note: '率印度海军横跨孟加拉湾征服三佛齐' }
    ],
    periods: [
      { id: 'harsha_chola', name: '戒日王（玄奘访印）与朱罗海权', startYear: 606, endYear: 1206, capital: '华氏城', territoryDesc: '北印封建诸国与南印强盛的海洋商业帝国。', mapRegions: ['india_north', 'india_south'], highlights: '南印度文化与建筑远播爪哇、吴哥与马来半岛。' },
      { id: 'delhi', name: '德里苏丹国', startYear: 1206, endYear: 1526, capital: '德里', territoryDesc: '突厥与阿富汗穆斯林王朝统治北印度，多次成功抵御蒙古察合台汗国入侵。', mapRegions: ['india_north'], highlights: '引入伊斯兰建筑与行政制度，保护次大陆免于蒙古洗劫。' }
    ]
  },
  {
    id: 'mughal',
    name: '莫卧儿帝国',
    enName: 'Mughal Empire',
    colStart: 6.04, colEnd: 6.96,
    startYear: 1526, endYear: 1857,
    color: '#a876a8',
    darkTextOff: true,
    religionTags: ['伊斯兰教', '印度教'],
    capital: '阿格拉',
    sphere: '几乎统一整个印度次大陆与阿富汗东部',
    summary: '中亚帖木儿与成吉思汗后裔巴布尔南下建立的“三大伊斯兰火药帝国”之一，全盛时期GDP占全球近四分之一，留下泰姬陵建筑绝唱！',
    civilization: '泰姬陵、红堡、世界最大棉纺织出口中心、融合波斯与印度美学的莫卧儿细密画。',
    religionDetail: '阿克巴大帝推行宗教宽容与联姻政策，废除异教人头税；晚期奥朗则布强推严苛政策引发教派裂痕。',
    keyFigures: [
      { name: '巴布尔', role: '开国皇帝', years: '1483—1530', note: '中亚费尔干纳王子，以火炮战术赢得帕尼帕特战役' },
      { name: '阿克巴大帝', role: '盛世明君', years: '1542—1605', note: '确立官僚税制与宗教宽容，帝国黄金时代奠基人' },
      { name: '沙贾汗', role: '皇帝', years: '1592—1666', note: '为爱妻修筑世界奇迹泰姬陵' }
    ],
    periods: [
      { id: 'akbar_shahjahan', name: '阿克巴与泰姬陵全盛期', startYear: 1526, endYear: 1707, capital: '阿格拉', territoryDesc: '横跨几乎全印度次大陆，人口逾1.5亿。', mapRegions: ['india_north', 'india_south'], highlights: '棉布与香料贸易吸引英法荷东印度公司纷至沓来。' },
      { id: 'british_raj_overlap', name: '帝国衰落与英属印度交替', startYear: 1707, endYear: 1857, capital: '德里', territoryDesc: '马拉塔崛起与英国东印度公司步步蚕食。', mapRegions: ['india_north'], highlights: '1857年印度民族大起义后被英国正式废黜，进入英属印度直辖期。' }
    ]
  },
  {
    id: 'modern_south_asia',
    name: '英属印度与现代南亚',
    enName: 'British Raj & Modern South Asia',
    colStart: 6.04, colEnd: 6.96,
    startYear: 1858, endYear: 2026,
    color: '#d99959',
    religionTags: ['印度教', '伊斯兰教'],
    capital: '德里',
    sphere: '印度、巴基斯坦、孟加拉国、斯里兰卡等',
    summary: '1858—1947年为大英帝国“王冠上的明珠”；甘地以非暴力不合作运动赢得独立，印巴分治后发展为全球人口第一大国与重要软件科技经济体。',
    civilization: '非暴力不合作运动、庞大铁路网、软件与航天工业、宝莱坞全球文化影响力。',
    religionDetail: '印度教占多数，同时拥有世界最大规模之一的穆斯林、锡克教与佛教社群。',
    keyFigures: [
      { name: '圣雄甘地', role: '印度国父', years: '1869—1948', note: '以非暴力不合作运动带领次大陆走向独立' },
      { name: '拉宾德拉纳特·泰戈尔', role: '文学巨匠', years: '1861—1941', note: '首位亚洲诺贝尔文学奖得主' }
    ],
    periods: [
      { id: 'raj', name: '英属印度与独立运动', startYear: 1858, endYear: 1947, capital: '德里', territoryDesc: '英国直辖印度、巴基斯坦与缅甸地区。', mapRegions: ['india_north', 'india_south'], highlights: '1947年蒙巴顿方案导致印巴分治独立。' },
      { id: 'india_modern', name: '现代印度与南亚崛起', startYear: 1947, endYear: 2026, capital: '德里', territoryDesc: '全球人口最多国家与新兴增长引擎。', mapRegions: ['india_north', 'india_south'], highlights: 'IT服务、医药制造与月球南极探测取得突破。' }
    ]
  },

  /* ===================== COL 7: 草原与中亚 (Steppe & Central Asia) ===================== */
  {
    id: 'indo_european_scythian',
    name: '印欧草原与斯基泰游牧圈',
    enName: 'Proto-Indo-European & Scythians',
    colStart: 7.04, colEnd: 7.96,
    startYear: -3000, endYear: -220,
    color: '#c2b98e',
    dashed: true,
    religionTags: ['草原萨满'],
    capital: '撒马尔罕',
    sphere: '黑海北岸至阿尔泰山与河中草原带',
    summary: '人类驯化马匹与发明双轮战车的策源地！印欧语族群从草原向四面八方扩散，塑造了欧洲、伊朗与北印度的语言与军事格局；斯基泰人以黄金动物纹艺术闻名。',
    civilization: '驯马术、辐条战车、复合反曲弓、草原黄金动物纹（野兽风格）艺术。',
    religionDetail: '萨满教与天空神崇拜，高大王陵墓葬（库尔干）。',
    keyFigures: [
      { name: '托米丽丝（传说）', role: '马萨革泰女王', years: '前6世纪', note: '据希罗多德记载在锡尔河畔击败波斯居鲁士大帝' }
    ],
    periods: [
      { id: 'chariot', name: '驯马、战车与印欧大扩散', startYear: -3000, endYear: -1000, capital: '撒马尔罕', territoryDesc: '欧亚草原带，向西入欧、向南入伊朗与印度、向东至阿尔泰。', mapRegions: ['russia_steppe', 'central_asia'], highlights: '彻底改变了人类战争速度与全球语系分布。' },
      { id: 'scythia', name: '斯基泰与月氏游牧联盟', startYear: -1000, endYear: -220, capital: '撒马尔罕', territoryDesc: '横跨黑海至天山北麓的骑射游牧世界。', mapRegions: ['russia_steppe', 'central_asia', 'xinjiang'], highlights: '骑马射箭技术成熟，开启游牧帝国时代。' }
    ]
  },
  {
    id: 'xiongnu',
    name: '匈奴帝国（南北分裂·西迁）',
    enName: 'Xiongnu Confederacy',
    colStart: 7.04, colEnd: 7.96,
    startYear: -209, endYear: 155,
    rects: [
      { colStart: 7.04, colEnd: 7.96, startYear: -209, endYear: -60, label: '匈奴帝国' },
      { colStart: 7.04, colEnd: 7.68, startYear: -60, endYear: 30, label: '匈奴' },
      { colStart: 7.40, colEnd: 7.68, startYear: 30, endYear: 155, label: '北匈奴西迁' }
    ],
    color: '#6e9ec9',
    darkTextOff: true,
    religionTags: ['草原萨满'],
    capital: '龙城',
    sphere: '蒙古高原、西域、河套至贝加尔湖',
    summary: '欧亚草原第一个超级游牧帝国！冒顿单于统一草原并与西汉激战百年；后分裂为南匈奴（内附中原，后建汉赵）与北匈奴（西迁中亚，演化为震撼罗马的匈人Huns！）。',
    civilization: '鸣镝响箭、控弦之士三十万的左右贤王体制、草原—丝路贸易控制网。',
    religionDetail: '崇拜撑犁（长生天/苍天）、日月与天地祖先，岁首聚龙城祭天。',
    keyFigures: [
      { name: '冒顿单于', role: '帝国缔造者', years: '前209—前174在位', note: '灭东胡、破月氏，白登之围迫汉初和亲' },
      { name: '呼韩邪单于', role: '南匈奴单于', years: '前58—前31在位', note: '归附西汉，“昭君出塞”换来汉匈数十年和平' },
      { name: '阿提拉（后世西迁匈人）', role: '匈人王', years: '406—453', note: '北匈奴西迁余波汇聚欧洲，重创东西罗马，被称为“上帝之鞭”' }
    ],
    periods: [
      { id: 'modu', name: '冒顿统一与汉匈百战', startYear: -209, endYear: -54, capital: '龙城', territoryDesc: '北抵贝加尔湖，西控西域三十六国，南临汉长城。', mapRegions: ['mongolia_steppe', 'xinjiang'], highlights: '汉武帝派卫青、霍去病漠北决战，匈奴西移并渐趋分裂。' },
      { id: 'split_west', name: '南北分裂与北匈奴西迁', startYear: -54, endYear: 155, capital: '龙城', territoryDesc: '南匈奴南迁并州融入中原；89年窦宪燕然勒功后，北匈奴远走康居与锡尔河！', mapRegions: ['mongolia_steppe', 'central_asia'], highlights: '点击上方“迁徙与脉络 → 匈奴西迁”可查看完整欧亚多米诺链条！' }
    ]
  },
  {
    id: 'kushan_sogdia',
    name: '贵霜帝国与中亚丝路城邦',
    enName: 'Kushan Empire & Sogdia',
    colStart: 7.04, colEnd: 7.40,
    startYear: 30, endYear: 375,
    color: '#b896c7',
    religionTags: ['佛教', '印度教'],
    capital: '白沙瓦',
    sphere: '阿富汗、巴基斯坦、中亚河中与北印度',
    summary: '被匈奴逐出河西走廊的大月氏西迁后建立的大帝国！与罗马、安息、东汉并称公元1—2世纪“欧亚四大帝国”，直接缔造了犍陀罗佛像艺术并推动佛教东传中国！',
    civilization: '犍陀罗希腊式佛像雕塑（佛陀首次拥有具象人形！）、丝路中枢、金币贸易。',
    religionDetail: '迦腻色伽王大力护持大乘佛教，召开佛教第四次结集，使佛教经西域源源传入汉地。',
    keyFigures: [
      { name: '迦腻色伽一世', role: '贵霜大帝', years: '约127—150在位', note: '大乘佛教大护法，推动犍陀罗艺术与丝路繁荣' }
    ],
    periods: [
      { id: 'kushan_peak', name: '欧亚四大帝国之一与佛教东传', startYear: 30, endYear: 375, capital: '白沙瓦', territoryDesc: '横跨中亚兴都库什山南北与北印度。', mapRegions: ['central_asia', 'india_north', 'xinjiang'], highlights: '由被匈奴驱逐的大月氏建立，反而成为佛教传入中国的桥梁！' }
    ]
  },
  {
    id: 'xianbei_rouran',
    name: '鲜卑与柔然汗国',
    enName: 'Xianbei & Rouran Khaganate',
    colStart: 7.40, colEnd: 7.96,
    startYear: 155, endYear: 552,
    rects: [
      { colStart: 7.40, colEnd: 7.68, startYear: 155, endYear: 175, label: '鲜卑' },
      { colStart: 7.40, colEnd: 7.96, startYear: 175, endYear: 375, label: '鲜卑诸部' },
      { colStart: 7.04, colEnd: 7.96, startYear: 375, endYear: 552, label: '柔然与嚈哒' }
    ],
    color: '#e5b3b8',
    religionTags: ['草原萨满', '佛教'],
    capital: '龙城',
    sphere: '蒙古高原、辽西至西域北道',
    summary: '北匈奴西迁后，鲜卑人填补蒙古高原真空，其中拓跋鲜卑南下建北魏统一华北；随后柔然首创“可汗”称号统治草原，并成为《木兰辞》中花木兰征战的对手。',
    civilization: '马镫在鲜卑时期成熟普及（彻底改写欧亚重骑兵战争！）、首创“可汗”尊号。',
    religionDetail: '萨满教与逐步传入的佛教并行。',
    keyFigures: [
      { name: '檀石槐', role: '鲜卑大人', years: '136—181', note: '统一鲜卑诸部，雄踞匈奴故地' },
      { name: '社仑', role: '柔然首任可汗', years: '402—410在位', note: '正式启用“可汗”称号，影响后世突厥与蒙古千年' }
    ],
    periods: [
      { id: 'steppe_relay', name: '鲜卑南下与柔然称汗', startYear: 155, endYear: 552, capital: '龙城', territoryDesc: '蒙古高原与大兴安岭草原带。', mapRegions: ['mongolia_steppe', 'manchuria'], highlights: '552年柔然被锻奴突厥推翻，部分余部西迁欧洲成为“阿瓦尔人”。' }
    ]
  },
  {
    id: 'gokturk_uyghur',
    name: '突厥汗国与回鹘 / 塞尔柱西迁',
    enName: 'Göktürks, Uyghurs & Central Asia',
    colStart: 7.04, colEnd: 7.96,
    startYear: 552, endYear: 1206,
    rects: [
      { colStart: 7.04, colEnd: 7.96, startYear: 552, endYear: 640, label: '东西突厥汗国' },
      { colStart: 7.04, colEnd: 7.64, startYear: 640, endYear: 790, label: '后突厥·回鹘' },
      { colStart: 7.04, colEnd: 7.96, startYear: 790, endYear: 1206, label: '回鹘西迁·喀喇汗·花剌子模' }
    ],
    color: '#b7a592',
    religionTags: ['草原萨满', '伊斯兰教', '佛教'],
    capital: '撒马尔罕',
    sphere: '从蒙古高原、西域直抵黑海北岸与河中地区',
    summary: '552年崛起的突厥汗国首次将欧亚草原东西打通；分裂与回鹘西迁后，突厥语族群涌入中亚并伊斯兰化，演化出喀喇汗、塞尔柱与后来的奥斯曼帝国！',
    civilization: '鄂尔浑突厥文、回鹘文（后成蒙古文与满文之母！）、粟特—突厥丝路贸易体系。',
    religionDetail: '从苍天萨满、摩尼教、佛教逐步过渡到中亚普遍伊斯兰化。',
    keyFigures: [
      { name: '土门 / 室点密', role: '突厥奠基兄弟', years: '6世纪中叶', note: '灭柔然建汗国，西联拜占庭直抵黑海' },
      { name: '默啜 / 毗伽可汗', role: '后突厥可汗', years: '7—8世纪', note: '立《阙特勤碑》，留存最早突厥语石刻文献' }
    ],
    periods: [
      { id: 'turk_khaganate', name: '东西突厥汗国', startYear: 552, endYear: 744, capital: '龙城', territoryDesc: '横跨蒙古高原至中亚与黑海，与隋唐反复博弈。', mapRegions: ['mongolia_steppe', 'xinjiang', 'central_asia'], highlights: '唐太宗灭东突厥获尊“天可汗”，唐高宗灭西突厥设安西/北庭都护府。' },
      { id: 'uyghur_turkic', name: '回鹘西迁与突厥伊斯兰化', startYear: 744, endYear: 1206, capital: '撒马尔罕', territoryDesc: '回鹘西迁新疆河西；喀喇汗、花剌子模、塞尔柱称雄中亚西亚。', mapRegions: ['xinjiang', 'central_asia', 'iran'], highlights: '深刻塑造了今天中亚五国、新疆与土耳其的语言人文格局。' }
    ]
  },
  {
    id: 'mongol_empire',
    name: '蒙古帝国（大蒙古国与四大汗国）',
    enName: 'Mongol Empire (Pax Mongolica)',
    colStart: 2.66, colEnd: 8.97,
    startYear: 1206, endYear: 1368,
    rects: [
      { colStart: 7.04, colEnd: 7.96, startYear: 1206, endYear: 1234, label: '大蒙古国' },
      { colStart: 7.04, colEnd: 8.46, startYear: 1234, endYear: 1279, label: '蒙古帝国（灭金西征）' },
      { colStart: 7.04, colEnd: 8.97, startYear: 1279, endYear: 1368, label: '元朝与察合台汗国' },
      { colStart: 2.66, colEnd: 2.96, startYear: 1240, endYear: 1480, label: '金帐汗国' },
      { colStart: 5.04, colEnd: 5.96, startYear: 1258, endYear: 1370, label: '伊尔汗国' }
    ],
    color: '#c9944c',
    darkTextOff: true,
    zIndex: 17,
    religionTags: ['草原萨满', '佛教', '伊斯兰教'],
    capital: '和林',
    sphere: '人类史上疆域最辽阔的连续陆地帝国：东起日本海、西至多瑙河与波斯湾',
    summary: '成吉思汗统一草原后发动三次西征与灭宋之战，将整个欧亚大陆首次打通为单一驿站网络（“蒙古和平”），让火药、活字、马可波罗与黑死病以前所未有的速度跨越洲际！',
    civilization: '横贯欧亚的站赤（驿站）与牌符护照、纸币交钞流通、全球天文/地理/医学知识大交汇（回回历法、蓝白青花瓷颜料苏麻离青）。',
    religionDetail: '高度宗教宽容：长生天信仰之下，藏传佛教、伊斯兰教、景教、道教与儒学共存。',
    keyFigures: [
      { name: '成吉思汗（铁木真）', role: '帝国缔造者', years: '1162—1227', note: '统一蒙古各部，创怯薛军与《大扎撒》，开启世界史转折' },
      { name: '拔都 / 旭烈兀', role: '西征统帅', years: '13世纪', note: '分别建立统治俄罗斯的金帐汗国与统治波斯的伊尔汗国' },
      { name: '忽必烈（元世祖）', role: '大汗/元朝开国皇帝', years: '1215—1294', note: '定都大都（北京），灭南宋统一中国，开创行省制度' }
    ],
    periods: [
      { id: 'genghis', name: '成吉思汗与三次西征', startYear: 1206, endYear: 1259, capital: '和林', territoryDesc: '灭西夏、花剌子模、金朝、基辅罗斯与阿拔斯巴格达。', mapRegions: ['mongolia_steppe', 'central_asia', 'xinjiang', 'china_north', 'iran', 'mesopotamia', 'russia_steppe', 'east_europe'], highlights: '欧亚大陆第一次被单一政治军事体系贯通。' },
      { id: 'yuan_khanates', name: '元朝大都与四大汗国（蒙古和平）', startYear: 1260, endYear: 1368, capital: '大都', territoryDesc: '元朝统治东亚与西藏，钦察/察合台/伊尔/窝阔台四大汗国分治欧亚草原与波斯。', mapRegions: ['china_north', 'china_south', 'mongolia_steppe', 'tibet', 'xinjiang', 'central_asia', 'iran', 'russia_steppe'], highlights: '马可波罗东来，北京直通黑海驿路畅行，中国首次将西藏正式纳入中央行政。' }
    ]
  },
  {
    id: 'timurid_steppe',
    name: '帖木儿帝国与准噶尔/中亚汗国',
    enName: 'Timurid Empire & Central Asian Khanates',
    colStart: 7.04, colEnd: 7.96,
    startYear: 1370, endYear: 1876,
    rects: [
      { colStart: 7.04, colEnd: 7.96, startYear: 1370, endYear: 1759, label: '帖木儿帝国·准噶尔汗国' },
      { colStart: 7.04, colEnd: 7.56, startYear: 1759, endYear: 1876, label: '中亚三汗国' }
    ],
    color: '#9c8db5',
    darkTextOff: true,
    religionTags: ['伊斯兰教', '佛教'],
    capital: '撒马尔罕',
    sphere: '河中撒马尔罕、伊朗东部、蒙古高原与新疆准噶尔',
    summary: '“跛子帖木儿”以撒马尔罕为都打造波斯—突厥文艺复兴奇迹，曾重创奥斯曼并拟东征明朝；其后裔巴布尔南下建莫卧儿帝国；清代则最终平定准噶尔统一新疆。',
    civilization: '撒马尔罕雷吉斯坦广场蓝瓷建筑群、乌鲁伯格超级天文台（测算回归年精确到秒级！）。',
    religionDetail: '中亚河中笃信伊斯兰教，蒙古与准噶尔皈依藏传佛教。',
    keyFigures: [
      { name: '帖木儿', role: '埃米尔', years: '1336—1405', note: '横扫中亚、印度与西亚，1405年东征明朝途中病逝' },
      { name: '乌鲁伯格', role: '天文学家国王', years: '1394—1449', note: '建当时世界最精确天文台，编纂千星表' }
    ],
    periods: [
      { id: 'timurid', name: '帖木儿文艺复兴', startYear: 1370, endYear: 1507, capital: '撒马尔罕', territoryDesc: '撒马尔罕、赫拉特与波斯东部。', mapRegions: ['central_asia', 'iran'], highlights: '中亚艺术、建筑与天文学的最后黄金时代。' },
      { id: 'khanates', name: '准噶尔、哈萨克与中亚三汗国', startYear: 1507, endYear: 1876, capital: '撒马尔罕', territoryDesc: '海权崛起后陆上丝路衰落，逐步被清朝与沙俄分治。', mapRegions: ['central_asia', 'xinjiang', 'mongolia_steppe'], highlights: '1759年清朝平定准噶尔与大小和卓，19世纪沙俄吞并中亚三汗国。' }
    ]
  },
  {
    id: 'modern_central_asia',
    name: '现代中亚与蒙古国',
    enName: 'Modern Central Asia & Mongolia',
    colStart: 7.04, colEnd: 7.96,
    startYear: 1876, endYear: 2026,
    rects: [
      { colStart: 7.04, colEnd: 7.56, startYear: 1876, endYear: 1912, label: '俄属中亚' },
      { colStart: 7.04, colEnd: 7.96, startYear: 1912, endYear: 2026, label: '现代中亚五国与蒙古' }
    ],
    color: '#a3b39c',
    religionTags: ['伊斯兰教', '佛教'],
    capital: '撒马尔罕',
    sphere: '哈萨克、乌兹别克等中亚五国及蒙古国',
    summary: '历经俄国统治、苏联加盟共和国建设，1991年独立后成为连接欧亚大陆“新丝绸之路”与能源走廊的关键枢纽。',
    civilization: '拜科努尔航天发射场（加加林升空地）、欧亚陆桥铁路网。',
    religionDetail: '中亚五国以世俗伊斯兰教为主，蒙古国以藏传佛教为主。',
    keyFigures: [
      { name: '努尔苏丹·纳扎尔巴耶夫', role: '哈萨克斯坦首任总统', years: '1940—', note: '推动独立后经济转型与核裁军' }
    ],
    periods: [
      { id: 'ca_modern', name: '现代主权国家与新丝路', startYear: 1991, endYear: 2026, capital: '撒马尔罕', territoryDesc: '中亚五国与蒙古高原。', mapRegions: ['central_asia', 'mongolia_steppe'], highlights: '中欧班列重焕古代丝路陆运活力。' }
    ]
  },

  /* ===================== COL 8: 中华与中原 (China / Central Plains) ===================== */
  {
    id: 'neolithic_xia',
    name: '仰韶·良渚与夏朝',
    enName: 'Neolithic Cultures & Xia Dynasty',
    colStart: 8.03, colEnd: 8.97,
    startYear: -3500, endYear: -1600,
    color: '#e6d2a8',
    dashed: true,
    religionTags: ['儒道', '古代多神'],
    capital: '洛邑',
    sphere: '黄河中下游（仰韶/龙山/二里头）与长江下游（良渚）',
    summary: '中华文明多元一体起源：良渚古国修筑了距今5000年的超级水利大坝与玉琮礼制，二里头文化则呈现了广域王权国家（夏）的早期礼乐与青铜铸造。',
    civilization: '水稻与粟作农业双核、良渚古城水利与精雕玉器、二里头绿松石龙形器与青铜爵。',
    religionDetail: '玉礼神灵、祖先崇拜与早期观象授时。',
    keyFigures: [
      { name: '大禹', role: '治水圣王/夏奠基者', years: '约前2070', note: '疏导洪水，划定九州，开创“家天下”先声' }
    ],
    periods: [
      { id: 'liangzhu_xia', name: '良渚古国与二里头夏文化', startYear: -3500, endYear: -1600, capital: '洛邑', territoryDesc: '黄河与长江流域满天星斗汇聚中原。', mapRegions: ['china_north', 'china_south'], highlights: '约前1600年进入成熟青铜王朝时代，此时西伯利亚猛犸象甚至还未完全灭绝！' }
    ]
  },
  {
    id: 'shang',
    name: '商朝（甲骨文与青铜巅峰）',
    enName: 'Shang Dynasty',
    colStart: 8.03, colEnd: 8.97,
    startYear: -1600, endYear: -1046,
    color: '#d4b475',
    religionTags: ['古代多神'],
    capital: '殷墟',
    sphere: '黄河中下游华北平原及长江流域青铜文化圈（三星堆同期）',
    summary: '中国首个拥有直接同时代文字实证（殷墟甲骨文）的王朝！青铜铸造工艺冠绝世界，同期西南四川盆地闪耀着神秘的三星堆青铜文明。',
    civilization: '成熟甲骨文（汉字直接源头）、后母戊鼎/四羊方尊、干支纪日法、马拉战车普及。',
    religionDetail: '崇拜“帝”与祖先神灵，大事必经龟甲兽骨占卜。',
    keyFigures: [
      { name: '商汤', role: '开国君主', years: '约前1600', note: '鸣条之战灭夏建商' },
      { name: '武丁与妇好', role: '中兴之主/女统帅', years: '约前1250—前1192', note: '武丁盛世甲骨文大兴，王后妇好是中国史上首位女军事家' }
    ],
    periods: [
      { id: 'yinxu', name: '盘庚迁殷与武丁盛世', startYear: -1300, endYear: -1046, capital: '殷墟', territoryDesc: '以安阳殷墟为都，势力辐射淮河、长江与关中。', mapRegions: ['china_north'], highlights: '十余万片甲骨记录了天文日食、战争与社会生活。' }
    ]
  },
  {
    id: 'west_zhou',
    name: '西周（礼乐与分封）',
    enName: 'Western Zhou Dynasty',
    colStart: 8.03, colEnd: 8.97,
    startYear: -1046, endYear: -771,
    color: '#c9c282',
    religionTags: ['儒道'],
    capital: '镐京',
    sphere: '关中至中原、齐鲁、燕赵、吴楚广袤分封疆域',
    summary: '提出“天命靡常、以德配天”的人文政治革命，制礼作乐、分封诸侯、确立宗法制与井田制，奠定了中华文明三千年的文化基因与“中国”一词（何尊铭文）！',
    civilization: '青铜铭文《何尊》首次出现“宅兹中国”、周礼乐制度、《诗经》《周易》早期结集。',
    religionDetail: '从商代神权占卜转向“敬天保民”的道德天命观。',
    keyFigures: [
      { name: '周武王', role: '开国君主', years: '前1046在位', note: '牧野之战灭商建周' },
      { name: '周公旦', role: '摄政/圣人', years: '前11世纪', note: '平定三监之乱，营建洛邑，制礼作乐，孔子毕生敬仰' }
    ],
    periods: [
      { id: 'chengkang', name: '成康之治与礼乐成型', startYear: -1046, endYear: -771, capital: '镐京', territoryDesc: '分封齐鲁晋燕楚吴等诸侯，极大扩展华夏文化圈。', mapRegions: ['china_north'], highlights: '前771年犬戎破镐京，周平王东迁洛邑开启东周。' }
    ]
  },
  {
    id: 'spring_warring',
    name: '东周（春秋战国·百家争鸣）',
    enName: 'Spring & Autumn / Warring States',
    colStart: 8.03, colEnd: 8.97,
    startYear: -770, endYear: -221,
    color: '#b8d199',
    religionTags: ['儒道'],
    capital: '洛邑',
    sphere: '华夏诸侯争霸扩张至长江、巴蜀、岭南与辽东',
    summary: '中国思想史最璀璨的“轴心时代”黄金爆发！铁犁牛耕普及、诸侯兼并变法，儒道法墨兵诸子百家争鸣，与古希腊哲学、印度佛教几乎完全同步！',
    civilization: '铁器冶炼领先欧洲千余年、都江堰水利工程、商鞅变法与郡县制萌芽、《孙子兵法》、二十四节气成型。',
    religionDetail: '孔子创儒家、老庄创道家、墨子倡兼爱、韩非集法家大成，奠定东亚精神底座。',
    keyFigures: [
      { name: '孔子', role: '儒家至圣', years: '前551—前479', note: '创办私学、倡导仁礼，塑造东亚两千年文明秩序' },
      { name: '老子 / 庄子', role: '道家宗师', years: '前6—前4世纪', note: '《道德经》提出道法自然与辩证哲学' },
      { name: '孙武', role: '兵圣', years: '前545—前470', note: '著《孙子兵法》，传世至今的战略圣经' },
      { name: '商鞅', role: '法家改革家', years: '前390—前338', note: '秦国变法强兵，奠定统一六国制度基石' }
    ],
    periods: [
      { id: 'spring_autumn', name: '春秋五霸与诸子发端', startYear: -770, endYear: -476, capital: '洛邑', territoryDesc: '齐晋楚秦吴越争霸，孔子、老子、孙子辈出。', mapRegions: ['china_north', 'china_south'], highlights: '礼崩乐坏中催生出空前活跃的士阶层与思想解放。' },
      { id: 'warring_states', name: '战国七雄与变法兼并', startYear: -475, endYear: -221, capital: '咸阳', territoryDesc: '秦齐楚燕韩赵魏七强角逐，建万里长城雏形与都江堰。', mapRegions: ['china_north', 'china_south'], highlights: '从贵族封建全面转型为官僚郡县制国家。' }
    ]
  },
  {
    id: 'qin',
    name: '秦朝',
    enName: 'Qin Dynasty',
    colStart: 8.03, colEnd: 8.97,
    startYear: -221, endYear: -206,
    color: '#6b7085',
    darkTextOff: true,
    religionTags: ['儒道'],
    capital: '咸阳',
    sphere: '北筑万里长城、南定百越岭南、首次大一统华夏',
    summary: '虽仅存15年（在1:1线性时间轴上薄如刀锋！），却以“书同文、车同轨、废分封行郡县、统一度量衡”奠定了此后两千余年大一统中华帝国的根本骨架。',
    civilization: '中央集权三公九卿与郡县制、小篆统一文字、驰道直道网、灵渠连通长江珠江、兵马俑。',
    religionDetail: '崇尚法家法治效率，兼采阴阳五行“水德”学说。',
    keyFigures: [
      { name: '秦始皇（嬴政）', role: '千古一帝', years: '前259—前210', note: '横扫六国，首创皇帝称号与郡县大一统，同期阿基米德在叙拉古' },
      { name: '李斯 / 蒙恬', role: '丞相/名将', years: '前3世纪', note: '分别主持统一文字法制与北击匈奴修筑长城' }
    ],
    periods: [
      { id: 'qin_unify', name: '大一统十五年巨变', startYear: -221, endYear: -206, capital: '咸阳', territoryDesc: '东至大海，西至陇西，北抵阴山，南至交趾。', mapRegions: ['china_north', 'china_south'], highlights: '严刑峻法与大兴土木引发陈胜吴广起义，楚汉之争后汉兴。' }
    ]
  },
  {
    id: 'west_han',
    name: '西汉（几乎全在公元前！）',
    enName: 'Western Han Dynasty',
    colStart: 7.72, colEnd: 8.97,
    startYear: -202, endYear: 8,
    rects: [
      { colStart: 8.03, colEnd: 8.97, startYear: -202, endYear: 8, label: '西汉（96%在公元前！）' },
      { colStart: 7.68, colEnd: 8.03, startYear: -60, endYear: 8, label: '西域都护' }
    ],
    color: '#88c47a',
    zIndex: 13,
    religionTags: ['儒道'],
    capital: '长安',
    sphere: '中原、江南、岭南、朝鲜北部，汉武帝起设河西四郡与西域都护府',
    summary: '⚡冷知识：西汉存续210年，96%都在公元前（耶稣诞生前）！从文景之治到汉武大帝北击匈奴、张骞凿空西域，正式塑造了“汉族”“汉字”“丝绸之路”的永恒底色。',
    civilization: '张骞通西域开启丝绸之路、司马迁《史记》、蔡伦前身早期麻纸、浑天仪雏形、太学与察举制、盐铁官营。',
    religionDetail: '汉初崇尚黄老道家休养生息；汉武帝“罢黜百家，独尊儒术”确立外儒内法传统。',
    keyFigures: [
      { name: '汉高祖刘邦', role: '开国皇帝', years: '前256—前195', note: '楚汉胜出建汉，开启四百年两汉基业' },
      { name: '汉武帝刘彻', role: '雄才大帝', years: '前156—前87', note: '派卫青霍去病封狼居胥、张骞通西域，与罗马共和国同期' },
      { name: '司马迁', role: '史圣', years: '前145—前86', note: '忍辱著成纪传体通史巅峰《史记》' },
      { name: '张骞 / 霍去病', role: '外交家/战神', years: '前2世纪', note: '打通河西走廊与丝绸之路，直接触发欧亚大联通' }
    ],
    periods: [
      { id: 'wenjing', name: '汉初与文景之治', startYear: -202, endYear: -141, capital: '长安', territoryDesc: '休养生息、轻徭薄赋，国库充盈。', mapRegions: ['china_north', 'china_south'], highlights: '积蓄了反击匈奴的雄厚国力。' },
      { id: 'hanwudi', name: '汉武盛世与凿空西域', startYear: -141, endYear: -87, capital: '长安', territoryDesc: '夺取河套与河西四郡，威震西域与南越。', mapRegions: ['china_north', 'china_south', 'xinjiang', 'korea'], highlights: '公元前119年漠北决战打散匈奴王庭；此时罗马凯撒尚未出生！' },
      { id: 'zhaoxuan', name: '昭宣中兴与西域都护府', startYear: -87, endYear: 8, capital: '长安', territoryDesc: '前60年正式设立西域都护府，新疆纳入中央版图。', mapRegions: ['china_north', 'china_south', 'xinjiang'], highlights: '呼韩邪单于归附、昭君出塞；公元8年王莽代汉建新朝。' }
    ]
  },
  {
    id: 'east_han',
    name: '东汉（含西域都护府）',
    enName: 'Eastern Han Dynasty',
    colStart: 7.72, colEnd: 8.97,
    startYear: 25, endYear: 220,
    rects: [
      { colStart: 8.03, colEnd: 8.97, startYear: 25, endYear: 220, label: '东汉' },
      { colStart: 7.68, colEnd: 8.03, startYear: 74, endYear: 175, label: '西域都护' }
    ],
    color: '#9fd08a',
    zIndex: 12,
    religionTags: ['儒道', '佛教'],
    capital: '洛阳',
    sphere: '华夏本土 + 班超重通西域都护府，与罗马帝国遥相呼应',
    summary: '光武中兴再造大汉；蔡伦改进造纸术、张衡造地动仪、佛教正式传入建白马寺；89年窦宪大破北匈奴燕然勒功，意外按下匈奴西迁与罗马命运的多米诺骨牌！',
    civilization: '蔡伦造纸术（改变全人类文明史）、张衡候风地动仪与浑天仪、张仲景《伤寒杂病论》、华佗麻沸散、《九章算术》。',
    religionDetail: '儒家经学极盛；佛教经丝路传入建洛阳白马寺；本土道教（五斗米道/太平道）正式创立。',
    keyFigures: [
      { name: '汉光武帝刘秀', role: '中兴之主', years: '前5—57', note: '昆阳之战以少胜多，开创柔道治国的光武中兴' },
      { name: '班超 / 窦宪', role: '西域都护/名将', years: '1世纪', note: '班超三十六人定西域，窦宪燕然勒功逼走北匈奴' },
      { name: '蔡伦 / 张衡', role: '发明家/科学家', years: '1—2世纪', note: '造纸术与天文学地震仪震撼古今' }
    ],
    periods: [
      { id: 'guangwu_mingzhang', name: '光武中兴与明章之治', startYear: 25, endYear: 105, capital: '洛阳', territoryDesc: '恢复西域都护府，甘英出使大秦抵波斯湾。', mapRegions: ['china_north', 'china_south', 'xinjiang'], highlights: '89年大破北匈奴；105年蔡伦奏报改进造纸术；166年罗马使团抵洛阳。' },
      { id: 'late_han', name: '外戚宦官与汉末群雄', startYear: 105, endYear: 220, capital: '洛阳', territoryDesc: '黄巾起义后曹操、刘备、孙权三分天下雏形已成。', mapRegions: ['china_north', 'china_south'], highlights: '建安文学璀璨，220年曹丕代汉开启三国。' }
    ]
  },
  {
    id: 'three_kingdoms_wei',
    name: '魏',
    enName: 'Cao Wei',
    colStart: 8.03, colEnd: 8.40,
    startYear: 220, endYear: 266,
    color: '#93b7e0',
    religionTags: ['儒道'],
    capital: '洛阳',
    sphere: '北方中原、关中与西域长史府',
    summary: '三国中实力最雄厚政权，曹操奠基、推行屯田与九品中正制，建安风骨光照文坛。',
    civilization: '马钧改进翻车水车、刘徽注《九章算术》创割圆术、九品中正制。',
    religionDetail: '玄学兴起，竹林七贤开启魏晋风度。',
    keyFigures: [
      { name: '曹操 / 曹丕', role: '奠基者/魏文帝', years: '155—226', note: '统一北方，唯才是举，开创建安文学' },
      { name: '司马懿', role: '权臣/军事家', years: '179—251', note: '抵御诸葛亮北伐，高平陵之变奠定西晋基业' }
    ],
    periods: [
      { id: 'wei', name: '曹魏统北方', startYear: 220, endYear: 266, capital: '洛阳', territoryDesc: '黄河流域及辽东、河西。', mapRegions: ['china_north'], highlights: '263年灭蜀汉，266年司马炎代魏建西晋。' }
    ]
  },
  {
    id: 'three_kingdoms_shu',
    name: '蜀汉',
    enName: 'Shu Han',
    colStart: 8.40, colEnd: 8.66,
    startYear: 221, endYear: 263,
    color: '#6b9454',
    darkTextOff: true,
    religionTags: ['儒道'],
    capital: '成都',
    sphere: '益州（巴蜀）、汉中与南中',
    summary: '刘备、诸葛亮以蜀地一隅扛起兴复汉室大旗，治蜀严明、发展蜀锦与水利，忠义精神成为千年文化图腾。',
    civilization: '蜀锦贸易、木牛流马、都江堰岁修制度、开发西南民族地区。',
    religionDetail: '尊崇儒家忠义与法家严明治理。',
    keyFigures: [
      { name: '刘备 / 诸葛亮', role: '昭烈帝/武侯', years: '161—234', note: '隆中对三分天下，六出祁山鞠躬尽瘁' }
    ],
    periods: [
      { id: 'shu', name: '赤壁鼎立与北伐曹魏', startYear: 221, endYear: 263, capital: '成都', territoryDesc: '四川盆地、汉中与云贵。', mapRegions: ['china_south'], highlights: '263年邓艾偷渡阴平灭蜀。' }
    ]
  },
  {
    id: 'three_kingdoms_wu',
    name: '东吴',
    enName: 'Eastern Wu',
    colStart: 8.66, colEnd: 8.97,
    startYear: 222, endYear: 280,
    color: '#c988a8',
    religionTags: ['儒道', '佛教'],
    capital: '建康',
    sphere: '江东、荆南与岭南交州',
    summary: '孙权据长江天险大力开发江南，造船航海远至夷洲（台湾）与扶南（东南亚），开启中国经济重心南移的序幕。',
    civilization: '造船与远洋航海、江南青瓷（越窑）成熟、建康城兴起。',
    religionDetail: '江南佛教与道教神仙思想并行发展。',
    keyFigures: [
      { name: '孙权 / 周瑜', role: '吴大帝/大都督', years: '175—252', note: '赤壁之战大破曹军，稳固江东半壁' }
    ],
    periods: [
      { id: 'wu', name: '开发江南与远航夷洲', startYear: 222, endYear: 280, capital: '建康', territoryDesc: '长江中下游与华南沿海。', mapRegions: ['china_south'], highlights: '280年西晋水陆并进灭吴，短暂重归统一。' }
    ]
  },
  {
    id: 'west_jin',
    name: '西晋',
    enName: 'Western Jin',
    colStart: 8.03, colEnd: 8.97,
    startYear: 266, endYear: 316,
    rects: [
      { colStart: 8.03, colEnd: 8.66, startYear: 266, endYear: 280, label: '西晋' },
      { colStart: 8.03, colEnd: 8.97, startYear: 280, endYear: 304, label: '西晋（短暂统一）' },
      { colStart: 8.52, colEnd: 8.97, startYear: 304, endYear: 316, label: '西晋末' }
    ],
    color: '#d8ebd2',
    religionTags: ['儒道'],
    capital: '洛阳',
    sphere: '短暂统一中原、巴蜀与江南',
    summary: '司马炎灭吴短暂一统天下，但八王之乱掏空国力，内迁的匈奴（刘渊）、羯、鲜卑、氐、羌等五胡顺势崛起，311年永嘉之乱衣冠南渡！',
    civilization: '太康文学、裴秀《禹贡地域图》创立“制图六体”（中国古代科学地图学鼻祖）。',
    religionDetail: '玄学清谈风行士族，佛教深入朝野。',
    keyFigures: [
      { name: '司马炎', role: '晋武帝', years: '236—290', note: '结束三国分裂，却因分封同姓诸王埋下八王之乱祸根' }
    ],
    periods: [
      { id: 'jin_short', name: '太康统一与永嘉衣冠南渡', startYear: 266, endYear: 316, capital: '洛阳', territoryDesc: '280—316年短暂统一，随后华北陷入十六国混战。', mapRegions: ['china_north', 'china_south'], highlights: '直接与南匈奴刘渊建汉赵（304）呼应。' }
    ]
  },
  {
    id: 'sixteen_north_dynasties',
    name: '十六国 · 北魏 · 西魏东魏 · 北周北齐',
    enName: 'Sixteen Kingdoms & Northern Dynasties',
    colStart: 8.03, colEnd: 8.52,
    startYear: 304, endYear: 581,
    color: '#e86868',
    darkTextOff: true,
    religionTags: ['佛教', '儒道'],
    capital: '洛阳',
    sphere: '中国北方（华北、关中、河西与东北）',
    summary: '草原与中原史上最剧烈的大融合！匈奴、氐、鲜卑轮番入主华北，北魏孝文帝推行全面汉化，北周宇文泰创立府兵制与关陇集团——直接孕育出大一统的盛唐气象！',
    civilization: '云冈石窟与龙门石窟、贾思勰《齐民要术》、郦道元《水经注》、府兵制与均田制。',
    religionDetail: '佛教空前兴盛，鸠摩罗什长安译经、莫高窟开凿，石窟艺术震撼世界。',
    keyFigures: [
      { name: '苻坚（前秦）', role: '氐族大帝', years: '338—385', note: '一度统一北方，383年淝水之战败于东晋' },
      { name: '北魏孝文帝拓跋宏', role: '改革大帝', years: '467—499', note: '迁都洛阳、穿汉服说汉语改汉姓，开启胡汉空前大融合' },
      { name: '宇文泰', role: '北周奠基者', years: '507—556', note: '创立府兵制与关陇贵族集团，奠定隋唐统一班底' }
    ],
    periods: [
      { id: 'sixteen', name: '五胡十六国（匈奴汉赵·前秦）', startYear: 304, endYear: 439, capital: '长安', territoryDesc: '南匈奴刘渊首举大旗，前秦短暂一统北方，河西走廊成文化避风港。', mapRegions: ['china_north'], highlights: '民族大迁徙与文化大碰撞。' },
      { id: 'north_wei', name: '北魏与孝文帝汉化', startYear: 386, endYear: 534, capital: '洛阳', territoryDesc: '拓跋鲜卑统一华北，迁都洛阳。', mapRegions: ['china_north'], highlights: '开凿云冈、龙门石窟；六镇起义后分裂为东魏/西魏 -> 北齐/北周。' },
      { id: 'zhou_qi', name: '北周北齐与关陇崛起', startYear: 534, endYear: 581, capital: '长安', territoryDesc: '577年北周灭北齐统一北方，581年杨坚受禅建隋。', mapRegions: ['china_north'], highlights: '为结束近300年分裂做好全部制度准备。' }
    ]
  },
  {
    id: 'east_jin_south_dynasties',
    name: '东晋 · 宋齐梁陈（南朝）',
    enName: 'Eastern Jin & Southern Dynasties',
    colStart: 8.52, colEnd: 8.97,
    startYear: 317, endYear: 589,
    color: '#a8dbe5',
    religionTags: ['儒道', '佛教'],
    capital: '建康',
    sphere: '秦岭淮河以南、江南与岭南（建康为都）',
    summary: '北方士族衣冠南渡全面开发江南！门阀政治、王羲之书法、顾恺之绘画、陶渊明山水田园诗、祖冲之精确圆周率，缔造了中国美学最飘逸风雅的时代。',
    civilization: '祖冲之将圆周率算至3.1415926（领先欧洲千年！）、王羲之《兰亭集序》、刘勰《文心雕龙》、江南水稻与海贸大开发。',
    religionDetail: '佛教“南朝四百八十寺”、法显西行取经、梁武帝崇佛与达摩东渡禅宗发端。',
    keyFigures: [
      { name: '谢安', role: '东晋名相', years: '320—385', note: '谈笑间指挥淝水之战以八万破前秦大军' },
      { name: '王羲之 / 陶渊明', role: '书圣/隐逸诗宗', years: '4—5世纪', note: '树立中国书法与诗学千古标杆' },
      { name: '祖冲之', role: '数学/天文学家', years: '429—500', note: '大明历与高精度圆周率震撼世界数学史' }
    ],
    periods: [
      { id: 'east_jin', name: '东晋门阀与淝水之战', startYear: 317, endYear: 420, capital: '建康', territoryDesc: '王与马共天下，稳固江南半壁。', mapRegions: ['china_south'], highlights: '衣冠南渡带来北方先进农耕与中原文化。' },
      { id: 'south_four', name: '刘宋·南齐·梁·陈', startYear: 420, endYear: 589, capital: '建康', territoryDesc: '建康成为当时全球首个百万人口级繁华大都市。', mapRegions: ['china_south'], highlights: '589年隋军渡江灭陈，天下重归大一统。' }
    ]
  },
  {
    id: 'sui',
    name: '隋朝（大运河与科举）',
    enName: 'Sui Dynasty',
    colStart: 8.03, colEnd: 8.97,
    startYear: 581, endYear: 618,
    rects: [
      { colStart: 8.03, colEnd: 8.52, startYear: 581, endYear: 589, label: '隋' },
      { colStart: 8.03, colEnd: 8.97, startYear: 589, endYear: 618, label: '隋朝（统一南北·大运河）' }
    ],
    color: '#3aa3db',
    darkTextOff: true,
    religionTags: ['佛教', '儒道'],
    capital: '长安',
    sphere: '结束近300年南北分裂，重归大一统并通河西西域',
    summary: '如同秦朝之于汉，短暂却极其辉煌的奠基帝国：首创科举制打破门阀垄断、确立三省六部制、贯通京杭大运河将南北经济融为一体！',
    civilization: '京杭大运河、三省六部制、进士科（科举制起点）、赵州桥（世界最早敞肩石拱桥）、大兴城（唐长安城蓝本）。',
    religionDetail: '隋文帝广建佛塔弘法，儒释道三教并行。',
    keyFigures: [
      { name: '隋文帝杨坚', role: '开国皇帝', years: '541—604', note: '一统南北，创“开皇之治”，西方学者称其为伟大统一者' },
      { name: '隋炀帝杨广', role: '皇帝', years: '569—618', note: '开运河、设进士科、巡张掖万国博览，但三征高句丽耗竭国力' }
    ],
    periods: [
      { id: 'sui_unify', name: '开皇之治与贯通大运河', startYear: 581, endYear: 618, capital: '长安', territoryDesc: '统一全中国，东抵渤海，西达青海与西域。', mapRegions: ['china_north', 'china_south'], highlights: '制度遗产直接滋养出盛唐三百年。' }
    ]
  },
  {
    id: 'tang',
    name: '唐朝（盛唐·安西都护府）',
    enName: 'Tang Dynasty',
    colStart: 7.62, colEnd: 8.97,
    startYear: 618, endYear: 907,
    rects: [
      { colStart: 8.03, colEnd: 8.97, startYear: 618, endYear: 907, label: '唐朝（盛唐）' },
      { colStart: 7.64, colEnd: 8.03, startYear: 640, endYear: 790, label: '安西都护' }
    ],
    color: '#e5924c',
    darkTextOff: true,
    zIndex: 13,
    religionTags: ['儒道', '佛教'],
    capital: '长安',
    sphere: '中原、江南、岭南、安西/北庭都护府（直抵葱岭中亚）及东亚文化圈核心',
    summary: '中国乃至同时代全人类最自信、开放、璀璨的国际大帝国！长安聚集波斯、粟特、阿拉伯、日本遣唐使与天竺高僧；唐诗、雕版印刷与火药雏形照耀中古世界。',
    civilization: '雕版印刷术（现存最早《金刚经》868年）、火药配方初见、唐律疏议（东亚法系蓝本）、唐诗黄金时代、均田与两税法、世界性大都会长安。',
    religionDetail: '极致开放包容：佛教禅宗成型（玄奘取经、鉴真东渡）、道教、儒学，长安并存景教（基督教）、祆教、摩尼教与清真寺！',
    keyFigures: [
      { name: '唐太宗李世民', role: '天可汗', years: '598—649', note: '开创贞观之治，纳谏如流，威服草原尊称天可汗' },
      { name: '武则天', role: '中国唯一女皇帝', years: '624—705', note: '大兴科举与殿试，承上启下延续盛唐国运' },
      { name: '唐玄宗李隆基', role: '皇帝', years: '685—762', note: '缔造开元盛世极峰，却因安史之乱由盛转衰' },
      { name: '李白 / 杜甫 / 玄奘', role: '诗仙/诗圣/高僧', years: '7—8世纪', note: '盛唐文化与中外交流的永恒灯塔' }
    ],
    periods: [
      { id: 'zhenguan', name: '贞观之治与万国来朝', startYear: 618, endYear: 712, capital: '长安', territoryDesc: '灭东西突厥与高句丽，设安西、安北、安东都护府，疆域抵中亚咸海。', mapRegions: ['china_north', 'china_south', 'xinjiang', 'mongolia_steppe', 'korea'], highlights: '文成公主入藏、玄奘西行归国、日本派遣唐使全面学唐。' },
      { id: 'kaiyuan', name: '开元盛世巅峰', startYear: 712, endYear: 755, capital: '长安', territoryDesc: '人口逾7000万，长安成为百万人口国际大都，与巴格达阿拔斯并辉。', mapRegions: ['china_north', 'china_south', 'xinjiang'], highlights: '李白杜甫并世，丝路商队昼夜不绝。' },
      { id: 'anshi', name: '安史之乱与中晚唐转型', startYear: 755, endYear: 907, capital: '长安', territoryDesc: '藩镇割据、吐蕃占河西，经济重心加速南移至江南。', mapRegions: ['china_north', 'china_south'], highlights: '两税法改革、茶叶与海上丝路大兴。' }
    ]
  },
  {
    id: 'liao_xixia_jin',
    name: '辽（契丹）·西夏·金（女真）',
    enName: 'Liao, Western Xia & Jin Dynasties',
    colStart: 8.03, colEnd: 8.46,
    startYear: 916, endYear: 1234,
    color: '#c98872',
    religionTags: ['佛教', '儒道', '草原萨满'],
    capital: '北京',
    sphere: '北方草原、燕云十六州、河西走廊及后期淮河以北',
    summary: '与两宋长期并立的北方多元政权：契丹辽朝首创“南北面官”双轨制，其名“契丹（Cathay）”成为俄罗斯与欧洲对中国的古老称呼；女真金朝定都中都（今北京），正式开启北京870年国都史！',
    civilization: '辽代木塔（应县木塔）与燕云防务、西夏活字印刷、金中都营建、元曲前身诸宫调。',
    religionDetail: '笃信佛教（雕印《契丹藏》），同时全面吸收儒家科举礼制。',
    keyFigures: [
      { name: '耶律阿保机', role: '辽太祖', years: '872—926', note: '统一契丹建辽，创南北面官治理游牧与农耕' },
      { name: '完颜阿骨打', role: '金太祖', years: '1068—1123', note: '统一女真反辽建金，迅速横扫北方' }
    ],
    periods: [
      { id: 'liao_xia', name: '辽宋檀渊之盟与西夏鼎立', startYear: 916, endYear: 1125, capital: '北京', territoryDesc: '契丹控制东北、内蒙与燕云，西夏控河西走廊。', mapRegions: ['manchuria', 'mongolia_steppe', 'china_north'], highlights: '1005年澶渊之盟换来宋辽百年和平与榷场繁盛。' },
      { id: 'jin', name: '金朝入主华北与定都中都', startYear: 1115, endYear: 1234, capital: '北京', territoryDesc: '1127年靖康之变后与南宋以淮河大散关为界。', mapRegions: ['manchuria', 'china_north'], highlights: '1153年迁都燕京（北京），1234年亡于蒙宋联军。' }
    ]
  },
  {
    id: 'song',
    name: '两宋（北宋·南宋·商业科技巅峰）',
    enName: 'Song Dynasty (Northern & Southern)',
    colStart: 8.46, colEnd: 8.97,
    startYear: 960, endYear: 1279,
    color: '#7ab8c9',
    religionTags: ['儒道', '佛教'],
    capital: '开封',
    sphere: '中原与江南（北宋）-> 淮河以南与发达海上丝路（南宋）',
    summary: '中国古代经济、科技、市民文化与美学的最高峰！发明世界最早纸币“交子”、毕昇活字印刷、指南针航海与火药武器化，恰逢西欧刚建立牛津大学（1096）！',
    civilization: '三大发明成熟爆发（活字印刷、罗盘航海、火药火器）、世界首张纸币交子、开封/临安不夜城夜市、五大名窑瓷器、《清明上河图》。',
    religionDetail: '程朱理学（新儒学）集儒释道哲学大成，深刻影响此后八百年东亚（中朝越日）。',
    keyFigures: [
      { name: '宋太祖赵匡胤', role: '开国皇帝', years: '927—976', note: '杯酒释兵权终结五代武人割据，确立崇文抑武国策' },
      { name: '王安石 / 司马光', role: '改革家/史学家', years: '11世纪', note: '熙宁变法与《资治通鉴》双峰并立' },
      { name: '苏轼 / 沈括', role: '文宗/科学全才', years: '11世纪', note: '《梦溪笔谈》记录活字、磁偏角与石油命名' },
      { name: '岳飞 / 文天祥', role: '民族英雄', years: '12—13世纪', note: '精忠报国与《正气歌》浩气长存' }
    ],
    periods: [
      { id: 'north_song', name: '北宋东京梦华与科技井喷', startYear: 960, endYear: 1127, capital: '开封', territoryDesc: '中原与华南繁华富庶，开封人口逾百万，钢铁与商税规模空前。', mapRegions: ['china_north', 'china_south'], highlights: '活字印刷、指南针、交子纸币相继诞生。' },
      { id: 'south_song', name: '南宋临安与海上丝路极盛', startYear: 1127, endYear: 1279, capital: '临安', territoryDesc: '经济重心彻底完成南移，泉州、广州成为世界级海港。', mapRegions: ['china_south'], highlights: '独立抵抗横扫欧亚的蒙古帝国长达45年！' }
    ]
  },
  {
    id: 'ming',
    name: '明朝（郑和下西洋·白银时代）',
    enName: 'Ming Dynasty',
    colStart: 8.03, colEnd: 8.97,
    startYear: 1368, endYear: 1644,
    color: '#d96b59',
    darkTextOff: true,
    religionTags: ['儒道', '佛教'],
    capital: '北京',
    sphere: '长城以内两京十三省、辽东、云南及郑和印度洋朝贡航线',
    summary: '驱逐元室恢复汉家衣冠！郑和七下西洋比哥伦布早87年；营建紫禁城与明长城；江南手工业繁荣吸收了全球近半美洲白银；崇祯煤山自缢时牛顿刚出生、哈佛已建校8年！',
    civilization: '《永乐大典》、紫禁城与明长城、郑和宝船舰队、阳明心学、《本草纲目》《天工开物》、四大名著中的三部、徐光启译《几何原本》。',
    religionDetail: '王阳明“致良知、知行合一”解放思想；利玛窦等耶稣会士开启西学东渐。',
    keyFigures: [
      { name: '明太祖朱元璋', role: '开国皇帝', years: '1328—1398', note: '布衣登基，废丞相制度，重建华夏法度' },
      { name: '明成祖朱棣 / 郑和', role: '永乐大帝/航海家', years: '1360—1433', note: '迁都北京建紫禁城，郑和七下西洋远抵东非' },
      { name: '王阳明 / 张居正', role: '思想家/改革名相', years: '15—16世纪', note: '心学大家与万历中兴一条鞭法改革者' },
      { name: '戚继光 / 李时珍', role: '抗倭名将/医圣', years: '16世纪', note: '平定倭患与编著药学巨著《本草纲目》' }
    ],
    periods: [
      { id: 'hongwu_yongle', name: '洪武建国与永乐盛世（郑和下西洋）', startYear: 1368, endYear: 1435, capital: '北京', territoryDesc: '定都南京后朱棣迁都北京，郑和舰队巡航印度洋。', mapRegions: ['china_north', 'china_south', 'manchuria'], highlights: '此时拜占庭东罗马帝国竟还活着（1453年才灭亡）！' },
      { id: 'late_ming', name: '隆庆开关、全球白银与晚明巨变', startYear: 1435, endYear: 1644, capital: '北京', territoryDesc: '丝绸瓷器远销欧亚美，小冰河期旱灾与战乱致1644年明亡。', mapRegions: ['china_north', 'china_south'], highlights: '哈佛大学(1636)、牛顿(1643)与英国资产阶级革命同期发生。' }
    ]
  },
  {
    id: 'qing',
    name: '清朝（康乾盛世·近代转折）',
    enName: 'Qing Dynasty',
    colStart: 7.56, colEnd: 8.97,
    startYear: 1644, endYear: 1912,
    rects: [
      { colStart: 8.03, colEnd: 8.97, startYear: 1644, endYear: 1912, label: '清朝' },
      { colStart: 7.56, colEnd: 8.03, startYear: 1759, endYear: 1912, label: '新疆·外蒙' }
    ],
    color: '#e0c15a',
    zIndex: 12,
    religionTags: ['儒道', '佛教'],
    capital: '北京',
    sphere: '奠定现代中国基本版图：内地十八省、满洲、内外蒙古、新疆、青藏与台湾',
    summary: '满洲入关建立中国最后一座帝制王朝。康乾盛世人口从1亿飙升至4亿（得益于摊丁入亩与美洲玉米番薯），奠定今日多民族国家版图；1840年鸦片战争后被迫卷入近代化剧变。',
    civilization: '《四库全书》、京剧成型、《红楼梦》文学巅峰、清代多民族边疆治理（金瓶掣签/改土归流）、洋务运动近代工厂。',
    religionDetail: '儒家正统治内地，藏传佛教联结蒙藏，满汉蒙回藏多元并治。',
    keyFigures: [
      { name: '康熙帝玄烨', role: '圣祖', years: '1654—1722', note: '平三藩、收台湾、签《尼布楚条约》，与路易十四、彼得大帝同龄' },
      { name: '乾隆帝弘历', role: '高宗', years: '1711—1799', note: '平准噶尔定新疆，十全武功下版图极盛，1793年会见英国马戛尔尼使团' },
      { name: '林则徐 / 曾国藩 / 李鸿章', role: '晚清重臣', years: '19世纪', note: '虎门销烟与洋务运动自强探索' }
    ],
    periods: [
      { id: 'kangqian', name: '康雍乾盛世与版图奠定', startYear: 1644, endYear: 1796, capital: '北京', territoryDesc: '1300多万平方公里超级版图，GDP占全球约三成。', mapRegions: ['china_north', 'china_south', 'manchuria', 'mongolia_steppe', 'xinjiang', 'tibet'], highlights: '人口突破3亿，却错失欧洲工业革命先机。' },
      { id: 'late_qing', name: '鸦片战争、洋务运动与辛亥革命', startYear: 1796, endYear: 1912, capital: '北京', territoryDesc: '三千年未有之大变局，被迫开放通商并开启近代化探索。', mapRegions: ['china_north', 'china_south', 'manchuria', 'xinjiang', 'tibet'], highlights: '1911年辛亥革命终结延续两千余年的帝制。' }
    ]
  },
  {
    id: 'modern_china',
    name: '中华民国与中华人民共和国',
    enName: 'ROC & People’s Republic of China',
    colStart: 8.03, colEnd: 8.97,
    startYear: 1912, endYear: 2026,
    color: '#d9574a',
    darkTextOff: true,
    religionTags: ['儒道'],
    capital: '北京',
    sphere: '现代中国960万平方公里陆地与辽阔海域',
    summary: '历经辛亥革命、抗日战争胜利与1949年新中国成立；1978年改革开放创造了人类史上最大规模的工业化与脱贫奇迹，跃升为世界第二大经济体与科技制造强国。',
    civilization: '两弹一星、杂交水稻、全球最大高铁与5G网络、空间站、新能源与人工智能产业前沿。',
    religionDetail: '现代世俗国家与中华优秀传统文化复兴并进。',
    keyFigures: [
      { name: '孙中山', role: '民主革命先行者', years: '1866—1925', note: '领导推翻帝制，创立民国' },
      { name: '毛泽东', role: '新中国缔造者', years: '1893—1976', note: '领导建立中华人民共和国，实现民族独立与工业奠基' },
      { name: '邓小平', role: '改革开放总设计师', years: '1904—1997', note: '开启改革开放，带领中国深度融入全球经济' }
    ],
    periods: [
      { id: 'roc', name: '民国与抗日战争', startYear: 1912, endYear: 1949, capital: '南京', territoryDesc: '历经军阀混战与十四年艰苦抗战，成为联合国安理会常任理事国。', mapRegions: ['china_north', 'china_south', 'manchuria', 'xinjiang', 'tibet'], highlights: '五四新文化运动重塑现代汉语与科学精神。' },
      { id: 'prc', name: '新中国工业化与改革开放崛起', startYear: 1949, endYear: 2026, capital: '北京', territoryDesc: '建成全球最完整工业门类体系，8亿人脱贫。', mapRegions: ['china_north', 'china_south', 'manchuria', 'xinjiang', 'tibet'], highlights: '21世纪成为全球贸易、基建与科技创新核心引擎之一。' }
    ]
  },

  /* ===================== COL 9: 日韩与东南亚 (NE & SE Asia) ===================== */
  {
    id: 'gojoseon_yayoi',
    name: '古朝鲜·朝鲜三国与日本弥生/古坟',
    enName: 'Gojoseon, Three Kingdoms & Yayoi/Yamato',
    colStart: 9.04, colEnd: 9.54,
    startYear: -1000, endYear: 668,
    color: '#9db8d4',
    religionTags: ['儒道', '佛教'],
    capital: '京都',
    sphere: '朝鲜半岛（高句丽、百济、新罗）与日本列岛（大和政权）',
    summary: '稻作、青铜与铁器技术从大陆传入半岛与列岛；汉字、儒学与佛教经朝鲜三国传至日本飞鸟时代，正式构建起“东亚汉字文化圈”。',
    civilization: '汉委奴国王金印（东汉赐予）、大型前方后圆古坟、圣德太子十七条宪法、高句丽壁画古墓。',
    religionDetail: '日本神道教与传入的佛教、儒学融合共存。',
    keyFigures: [
      { name: '广开土大王', role: '高句丽国王', years: '374—413', note: '高句丽极盛期君主，立好太王碑' },
      { name: '圣德太子', role: '日本摄政', years: '574—622', note: '派遣隋使，崇佛修宪，推动大和中央集权' }
    ],
    periods: [
      { id: 'ne_early', name: '朝鲜三国与日本大和兴起', startYear: -300, endYear: 668, capital: '京都', territoryDesc: '高句丽、百济、新罗鼎立；日本统一关西并开启大化改新(645)。', mapRegions: ['korea', 'japan'], highlights: '663年白江口之战唐新联军击败日本百济，东亚格局稳定数百年。' }
    ]
  },
  {
    id: 'heian_goryeo_shogun',
    name: '奈良平安·幕府日本 / 新罗高丽朝鲜',
    enName: 'Nara-Heian-Shogunate Japan & Goryeo-Joseon',
    colStart: 9.04, colEnd: 9.54,
    startYear: 668, endYear: 1868,
    color: '#889fc7',
    religionTags: ['儒道', '佛教'],
    capital: '京都',
    sphere: '日本列岛与朝鲜半岛',
    summary: '日本经遣唐使全面吸收盛唐典章，后演化出独特的天皇+武士幕府双轨体制；朝鲜高丽王朝创金属活字，朝鲜王朝世宗大王创制韩文（谚文）。',
    civilization: '日本假名文字与《源氏物语》（世界最早长篇小说之一）、浮世绘、高丽青瓷与《高丽大藏经》、世宗训民正音（韩文）。',
    religionDetail: '禅宗、净土宗与神道教塑造日本美学；朝鲜王朝尊程朱理学为国学。',
    keyFigures: [
      { name: '紫式部', role: '平安才女', years: '约973—1014', note: '著《源氏物语》，日本古典文学巅峰' },
      { name: '朝鲜世宗大王', role: '朝鲜国王', years: '1397—1450', note: '1443年创制科学拼音文字“训民正音”（韩文）' },
      { name: '织田信长 / 德川家康', role: '战国三杰', years: '16世纪', note: '终结日本战国，开创260年江户幕府和平期' }
    ],
    periods: [
      { id: 'nara_heian', name: '遣唐使、平安时代与高丽', startYear: 668, endYear: 1192, capital: '京都', territoryDesc: '仿长安建平城京/平安京；高丽统一朝鲜半岛。', mapRegions: ['japan', 'korea'], highlights: '东亚文化深度共鸣并孕育各自民族文字。' },
      { id: 'kamakura_edo', name: '武士幕府、朝鲜王朝与江户锁国', startYear: 1192, endYear: 1868, capital: '江户', territoryDesc: '镰仓/室町/江户幕府治日本（抵抗蒙古“神风”）；李氏朝鲜存续500年。', mapRegions: ['japan', 'korea'], highlights: '1853年黑船来航打破江户200年锁国。' }
    ]
  },
  {
    id: 'khmer_se_asia',
    name: '扶南·三佛齐·吴哥高棉与东南亚诸国',
    enName: 'Funan, Srivijaya, Khmer & SE Asia',
    colStart: 9.54, colEnd: 9.96,
    startYear: 100, endYear: 1850,
    color: '#88bf9e',
    religionTags: ['佛教', '印度教', '伊斯兰教'],
    capital: '吴哥',
    sphere: '中南半岛（越南、柬埔寨、泰国、缅甸）与马来群岛（苏门答腊、爪哇）',
    summary: '印度洋与南海交汇的“海上十字路口”！三佛齐扼守马六甲，高棉帝国修建世界最大宗教建筑吴哥窟，满者伯夷称雄南洋，越南则融入东亚儒家圈。',
    civilization: '吴哥窟与庞大水利蓄水城、婆罗浮屠佛塔、马六甲香料贸易网、占城早熟稻传入宋朝大幅提升中国粮食产量！',
    religionDetail: '早期印度教与大乘佛教（吴哥/婆罗浮屠），后中南半岛盛行上座部佛教，群岛14—15世纪广泛伊斯兰化。',
    keyFigures: [
      { name: '苏利耶跋摩二世', role: '高棉皇帝', years: '1113—1150在位', note: '兴建宏伟的吴哥窟' },
      { name: '加查·马达', role: '满者伯夷宰相', years: '1290—1364', note: '统一印尼群岛大部，奠定现代印尼版图记忆' }
    ],
    periods: [
      { id: 'angkor', name: '三佛齐与吴哥高棉鼎盛', startYear: 650, endYear: 1431, capital: '吴哥', territoryDesc: '高棉覆盖柬泰老越，三佛齐/满者伯夷主导马来与爪哇海商。', mapRegions: ['southeast_asia'], highlights: '1296年元朝使节周达观著《真腊风土记》记录吴哥盛景。' },
      { id: 'spice_era', name: '马六甲、大越、暹罗与殖民冲击', startYear: 1431, endYear: 1850, capital: '吴哥', territoryDesc: '香料群岛吸引葡荷英法殖民者角逐，仅泰国（暹罗）始终保持独立。', mapRegions: ['southeast_asia'], highlights: '成为全球香料贸易核心与大航海必争之地。' }
    ]
  },
  {
    id: 'modern_ne_se_asia',
    name: '明治日本与现代日韩·东盟',
    enName: 'Meiji Japan, Modern Korea & ASEAN',
    colStart: 9.04, colEnd: 9.96,
    startYear: 1868, endYear: 2026,
    color: '#d48c9c',
    religionTags: ['佛教', '儒道'],
    capital: '东京',
    sphere: '日本、韩国、朝鲜及东盟十国',
    summary: '1868年日本明治维新成为亚洲首个成功工业化国家，一度走向军国主义灾难；二战后日本、亚洲四小龙与东盟先后创造经济奇迹，成为全球精密制造与半导体高地。',
    civilization: '明治维新近代化、战后精密制造/汽车/半导体产业、动漫与韩流全球文化输出、新加坡全球港航金融中心。',
    religionDetail: '神道/佛教、基督教、伊斯兰教与世俗现代文化多元并存。',
    keyFigures: [
      { name: '明治天皇 / 伊藤博文', role: '维新主导者', years: '1852—1912', note: '推行文明开化与立宪改革，30年建成近代工业国' },
      { name: '李光耀', role: '新加坡国父', years: '1923—2015', note: '将弹丸岛国建设为亚洲发达金融航运枢纽' }
    ],
    periods: [
      { id: 'meiji_ww2', name: '明治维新与二战浩劫', startYear: 1868, endYear: 1945, capital: '东京', territoryDesc: '日本快速工业化后对外侵略扩张，1945年战败投降。', mapRegions: ['japan', 'korea', 'southeast_asia'], highlights: '1868年武士道终结与美国牛仔、晚清洋务竟在同一时代！' },
      { id: 'asian_miracle', name: '战后经济奇迹与东盟崛起', startYear: 1945, endYear: 2026, capital: '东京', territoryDesc: '日本、韩国、新加坡及东盟成为世界制造与科技重镇。', mapRegions: ['japan', 'korea', 'southeast_asia'], highlights: '半导体、电子消费品与区域供应链核心。' }
    ]
  }
];
