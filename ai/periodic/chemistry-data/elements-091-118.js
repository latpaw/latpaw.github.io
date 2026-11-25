(function (factory) {
  "use strict";

  var entries = factory();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = entries;
  }
  if (typeof window !== "undefined") {
    window.CHEMISTRY_PART_091_118 = entries;
  }
}(function () {
  "use strict";

  return [
    {
      number: 91,
      config: "[Rn]5f²6d¹7s²",
      shells: [2, 8, 18, 32, 20, 9, 2],
      oxidation: "已知 +5（最常见）、+4；+3、+2 较少见",
      reactivity: "实验化学以受控的溶液和固相研究为主；+5 价易水解并形成多种配合物。镤稀缺且强放射，不能按日常金属想象其反应操作。",
      nuclear: "radioactive",
      nuclearText: "没有稳定同位素。长寿命同位素 ²³¹Pa 的半衰期约 3.276 万年；它仍需专业放射防护，绝非可日常接触的材料。",
      flame: { type: "unknown", color: null, label: "未知", text: "没有可靠的镤焰色实验记录。强放射性、样品稀缺及极微量研究条件使焰色观察没有实际意义。" },
      compounds: [
        { name: "五氧化二镤", formula: "Pa₂O₅", note: "+5 价氧化物，在受控高温固相研究中表征。" },
        { name: "二氧化镤", formula: "PaO₂", note: "+4 价氧化物；不同价态氧化物的转化是镤化学研究内容。" },
        { name: "五氟化镤", formula: "PaF₅", note: "+5 价氟化物，仅在专业放射化学条件下研究。" }
      ],
      compoundNote: "所列均为真实研究化合物，不是常规商品。宏观单质和化合物都稀缺、强放射，不存在面向大众的“常见镤化合物”。",
      reaction: null,
      relations: [
        { number: 89, type: "锕系同系", text: "镤属于锕系，名称中的“镤/protactinium”还反映其衰变可生成锕的核素关系。" },
        { number: 92, type: "衰变链", text: "²³¹Pa 位于铀-235 衰变链，²³⁴Pa 出现在铀-238 衰变链中；这是核素关系，不是化合反应。" }
      ],
      story: "镤的名称意为“锕之前”，因为 ²³¹Pa 经 α 衰变形成 ²²⁷Ac。1913 年法扬斯和格林发现短寿命的 ²³⁴Pa，1917—1918 年迈特纳、哈恩以及索迪、克兰斯顿分别推进了长寿命 ²³¹Pa 的鉴定。",
      mass: "[231]",
      melting: "1568 °C",
      density: "15.37 g/cm³"
    },
    {
      number: 92,
      config: "[Rn]5f³6d¹7s²",
      shells: [2, 8, 18, 32, 21, 9, 2],
      oxidation: "已知 +3、+4、+5、+6；其中 +4 和 +6 最重要",
      reactivity: "实验表明铀金属会被氧化，细粉有自燃危险；水溶液中 U(IV) 与铀酰 U(VI) 化学尤其重要。所有操作都需考虑放射性与重金属化学毒性。",
      nuclear: "radioactive",
      nuclearText: "没有稳定同位素。²³⁸U 半衰期约 44.68 亿年，²³⁵U 约 7.038 亿年；长半衰期不等于无放射性或可以徒手接触。",
      flame: { type: "unknown", color: null, label: "未知", text: "铀没有可作为元素鉴定依据的可靠常规焰色。铀玻璃的绿黄荧光不是焰色；放射性与样品管控也使焰色试验没有实际意义。" },
      compounds: [
        { name: "二氧化铀", formula: "UO₂", note: "重要的 +4 价氧化物，也是陶瓷核燃料的常见化学形式。" },
        { name: "六氟化铀", formula: "UF₆", note: "易挥发的 +6 价氟化物，用于同位素分离流程，具强腐蚀性和放射危害。" },
        { name: "八氧化三铀", formula: "U₃O₈", note: "混合价态氧化物，可表示为 U(IV) 与 U(VI) 的组合。" }
      ],
      compoundNote: "这些是真实、研究充分的化合物，但“工业上常见”不等于适合日常接触；铀化合物同时具有放射风险和化学毒性。",
      reaction: { equation: "U + 3F₂ → UF₆", text: "氟气可把铀转化为挥发性六氟化铀。该式表示总反应；工业转化和防护远比课堂方程式复杂，绝非可模仿实验。" },
      relations: [
        { number: 91, type: "衰变链", text: "铀-238 与铀-235 的天然衰变链都经过镤同位素，体现母核与子核的关系。" },
        { number: 93, type: "核素合成", text: "²³⁸U 俘获中子生成 ²³⁹U，随后经 β⁻ 衰变生成 ²³⁹Np。" }
      ],
      story: "克拉普罗特于 1789 年从沥青铀矿中鉴定出铀，并以不久前发现的天王星 Uranus 命名。1896 年贝克勒尔研究铀盐时发现天然放射性，元素铀由此成为核科学史的起点之一。",
      mass: "[238]",
      melting: "1132.2 °C",
      density: "19.1 g/cm³"
    },
    {
      number: 93,
      config: "[Rn]5f⁴6d¹7s²",
      shells: [2, 8, 18, 32, 22, 9, 2],
      oxidation: "已知 +3、+4、+5、+6、+7；水溶液中 +5 很重要",
      reactivity: "实验研究覆盖多种价态；Np(V) 常以 NpO₂⁺ 存在，高价态具氧化性，价态会随酸碱度、配体和氧化还原条件改变。",
      nuclear: "radioactive",
      nuclearText: "没有稳定同位素。²³⁷Np 半衰期约 214.4 万年，是长寿命核废物核素之一；长寿命并不意味着可日常接触。",
      flame: { type: "unknown", color: null, label: "未知", text: "没有可靠的镤系之外类推而来的“镎焰色”实验依据。强放射性和极少量受控样品使焰色观察没有实际意义。" },
      compounds: [
        { name: "二氧化镎", formula: "NpO₂", note: "+4 价氧化物，是镎固相化学与核燃料循环研究的重要对象。" },
        { name: "六氟化镎", formula: "NpF₆", note: "挥发性 +6 价氟化物，需在专用装置中制备和研究。" },
        { name: "镎酰(V)离子", formula: "NpO₂⁺", note: "Np(V) 在水溶液中的代表性含氧阳离子，外围配位随介质而变。" }
      ],
      compoundNote: "所列物种均有实验研究基础，但不存在日常可见的镎化学品；宏观形态研究受放射性、自热和稀缺性限制。",
      reaction: { equation: "NpF₄ + F₂ → NpF₆", text: "四氟化镎进一步氟化可生成六氟化镎，这是挥发性锕系氟化物研究的代表反应，不是普通实验室演示。" },
      relations: [
        { number: 92, type: "合成前体", text: "²³⁹Np 由 ²³⁹U 经 β⁻ 衰变生成，其母核来自铀-238 的中子俘获。" },
        { number: 94, type: "核素转化", text: "²³⁷Np 俘获中子后经短寿命镎同位素衰变，可用于制备 ²³⁸Pu。" }
      ],
      story: "麦克米伦和艾贝尔生于 1940 年鉴定出首个被确认的超铀元素镎。天王星之外是海王星，因此铀之后的元素以 Neptune 命名；这一命名思路也延续到后面的钚。",
      mass: "[237]",
      melting: "644 °C",
      density: "20.45 g/cm³（α型）"
    },
    {
      number: 94,
      config: "[Rn]5f⁶7s²",
      shells: [2, 8, 18, 32, 24, 8, 2],
      oxidation: "已知 +3、+4、+5、+6、+7；+3、+4 常见，+7 需强氧化条件",
      reactivity: "实验表明钚金属活泼且粉尘有自燃危险；水溶液中多种价态可共存并发生歧化。它还具严重放射毒性，不能仅凭外观判断风险。",
      nuclear: "radioactive",
      nuclearText: "没有稳定同位素。最长寿命的 ²⁴⁴Pu 半衰期约 8130 万年；研究和能源领域常见的 ²³⁹Pu 约 2.411 万年，²³⁸Pu 约 87.7 年。",
      flame: { type: "unknown", color: null, label: "未知", text: "没有可靠的宏观钚焰色实验记录。强放射性、自燃与吸入危害以及受控微量样品，使焰色试验没有实际观察意义。" },
      compounds: [
        { name: "二氧化钚", formula: "PuO₂", note: "+4 价氧化物，是固相化学、燃料和长期贮存研究的重要材料。" },
        { name: "四氟化钚", formula: "PuF₄", note: "+4 价氟化物，可受控转化为其他钚化合物。" },
        { name: "三氯化钚", formula: "PuCl₃", note: "+3 价氯化物，代表钚的低价卤化物化学。" }
      ],
      compoundNote: "化合物种类虽有充分研究，但都只能在严格核材料管制和防护下处理；不存在适合大众接触的“常见钚化合物”。",
      reaction: { equation: "Pu + O₂ → PuO₂", text: "钚氧化可形成二氧化钚。实际氧化速率与是否自燃强烈依赖粒度、表面和金属相，不能视作安全演示。" },
      relations: [
        { number: 92, type: "反应堆生成", text: "²³⁸U 俘获中子后，经 ²³⁹U、²³⁹Np 的连续衰变生成 ²³⁹Pu。" },
        { number: 95, type: "继续俘获中子", text: "钚同位素在反应堆中继续俘获中子并衰变，可形成镅等更重锕系核素，具体产物取决于照射条件。" }
      ],
      story: "西博格团队在 1940—1941 年鉴定钚同位素。海王星之外当时是冥王星 Pluto，因此 94 号元素得名 plutonium。²³⁸Pu 的衰变热还为深空探测器提供长期电源。",
      mass: "[244]",
      melting: "639.4 °C",
      density: "19.85 g/cm³（α型）"
    },
    {
      number: 95,
      config: "[Rn]5f⁷7s²",
      shells: [2, 8, 18, 32, 25, 8, 2],
      oxidation: "已知 +3（最常见）、+4、+5、+6；高价态需较强氧化条件",
      reactivity: "实验水溶液化学以 Am(III) 为主，强氧化剂可产生高价镅酰物种；固相中可研究 +4 价。反应条件与放射性必须同时考虑。",
      nuclear: "radioactive",
      nuclearText: "没有稳定同位素。²⁴³Am 半衰期约 7370 年；离子感烟探测器使用的 ²⁴¹Am 约 432.2 年，活度虽小也必须保留在密封源内。",
      flame: { type: "unknown", color: null, label: "未知", text: "没有可靠的镅焰色实验记录。感烟探测器中的微量密封源不是焰色样品，强放射性使焰色观察没有实际意义。" },
      compounds: [
        { name: "二氧化镅", formula: "AmO₂", note: "+4 价氧化物，可用于研究镅的固相结构与价态。" },
        { name: "三氧化二镅", formula: "Am₂O₃", note: "+3 价氧化物，在受控条件下制备和表征。" },
        { name: "三氯化镅", formula: "AmCl₃", note: "+3 价氯化物，是镅卤化物化学的代表。" }
      ],
      compoundNote: "所列是真实研究化合物；镅虽在感烟探测器中有微量应用，但其纯化合物没有日常用途，宏观样品具有强放射危害。",
      reaction: null,
      relations: [
        { number: 94, type: "反应堆生成", text: "镅同位素可由钚同位素在反应堆中连续俘获中子并发生衰变形成。" },
        { number: 93, type: "α衰变产物", text: "²⁴¹Am 经 α 衰变生成 ²³⁷Np；这也是核素关系而非化合物之间的反应。" }
      ],
      story: "镅由西博格团队于 1944 年鉴定，以美洲 America 命名，呼应同族的铕以欧洲 Europe 命名。²⁴¹Am 的电离作用曾广泛用于离子感烟探测器，但密封源不应拆解。",
      mass: "[243]",
      melting: "1176 °C",
      density: "12.0 g/cm³"
    },
    {
      number: 96,
      config: "[Rn]5f⁷6d¹7s²",
      shells: [2, 8, 18, 32, 25, 9, 2],
      oxidation: "已知 +3（占主导）、+4；低价态不是水溶液化学的主要形式",
      reactivity: "实验化学以 Cm(III) 的溶液配位和固相化合物为主，强氧化条件可获得 Cm(IV)。强放射性造成的自热和辐射分解会改变样品行为。",
      nuclear: "radioactive",
      nuclearText: "没有稳定同位素。²⁴⁷Cm 半衰期约 1560 万年；常用于研究的 ²⁴⁴Cm 仅约 18.1 年，会产生明显衰变热，必须远程防护。",
      flame: { type: "unknown", color: null, label: "未知", text: "没有可靠的锔焰色实验记录。强放射、自热和极微量样品使焰色试验既不安全，也没有实际鉴定意义。" },
      compounds: [
        { name: "三氧化二锔", formula: "Cm₂O₃", note: "+3 价氧化物，固相结构与辐射效应均有研究。" },
        { name: "二氧化锔", formula: "CmO₂", note: "+4 价氧化物，代表锔的较高价态。" },
        { name: "三氯化锔", formula: "CmCl₃", note: "+3 价氯化物，可在专业放射化学装置中表征。" }
      ],
      compoundNote: "这些是真实研究化合物而非日常用品。锔样品常受自热、辐射分解和衰变子体积累影响，不能由短期外观推断长期稳定性。",
      reaction: null,
      relations: [
        { number: 95, type: "合成前体", text: "²⁴¹Am 俘获中子后经短寿命镅同位素 β⁻ 衰变，可形成 ²⁴²Cm。" },
        { number: 97, type: "锕系相邻", text: "锔与锫在周期表相邻，均以三价水溶液化学为重要研究对象，但这不表示任意两者会直接化合。" }
      ],
      story: "锔于 1944 年由西博格、詹姆斯和吉奥索团队鉴定，名称纪念皮埃尔·居里和玛丽·居里。它在周期表中的位置呼应钆，而钆的命名则纪念加多林。",
      mass: "[247]",
      melting: "1345 °C",
      density: "13.51 g/cm³"
    },
    {
      number: 97,
      config: "[Rn]5f⁹7s²",
      shells: [2, 8, 18, 32, 27, 8, 2],
      oxidation: "已知 +3（最常见）、+4",
      reactivity: "实验上以 Bk(III) 的溶液和固相化学为主，Bk(IV) 是较强氧化态。样品极少，研究通常采用 tracer（示踪）量或专门微量技术。",
      nuclear: "radioactive",
      nuclearText: "没有稳定同位素。²⁴⁷Bk 半衰期约 1380 年；用于合成更重元素的 ²⁴⁹Bk 约 330 天，靶材会随衰变不断减少。",
      flame: { type: "unknown", color: null, label: "未知", text: "没有可靠的锫焰色实验记录。强放射性和仅够科研的微量样品，使焰色观察没有实际意义。" },
      compounds: [
        { name: "三氧化二锫", formula: "Bk₂O₃", note: "+3 价氧化物，是真实固相研究对象。" },
        { name: "二氧化锫", formula: "BkO₂", note: "+4 价氧化物，展示锫可达到的较高氧化态。" },
        { name: "三氯化锫", formula: "BkCl₃", note: "+3 价氯化物，仅在微量专业研究中处理。" }
      ],
      compoundNote: "所列化合物有实验基础，但没有宏量常见形态或大众用途；锫的主要“应用”是作为超重元素合成研究的靶材。",
      reaction: null,
      relations: [
        { number: 95, type: "首次合成靶材", text: "锫的首次鉴定使用 ²⁴¹Am 靶进行 α 粒子轰击，形成锫同位素。" },
        { number: 98, type: "β衰变产物", text: "²⁴⁹Bk 经 β⁻ 衰变生成 ²⁴⁹Cf；锫靶也是获取锎及超重元素研究材料的一环。" }
      ],
      story: "锫于 1949 年在伯克利被鉴定，以 Berkeley 命名。几十年后，²⁴⁹Bk 靶又成为合成 117 号元素的关键原料，其有限存量和约 330 天的半衰期让实验时间格外宝贵。",
      mass: "[247]",
      melting: "986 °C（α型）",
      density: "14.78 g/cm³（α型）"
    },
    {
      number: 98,
      config: "[Rn]5f¹⁰7s²",
      shells: [2, 8, 18, 32, 28, 8, 2],
      oxidation: "已知 +3（最常见）、+2、+4",
      reactivity: "实验研究以 Cf(III) 为主，在特定固相或还原、氧化条件下可研究其他价态。²⁵²Cf 的强中子发射使实验防护尤为特殊。",
      nuclear: "radioactive",
      nuclearText: "没有稳定同位素。²⁵¹Cf 半衰期约 898 年；²⁵²Cf 约 2.645 年并显著自发裂变、释放中子，绝不能视作可日常接触的放射源。",
      flame: { type: "unknown", color: null, label: "未知", text: "没有可靠的锎焰色实验记录。强放射、中子辐射及极微量样品使焰色观察没有实际意义。" },
      compounds: [
        { name: "三氧化二锎", formula: "Cf₂O₃", note: "+3 价氧化物，在受控固相研究中表征。" },
        { name: "三氯化锎", formula: "CfCl₃", note: "+3 价氯化物，代表锎的卤化物化学。" },
        { name: "氯氧化锎", formula: "CfOCl", note: "+3 价氯氧化物，是真实研究过的固相化合物。" }
      ],
      compoundNote: "这些是真实研究化合物，不存在日常可接触的锎化学品。²⁵²Cf 的中子源用途使用密封专门源，不等于其化合物可自由使用。",
      reaction: null,
      relations: [
        { number: 97, type: "核素转化", text: "²⁴⁹Bk 可经中子俘获等核反应生成锎同位素；²⁴⁹Bk 本身也会 β⁻ 衰变为 ²⁴⁹Cf。" },
        { number: 99, type: "锕系相邻", text: "锎与锿同属锕系且原子序数相邻；这只是周期表与核素研究联系，不是直接化学键关系。" }
      ],
      story: "锎于 1950 年在伯克利被鉴定，以加利福尼亚州 California 命名。²⁵²Cf 会自发裂变并放出中子，因此密封的锎源可用于中子活化分析、启动某些反应堆等专业场景。",
      mass: "[251]",
      melting: "900 °C",
      density: "15.1 g/cm³"
    },
    {
      number: 99,
      config: "[Rn]5f¹¹7s²",
      shells: [2, 8, 18, 32, 29, 8, 2],
      oxidation: "已知 +3（占主导）；+2 在部分固相和还原研究中出现",
      reactivity: "实验主要在微量溶液、固相和气相条件下研究 Es(III)，也探索较低价态。强放射性和自辐照会限制宏观样品的结构与反应研究。",
      nuclear: "radioactive",
      nuclearText: "没有稳定同位素。较长寿命的 ²⁵²Es 半衰期约 472 天，²⁵⁴Es 约 276 天；样品会明显衰变并伴随强辐射。",
      flame: { type: "unknown", color: null, label: "未知", text: "没有可靠的锿焰色实验记录。强放射性与极微量、短寿命样品使焰色观察没有实际意义。" },
      compounds: [
        { name: "三氧化二锿", formula: "Es₂O₃", note: "+3 价氧化物，曾在微量固相研究中表征。" },
        { name: "三氯化锿", formula: "EsCl₃", note: "+3 价氯化物，有真实的结构与光谱研究。" },
        { name: "氯氧化锿", formula: "EsOCl", note: "+3 价氯氧化物，代表微量锿化合物的研究。" }
      ],
      compoundNote: "所列均来自专业微量研究，不是可常规购买的化合物。锿的宏观物性数据有限，辐射分解与衰变子体会持续改变样品。",
      reaction: null,
      relations: [
        { number: 100, type: "共同发现", text: "锿和镄都在 1952 年首次热核试验“Mike”的沉降物研究中被识别。" },
        { number: 92, type: "多重中子俘获", text: "热核爆炸瞬间的极强中子通量使铀同位素连续俘获中子并衰变，形成包括锿在内的重核素。" }
      ],
      story: "锿以物理学家阿尔伯特·爱因斯坦命名。它并非先从瓶装矿物里找到，而是从首次氢弹试验后的放射性碎片中识别出来，这一发现曾长期保密。",
      mass: "[252]",
      melting: "860 °C",
      density: "8.84 g/cm³"
    },
    {
      number: 100,
      config: "[Rn]5f¹²7s²",
      shells: [2, 8, 18, 32, 30, 8, 2],
      oxidation: "已知 +3（水溶液主要）；+2 可在强还原研究中涉及",
      reactivity: "实验证据主要来自“一次少量原子”的示踪溶液化学，Fm(III) 的离子交换和萃取行为可与锕系离子比较；没有常规宏量反应实验。",
      nuclear: "radioactive",
      nuclearText: "没有稳定同位素。最长寿命的 ²⁵⁷Fm 半衰期约 100.5 天，因此镄研究依赖不断补充的极微量短寿命样品。",
      flame: { type: "unknown", color: null, label: "未知", text: "没有可靠的镄焰色实验记录。样品只有极微量且强放射、寿命短，焰色观察没有实际意义。" },
      compounds: [
        { name: "水合镄(III)配位物种", formula: "Fm³⁺(aq)", note: "由离子交换、溶剂萃取等示踪实验研究；不是已经分离装瓶的纯盐。" }
      ],
      compoundNote: "尚无宏量、结构明确的纯镄化合物；这里列出的是水溶液中真实研究的离子物种，不把它冒充可分离晶体。宏观形态和常见化合物未知。",
      reaction: null,
      relations: [
        { number: 99, type: "共同发现", text: "镄与锿同在首次热核试验后的放射性碎片研究中被识别。" },
        { number: 101, type: "锕系相邻", text: "镄与钔原子序数相邻，化学研究都高度依赖示踪量和离子行为比较。" }
      ],
      story: "镄以恩里科·费米命名，纪念他在核物理和首个核反应堆方面的贡献。它的元素符号 Fm 同时出现在第 100 号这一里程碑位置，但自然界并没有可供开采的镄矿。",
      mass: "[257]",
      melting: "未知",
      density: "未知"
    },
    {
      number: 101,
      config: "[Rn]5f¹³7s²",
      shells: [2, 8, 18, 32, 31, 8, 2],
      oxidation: "已知 +3、+2；水溶液中 Md(II) 相对易形成",
      reactivity: "示踪实验表明 Md(III) 可被还原为 Md(II)，并可用离子交换和萃取研究。原子数量太少，不能据此描述宏量金属或瓶装修盐的反应。",
      nuclear: "radioactive",
      nuclearText: "没有稳定同位素。²⁵⁸Md 半衰期约 51.6 天，是较长寿命同位素之一；实验仍通常只得到少量原子。",
      flame: { type: "unknown", color: null, label: "未知", text: "没有可靠的钔焰色实验记录。强放射性和一次少量原子的研究规模，使焰色观察没有实际意义。" },
      compounds: [
        { name: "水合钔(III)配位物种", formula: "Md³⁺(aq)", note: "由示踪离子交换与萃取实验确认其三价离子行为。" },
        { name: "水合钔(II)配位物种", formula: "Md²⁺(aq)", note: "还原实验研究的二价水溶液物种，不代表已分离出宏量纯盐。" }
      ],
      compoundNote: "尚无宏量、结构明确的纯钔化合物；列出的是真实示踪化学物种。宏观单质、常见化合物和常规反应性均未知。",
      reaction: null,
      relations: [
        { number: 99, type: "首次合成靶材", text: "首次合成钔使用 ²⁵³Es 靶与 α 粒子反应，得到 ²⁵⁶Md。" },
        { number: 102, type: "锕系相邻", text: "钔与锘相邻；锘的二价稳定性更突出，两者常在同位素与示踪化学研究中相互参照。" }
      ],
      story: "钔以元素周期律奠基者门捷列夫命名。1955 年的首次实验从极少量的 ²⁵³Es 出发，按“一次一个原子”的思路识别新元素，是微量元素化学的经典故事。",
      mass: "[258]",
      melting: "未知",
      density: "未知"
    },
    {
      number: 102,
      config: "[Rn]5f¹⁴7s²",
      shells: [2, 8, 18, 32, 32, 8, 2],
      oxidation: "已知 +2（水溶液中相对稳定）、+3",
      reactivity: "示踪实验显示 No(II) 在水溶液中比典型锕系二价离子更稳定，No(III) 需氧化条件维持。尚无宏量反应或纯化合物研究。",
      nuclear: "radioactive",
      nuclearText: "没有稳定同位素。²⁵⁹No 半衰期约 58 分钟，是较长寿命同位素；多数锘同位素更短，只能以极少原子研究。",
      flame: { type: "unknown", color: null, label: "未知", text: "没有可靠的锘焰色实验记录。强放射、短寿命和一次少量原子的样品规模，使焰色观察没有实际意义。" },
      compounds: [
        { name: "水合锘(II)配位物种", formula: "No²⁺(aq)", note: "示踪实验中的代表性二价水溶液离子，突出锘不同于多数锕系元素之处。" },
        { name: "水合锘(III)配位物种", formula: "No³⁺(aq)", note: "在适当氧化条件下研究的三价离子，不是可分离宏量晶体的配方。" }
      ],
      compoundNote: "尚无宏量、结构明确的纯锘化合物；列出的是水溶液示踪物种。宏观形态、常见化合物和常规反应性未知。",
      reaction: null,
      relations: [
        { number: 96, type: "合成靶材", text: "多种锘同位素可用锔靶与碳离子反应合成，具体产物取决于靶核、束流和能量。" },
        { number: 103, type: "锕系相邻", text: "锘与铹位于锕系末端；两者的化学研究都依赖短寿命原子和示踪方法。" }
      ],
      story: "锘以阿尔弗雷德·诺贝尔命名。其发现史伴随多国实验室的主张与重复验证，今天的元素表采用 nobelium 这一名称，但具体“谁首先发现”的叙述需要区分不同实验与证据。",
      mass: "[259]",
      melting: "未知",
      density: "未知"
    },
    {
      number: 103,
      config: "[Rn]5f¹⁴7s²7p¹",
      shells: [2, 8, 18, 32, 32, 8, 3],
      oxidation: "已知 +3；其他价态主要属于理论预测",
      reactivity: "实验支持 Lr(III) 的溶液离子行为，并有气相色谱研究。相对论效应使最外层为 7p¹ 而非简单照抄的 6d¹，但不能由此虚构宏量反应性。",
      nuclear: "radioactive",
      nuclearText: "没有稳定同位素。较长寿命的 ²⁶⁶Lr 半衰期约 11 小时；产量仍极低，化学实验通常按单原子或少量原子进行。",
      flame: { type: "unknown", color: null, label: "未知", text: "没有可靠的铹焰色实验记录。强放射、短寿命与极微量样品使焰色观察没有实际意义。" },
      compounds: [
        { name: "水合铹(III)配位物种", formula: "Lr³⁺(aq)", note: "离子交换等实验研究的三价水溶液物种，并非宏量纯盐。" }
      ],
      compoundNote: "尚无宏量、结构明确的纯铹化合物；水溶液离子行为有实验研究，而宏观形态和常见化合物未知，更多化合物属于理论预测。",
      reaction: null,
      relations: [
        { number: 102, type: "锕系末端", text: "铹通常列为锕系最后一个元素，紧接锘；两者均没有稳定同位素。" },
        { number: 104, type: "周期表相邻", text: "Rf 接在铹之后并开启 6d 过渡元素区域；这一位置关系不等于两种元素会直接化合。" }
      ],
      story: "铹以回旋加速器先驱欧内斯特·劳伦斯命名。它的中性原子基态写作 [Rn]5f¹⁴7s²7p¹，是相对论效应改变超重元素电子排布直觉的著名例子。",
      mass: "[266]",
      melting: "未知",
      density: "未知"
    },
    {
      number: 104,
      config: "[Rn]5f¹⁴6d²7s²（预测）",
      shells: [2, 8, 18, 32, 32, 10, 2],
      oxidation: "实验支持 +4；其他价态尚缺少充分实验确认",
      reactivity: "单原子气相色谱实验支持 Rf(IV) 氯化物的挥发性，并与第 4 族化学作比较；这些结果不能外推为宏观金属或常见试剂的反应性。",
      nuclear: "radioactive",
      nuclearText: "没有稳定同位素。²⁶⁷Rf 曾测得小时量级半衰期（约 1.3 小时，核数据仍会修订）；化学实验通常只涉及极少原子。",
      flame: { type: "unknown", color: null, label: "未知", text: "没有任何可靠的 Rf 焰色实验。强放射性、短寿命和单原子量级样品使焰色观察没有实际意义。",
      },
      compounds: [
        { name: "Rf 四氯化物", formula: "RfCl₄", note: "由单原子气相色谱研究支持的挥发性 +4 价物种，不是宏量分离的晶体。" }
      ],
      compoundNote: "所列仅为单原子实验支持的气相物种；宏观形态、常见化合物和常规反应性未知，不能写成可装瓶保存的试剂。",
      reaction: null,
      relations: [
        { number: 72, type: "同族比较", text: "Rf 位于铪下方的第 4 族位置；气相氯化物实验用于检验同族相似性及相对论效应。" },
        { number: 105, type: "周期表相邻", text: "Rf 与 Db 原子序数相邻，化学研究都采用短寿命单原子气相方法。" }
      ],
      story: "Rf 以欧内斯特·卢瑟福命名。它与随后几种元素的命名曾经历长期国际争议，因此旧文献里可能出现不同名称；现代数据应使用 IUPAC 正式名称。",
      mass: "[267]",
      melting: "未知",
      density: "未知"
    },
    {
      number: 105,
      config: "[Rn]5f¹⁴6d³7s²（预测）",
      shells: [2, 8, 18, 32, 32, 11, 2],
      oxidation: "实验研究主要围绕 +5；其他价态尚未充分确定",
      reactivity: "气相实验研究 Db 的氯氧化物吸附与挥发性，并与铌、钽比较；结果提示不能机械照搬同族趋势。没有宏量反应性实验。",
      nuclear: "radioactive",
      nuclearText: "没有稳定同位素。²⁶⁸Db 曾报道约 1 天量级的半衰期，但测量来自极少原子且不确定度较大，不能理解为可日常保存。",
      flame: { type: "unknown", color: null, label: "未知", text: "没有可靠的 Db 焰色实验。强放射、短寿命和单原子研究规模使焰色观察没有实际意义。" },
      compounds: [
        { name: "Db 氯氧化物", formula: "DbOCl₃", note: "气相色谱实验中讨论的 +5 价挥发性物种，证据来自极少原子的保留行为。" }
      ],
      compoundNote: "所列仅为实验研究的气相物种；宏观晶体、常见化合物与常规反应性未知，不能把气相吸附证据写成宏量合成事实。",
      reaction: null,
      relations: [
        { number: 73, type: "同族比较", text: "Db 位于钽下方的第 5 族位置，其气相化学常与钽、铌对照，而不是声称存在直接化学关系。" },
        { number: 106, type: "周期表相邻", text: "Db 与 Sg 相邻，均通过加速器合成并依赖短寿命原子化学。" }
      ],
      story: "Db 的名称来自俄罗斯杜布纳 Dubna，纪念杜布纳联合核子研究所的贡献。它的命名也曾处在“冷战元素命名争议”之中，旧资料中的 hahnium 等叫法并非现行名称。",
      mass: "[268]",
      melting: "未知",
      density: "未知"
    },
    {
      number: 106,
      config: "[Rn]5f¹⁴6d⁴7s²（预测）",
      shells: [2, 8, 18, 32, 32, 12, 2],
      oxidation: "实验支持 +6；其他价态主要为预测或尚不确定",
      reactivity: "单原子气相实验支持 Sg(VI) 氯氧化物和六羰基物种，可与第 6 族比较；没有宏观样品、燃烧或常规溶液反应数据。",
      nuclear: "radioactive",
      nuclearText: "没有稳定同位素。用于化学研究的 ²⁶⁹Sg 等同位素半衰期为分钟量级；原子逐个产生、逐个探测，不存在可日常接触的样品。",
      flame: { type: "unknown", color: null, label: "未知", text: "没有可靠的 Sg 焰色实验。强放射、短寿命和单原子量级样品使焰色观察没有实际意义。" },
      compounds: [
        { name: "Sg 氯氧化物", formula: "SgO₂Cl₂", note: "由气相色谱实验支持的 +6 价挥发性物种。" },
        { name: "Sg 六羰基合物", formula: "Sg(CO)₆", note: "单原子气相实验研究的羰基化合物，用于比较第 6 族金属羰基化学。" }
      ],
      compoundNote: "所列是实验支持的气相物种，不是宏量纯品；Sg 的宏观形态、常见化合物和常规反应性未知。",
      reaction: null,
      relations: [
        { number: 74, type: "同族比较", text: "Sg 位于钨下方的第 6 族位置，挥发性含氧化合物和羰基化合物用于同族比较。" },
        { number: 107, type: "周期表相邻", text: "Sg 与 Bh 相邻，都已通过极少量原子的气相化合物实验探索化学性质。" }
      ],
      story: "Sg 以格伦·西博格命名，他参与了多种锕系元素的发现。正式命名时西博格仍在世，这在元素命名史上非常罕见，也让“元素名如何纪念科学家”成为有趣话题。",
      mass: "[269]",
      melting: "未知",
      density: "未知"
    },
    {
      number: 107,
      config: "[Rn]5f¹⁴6d⁵7s²（预测）",
      shells: [2, 8, 18, 32, 32, 13, 2],
      oxidation: "实验支持 +7；其他价态主要为预测或尚不确定",
      reactivity: "气相色谱实验支持 Bh(VII) 氯氧化物的形成和挥发性，可与铼、锝同类物种比较；没有宏观化学或日常反应数据。",
      nuclear: "radioactive",
      nuclearText: "没有稳定同位素。²⁷⁰Bh 半衰期约 1 分钟，是较有代表性的研究同位素；实验只能处理逐个产生的高速衰变原子。",
      flame: { type: "unknown", color: null, label: "未知", text: "没有可靠的 Bh 焰色实验。强放射、短寿命和单原子量级样品使焰色观察没有实际意义。" },
      compounds: [
        { name: "Bh 氯氧化物", formula: "BhO₃Cl", note: "由单原子气相实验支持的 +7 价挥发性物种，不是宏量分离产物。" }
      ],
      compoundNote: "所列仅为气相实验物种；Bh 的宏观形态、常见化合物和常规反应性未知，更多可能化合物仍是理论预测。",
      reaction: null,
      relations: [
        { number: 75, type: "同族比较", text: "Bh 位于铼下方的第 7 族位置，BhO₃Cl 的挥发性研究可与铼的同类化学对照。" },
        { number: 108, type: "周期表相邻", text: "Bh 与 Hs 相邻，二者都在重离子加速器中以极少原子合成。" }
      ],
      story: "Bh 以尼尔斯·玻尔命名，纪念他对原子结构和量子理论的贡献。名称曾被提议为 nielsbohrium，最终采用较短的 bohrium，中文资料中应以现行元素名为准。",
      mass: "[270]",
      melting: "未知",
      density: "未知"
    },
    {
      number: 108,
      config: "[Rn]5f¹⁴6d⁶7s²（预测）",
      shells: [2, 8, 18, 32, 32, 14, 2],
      oxidation: "实验支持 +8；其他价态尚缺少充分实验确认",
      reactivity: "单原子气相实验支持挥发性 HsO₄，显示 Hs 可达到 +8 并与锇的四氧化物比较；这不代表已获得宏量 Hs 或其完整反应系列。",
      nuclear: "radioactive",
      nuclearText: "没有稳定同位素。²⁶⁹Hs 半衰期约十几秒，是代表性化学研究同位素；关于其他更长寿命核态的个别报告不能当作常规样品依据。",
      flame: { type: "unknown", color: null, label: "未知", text: "没有可靠的 Hs 焰色实验。强放射、短寿命和单原子量级样品使焰色观察没有实际意义。" },
      compounds: [
        { name: "Hs 四氧化物", formula: "HsO₄", note: "由气相实验支持的挥发性 +8 价氧化物，与 OsO₄ 作方法学比较。" }
      ],
      compoundNote: "所列仅为单原子气相实验物种；Hs 的宏观形态、常见化合物和常规反应性未知，不能据此声称已制成瓶装氧化物。",
      reaction: null,
      relations: [
        { number: 76, type: "同族比较", text: "Hs 位于锇下方的第 8 族位置，HsO₄ 的研究用于检验与 OsO₄ 的相似和差异。" },
        { number: 109, type: "周期表相邻", text: "Hs 与 Mt 相邻，但 Mt 尚无同等级别的确证化合物实验，不能把 HsO₄ 外推过去。" }
      ],
      story: "Hs 的名称来自德国黑森州 Hesse 的拉丁名 Hassia，发现工作与位于达姆施塔特的 GSI 研究机构密切相关。地名进入元素名，是超重元素命名的一种传统。",
      mass: "[269]",
      melting: "未知",
      density: "未知"
    },
    {
      number: 109,
      config: "[Rn]5f¹⁴6d⁷7s²（预测）",
      shells: [2, 8, 18, 32, 32, 15, 2],
      oxidation: "预测 +1、+3、+6 等；尚无充分实验确认",
      reactivity: "尚无获得公认的具体化合物化学实验。理论预测可讨论同族趋势与相对论效应，但不能把预测写成 Mt 金属或盐类的实测反应性。",
      nuclear: "radioactive",
      nuclearText: "没有稳定同位素。²⁷⁸Mt 半衰期为秒量级，已合成原子极少；任何化学性质结论都受到产额和寿命的严格限制。",
      flame: { type: "unknown", color: null, label: "未知", text: "没有 Mt 焰色实验。强放射、短寿命和单原子量级样品使焰色观察没有实际意义，也没有可报告的可靠颜色。" },
      compounds: [],
      compoundNote: "尚无实验确证的 Mt 化合物；宏观形态、常见化合物和常规反应性未知。文献中的可能价态与物种主要是理论预测，本表不虚构“常见化合物”。",
      reaction: null,
      relations: [
        { number: 77, type: "同族位置", text: "Mt 位于铱下方的第 9 族位置；这只是周期表位置与预测比较，尚无直接化学相似性的实验确证。" },
        { number: 110, type: "周期表相邻", text: "Mt 与 Ds 相邻，两者的化学性质都主要停留在预测阶段。" }
      ],
      story: "Mt 以莉泽·迈特纳命名，她参与解释了核裂变机制，并在核科学史上具有重要地位。以她命名元素，也提醒人们重新关注那些曾被低估的科学贡献。",
      mass: "[278]",
      melting: "未知",
      density: "未知"
    },
    {
      number: 110,
      config: "[Rn]5f¹⁴6d⁸7s²（预测）",
      shells: [2, 8, 18, 32, 32, 16, 2],
      oxidation: "预测 +2、+4、+6；尚无实验确证",
      reactivity: "尚无确证的具体化合物实验。理论预测 Ds 可能表现第 10 族某些趋势，但强相对论效应、短寿命和极低产额使宏观反应性未知。",
      nuclear: "radioactive",
      nuclearText: "没有稳定同位素。²⁸¹Ds 半衰期为秒量级（约十几秒），只产生过极少原子，不能形成可观察的宏观样品。",
      flame: { type: "unknown", color: null, label: "未知", text: "没有 Ds 焰色实验。强放射、短寿命和单原子量级样品使焰色观察没有实际意义。" },
      compounds: [],
      compoundNote: "尚无实验确证的 Ds 化合物；宏观形态、常见化合物和常规反应性未知，任何具体氧化物、卤化物或配合物都不应写成已发现的常见物质。",
      reaction: null,
      relations: [
        { number: 78, type: "同族位置", text: "Ds 位于铂下方的第 10 族位置；同族比较主要是理论预测，不能据此宣称其实测催化性。" },
        { number: 111, type: "周期表相邻", text: "Ds 与 Rg 相邻，均为人工合成、无稳定同位素的超重元素。" }
      ],
      story: "Ds 以德国达姆施塔特 Darmstadt 命名，发现工作在当地重离子研究机构完成。它的名称 darmstadtium 较长，却完整保留了一座科学城市的名字。",
      mass: "[281]",
      melting: "未知",
      density: "未知"
    },
    {
      number: 111,
      config: "[Rn]5f¹⁴6d⁹7s²（预测）",
      shells: [2, 8, 18, 32, 32, 17, 2],
      oxidation: "预测 +1、+3、+5 等；尚无实验确证",
      reactivity: "尚无确证的具体化合物实验。理论常把 Rg 与金比较，但相对论效应可能带来显著差异；不能由此声称 Rg 已表现黄金般稳定性。",
      nuclear: "radioactive",
      nuclearText: "没有稳定同位素。²⁸²Rg 半衰期约 100 秒，是较长寿命的代表核素之一；产额仍只是极少原子。",
      flame: { type: "unknown", color: null, label: "未知", text: "没有 Rg 焰色实验。强放射、短寿命和单原子量级样品使焰色观察没有实际意义。" },
      compounds: [],
      compoundNote: "尚无实验确证的 Rg 化合物；宏观形态、常见化合物和常规反应性未知，具体化合物只宜作为理论预测讨论。",
      reaction: null,
      relations: [
        { number: 79, type: "同族位置", text: "Rg 位于金下方的第 11 族位置；这种位置关系不等于已证实 Rg 具有金的颜色、惰性或货币金属性质。" },
        { number: 112, type: "周期表相邻", text: "Rg 与 Cn 相邻，Cn 已有单原子表面吸附研究，而 Rg 的确证化学实验更有限。" }
      ],
      story: "Rg 以威廉·康拉德·伦琴命名，他因发现 X 射线而闻名。元素符号 Rg 与中文里“黄金”的联想无关，也不意味着这种超重元素会呈现黄金外观。",
      mass: "[282]",
      melting: "未知",
      density: "未知"
    },
    {
      number: 112,
      config: "[Rn]5f¹⁴6d¹⁰7s²（预测）",
      shells: [2, 8, 18, 32, 32, 18, 2],
      oxidation: "预测 +2 较重要，+4 亦被讨论；尚无化合物实验确证",
      reactivity: "已有单原子在金表面的吸附与挥发性研究，支持对 Cn 单质行为的初步探索；这不是宏观汞样反应，也没有确证常见化合物。",
      nuclear: "radioactive",
      nuclearText: "没有稳定同位素。²⁸⁵Cn 半衰期约 30 秒，是代表性较长寿命同位素；实验只能逐个合成并探测其衰变。",
      flame: { type: "unknown", color: null, label: "未知", text: "没有 Cn 焰色实验。强放射、短寿命和单原子量级样品使焰色观察没有实际意义，不能借用汞的发射光谱充当焰色。" },
      compounds: [],
      compoundNote: "尚无实验确证的 Cn 化合物；单原子吸附不等于合成了化合物。宏观形态、常见化合物和常规反应性未知，具体组成多为理论预测。",
      reaction: null,
      relations: [
        { number: 80, type: "同族比较", text: "Cn 位于汞下方的第 12 族位置；吸附实验探索其挥发性与金属性，但没有宏量性质可简单照搬汞。" },
        { number: 82, type: "合成靶材", text: "²⁰⁸Pb 靶与 ⁷⁰Zn 束流的聚变蒸发反应可产生 ²⁷⁷Cn。" },
        { number: 30, type: "合成束流", text: "锌-70 是合成 ²⁷⁷Cn 的弹核，反应方程属于核聚变而非化学结合。" }
      ],
      story: "Cn 以尼古拉·哥白尼命名，纪念他提出的日心体系。其首次确认的合成路线把铅-208 与锌-70 结合，得到 ²⁷⁷Cn，是“冷聚变”超重核合成策略的代表。",
      mass: "[285]",
      melting: "未知",
      density: "未知"
    },
    {
      number: 113,
      config: "[Rn]5f¹⁴6d¹⁰7s²7p¹（预测）",
      shells: [2, 8, 18, 32, 32, 18, 3],
      oxidation: "预测 +1、+3；尚无实验确证",
      reactivity: "尚无确证的 Nh 化合物化学实验。理论预测其可能偏向 +1 并表现强相对论效应，不能简单照抄铊的宏量反应性。",
      nuclear: "radioactive",
      nuclearText: "没有稳定同位素。²⁸⁶Nh 半衰期为秒量级（约十秒），而最初确认链中的 ²⁷⁸Nh 更短；只合成过极少原子。",
      flame: { type: "unknown", color: null, label: "未知", text: "没有 Nh 焰色实验。强放射、短寿命和单原子量级样品使焰色观察没有实际意义。" },
      compounds: [],
      compoundNote: "尚无实验确证的 Nh 化合物；宏观形态、常见化合物和常规反应性未知。其可能氢化物、卤化物等只属理论预测。",
      reaction: null,
      relations: [
        { number: 83, type: "合成靶材", text: "²⁰⁹Bi 靶与 ⁷⁰Zn 束流反应可生成 ²⁷⁸Nh，并放出一个中子。" },
        { number: 30, type: "合成束流", text: "锌-70 是首次确认 Nh 的弹核；这是核反应关系，不是 Nh 与锌的化学关系。" },
        { number: 81, type: "同族位置", text: "Nh 位于铊下方的第 13 族位置，其实际化学是否类似铊仍待实验。" }
      ],
      story: "Nh 的名称 Nihonium 来自 Nihon，即日语中的“日本”。它由日本理化学研究所团队长期追踪极稀有衰变链而确认，是首个以日本命名的元素。",
      mass: "[286]",
      melting: "未知",
      density: "未知"
    },
    {
      number: 114,
      config: "[Rn]5f¹⁴6d¹⁰7s²7p²（预测）",
      shells: [2, 8, 18, 32, 32, 18, 4],
      oxidation: "预测 +2、+4；单质可能较惰性，尚无化合物实验确证",
      reactivity: "已有极少原子的吸附与挥发性探索，但不足以建立宏观化学。Fl 是否比铅更惰性是理论与实验共同探索的问题，不能写成定论。",
      nuclear: "radioactive",
      nuclearText: "没有稳定同位素。²⁸⁹Fl 半衰期约 2 秒，是代表性同位素；即使位于“稳定岛”讨论区域，也不表示它稳定或长寿命。",
      flame: { type: "unknown", color: null, label: "未知", text: "没有 Fl 焰色实验。强放射、短寿命和单原子量级样品使焰色观察没有实际意义。" },
      compounds: [],
      compoundNote: "尚无实验确证的 Fl 化合物；吸附研究不等于制成化合物。宏观形态、常见化合物和常规反应性未知，FlCl₂ 等只可作理论讨论。",
      reaction: null,
      relations: [
        { number: 94, type: "合成靶材", text: "以钚同位素为靶、钙-48 为束流，可合成多种 Fl 同位素，具体产物取决于靶核与中子蒸发数。" },
        { number: 20, type: "合成束流", text: "钙-48 因中子数较多而被用于多种超重元素合成，包括 Fl。" },
        { number: 82, type: "同族位置", text: "Fl 位于铅下方的第 14 族位置；同族相似程度仍有待实验，不能由铅的焰色或反应性类推。" }
      ],
      story: "Fl 的名称纪念杜布纳的弗廖罗夫核反应实验室，实验室名则来自核物理学家格奥尔基·弗廖罗夫。它常与“稳定岛”一起出现，但“相对稳定”仍可能只是秒级或更短。",
      mass: "[289]",
      melting: "未知",
      density: "未知"
    },
    {
      number: 115,
      config: "[Rn]5f¹⁴6d¹⁰7s²7p³（预测）",
      shells: [2, 8, 18, 32, 32, 18, 5],
      oxidation: "预测 +1、+3；尚无实验确证",
      reactivity: "尚无确证的 Mc 化合物化学实验。理论预测 +1 可能因 7p 电子束缚差异而重要，但不能把铋的反应性或化合物直接套用到 Mc。",
      nuclear: "radioactive",
      nuclearText: "没有稳定同位素。²⁹⁰Mc 半衰期不足 1 秒，其他已确认同位素也极短；实验以衰变链鉴定为主，无法积累宏观样品。",
      flame: { type: "unknown", color: null, label: "未知", text: "没有 Mc 焰色实验。强放射、亚秒级寿命和单原子量级样品使焰色观察没有实际意义。" },
      compounds: [],
      compoundNote: "尚无实验确证的 Mc 化合物；宏观形态、常见化合物和常规反应性未知，任何具体分子式都不应被描述为已制得物质。",
      reaction: null,
      relations: [
        { number: 95, type: "合成靶材", text: "以 ²⁴³Am 为靶、⁴⁸Ca 为束流的反应可生成 Mc 同位素。" },
        { number: 20, type: "合成束流", text: "钙-48 是 Mc 合成反应的弹核，参与的是原子核聚变，不是形成化学键。" },
        { number: 83, type: "同族位置", text: "Mc 位于铋下方的第 15 族位置，其化学相似性仍主要属于预测。" }
      ],
      story: "Mc 以俄罗斯莫斯科州 Moscow Oblast 命名，杜布纳研究所就位于该地区。它常与外星科技传闻一同出现在大众文化里，但真实实验只得到极短寿命的少数原子。",
      mass: "[290]",
      melting: "未知",
      density: "未知"
    },
    {
      number: 116,
      config: "[Rn]5f¹⁴6d¹⁰7s²7p⁴（预测）",
      shells: [2, 8, 18, 32, 32, 18, 6],
      oxidation: "预测 +2、+4，更高价态亦被理论讨论；均无实验确证",
      reactivity: "尚无确证的 Lv 化合物化学实验。理论预测其价态和挥发性可能偏离钋的简单同族外推，宏观反应性未知。",
      nuclear: "radioactive",
      nuclearText: "没有稳定同位素。²⁹³Lv 半衰期为几十毫秒量级，只通过极少数原子的产生与衰变链研究，不能形成可触摸样品。",
      flame: { type: "unknown", color: null, label: "未知", text: "没有 Lv 焰色实验。强放射、毫秒量级寿命和单原子样品使焰色观察没有实际意义。" },
      compounds: [],
      compoundNote: "尚无实验确证的 Lv 化合物；宏观形态、常见化合物和常规反应性未知，可能氧化物或卤化物仅是理论预测。",
      reaction: null,
      relations: [
        { number: 96, type: "合成靶材", text: "以锔同位素靶和 ⁴⁸Ca 束流可合成 Lv 同位素，具体质量数取决于反应道。" },
        { number: 20, type: "合成束流", text: "钙-48 是 Lv 合成所用弹核，该关系属于核反应而非化合物形成。" },
        { number: 84, type: "同族位置", text: "Lv 位于钋下方的第 16 族位置；没有足够实验验证其是否重现钋的化学。" }
      ],
      story: "Lv 以美国劳伦斯利弗莫尔国家实验室命名，体现实验室之间的合作。其英文名 livermorium 中的“liver”只是地名读音的一部分，与肝脏或生物组织无关。",
      mass: "[293]",
      melting: "未知",
      density: "未知"
    },
    {
      number: 117,
      config: "[Rn]5f¹⁴6d¹⁰7s²7p⁵（预测）",
      shells: [2, 8, 18, 32, 32, 18, 7],
      oxidation: "预测 −1、+1、+3、+5 等；均无实验确证",
      reactivity: "尚无确证的 Ts 化合物化学实验。理论预测相对论效应会改变卤素同族趋势，不能声称它一定像砹或碘那样反应。",
      nuclear: "radioactive",
      nuclearText: "没有稳定同位素。²⁹⁴Ts 半衰期约几十毫秒，合成依赖不断衰变的 ²⁴⁹Bk 靶和钙-48 束流，样品只是逐个原子。",
      flame: { type: "unknown", color: null, label: "未知", text: "没有 Ts 焰色实验。强放射、毫秒量级寿命和单原子样品使焰色观察没有实际意义。" },
      compounds: [],
      compoundNote: "尚无实验确证的 Ts 化合物；宏观形态、常见化合物和常规反应性未知。TsF、TsCl 等写法若出现，只代表理论候选而非已制得化学品。",
      reaction: null,
      relations: [
        { number: 97, type: "合成靶材", text: "²⁴⁹Bk 靶与 ⁴⁸Ca 束流用于合成 Ts 同位素；锫靶本身也在快速衰变。" },
        { number: 20, type: "合成束流", text: "钙-48 与锫-249 的核反应产生 Ts，不是钙与 Ts 之间的化学反应。" },
        { number: 85, type: "同族位置", text: "Ts 位于砹下方的第 17 族位置，但卤素典型性质能否延续仍待实验。" }
      ],
      story: "Ts 以美国田纳西州 Tennessee 命名，体现橡树岭等地提供锫靶和国际合作的贡献。把极稀缺的 ²⁴⁹Bk 制成靶并赶在衰变前实验，是发现故事中的关键工程挑战。",
      mass: "[294]",
      melting: "未知",
      density: "未知"
    },
    {
      number: 118,
      config: "[Rn]5f¹⁴6d¹⁰7s²7p⁶（预测）",
      shells: [2, 8, 18, 32, 32, 18, 8],
      oxidation: "预测 +2、+4 等；单质反应性尚无实验确证",
      reactivity: "目前主要测量原子核产生与衰变，尚无化学键或化合物实验。理论预测 Og 极化性较强，未必像氡那样惰性，因此不宜简单称为“最重惰性气体”。",
      nuclear: "radioactive",
      nuclearText: "没有稳定同位素。²⁹⁴Og 的已测半衰期约为亚毫秒至毫秒量级（常引约 0.7 毫秒），只确认过极少原子，不可能积累宏观样品。",
      flame: { type: "unknown", color: null, label: "未知", text: "没有 Og 焰色实验，也不应预测一个颜色充当事实。强放射、极短寿命和单原子量级使焰色观察没有实际意义。" },
      compounds: [],
      compoundNote: "尚无实验确证的 Og 化合物；宏观形态、常见化合物和常规反应性均未知。OgCl₂、OgF₄ 等只可在理论预测中讨论，本表不将其列为真实化合物。",
      reaction: null,
      relations: [
        { number: 98, type: "合成靶材", text: "²⁴⁹Cf 靶与 ⁴⁸Ca 束流的聚变蒸发反应用于生成 ²⁹⁴Og。" },
        { number: 20, type: "合成束流", text: "钙-48 是 Og 合成所用弹核；这种核反应关系不表示已观察到 Og 的化学键。" },
        { number: 86, type: "同族位置", text: "Og 位于氡下方的第 18 族位置，但是否具有典型稀有气体化学仍属预测。" }
      ],
      story: "Og 以核物理学家尤里·奥加涅相命名，表彰他在超重元素研究中的贡献，正式命名时他仍在世。118 号位于周期表第七周期末端，但它的化学远不像位置看起来那样已被了解。",
      mass: "[294]",
      melting: "未知",
      density: "未知"
    }
  ];
}));
