(function (root, factory) {
  'use strict';

  var entries = factory();

  if (typeof module === 'object' && module.exports) {
    module.exports = entries;
  }
  if (root) {
    root.CHEMISTRY_PART_001_030 = entries;
  }
}(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this), function () {
  'use strict';

  var entries = [
    {
      number: 1,
      config: '1s¹',
      shells: [1],
      oxidation: '+1、-1（单质为0）',
      reactivity: '氢气常温下较稳定，点燃或遇到合适催化剂时可与氧剧烈反应；氢原子则很活泼。活泼性必须结合具体形态判断。',
      nuclear: 'stable',
      nuclearText: '氢有¹H和²H两种稳定同位素；³H（氚）有放射性，自然界仅有痕量，因此“氢有稳定同位素”不等于所有氢同位素都稳定。',
      flame: {
        type: 'none',
        color: null,
        label: '无典型焰色',
        text: '氢气燃烧的淡蓝色火焰不是用于鉴别氢元素的特征焰色；火焰颜色还会受燃烧条件和背景光影响。'
      },
      compounds: [
        { name: '水', formula: 'H₂O', note: '常温下为无色液体，是生命活动、溶解和许多化学反应的重要介质。' },
        { name: '过氧化氢', formula: 'H₂O₂', note: '其稀溶液可用于消毒或漂白；浓溶液有强氧化性和腐蚀性。' },
        { name: '甲烷', formula: 'CH₄', note: '天然气的主要成分，无色、可燃，也是重要的化工原料。' }
      ],
      compoundNote: '氢在不同化合物中可呈+1价或-1价；水、甲烷等含氢物质都不能当作氢气看待。',
      reaction: {
        equation: '2H₂ + O₂ → 2H₂O',
        text: '氢与氧化合生成水并放热；混合气体遇火可能猛烈爆炸，这里只说明反应原理，不提供操作步骤。'
      },
      relations: [
        { number: 8, type: '反应伙伴', text: '氢与氧化合生成水，燃料电池也利用这一反应的化学能。' },
        { number: 6, type: '材料搭档', text: '碳和氢构成烃以及多数有机分子的基本骨架。' },
        { number: 2, type: '宇宙关联', text: '恒星内部的核聚变把氢转化为氦，并释放能量。' }
      ],
      story: '太阳的能量主要来自氢核聚变，而不是氢气在“燃烧”；核聚变需要极高温高压，与日常点火的化学反应完全不同。',
      mass: '1.008',
      melting: '-259.16 ℃',
      density: '0.08988 g/L（氢气，0 ℃、1 atm）'
    },
    {
      number: 2,
      config: '1s²',
      shells: [2],
      oxidation: '0（通常不形成化合物）',
      reactivity: '氦的电子层已满，常温常压下几乎不与其他物质反应，是典型的惰性气体。',
      nuclear: 'stable',
      nuclearText: '³He和⁴He都是稳定同位素；地球上常见的氦主要是⁴He，许多⁴He原子核来自放射性元素的α衰变。',
      flame: {
        type: 'none',
        color: null,
        label: '无典型焰色',
        text: '氦在放电管中可发淡黄至粉红色光，这是受激原子的放电发光，不是焰色试验，也没有典型焰色。'
      },
      compounds: [],
      compoundNote: '氦在通常条件下没有常见化合物；极端条件下观察到的特殊含氦物种不属于日常化学中的稳定化合物。',
      reaction: null,
      relations: [
        { number: 10, type: '同族相似', text: '氦和氖同属稀有气体，通常以单原子形式存在，化学性质都很不活泼。' },
        { number: 1, type: '宇宙关联', text: '氦的许多原子核由氢在恒星中聚变形成，但普通实验室化学反应不能实现这种转化。' },
        { number: 8, type: '材料搭档', text: '液氦可为超导磁体提供低温环境；这种冷却不依赖氦与氧等物质反应。' }
      ],
      story: '氦是先在太阳光谱中被认出、后来才在地球上找到的元素；它的英文名与希腊语“太阳”有关。',
      mass: '4.0026',
      melting: '-272.20 ℃（约2.5 MPa下）',
      density: '0.1785 g/L（氦气，0 ℃、1 atm）'
    },
    {
      number: 3,
      config: '[He] 2s¹',
      shells: [2, 1],
      oxidation: '+1',
      reactivity: '锂是活泼金属，能与氧、氮和水反应，但通常不如钠、钾与水反应猛烈；表面会形成反应产物层。',
      nuclear: 'stable',
      nuclearText: '⁶Li和⁷Li都是稳定同位素，天然锂以⁷Li为主；两种同位素在核科学和材料研究中用途不同。',
      flame: {
        type: 'typical',
        color: '#DC143C',
        label: '深红色',
        text: '锂盐受热激发时常产生深红色（洋红色）焰色，例如氯化锂；观察的是锂离子的特征发射，不是金属锂燃烧的颜色。'
      },
      compounds: [
        { name: '碳酸锂', formula: 'Li₂CO₃', note: '白色粉末，可制玻璃和陶瓷；其药物制剂能治疗部分精神疾病，但须遵医嘱使用。' },
        { name: '氢氧化锂', formula: 'LiOH', note: '白色固体，可吸收二氧化碳，也用于润滑脂和电池材料生产。' },
        { name: '钴酸锂', formula: 'LiCoO₂', note: '含锂、钴、氧的复合氧化物，是常见的锂离子电池正极材料。' }
      ],
      compoundNote: '锂在化合物中通常为Li⁺；锂离子电池依靠锂离子迁移工作，并不意味着电池里装着活泼的金属锂片。',
      reaction: {
        equation: '4Li + O₂ → 2Li₂O',
        text: '锂与氧反应可生成氧化锂；锂还能与氮反应，这一点与同族的钠、钾有明显差别。'
      },
      relations: [
        { number: 11, type: '同族相似', text: '锂和钠都是碱金属，最外层各有1个电子，化合物中通常呈+1价。' },
        { number: 8, type: '反应伙伴', text: '锂与氧形成Li₂O，锂盐溶液中的Li⁺则与金属锂的活泼性不同。' },
        { number: 6, type: '材料搭档', text: '许多锂离子电池用石墨作负极主体，锂离子在充电时嵌入石墨层间。' }
      ],
      story: '手机里的锂离子电池主要靠锂离子在正负极之间往返迁移储存能量，正常工作时并没有锂金属持续燃烧。',
      mass: '6.94',
      melting: '180.54 ℃',
      density: '0.534 g/cm³（常温）'
    },
    {
      number: 4,
      config: '[He] 2s²',
      shells: [2, 2],
      oxidation: '+2',
      reactivity: '铍在常温空气中因致密氧化膜而较稳定，加热时可反应；其化合物共价性较强，不能简单套用镁、钙的性质。',
      nuclear: 'stable',
      nuclearText: '⁹Be是铍唯一的稳定同位素；¹⁰Be有放射性，可由宇宙射线作用产生并用于地质测年。',
      flame: {
        type: 'none',
        color: null,
        label: '无典型焰色',
        text: '铍没有用于常规鉴别的典型焰色，而且铍及其化合物毒性很强，不应为观察颜色而加热或燃烧。'
      },
      compounds: [
        { name: '氧化铍', formula: 'BeO', note: '白色高熔点固体，导热好且电绝缘，可用于特种陶瓷；粉尘有严重危害。' },
        { name: '氯化铍', formula: 'BeCl₂', note: '白色吸湿性固体，主要见于实验室和材料制备，不是日用食盐类物质。' }
      ],
      compoundNote: '铍化合物多有毒，尤其要避免吸入粉尘；化学式中的Be²⁺不能理解为可以安全接触的普通金属颗粒。',
      reaction: {
        equation: '2Be + O₂ → 2BeO',
        text: '铍被氧化可形成BeO；常温下表面的氧化膜能减缓进一步反应。'
      },
      relations: [
        { number: 12, type: '同族相似', text: '铍与镁同属第2族，常见氧化态都是+2，但铍化合物的共价性更明显。' },
        { number: 13, type: '材料搭档', text: '铍与铝可形成轻质合金，用于对刚度和质量要求高的领域。' },
        { number: 8, type: '反应伙伴', text: '铍表面的BeO氧化膜使其在常温空气中更耐腐蚀。' }
      ],
      story: '金属铍对X射线较透明，可制成某些X射线设备的窗口；但这种用途不代表它安全，铍粉尘必须严格防护。',
      mass: '9.0122',
      melting: '1287 ℃',
      density: '1.85 g/cm³（常温）'
    },
    {
      number: 5,
      config: '[He] 2s² 2p¹',
      shells: [2, 3],
      oxidation: '+3',
      reactivity: '晶体硼常温下不很活泼，高温时可与氧及多种非金属反应；硼化合物常以缺电子和复杂网状结构为特点。',
      nuclear: 'stable',
      nuclearText: '¹⁰B和¹¹B都是稳定同位素；¹⁰B吸收热中子的能力很强，稳定性与中子吸收能力是两个不同概念。',
      flame: {
        type: 'typical',
        color: '#7CFC00',
        label: '黄绿色',
        text: '某些易挥发的硼化合物受热时可使火焰呈黄绿色；这是特定含硼物种的发射，不应把任何硼单质燃烧都概括为这种焰色。'
      },
      compounds: [
        { name: '氧化硼', formula: 'B₂O₃', note: '无色玻璃状或白色固体，是制造硼玻璃和釉料的重要原料。' },
        { name: '硼酸', formula: 'H₃BO₃', note: '白色晶体，可用于玻璃、陶瓷及部分外用制剂，但不能随意入口。' },
        { name: '硼砂', formula: 'Na₂B₄O₇·10H₂O', note: '白色结晶，常用于玻璃、釉料和清洁产品，并非食品添加剂。' },
        { name: '碳化硼', formula: 'B₄C', note: '灰黑色高硬度陶瓷，可作磨料、耐磨部件和中子吸收材料。' }
      ],
      compoundNote: '硼常形成共价键和多面体骨架；硼砂等含硼化合物有毒性风险，不能因常见于清洁用品就当作无害物质。',
      reaction: {
        equation: '4B + 3O₂ → 2B₂O₃',
        text: '硼充分氧化可生成B₂O₃，它容易形成玻璃态物质，也是硼硅酸盐玻璃的重要组成来源。'
      },
      relations: [
        { number: 13, type: '同族相似', text: '硼和铝同属第13族，常见氧化态均为+3，但硼是非金属，铝是金属。' },
        { number: 14, type: '材料搭档', text: '硼与硅的氧化物共同构成耐热硼硅酸盐玻璃，常用于实验器皿。' },
        { number: 8, type: '反应伙伴', text: '硼与氧形成B₂O₃，进一步参与多种硼酸盐和玻璃结构。' }
      ],
      story: '¹⁰B能高效吸收热中子，因此硼材料可用于核反应堆控制与屏蔽；这依靠核反应，不是普通化学反应。',
      mass: '10.81',
      melting: '约2076 ℃（晶体硼）',
      density: '约2.34 g/cm³（晶体硼，常温）'
    },
    {
      number: 6,
      config: '[He] 2s² 2p²',
      shells: [2, 4],
      oxidation: '-4、+2、+4（还有多种中间态）',
      reactivity: '常温下碳较稳定，高温下可燃并具有还原性；金刚石、石墨和炭黑的反应速率因结构不同而有差异。',
      nuclear: 'stable',
      nuclearText: '¹²C和¹³C是稳定同位素；¹⁴C有放射性，可用于含碳古代遗物的测年，但并不表示碳元素整体没有稳定同位素。',
      flame: {
        type: 'none',
        color: null,
        label: '无典型焰色',
        text: '炭火发红、发黄主要涉及高温热辐射和燃烧过程，不是碳元素用于鉴别的特征焰色。'
      },
      compounds: [
        { name: '二氧化碳', formula: 'CO₂', note: '无色气体，是光合作用的碳源，也可制成干冰；高浓度会导致窒息。' },
        { name: '一氧化碳', formula: 'CO', note: '无色无味而有毒的可燃气体，会与血红蛋白结合，不能靠气味察觉。' },
        { name: '甲烷', formula: 'CH₄', note: '最简单的烃，是天然气主要成分，也是重要的燃料和化工原料。' },
        { name: '碳酸钙', formula: 'CaCO₃', note: '石灰石、方解石的主要成分，也存在于许多贝壳中。' }
      ],
      compoundNote: '含碳化合物种类极多；CO和CO₂只差一个氧原子，性质却截然不同，不能统称为“碳气”。',
      reaction: {
        equation: 'C + O₂ → CO₂',
        text: '碳在氧气充足时完全燃烧主要生成CO₂；供氧不足还可能生成有毒的CO。'
      },
      relations: [
        { number: 14, type: '同族相似', text: '碳和硅同属第14族，都能形成四个共价键，但碳更容易形成多重键和长链。' },
        { number: 8, type: '反应伙伴', text: '碳与氧的化合程度不同可生成CO或CO₂，反应条件决定产物比例。' },
        { number: 26, type: '材料搭档', text: '钢主要是铁与少量碳等元素的合金，碳含量和热处理会显著改变硬度与韧性。' }
      ],
      story: '金刚石和石墨都只含碳，却因原子连接方式不同而一个极硬、一个较软且能导电，说明结构能与成分同样重要。',
      mass: '12.011',
      melting: '约3550 ℃（高压下）',
      density: '约2.26 g/cm³（石墨，常温）'
    },
    {
      number: 7,
      config: '[He] 2s² 2p³',
      shells: [2, 5],
      oxidation: '-3、+1、+2、+3、+4、+5',
      reactivity: '氮气分子中的N≡N键很强，所以常温下不活泼；氮的许多化合物却可很活泼，不能用氮气的稳定性概括全部含氮物质。',
      nuclear: 'stable',
      nuclearText: '¹⁴N和¹⁵N都是稳定同位素；¹⁵N可作示踪原子，用来追踪肥料或生物体系中的氮去向。',
      flame: {
        type: 'none',
        color: null,
        label: '无典型焰色',
        text: '氮没有典型焰色；雷电或放电时出现的辉光与含氮氧化物的形成，不属于焰色试验。'
      },
      compounds: [
        { name: '氨', formula: 'NH₃', note: '无色、有刺激性气味的气体，可制肥料和制冷剂，水溶液呈碱性。' },
        { name: '一氧化氮', formula: 'NO', note: '无色气体，既是空气污染物之一，也在人体内承担信号传递作用。' },
        { name: '二氧化氮', formula: 'NO₂', note: '红棕色有毒气体，参与酸雨和光化学烟雾形成。' },
        { name: '硝酸', formula: 'HNO₃', note: '强酸和强氧化剂，是制化肥的重要原料，浓溶液有强腐蚀性。' }
      ],
      compoundNote: '氮气、氨和硝酸中的氮处于不同化学环境；“生命需要氮”主要指可利用的含氮化合物，而不是直接利用氮气。',
      reaction: {
        equation: 'N₂ + 3H₂ ⇌ 2NH₃（高温、高压、催化剂）',
        text: '工业合成氨把稳定的氮气转化为NH₃，为氮肥提供原料；可逆反应需要合适的温度、压力和催化条件。'
      },
      relations: [
        { number: 15, type: '同族相似', text: '氮和磷同属第15族，都可形成含氧酸，也都是生命所需元素。' },
        { number: 1, type: '反应伙伴', text: '氮与氢通过合成氨反应生成NH₃，这是现代氮肥工业的基础。' },
        { number: 8, type: '反应伙伴', text: '高温或放电条件下，N₂与O₂可生成NO等氮氧化物。' }
      ],
      story: '液氮周围的“白雾”主要是空气中水蒸气冷凝成的小水滴，不是看得见的氮气本身。',
      mass: '14.007',
      melting: '-210.00 ℃',
      density: '1.2506 g/L（氮气，0 ℃、1 atm）'
    },
    {
      number: 8,
      config: '[He] 2s² 2p⁴',
      shells: [2, 6],
      oxidation: '-2（过氧化物中为-1，另有例外）',
      reactivity: '氧是活泼的非金属，能与许多元素形成氧化物；常温下反应快慢差别很大，活泼不等于所有物质都会立即自燃。',
      nuclear: 'stable',
      nuclearText: '¹⁶O、¹⁷O和¹⁸O都是稳定同位素；¹⁸O的比例变化可帮助研究古代温度和水的来源。',
      flame: {
        type: 'none',
        color: null,
        label: '无典型焰色',
        text: '氧本身通常不是被点燃的燃料，也没有典型焰色；它支持许多燃烧，但“助燃”不等于“可燃”。'
      },
      compounds: [
        { name: '水', formula: 'H₂O', note: '最常见的含氧化合物之一，优良的溶解能力支撑生命和地质过程。' },
        { name: '二氧化碳', formula: 'CO₂', note: '碳的氧化物，参与光合作用和全球碳循环，也是一种温室气体。' },
        { name: '氧化铁(III)', formula: 'Fe₂O₃', note: '红棕色固体，可作颜料和炼铁原料，天然矿物有赤铁矿。' },
        { name: '过氧化氢', formula: 'H₂O₂', note: '含O—O键，稀溶液可消毒，浓度较高时危险性明显增加。' }
      ],
      compoundNote: 'O₂是氧元素组成的单质，H₂O和CO₂是含氧化合物；氧化物中的氧通常以离子或共价结合形式存在。',
      reaction: {
        equation: '2H₂ + O₂ → 2H₂O',
        text: '氧与氢化合生成水并释放能量；氧在这里起氧化作用，并不是氧气自己作为燃料被消耗来“烧掉”。'
      },
      relations: [
        { number: 16, type: '同族相似', text: '氧和硫同属第16族，常见负氧化态为-2，但单质形态与活泼性不同。' },
        { number: 1, type: '生命关联', text: '氧与氢共同构成水，水分子是生命体系的重要环境。' },
        { number: 26, type: '反应伙伴', text: '铁在氧和水共同作用下生锈，干燥氧气中铁的腐蚀会慢得多。' }
      ],
      story: '液氧呈淡蓝色，而且氧气本身通常不是燃料；把可燃物与氧混得“越浓越好”只会显著增加燃烧危险。',
      mass: '15.999',
      melting: '-218.79 ℃',
      density: '1.429 g/L（氧气，0 ℃、1 atm）'
    },
    {
      number: 9,
      config: '[He] 2s² 2p⁵',
      shells: [2, 7],
      oxidation: '-1',
      reactivity: '氟是极活泼的非金属，F₂能与许多物质剧烈反应；含氟化合物却可能非常稳定，不能由单质活泼性推断化合物性质。',
      nuclear: 'stable',
      nuclearText: '¹⁹F是氟唯一的稳定同位素，因此天然氟的原子量几乎就是¹⁹F原子的质量尺度。',
      flame: {
        type: 'none',
        color: null,
        label: '无典型焰色',
        text: '氟没有典型焰色；F₂与其他物质发生的剧烈反应也不是可用于安全鉴别的焰色试验。'
      },
      compounds: [
        { name: '氟化钠', formula: 'NaF', note: '白色固体，可按规定量用于防龋产品；过量摄入氟化物有害。' },
        { name: '氟化钙', formula: 'CaF₂', note: '萤石的主要成分，可制光学材料，也是重要的氟资源。' },
        { name: '氟化氢', formula: 'HF', note: '其水溶液叫氢氟酸，可腐蚀玻璃并对人体造成严重伤害。' },
        { name: '六氟化硫', formula: 'SF₆', note: '无色气体，电绝缘性能好，可用于电力设备，同时也是强温室气体。' }
      ],
      compoundNote: 'F₂是危险而活泼的单质，F⁻则存在于氟化物中；防龋利用的是受控低剂量氟化物，不是氟气。',
      reaction: {
        equation: 'H₂ + F₂ → 2HF',
        text: '氢与氟化合生成HF，反应极剧烈；这里只说明氟的强氧化性，不提供任何操作条件。'
      },
      relations: [
        { number: 17, type: '同族相似', text: '氟与氯同属卤素，通常各需得到一个电子形成F⁻或Cl⁻。' },
        { number: 20, type: '反应伙伴', text: '钙与氟可形成难溶的CaF₂，即萤石的主要成分。' },
        { number: 11, type: '生命关联', text: '钠与氟形成NaF；规定剂量的氟化物有助于防龋，但过量会产生毒性。' }
      ],
      story: '聚四氟乙烯涂层很稳定，说明“氟气极活泼”和“含氟化合物一定活泼”是两回事，化学键结构会彻底改变性质。',
      mass: '18.998',
      melting: '-219.67 ℃',
      density: '1.696 g/L（氟气，0 ℃、1 atm）'
    },
    {
      number: 10,
      config: '[He] 2s² 2p⁶',
      shells: [2, 8],
      oxidation: '0（通常不形成化合物）',
      reactivity: '氖具有稳定的满电子层，通常条件下几乎不反应，以单原子气体存在。',
      nuclear: 'stable',
      nuclearText: '²⁰Ne、²¹Ne和²²Ne都是稳定同位素；它们的比例可用于研究地球和陨石中物质的来源。',
      flame: {
        type: 'none',
        color: null,
        label: '无典型焰色',
        text: '霓虹灯中氖气放电产生橙红色光，这是气体放电发光，不是燃烧，也不是氖的焰色。'
      },
      compounds: [],
      compoundNote: '氖在通常条件下没有常见化合物；它的照明用途来自放电光谱，而不是生成了某种“发光氖化合物”。',
      reaction: null,
      relations: [
        { number: 2, type: '同族相似', text: '氖与氦同属稀有气体，通常以单原子形式存在且极难发生化学反应。' },
        { number: 18, type: '同族相似', text: '氖与氩都可用于放电光源或保护气氛，但发光颜色与具体用途不同。' },
        { number: 9, type: '对照理解', text: '氖与氟的电子数相近、排布却不同：Ne外层已满，F₂则极活泼，可用来理解稳定电子层。' }
      ],
      story: '只有充氖的灯管才直接呈现经典橙红色“霓虹光”；其他颜色常来自别的气体、荧光粉或有色玻璃。',
      mass: '20.180',
      melting: '-248.59 ℃',
      density: '0.9002 g/L（氖气，0 ℃、1 atm）'
    },
    {
      number: 11,
      config: '[Ne] 3s¹',
      shells: [2, 8, 1],
      oxidation: '+1',
      reactivity: '钠是很活泼的金属，容易被氧化并与水剧烈反应；食盐中的Na⁺性质温和得多，不能与金属钠混为一谈。',
      nuclear: 'stable',
      nuclearText: '²³Na是钠唯一的稳定同位素；人工²²Na有放射性，但天然食盐中的钠仍以稳定的²³Na为主。',
      flame: {
        type: 'typical',
        color: '#FFD700',
        label: '黄色',
        text: '钠盐通常产生很强的黄色焰色，例如NaCl；痕量钠杂质也可能掩盖钾等元素的较浅焰色。'
      },
      compounds: [
        { name: '氯化钠', formula: 'NaCl', note: '食盐的主要成分，白色晶体，可调味，也是人体所需的电解质来源之一。' },
        { name: '碳酸钠', formula: 'Na₂CO₃', note: '俗称纯碱或苏打，用于玻璃、洗涤和化工生产，不是小苏打。' },
        { name: '碳酸氢钠', formula: 'NaHCO₃', note: '俗称小苏打，可作膨松剂和抗酸剂，受热会放出CO₂。' },
        { name: '氢氧化钠', formula: 'NaOH', note: '俗称烧碱，白色易吸湿固体，可制肥皂，具有强腐蚀性。' }
      ],
      compoundNote: '钠化合物中通常含Na⁺；NaCl、Na₂CO₃和NaHCO₃名称相近，却是不同物质，用途和碱性也不相同。',
      reaction: {
        equation: '2Na + 2H₂O → 2NaOH + H₂↑',
        text: '金属钠与水反应生成NaOH和氢气并大量放热，可能引发燃烧或爆炸；只作原理介绍，不应自行尝试。'
      },
      relations: [
        { number: 19, type: '同族相似', text: '钠和钾都是碱金属，常见+1价；钾与水的反应通常更剧烈。' },
        { number: 17, type: '反应伙伴', text: 'Na⁺与Cl⁻构成食盐NaCl，稳定的离子化合物与活泼钠单质性质完全不同。' },
        { number: 1, type: '反应伙伴', text: '金属钠与水反应会生成氢气，同时水中部分氢从+1价降为0价。' }
      ],
      story: '汗液里的咸味主要来自包括NaCl在内的溶质；人体需要的是适量Na⁺等电解质，而不是活泼的金属钠。',
      mass: '22.990',
      melting: '97.72 ℃',
      density: '0.968 g/cm³（常温）'
    },
    {
      number: 12,
      config: '[Ne] 3s²',
      shells: [2, 8, 2],
      oxidation: '+2',
      reactivity: '镁较活泼，常温下表面氧化膜有一定保护作用，粉末或条带受热可燃烧并发出耀眼白光。',
      nuclear: 'stable',
      nuclearText: '²⁴Mg、²⁵Mg和²⁶Mg都是稳定同位素，天然镁以²⁴Mg为主。',
      flame: {
        type: 'none',
        color: null,
        label: '无典型焰色',
        text: '镁燃烧的强烈白光是高温燃烧和颗粒热辐射，不是镁盐的特征焰色；常规焰色试验中镁无典型焰色。'
      },
      compounds: [
        { name: '氧化镁', formula: 'MgO', note: '白色高熔点粉末，可作耐火材料，也是部分抗酸药的成分。' },
        { name: '氢氧化镁', formula: 'Mg(OH)₂', note: '白色难溶固体，其悬浊液俗称镁乳，可中和胃酸。' },
        { name: '七水硫酸镁', formula: 'MgSO₄·7H₂O', note: '俗称泻盐，白色晶体，可用于农业和特定制剂，不可随意服用。' },
        { name: '氯化镁', formula: 'MgCl₂', note: '易吸湿的盐，可用于融雪和制镁；食品级盐卤也可用于点豆腐。' }
      ],
      compoundNote: '镁在化合物中通常呈Mg²⁺；叶绿素含的是配位结合的镁离子，不是叶片里存在金属镁。',
      reaction: {
        equation: '2Mg + O₂ → 2MgO',
        text: '镁燃烧生成白色MgO并发出耀眼白光；燃烧产物不是把镁“变成氧”，而是两种元素重新成键。'
      },
      relations: [
        { number: 20, type: '同族相似', text: '镁与钙同属碱土金属，化合物中通常呈+2价，许多盐的性质相似。' },
        { number: 8, type: '反应伙伴', text: '镁与氧形成MgO，强光和白色产物都来自这一氧化过程。' },
        { number: 13, type: '材料搭档', text: '镁与铝可形成轻质合金，用于交通和电子产品结构件。' }
      ],
      story: '叶绿素分子中心含Mg²⁺，参与捕获光能；植物需要的是镁离子营养，而不是把金属镁当肥料。',
      mass: '24.305',
      melting: '650 ℃',
      density: '1.738 g/cm³（常温）'
    },
    {
      number: 13,
      config: '[Ne] 3s² 3p¹',
      shells: [2, 8, 3],
      oxidation: '+3',
      reactivity: '铝本质上较活泼，但致密Al₂O₃膜让块状铝在常温空气中耐腐蚀；氧化膜受损或遇到特定介质时仍会反应。',
      nuclear: 'stable',
      nuclearText: '²⁷Al是铝唯一的稳定同位素；²⁶Al有放射性，可用于陨石和宇宙成因核素研究。',
      flame: {
        type: 'none',
        color: null,
        label: '无典型焰色',
        text: '铝粉燃烧或高温铝发光不是铝的特征焰色；铝没有用于常规鉴别的典型焰色。'
      },
      compounds: [
        { name: '氧化铝', formula: 'Al₂O₃', note: '白色高硬度固体，刚玉的主要成分，可制陶瓷、磨料和耐火材料。' },
        { name: '氢氧化铝', formula: 'Al(OH)₃', note: '白色难溶固体，可作阻燃填料，也用于部分抗酸药。' },
        { name: '硫酸铝', formula: 'Al₂(SO₄)₃', note: '可溶于水的铝盐，用于水处理和造纸，帮助细小颗粒聚集沉降。' }
      ],
      compoundNote: '铝单质、Al₂O₃和溶液中的Al³⁺不是同一种物质；铝表面的氧化膜虽薄，却能明显改变其表观活泼性。',
      reaction: {
        equation: '4Al + 3O₂ → 2Al₂O₃',
        text: '铝与氧形成Al₂O₃；新鲜铝表面很快生成薄而密的氧化膜，阻止内部继续快速氧化。'
      },
      relations: [
        { number: 5, type: '同族相似', text: '铝与硼同属第13族，常见+3氧化态，但铝更具金属性。' },
        { number: 8, type: '反应伙伴', text: 'Al₂O₃膜保护铝，使活泼金属也能长期用作炊具和建筑材料。' },
        { number: 14, type: '材料搭档', text: '铝和硅的氧化物共同构成长石、黏土等多种铝硅酸盐矿物。' }
      ],
      story: '电解制铝普及前，铝曾因提炼困难而十分昂贵；今天的低价来自工业技术进步，不是铝在地壳中突然变多。',
      mass: '26.982',
      melting: '660.32 ℃',
      density: '2.70 g/cm³（常温）'
    },
    {
      number: 14,
      config: '[Ne] 3s² 3p²',
      shells: [2, 8, 4],
      oxidation: '+4（少数硅化物中为-4）',
      reactivity: '晶体硅常温下较稳定，表面常有薄氧化层；高温下能与氧、卤素等反应，硅粉的反应性通常更强。',
      nuclear: 'stable',
      nuclearText: '²⁸Si、²⁹Si和³⁰Si都是稳定同位素；高纯²⁸Si晶体还用于精密测量和同位素研究。',
      flame: {
        type: 'none',
        color: null,
        label: '无典型焰色',
        text: '硅没有典型焰色；硅燃烧、硅烷自燃或高温发光都不能直接当作硅元素的特征焰色。'
      },
      compounds: [
        { name: '二氧化硅', formula: 'SiO₂', note: '石英的主要成分，可制玻璃；结晶SiO₂是由原子网络构成，不是离散小分子。' },
        { name: '硅酸钠', formula: 'Na₂SiO₃', note: '其浓溶液俗称水玻璃，可作黏合剂、防火材料和洗涤剂助剂。' },
        { name: '碳化硅', formula: 'SiC', note: '高硬度陶瓷，可作磨料、耐热部件和功率半导体材料。' },
        { name: '四氯化硅', formula: 'SiCl₄', note: '无色易挥发液体，遇水产生腐蚀性物质，是高纯硅和硅材料的中间体。' }
      ],
      compoundNote: '晶体硅用于芯片，SiO₂用于玻璃和绝缘层；二者都含硅，但导电性、结构和用途完全不同。',
      reaction: {
        equation: 'Si + O₂ → SiO₂',
        text: '硅氧化形成SiO₂；芯片制造也可利用受控氧化层来绝缘和保护硅表面。'
      },
      relations: [
        { number: 6, type: '同族相似', text: '硅与碳同属第14族，常形成四个共价键，但SiO₂的网状结构与CO₂小分子不同。' },
        { number: 8, type: '材料搭档', text: '硅与氧构成SiO₂，是玻璃、石英和硅芯片绝缘层的基础。' },
        { number: 13, type: '材料搭档', text: '铝硅酸盐矿物由铝、硅、氧及其他元素共同组成，是岩石和土壤的重要成分。' }
      ],
      story: '芯片里的晶体硅需要极高纯度和精确掺杂；普通沙子的主要成分虽是SiO₂，却不能直接当成芯片原料使用。',
      mass: '28.085',
      melting: '1414 ℃',
      density: '2.329 g/cm³（常温）'
    },
    {
      number: 15,
      config: '[Ne] 3s² 3p³',
      shells: [2, 8, 5],
      oxidation: '-3、+3、+5',
      reactivity: '白磷在空气中很容易氧化并可自燃，红磷相对稳定；讨论磷的活泼性必须说明单质种类，磷酸盐则通常较稳定。',
      nuclear: 'stable',
      nuclearText: '³¹P是磷唯一的稳定同位素；³²P和³³P有放射性，可在严格管理下用作生物示踪剂。',
      flame: {
        type: 'none',
        color: null,
        label: '无典型焰色',
        text: '白磷燃烧的发光和生成大量白烟不是磷盐的特征焰色；磷没有用于常规鉴别的典型焰色。'
      },
      compounds: [
        { name: '磷酸', formula: 'H₃PO₄', note: '中等强度酸，可制磷肥，也以规定用量作部分饮料的酸味剂。' },
        { name: '磷酸钙', formula: 'Ca₃(PO₄)₂', note: '难溶白色固体，见于磷矿石，可用于制磷肥和饲料添加剂。' },
        { name: '十氧化四磷', formula: 'P₄O₁₀', note: '常按经验式称五氧化二磷，是白色强吸湿性固体和干燥剂，遇水剧烈放热。' }
      ],
      compoundNote: '白磷和红磷都是磷单质，磷酸与磷酸盐才是化合物；生物体利用的磷主要以磷酸基团等形式存在。',
      reaction: {
        equation: 'P₄ + 5O₂ → P₄O₁₀',
        text: '白磷充分氧化生成P₄O₁₀并伴随放热和白烟；白磷危险，不应自行燃烧观察。'
      },
      relations: [
        { number: 7, type: '同族相似', text: '磷与氮同属第15族，都能形成含氧酸，也都是肥料和生命所需元素。' },
        { number: 20, type: '生命关联', text: '钙与磷酸根可构成骨骼矿物的重要成分，人体骨骼不是由金属钙组成。' },
        { number: 8, type: '反应伙伴', text: '磷与氧形成P₄O₁₀，后者遇水最终可转化为磷酸。' }
      ],
      story: 'DNA骨架中的磷酸基团把核苷酸连接起来；这体现的是磷酸盐化学，与白磷的可燃性没有关系。',
      mass: '30.974',
      melting: '44.15 ℃（白磷）',
      density: '1.82 g/cm³（白磷，常温）'
    },
    {
      number: 16,
      config: '[Ne] 3s² 3p⁴',
      shells: [2, 8, 6],
      oxidation: '-2、+4、+6',
      reactivity: '硫在常温下较稳定，受热可与氧和许多金属反应；硫化物、硫酸盐等含硫物质的性质差别很大。',
      nuclear: 'stable',
      nuclearText: '³²S、³³S、³⁴S和³⁶S都有稳定核素，天然硫以³²S为主；硫同位素比例可帮助追踪地质过程。',
      flame: {
        type: 'none',
        color: null,
        label: '无典型焰色',
        text: '硫燃烧时的蓝色火焰来自燃烧过程中的分子发光，不是硫盐用于鉴别的典型焰色。'
      },
      compounds: [
        { name: '二氧化硫', formula: 'SO₂', note: '无色刺激性气体，可按规定作食品防腐剂，也是酸雨相关污染物。' },
        { name: '硫酸', formula: 'H₂SO₄', note: '重要强酸和化工原料，用于化肥与蓄电池，浓硫酸有强腐蚀性。' },
        { name: '硫化氢', formula: 'H₂S', note: '有臭鸡蛋气味的有毒气体，高浓度时嗅觉会失灵，不能靠闻味判断安全。' },
        { name: '二水硫酸钙', formula: 'CaSO₄·2H₂O', note: '石膏的主要成分，可用于建筑材料、模具和水泥调节。' }
      ],
      compoundNote: '硫磺单质本身气味不强，常见的刺鼻气味多来自SO₂、H₂S等含硫化合物，不能把所有气味归给硫原子。',
      reaction: {
        equation: 'S + O₂ → SO₂',
        text: '硫燃烧生成SO₂；这种气体会刺激呼吸道并参与酸雨形成，所以不能用闻气味的方式观察。'
      },
      relations: [
        { number: 8, type: '同族相似', text: '硫与氧同属第16族，都可呈-2价，也能形成性质不同的氧化物。' },
        { number: 1, type: '反应伙伴', text: '硫与氢形成H₂S；这种有毒气体与生命必需的水H₂O不可混为一谈。' },
        { number: 26, type: '矿物关联', text: '铁与硫可形成FeS₂，黄铁矿就是常见矿物，外观像金属却不是黄金。' }
      ],
      story: '黄铁矿FeS₂因金黄色外观被称为“愚人金”；它的成分是铁和硫，化学性质与黄金完全不同。',
      mass: '32.06',
      melting: '115.21 ℃（单斜硫）',
      density: '约2.07 g/cm³（常温）'
    },
    {
      number: 17,
      config: '[Ne] 3s² 3p⁵',
      shells: [2, 8, 7],
      oxidation: '-1、+1、+3、+5、+7',
      reactivity: '氯气是活泼的氧化性非金属，可与许多金属和氢反应；Cl⁻则常较稳定，例如食盐中的氯离子。',
      nuclear: 'stable',
      nuclearText: '³⁵Cl和³⁷Cl都是稳定同位素；³⁶Cl有放射性，自然界痕量存在，可用于地下水等研究。',
      flame: {
        type: 'none',
        color: null,
        label: '无典型焰色',
        text: '氯没有典型焰色；氯气的黄绿色是Cl₂分子的颜色，含氯物质燃烧产生的颜色也不等于氯元素的焰色。'
      },
      compounds: [
        { name: '氯化钠', formula: 'NaCl', note: '食盐主要成分，含稳定Cl⁻，与有毒、有氧化性的氯气完全不同。' },
        { name: '氯化氢', formula: 'HCl', note: '无色刺激性气体，其水溶液叫盐酸，胃酸中也含低浓度盐酸。' },
        { name: '次氯酸钠', formula: 'NaClO', note: '漂白和消毒产品的常见有效成分，与酸混合可能放出有毒氯气。' },
        { name: '氯化钙', formula: 'CaCl₂', note: '易吸湿白色盐，可作干燥剂和融雪剂，无水与含水形式吸水性不同。' }
      ],
      compoundNote: 'Cl₂是单质，Cl⁻是离子，NaClO中的氯则呈+1价；含氯产品的消毒性不能推广到所有氯化物。',
      reaction: {
        equation: 'H₂ + Cl₂ → 2HCl',
        text: '氢与氯化合生成HCl，光照或加热可使反应剧烈；只用于说明化合反应，不提供操作步骤。'
      },
      relations: [
        { number: 9, type: '同族相似', text: '氯与氟同属卤素，单质都有较强氧化性，化合物中也常形成卤离子。' },
        { number: 11, type: '生命关联', text: 'NaCl提供Na⁺和Cl⁻，两者都是人体电解质，但摄入食盐仍需适量。' },
        { number: 1, type: '反应伙伴', text: 'HCl由氢和氯组成，其水溶液盐酸能解离出H⁺和Cl⁻。' }
      ],
      story: '消毒水里的有效氯和食盐里的Cl⁻不是同一种化学形态；漂白剂与洁厕剂混用可能放出Cl₂，因此绝不能随意混合。',
      mass: '35.45',
      melting: '-101.5 ℃',
      density: '3.214 g/L（氯气，0 ℃、1 atm）'
    },
    {
      number: 18,
      config: '[Ne] 3s² 3p⁶',
      shells: [2, 8, 8],
      oxidation: '0（通常不形成化合物）',
      reactivity: '氩在通常条件下极不活泼，常用作焊接和高温处理的保护气体，以减少金属与空气反应。',
      nuclear: 'stable',
      nuclearText: '³⁶Ar、³⁸Ar和⁴⁰Ar都有稳定核素，地球大气中的氩以⁴⁰Ar为主，主要来自⁴⁰K长期衰变。',
      flame: {
        type: 'none',
        color: null,
        label: '无典型焰色',
        text: '氩在放电管中可发蓝紫色光，这是放电发光，不是焰色；焊接时的亮光也主要来自电弧和高温金属。'
      },
      compounds: [],
      compoundNote: '氩在通常条件下没有常见化合物；特殊低温或极端条件下的含氩物种，不改变它在日常化学中的惰性。',
      reaction: null,
      relations: [
        { number: 2, type: '同族相似', text: '氩与氦同属稀有气体，都可用作保护气氛，但密度、成本和低温性质不同。' },
        { number: 10, type: '同族相似', text: '氩与氖都可通过放电发光，颜色不同源于各自原子能级，而不是发生了燃烧。' },
        { number: 22, type: '材料搭档', text: '钛焊接常用氩气隔绝空气，防止高温钛与氧、氮反应而变脆。' }
      ],
      story: '氩约占地球大气体积的0.93%，远多于二氧化碳；它来自长期核衰变积累，却没有像氧气那样参与大多数生命代谢。',
      mass: '39.948',
      melting: '-189.34 ℃',
      density: '1.784 g/L（氩气，0 ℃、1 atm）'
    },
    {
      number: 19,
      config: '[Ar] 4s¹',
      shells: [2, 8, 8, 1],
      oxidation: '+1',
      reactivity: '钾是非常活泼的金属，遇空气易氧化，与水反应通常比钠更剧烈；生物体中的K⁺则受生理机制调控。',
      nuclear: 'stable',
      nuclearText: '³⁹K和⁴¹K是稳定同位素；天然⁴⁰K有极长寿命放射性，所以含钾食物有微弱天然放射性，但钾仍有稳定同位素。',
      flame: {
        type: 'typical',
        color: '#C8A2C8',
        label: '浅紫色',
        text: '钾盐常呈浅紫色（丁香紫）焰色；钠杂质产生的强黄光容易把它掩盖，观察的是钾离子的发射。'
      },
      compounds: [
        { name: '氯化钾', formula: 'KCl', note: '白色盐，可作钾肥和部分低钠盐配料；肾功能异常者不能随意大量食用。' },
        { name: '氢氧化钾', formula: 'KOH', note: '俗称苛性钾，强腐蚀性固体，可制软皂并用于某些碱性电池。' },
        { name: '硝酸钾', formula: 'KNO₃', note: '白色氧化性盐，可作肥料，也用于烟火和化工生产。' },
        { name: '碳酸钾', formula: 'K₂CO₃', note: '白色易溶盐，可用于玻璃、陶瓷和肥皂生产。' }
      ],
      compoundNote: '钾化合物通常含K⁺；神经活动需要K⁺，绝不意味着活泼的金属钾可以进入人体或食物。',
      reaction: {
        equation: '2K + 2H₂O → 2KOH + H₂↑',
        text: '钾与水生成KOH和氢气并大量放热，反应很危险；此式只展示元素守恒和反应原理。'
      },
      relations: [
        { number: 11, type: '同族相似', text: '钾与钠都是碱金属，常见+1价，焰色却分别为浅紫和黄色。' },
        { number: 17, type: '反应伙伴', text: 'K⁺与Cl⁻形成KCl，是重要的钾肥和部分代盐产品成分。' },
        { number: 20, type: '生命关联', text: 'K⁺和Ca²⁺都参与生理调节，但电荷、浓度范围和具体作用并不相同。' }
      ],
      story: '香蕉等食物因天然⁴⁰K而有极微弱放射性，这是正常背景现象；“有放射性同位素”不等于香蕉具有放射危害。',
      mass: '39.0983',
      melting: '63.38 ℃',
      density: '0.862 g/cm³（常温）'
    },
    {
      number: 20,
      config: '[Ar] 4s²',
      shells: [2, 8, 8, 2],
      oxidation: '+2',
      reactivity: '钙是活泼金属，在空气中会氧化，并能与水反应生成Ca(OH)₂和氢气；石灰石中的钙则已以Ca²⁺形式结合。',
      nuclear: 'stable',
      nuclearText: '⁴⁰Ca、⁴²Ca、⁴³Ca和⁴⁴Ca等是稳定同位素；⁴⁸Ca虽有极慢双β衰变，但钙仍有稳定同位素。',
      flame: {
        type: 'typical',
        color: '#B54A3A',
        label: '砖红色',
        text: '钙盐通常使火焰呈砖红色，例如含钙烟花利用相关发射；颜色来自受热激发的含钙物种，不是金属钙日常生锈的颜色。'
      },
      compounds: [
        { name: '氧化钙（生石灰）', formula: 'CaO', note: '生石灰是白色块状或粉末状固体，遇水强烈放热，用于建材和化工。' },
        { name: '氢氧化钙（熟石灰）', formula: 'Ca(OH)₂', note: '熟石灰是白色碱性固体，其澄清溶液叫石灰水，可检验CO₂。' },
        { name: '碳酸钙（石灰石/方解石）', formula: 'CaCO₃', note: '石灰石和方解石的主要成分，也存在于许多贝壳中，可作建材和补钙原料。' },
        { name: '二水硫酸钙（石膏）', formula: 'CaSO₄·2H₂O', note: '石膏的主要成分，加热失去部分结晶水后可制熟石膏和模具。' }
      ],
      compoundNote: 'CaO、Ca(OH)₂、CaCO₃和CaSO₄·2H₂O都含钙，却是不同化合物；补钙产品利用的是钙盐中的Ca²⁺，不是金属钙。',
      reaction: {
        equation: 'Ca + 2H₂O → Ca(OH)₂ + H₂↑',
        text: '金属钙与水生成熟石灰和氢气；这与生石灰CaO遇水生成熟石灰是两种不同的反应。'
      },
      relations: [
        { number: 12, type: '同族相似', text: '钙与镁同属碱土金属，常见+2价，也都参与生命过程。' },
        { number: 15, type: '生命关联', text: '骨骼中的主要矿物是含钙、磷酸根和氢氧根的羟基磷灰石，而不是金属钙。' },
        { number: 6, type: '地质关联', text: 'CaCO₃把钙与碳酸根结合起来，形成石灰岩、大理石和许多贝壳。' }
      ],
      story: '钟乳石的生长涉及CaCO₃在水中溶解与重新沉积；水中的CO₂会影响碳酸钙溶解平衡，并不是石头在“生长细胞”。',
      mass: '40.078',
      melting: '842 ℃',
      density: '1.55 g/cm³（常温）'
    },
    {
      number: 21,
      config: '[Ar] 3d¹ 4s²',
      shells: [2, 8, 9, 2],
      oxidation: '+3',
      reactivity: '钪是较活泼的过渡金属，表面可形成氧化膜；其化合物通常以Sc³⁺为特征，金属单质应用较少。',
      nuclear: 'stable',
      nuclearText: '⁴⁵Sc是钪唯一的稳定同位素；其他钪同位素多为人工放射性核素。',
      flame: {
        type: 'none',
        color: null,
        label: '无典型焰色',
        text: '钪没有常规焰色试验中的典型颜色；含钪金属卤化物灯的丰富光谱是放电发光，不是焰色。'
      },
      compounds: [
        { name: '氧化钪', formula: 'Sc₂O₃', note: '白色高熔点固体，可用于特种陶瓷、激光和光学材料。' },
        { name: '碘化钪', formula: 'ScI₃', note: '可用于某些金属卤化物灯，灯内放电时产生有特色的光谱。' },
        { name: '氟化钪', formula: 'ScF₃', note: '白色固体，因在较宽温区表现出负热膨胀而受到材料研究关注。' }
      ],
      compoundNote: '钪在化合物中几乎总是+3价；含钪灯发光依靠电弧放电，不能据此给钪指定一种焰色。',
      reaction: {
        equation: '4Sc + 3O₂ → 2Sc₂O₃',
        text: '钪被氧氧化可生成Sc₂O₃，其中钪为+3价，这是钪化合物最常见的价态。'
      },
      relations: [
        { number: 39, type: '同族相似', text: '钪与钇同属第3族，常见+3氧化态，在矿物和材料化学中经常相伴讨论。' },
        { number: 13, type: '材料搭档', text: '少量钪加入铝合金可提高强度和焊接性能，用于航空航天等领域。' },
        { number: 8, type: '反应伙伴', text: '钪与氧形成Sc₂O₃，体现其典型+3价。' }
      ],
      story: 'ScF₃升温时平均体积反而缩小，是“负热膨胀”材料的典型例子；大多数固体升温膨胀并非绝对规律。',
      mass: '44.955908',
      melting: '1541 ℃',
      density: '2.985 g/cm³（常温）'
    },
    {
      number: 22,
      config: '[Ar] 3d² 4s²',
      shells: [2, 8, 10, 2],
      oxidation: '+2、+3、+4（+4最常见）',
      reactivity: '块状钛因稳定氧化膜而耐腐蚀，但高温或粉末状态下会明显与氧、氮等反应，不能简单称为“不活泼”。',
      nuclear: 'stable',
      nuclearText: '⁴⁶Ti、⁴⁷Ti、⁴⁸Ti、⁴⁹Ti和⁵⁰Ti都是稳定同位素，天然钛以⁴⁸Ti为主。',
      flame: {
        type: 'none',
        color: null,
        label: '无典型焰色',
        text: '钛粉在烟花中产生明亮银白火花，这是燃烧和高温颗粒发光，不是钛盐的特征焰色。'
      },
      compounds: [
        { name: '二氧化钛', formula: 'TiO₂', note: '白色高折射率颜料，也用于防晒和光催化材料，不等同于金属钛。' },
        { name: '四氯化钛', formula: 'TiCl₄', note: '无色易挥发液体，遇潮湿空气发烟，是制钛和TiO₂的重要中间体。' },
        { name: '氮化钛', formula: 'TiN', note: '金黄色高硬度陶瓷，常作刀具耐磨涂层，颜色不是镀金造成的。' },
        { name: '碳化钛', formula: 'TiC', note: '高熔点硬质材料，可用于切削工具和耐磨复合材料。' }
      ],
      compoundNote: '金属钛、TiO₂和TiN的外观与用途差异很大；“钛白色”来自TiO₂颜料，不是钛金属粉末的颜色。',
      reaction: {
        equation: 'Ti + O₂ → TiO₂',
        text: '钛氧化可形成TiO₂；表面致密氧化物能保护内部金属，也使钛具有良好耐腐蚀性。'
      },
      relations: [
        { number: 40, type: '同族相似', text: '钛与锆同属第4族，常见+4价，并形成稳定的高熔点氧化物。' },
        { number: 13, type: '材料搭档', text: '钛铝钒等合金兼顾强度和密度，用于航空与医疗植入物。' },
        { number: 18, type: '材料搭档', text: '高温钛易与空气成分反应，焊接时常用氩气保护。' }
      ],
      story: '钛植入体能与骨组织形成较稳定的结合，称为骨整合；这依赖表面氧化层和生物相容性，不是钛与骨头“焊接”。',
      mass: '47.867',
      melting: '1668 ℃',
      density: '4.506 g/cm³（常温）'
    },
    {
      number: 23,
      config: '[Ar] 3d³ 4s²',
      shells: [2, 8, 11, 2],
      oxidation: '+2、+3、+4、+5',
      reactivity: '块状钒常温下因氧化膜较稳定，高温下可氧化；钒离子能方便地改变价态，使其适合催化和氧化还原储能。',
      nuclear: 'stable',
      nuclearText: '⁵¹V是稳定同位素，占天然钒的大部分；天然⁵⁰V具有极长寿命放射性，不影响钒有稳定同位素这一分类。',
      flame: {
        type: 'none',
        color: null,
        label: '无典型焰色',
        text: '钒没有典型焰色；不同价态钒溶液的彩色来自离子对可见光的选择吸收，不是火焰发射。'
      },
      compounds: [
        { name: '五氧化二钒', formula: 'V₂O₅', note: '橙黄色至橙红色固体，是接触法制硫酸的重要催化剂。' },
        { name: '二氧化钒', formula: 'VO₂', note: '深色固体，会在特定温度附近改变电学和光学性质，可研究智能窗。' },
        { name: '偏钒酸铵', formula: 'NH₄VO₃', note: '白色至淡黄色含钒盐，可作催化剂和钒材料的前驱体。' }
      ],
      compoundNote: '钒化合物的颜色常随价态和配位环境变化；彩色溶液不是金属钒单质，也不代表其具有对应焰色。',
      reaction: {
        equation: '4V + 5O₂ → 2V₂O₅',
        text: '钒充分氧化可生成V₂O₅，其中钒为+5价；它还能在较低价态之间转换，因此可用于催化。'
      },
      relations: [
        { number: 41, type: '同族相似', text: '钒与铌同属第5族，可呈多种氧化态，也都用于高强度合金。' },
        { number: 26, type: '材料搭档', text: '少量钒可细化钢的组织并提高强度，用于工具钢和高强度钢。' },
        { number: 8, type: '反应伙伴', text: '钒的多种氧化物体现+2至+5价变化，是理解可变价金属的好例子。' }
      ],
      story: '全钒液流电池的正负两极都使用钒离子，只靠不同价态之间转移电子储能，能减少不同元素交叉污染。',
      mass: '50.9415',
      melting: '1910 ℃',
      density: '6.11 g/cm³（常温）'
    },
    {
      number: 24,
      config: '[Ar] 3d⁵ 4s¹',
      shells: [2, 8, 13, 1],
      oxidation: '+2、+3、+6（+3、+6常见）',
      reactivity: '铬在常温下因钝化氧化膜而耐腐蚀，加热时可反应；Cr(III)与Cr(VI)化合物的性质和毒性差别很大。',
      nuclear: 'stable',
      nuclearText: '⁵⁰Cr、⁵²Cr、⁵³Cr和⁵⁴Cr都有稳定核素，天然铬以⁵²Cr为主。',
      flame: {
        type: 'none',
        color: null,
        label: '无典型焰色',
        text: '铬没有常规典型焰色；铬化合物本身的绿色、黄色或橙色是固体或溶液的颜色，不等于焰色。'
      },
      compounds: [
        { name: '氧化铬(III)', formula: 'Cr₂O₃', note: '绿色难溶固体，俗称铬绿，可作稳定颜料和磨料。' },
        { name: '铬酸钾', formula: 'K₂CrO₄', note: '黄色晶体，含六价铬，具有氧化性且有毒、有致癌风险。' },
        { name: '重铬酸钾', formula: 'K₂Cr₂O₇', note: '橙色晶体和强氧化剂，曾用于实验和工业，因六价铬危害须严格管理。' }
      ],
      compoundNote: '不锈钢中的金属铬、颜料中的Cr(III)和铬酸盐中的Cr(VI)不能混为一谈，尤其Cr(VI)化合物危害显著。',
      reaction: {
        equation: '4Cr + 3O₂ → 2Cr₂O₃',
        text: '铬表面形成Cr₂O₃等氧化物可产生钝化保护，这也是含铬不锈钢耐腐蚀的重要原因之一。'
      },
      relations: [
        { number: 42, type: '同族相似', text: '铬与钼同属第6族，都能形成多种价态并用于合金钢。' },
        { number: 26, type: '材料搭档', text: '不锈钢通常以铁为主并含足量铬，表面钝化膜提高耐蚀性，并非永不生锈。' },
        { number: 13, type: '矿物关联', text: '红宝石的红色主要来自Al₂O₃晶体中少量Cr³⁺替位，而不是含金属铬颗粒。' }
      ],
      story: '红宝石和蓝宝石的主要成分都是Al₂O₃；少量Cr³⁺让红宝石呈红色，说明微量杂质也能改变晶体颜色。',
      mass: '51.9961',
      melting: '1907 ℃',
      density: '7.15 g/cm³（常温）'
    },
    {
      number: 25,
      config: '[Ar] 3d⁵ 4s²',
      shells: [2, 8, 13, 2],
      oxidation: '+2、+3、+4、+6、+7（+2、+4、+7常见）',
      reactivity: '锰在空气中会逐渐氧化，可与稀酸反应；其多种氧化态让锰化合物广泛参与氧化还原和电池反应。',
      nuclear: 'stable',
      nuclearText: '⁵⁵Mn是锰唯一的稳定同位素；⁵⁴Mn等有放射性的人工同位素可用于示踪研究。',
      flame: {
        type: 'none',
        color: null,
        label: '无典型焰色',
        text: '锰没有常规典型焰色；高锰酸钾等固体的紫色是化合物对光的选择吸收，不是焰色。'
      },
      compounds: [
        { name: '二氧化锰', formula: 'MnO₂', note: '黑色固体，可用于干电池和催化分解反应，锰在其中为+4价。' },
        { name: '高锰酸钾', formula: 'KMnO₄', note: '深紫色强氧化剂，可用于消毒和水处理，浓溶液会染色并腐蚀。' },
        { name: '硫酸锰', formula: 'MnSO₄', note: '常用锰盐，可作微量元素肥料，也用于电池材料生产。' },
        { name: '碳酸锰', formula: 'MnCO₃', note: '菱锰矿的主要成分，常呈粉红至红色，是锰的矿物来源之一。' }
      ],
      compoundNote: 'MnO₂与KMnO₄都含锰和氧，但锰价态分别为+4和+7，颜色、氧化性和用途都不同。',
      reaction: {
        equation: 'Mn + 2HCl → MnCl₂ + H₂↑',
        text: '锰与稀盐酸反应可生成MnCl₂和氢气，体现金属与酸的置换反应；酸具有腐蚀性。'
      },
      relations: [
        { number: 43, type: '同族相似', text: '锰与锝同属第7族，但锰有稳定同位素且广泛存在，锝的同位素则都有放射性。' },
        { number: 26, type: '材料搭档', text: '锰是炼钢常用合金元素，可改善强度、硬度和耐磨性，并参与脱氧脱硫。' },
        { number: 19, type: '反应伙伴', text: 'KMnO₄由K⁺与高锰酸根组成，其中锰为+7价，钾本身并不使溶液呈紫色。' }
      ],
      story: '光合作用放氧的关键结构含Mn₄CaO₅簇，能逐步积累氧化能力把水氧化；这不是植物在电解金属锰。',
      mass: '54.938044',
      melting: '1246 ℃',
      density: '7.21 g/cm³（常温）'
    },
    {
      number: 26,
      config: '[Ar] 3d⁶ 4s²',
      shells: [2, 8, 14, 2],
      oxidation: '+2、+3',
      reactivity: '铁是中等活泼金属，能与氧、水和许多酸反应；生锈需要水和氧共同参与，合金化与表面处理可改变耐蚀性。',
      nuclear: 'stable',
      nuclearText: '⁵⁴Fe、⁵⁶Fe、⁵⁷Fe和⁵⁸Fe都是稳定同位素；⁵⁶Fe丰度很高，但不能因此忽略其他稳定同位素。',
      flame: {
        type: 'none',
        color: null,
        label: '无典型焰色',
        text: '铁没有典型焰色；钢丝棉燃烧的火星、铁块烧红和烟花中的亮点属于燃烧或高温发光，不是铁的特征焰色。'
      },
      compounds: [
        { name: '氧化铁(III)', formula: 'Fe₂O₃', note: '红棕色固体，可作颜料和炼铁原料；实际铁锈不是纯净Fe₂O₃，通常是含水氧化铁、氢氧化氧铁及其他物质的混合物。' },
        { name: '四氧化三铁', formula: 'Fe₃O₄', note: '黑色磁性固体，是磁铁矿主要成分，可表示为FeO·Fe₂O₃，同时含Fe(II)和Fe(III)。' },
        { name: '硫酸亚铁', formula: 'FeSO₄', note: '其七水合物为浅绿色晶体，可用于水处理和补铁制剂，亚铁离子容易被氧化。' },
        { name: '氯化铁(III)', formula: 'FeCl₃', note: '常见水合物呈黄褐色，可用于水处理和电路板蚀刻，具有腐蚀性。' }
      ],
      compoundNote: 'Fe²⁺和Fe³⁺是不同价态的铁离子；Fe₂O₃、Fe₃O₄与铁锈相关，但铁锈是复杂混合物，不能用一个化学式完全概括。',
      reaction: {
        equation: '3Fe + 2O₂ → Fe₃O₄',
        text: '铁在氧气中燃烧可生成黑色Fe₃O₄并出现火星；火星是燃烧现象，不是铁元素的焰色。'
      },
      relations: [
        { number: 6, type: '材料搭档', text: '钢是以铁为主、含少量碳及其他元素的合金；调碳含量和热处理可改变钢的强度、硬度与韧性。' },
        { number: 24, type: '材料搭档', text: '铁与铬等元素可制成不锈钢，钝化膜提高耐蚀性，但不代表任何环境下都不锈。' },
        { number: 8, type: '反应伙伴', text: '铁与氧、水长期作用形成复杂铁锈；Fe₃O₄则可在特定氧化条件下生成。' },
        { number: 27, type: '同族相似', text: '铁和钴都属于铁系元素，单质都有铁磁性，也常共同参与合金和磁性材料。' }
      ],
      story: '血红蛋白利用血红素中的Fe²⁺可逆结合氧气来运输氧；体内的铁处于配位结构中，并不是微小铁钉，也不会像铁钉那样生锈。',
      mass: '55.845',
      melting: '1538 ℃',
      density: '7.874 g/cm³（常温）'
    },
    {
      number: 27,
      config: '[Ar] 3d⁷ 4s²',
      shells: [2, 8, 15, 2],
      oxidation: '+2、+3',
      reactivity: '钴在常温空气中较稳定，加热或处于粉末状态时更易氧化，可与酸反应；不同钴化合物的颜色和毒性不同。',
      nuclear: 'stable',
      nuclearText: '⁵⁹Co是钴唯一的稳定同位素；人工⁶⁰Co有较强放射性，可用于受控辐照和放疗，不是天然钴都带放射性。',
      flame: {
        type: 'none',
        color: null,
        label: '无典型焰色',
        text: '钴没有典型焰色；蓝色钴玻璃或变色硅胶中的颜色来自Co²⁺的配位环境，不是焰色反应。'
      },
      compounds: [
        { name: '氧化钴(II)', formula: 'CoO', note: '通常呈橄榄绿色至灰绿色粉末，可用于陶瓷和钴材料制备。' },
        { name: '氯化钴', formula: 'CoCl₂', note: '无水物偏蓝，吸水形成水合物后可变粉红，曾用于湿度指示材料。' },
        { name: '钴酸锂', formula: 'LiCoO₂', note: '重要锂离子电池正极材料，钴处于复合氧化物晶格中，不是金属钴片。' }
      ],
      compoundNote: '钴化合物可呈蓝、粉红或绿色，颜色取决于价态、水合和配位；人体需要的是维生素B₁₂中的微量钴。',
      reaction: {
        equation: 'Co + 2HCl → CoCl₂ + H₂↑',
        text: '钴与盐酸反应可生成CoCl₂和氢气，溶液颜色来自水合钴离子，而不是金属钴溶解后仍以原子漂浮。'
      },
      relations: [
        { number: 26, type: '同族相似', text: '钴与铁、镍合称铁系元素，都具有铁磁性并能形成多种耐高温合金。' },
        { number: 3, type: '材料搭档', text: 'LiCoO₂把锂、钴和氧结合在晶体中，是常见电池正极材料。' },
        { number: 17, type: '反应伙伴', text: 'CoCl₂的水合与失水会改变钴离子的配位环境，从而发生颜色变化。' }
      ],
      story: '维生素B₁₂的中心含一个钴离子，人体需要它来维持正常生理功能；这与金属钴或放射性⁶⁰Co不是一回事。',
      mass: '58.933194',
      melting: '1495 ℃',
      density: '8.90 g/cm³（常温）'
    },
    {
      number: 28,
      config: '[Ar] 3d⁸ 4s²',
      shells: [2, 8, 16, 2],
      oxidation: '+2、+3（+2最常见）',
      reactivity: '镍常温下较耐腐蚀，表面可钝化，能缓慢与某些酸反应；镍粉和镍盐的反应性、危害性不能由镍块直接推断。',
      nuclear: 'stable',
      nuclearText: '⁵⁸Ni、⁶⁰Ni、⁶¹Ni、⁶²Ni和⁶⁴Ni都是稳定同位素，天然镍以⁵⁸Ni和⁶⁰Ni为主。',
      flame: {
        type: 'none',
        color: null,
        label: '无典型焰色',
        text: '镍没有典型焰色；镍盐溶液常呈绿色是Ni²⁺配位化合物的颜色，不是火焰中的特征发光。'
      },
      compounds: [
        { name: '氧化镍(II)', formula: 'NiO', note: '绿色粉末，可用于陶瓷、玻璃着色和电池材料。' },
        { name: '硫酸镍', formula: 'NiSO₄', note: '常见水合物为绿色晶体，用于电镀和电池原料，镍盐有致敏和毒性风险。' },
        { name: '氯化镍', formula: 'NiCl₂', note: '其水合物常呈绿色，可用于电镀和化学合成。' },
        { name: '氢氧化镍', formula: 'Ni(OH)₂', note: '绿色难溶固体，是镍氢电池等体系的正极活性材料之一。' }
      ],
      compoundNote: '镍盐的绿色通常与水合Ni²⁺有关；金属镍、NiO和电池中的Ni(OH)₂属于不同物质。',
      reaction: {
        equation: 'Ni + 2HCl → NiCl₂ + H₂↑',
        text: '镍可与盐酸反应生成NiCl₂和氢气，实际速率受表面氧化膜和酸浓度影响。'
      },
      relations: [
        { number: 26, type: '材料搭档', text: '镍与铁、铬共同用于多种不锈钢和耐热合金，镍有助于稳定组织和改善韧性。' },
        { number: 27, type: '同族相似', text: '镍与钴同属铁系元素，常见合金和电池材料中会一起出现。' },
        { number: 22, type: '材料搭档', text: '镍钛合金可表现形状记忆效应，用于医疗器械和温控器件。' }
      ],
      story: '镍钛合金受热后能恢复预设形状，这叫形状记忆效应；它不是金属有记忆，而是晶体结构发生可逆变化。',
      mass: '58.6934',
      melting: '1455 ℃',
      density: '8.908 g/cm³（常温）'
    },
    {
      number: 29,
      config: '[Ar] 3d¹⁰ 4s¹',
      shells: [2, 8, 18, 1],
      oxidation: '+1、+2',
      reactivity: '铜在干燥空气中较稳定，潮湿含CO₂等环境中会逐渐形成铜绿；能与氧化性酸反应，但不与稀盐酸像锌那样放氢。',
      nuclear: 'stable',
      nuclearText: '⁶³Cu和⁶⁵Cu都是稳定同位素；人工放射性铜同位素可用于医学研究，但不改变天然铜有稳定同位素的事实。',
      flame: {
        type: 'typical',
        color: '#20B2AA',
        label: '蓝绿色/绿色',
        text: '铜化合物可产生蓝绿色或绿色焰色，具体颜色受卤素等化学形态影响；这是受热激发发光，不等于所有铜制品燃烧都呈绿色。'
      },
      compounds: [
        { name: '氧化铜(II)', formula: 'CuO', note: '黑色固体，可用于陶瓷着色和化学试剂，铜为+2价。' },
        { name: '氧化亚铜', formula: 'Cu₂O', note: '红色至红棕色固体，可用于玻璃着色和防污涂料，铜为+1价。' },
        { name: '五水硫酸铜', formula: 'CuSO₄·5H₂O', note: '蓝色晶体，俗称胆矾，可用于实验和杀菌剂，失水后颜色会变浅。' },
        { name: '碱式碳酸铜', formula: 'Cu₂(OH)₂CO₃', note: '孔雀石的主要成分，呈绿色；真实铜绿还常含其他碱式铜盐。' }
      ],
      compoundNote: 'Cu₂O与CuO分别含+1价和+2价铜；铜绿是复杂腐蚀产物，不能简单写成黑色CuO或纯净Cu₂(OH)₂CO₃。',
      reaction: {
        equation: '2Cu + O₂ → 2CuO',
        text: '铜受热氧化可生成黑色CuO；长期潮湿环境中的绿色铜锈则是更复杂的碱式盐混合物。'
      },
      relations: [
        { number: 47, type: '同族相似', text: '铜与银同属第11族，都有良好导电性，但铜更常见且更易氧化。' },
        { number: 30, type: '材料搭档', text: '铜与锌可形成黄铜，比例变化会改变颜色、强度和加工性能。' },
        { number: 8, type: '反应伙伴', text: '铜与氧可形成CuO或Cu₂O，产物受反应条件影响。' },
        { number: 16, type: '矿物关联', text: '许多铜矿含铜和硫，如黄铜矿CuFeS₂，冶炼不是简单地把铜从石头里筛出。' }
      ],
      story: '旧铜像表面的绿色铜绿可形成保护层，成分会随环境中的CO₂、氯化物和硫化物而变，并不是铜“变成了绿色纯氧化铜”。',
      mass: '63.546',
      melting: '1084.62 ℃',
      density: '8.96 g/cm³（常温）'
    },
    {
      number: 30,
      config: '[Ar] 3d¹⁰ 4s²',
      shells: [2, 8, 18, 2],
      oxidation: '+2',
      reactivity: '锌较活泼，表面氧化膜提供一定保护；它能与稀酸放出氢气，也可在镀锌钢上作为牺牲性保护层。',
      nuclear: 'stable',
      nuclearText: '⁶⁴Zn、⁶⁶Zn、⁶⁷Zn、⁶⁸Zn和⁷⁰Zn都有稳定核素，天然锌以⁶⁴Zn为主。',
      flame: {
        type: 'none',
        color: null,
        label: '无典型焰色',
        text: '锌没有常规典型焰色；锌粉燃烧时可能出现的青绿色光和白色ZnO烟属于燃烧过程，不宜当作可靠焰色鉴别。'
      },
      compounds: [
        { name: '氧化锌', formula: 'ZnO', note: '白色粉末，可用于橡胶、陶瓷和防晒产品，能吸收部分紫外线。' },
        { name: '硫酸锌', formula: 'ZnSO₄', note: '常用锌盐，可作农业微量元素肥料和特定制剂原料。' },
        { name: '氯化锌', formula: 'ZnCl₂', note: '易吸湿固体，可用于助焊剂和工业处理，具有腐蚀性。' },
        { name: '硫化锌', formula: 'ZnS', note: '闪锌矿的主要成分，也可作荧光材料，掺杂后发光颜色会改变。' }
      ],
      compoundNote: '锌在化合物中几乎总是+2价；补锌利用适量锌盐或锌离子，金属锌和ZnO、ZnS的性质并不相同。',
      reaction: {
        equation: 'Zn + 2HCl → ZnCl₂ + H₂↑',
        text: '锌与稀盐酸生成ZnCl₂和氢气，是金属置换酸中氢的典型例子；酸有腐蚀性，氢气可燃。'
      },
      relations: [
        { number: 48, type: '同族相似', text: '锌与镉同属第12族，常见+2价，但镉及其化合物毒性通常更突出。' },
        { number: 29, type: '材料搭档', text: '锌与铜形成黄铜，这是合金而不是一种固定化学式的新化合物。' },
        { number: 26, type: '材料搭档', text: '镀锌层既隔离钢与环境，也能在局部破损时优先腐蚀，从而保护铁基体。' },
        { number: 16, type: '矿物关联', text: 'ZnS是常见锌矿物闪锌矿的主要成分，体现锌与硫的矿物联系。' }
      ],
      story: '镀锌钢板被划伤后，周围的锌仍可优先被氧化而保护铁，这叫牺牲性保护；代价是锌层会逐渐消耗。',
      mass: '65.38',
      melting: '419.53 ℃',
      density: '7.14 g/cm³（常温）'
    }
  ];

  return entries;
}));
