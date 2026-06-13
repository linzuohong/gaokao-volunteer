/**
 * University database — 100+ representative institutions
 * 全部985(39所) + 主要211(50+所) + 各省一本(15+所) + 江西二本(10+所)
 * Data: name, type, level, location, ranking, admission, salary, employment
 * Majors auto-generated from type template at bottom
 */
window.universityData = [
  // ═══════════════════════════════════════════
  // 全部 985 高校 (39所)
  // ═══════════════════════════════════════════
  {id:'pku',name:'北京大学',type:'综合类',level:['985','211','双一流'],location:'北京',rankN:2,minRank:'85',avgSalary:18000,empRate:98.5,tags:'C9联盟,基础学科拔尖',feats:'未名湖,博雅塔,亚洲最大高校图书馆'},
  {id:'tsinghua',name:'清华大学',type:'理工类',level:['985','211','双一流'],location:'北京',rankN:1,minRank:'65',avgSalary:18500,empRate:98.8,tags:'C9联盟,卓越工程师',feats:'清华园,荷塘月色,艺术博物馆'},
  {id:'fudan',name:'复旦大学',type:'综合类',level:['985','211','双一流'],location:'上海',rankN:4,minRank:'320',avgSalary:15500,empRate:97.8,tags:'C9联盟,医学八校',feats:'光华楼,相辉堂,江湾校区'},
  {id:'zju',name:'浙江大学',type:'综合类',level:['985','211','双一流'],location:'浙江杭州',rankN:3,minRank:'450',avgSalary:15000,empRate:97.6,tags:'C9联盟,创新创业',feats:'紫金港,玉泉,之江校区'},
  {id:'sjtu',name:'上海交通大学',type:'理工类',level:['985','211','双一流'],location:'上海',rankN:5,minRank:'280',avgSalary:16000,empRate:98.0,tags:'C9联盟,卓越工程师',feats:'闵行校区,钱学森图书馆'},
  {id:'nju',name:'南京大学',type:'综合类',level:['985','211','双一流'],location:'江苏南京',rankN:6,minRank:'520',avgSalary:14500,empRate:97.2,tags:'C9联盟,天文强校',feats:'鼓楼校区,仙林校区,北大楼'},
  {id:'hit',name:'哈尔滨工业大学',type:'理工类',level:['985','211','双一流'],location:'黑龙江哈尔滨',rankN:11,minRank:'2300',avgSalary:13000,empRate:96.5,tags:'C9联盟,航天强校',feats:'一校区,深圳校区,威海校区'},
  {id:'xajt',name:'西安交通大学',type:'理工类',level:['985','211','双一流'],location:'陕西西安',rankN:10,minRank:'2000',avgSalary:13000,empRate:97.0,tags:'C9联盟,西部第一',feats:'兴庆校区,创新港'},
  {id:'ustc',name:'中国科学技术大学',type:'理工类',level:['985','211','双一流'],location:'安徽合肥',rankN:7,minRank:'400',avgSalary:16000,empRate:98.0,tags:'C9联盟,科研重镇',feats:'东区,西区,国家同步辐射实验室'},
  {id:'ruc',name:'中国人民大学',type:'综合类',level:['985','211','双一流'],location:'北京',rankN:18,minRank:'800',avgSalary:14000,empRate:97.0,tags:'人文社科顶尖',feats:'中关村校区'},
  {id:'buaa',name:'北京航空航天大学',type:'理工类',level:['985','211','双一流'],location:'北京',rankN:13,minRank:'1200',avgSalary:14500,empRate:97.5,tags:'航空航天强校',feats:'学院路校区,沙河校区'},
  {id:'bit',name:'北京理工大学',type:'理工类',level:['985','211','双一流'],location:'北京',rankN:19,minRank:'1500',avgSalary:13500,empRate:97.0,tags:'军工七子,兵器强校',feats:'中关村校区,良乡校区'},
  {id:'cau',name:'中国农业大学',type:'农林类',level:['985','211','双一流'],location:'北京',rankN:30,minRank:'4000',avgSalary:10000,empRate:94.0,tags:'农林No.1',feats:'东校区,西校区'},
  {id:'bnu',name:'北京师范大学',type:'师范类',level:['985','211','双一流'],location:'北京',rankN:17,minRank:'3500',avgSalary:11000,empRate:95.5,tags:'师范No.1,教育学强校',feats:'海淀校区,昌平校区'},
  {id:'nku',name:'南开大学',type:'综合类',level:['985','211','双一流'],location:'天津',rankN:16,minRank:'2200',avgSalary:12000,empRate:96.0,tags:'文理强校,周总理母校',feats:'八里台校区,津南校区'},
  {id:'tju',name:'天津大学',type:'理工类',level:['985','211','双一流'],location:'天津',rankN:21,minRank:'2800',avgSalary:12000,empRate:96.5,tags:'建筑老八校',feats:'卫津路校区,北洋园校区'},
  {id:'dut',name:'大连理工大学',type:'理工类',level:['985','211','双一流'],location:'辽宁大连',rankN:27,minRank:'4500',avgSalary:11000,empRate:96.0,tags:'化工强校',feats:'凌水主校区,开发区校区'},
  {id:'neu',name:'东北大学',type:'理工类',level:['985','211','双一流'],location:'辽宁沈阳',rankN:35,minRank:'7000',avgSalary:10500,empRate:95.5,tags:'自动化强校,机器人',feats:'南湖校区,浑南校区'},
  {id:'jlu',name:'吉林大学',type:'综合类',level:['985','211','双一流'],location:'吉林长春',rankN:26,minRank:'5000',avgSalary:10000,empRate:95.0,tags:'东北巨无霸,法学强校',feats:'前卫校区,南岭校区,新民校区'},
  {id:'hitNe',name:'哈尔滨工业大学(威海)',type:'理工类',level:['985','211','双一流'],location:'山东威海',rankN:35,minRank:'3000',avgSalary:13000,empRate:96.5,tags:'哈工大分校区',feats:'威海校区,海滨校园'},
  {id:'tongji',name:'同济大学',type:'理工类',level:['985','211','双一流'],location:'上海',rankN:12,minRank:'1800',avgSalary:14000,empRate:97.0,tags:'建筑老八校,土木No.1',feats:'四平路校区,嘉定校区'},
  {id:'ecnu',name:'华东师范大学',type:'师范类',level:['985','211','双一流'],location:'上海',rankN:25,minRank:'3800',avgSalary:11500,empRate:95.8,tags:'师范顶尖,教育学科',feats:'中山北路校区,闵行校区'},
  {id:'seu',name:'东南大学',type:'理工类',level:['985','211','双一流'],location:'江苏南京',rankN:15,minRank:'1800',avgSalary:13000,empRate:97.0,tags:'建筑老八校',feats:'四牌楼校区,九龙湖校区'},
  {id:'nuaa',name:'南京航空航天大学',type:'理工类',level:['211','双一流'],location:'江苏南京',rankN:45,minRank:'6000',avgSalary:11500,empRate:96.5,tags:'航空航天强校',feats:'明故宫校区,将军路校区'},
  {id:'zjuTech',name:'浙江工业大学',type:'理工类',level:['省重点'],location:'浙江杭州',rankN:65,minRank:'10000',avgSalary:10000,empRate:95.0,tags:'浙江省重点',feats:'朝晖校区,屏峰校区'},
  {id:'xmu',name:'厦门大学',type:'综合类',level:['985','211','双一流'],location:'福建厦门',rankN:22,minRank:'3000',avgSalary:11500,empRate:96.0,tags:'最美校园,海洋强校',feats:'思明校区,翔安校区'},
  {id:'sdu',name:'山东大学',type:'综合类',level:['985','211','双一流'],location:'山东济南',rankN:20,minRank:'3800',avgSalary:11000,empRate:95.5,tags:'文史见长',feats:'中心校区,趵突泉校区,威海校区'},
  {id:'ouc',name:'中国海洋大学',type:'理工类',level:['985','211','双一流'],location:'山东青岛',rankN:42,minRank:'7000',avgSalary:10000,empRate:94.5,tags:'海洋科学No.1',feats:'崂山校区,鱼山校区'},
  {id:'whu',name:'武汉大学',type:'综合类',level:['985','211','双一流'],location:'湖北武汉',rankN:9,minRank:'1200',avgSalary:12000,empRate:96.2,tags:'中坚九校,最美校园',feats:'樱花大道,珞珈山,东湖'},
  {id:'hust',name:'华中科技大学',type:'理工类',level:['985','211','双一流'],location:'湖北武汉',rankN:8,minRank:'1500',avgSalary:12500,empRate:96.8,tags:'中坚九校,工科强校',feats:'喻家山,光谷,同济医学院'},
  {id:'csu',name:'中南大学',type:'综合类',level:['985','211','双一流'],location:'湖南长沙',rankN:24,minRank:'3200',avgSalary:11500,empRate:96.0,tags:'湘雅医学,有色金属',feats:'岳麓山,湘雅医学院'},
  {id:'hnu',name:'湖南大学',type:'理工类',level:['985','211','双一流'],location:'湖南长沙',rankN:30,minRank:'4800',avgSalary:11000,empRate:95.8,tags:'千年学府',feats:'岳麓书院,岳麓山'},
  {id:'sysu',name:'中山大学',type:'综合类',level:['985','211','双一流'],location:'广东广州',rankN:15,minRank:'2600',avgSalary:13000,empRate:96.5,tags:'华南第一,医学强校',feats:'广州校区,珠海校区,深圳校区'},
  {id:'scut',name:'华南理工大学',type:'理工类',level:['985','211','双一流'],location:'广东广州',rankN:23,minRank:'3500',avgSalary:12000,empRate:96.5,tags:'建筑老八校,轻工强校',feats:'五山校区,大学城校区'},
  {id:'scu',name:'四川大学',type:'综合类',level:['985','211','双一流'],location:'四川成都',rankN:14,minRank:'4000',avgSalary:11000,empRate:95.8,tags:'华西医学,口腔顶尖',feats:'望江校区,江安校区,华西医学中心'},
  {id:'uestc',name:'电子科技大学',type:'理工类',level:['985','211','双一流'],location:'四川成都',rankN:28,minRank:'2800',avgSalary:13000,empRate:97.5,tags:'两电一邮,电子信息No.1',feats:'清水河校区,沙河校区'},
  {id:'cqdx',name:'重庆大学',type:'理工类',level:['985','211','双一流'],location:'重庆',rankN:32,minRank:'5500',avgSalary:11000,empRate:95.8,tags:'建筑老八校,西南强校',feats:'A区,B区,虎溪校区'},
  {id:'lzu',name:'兰州大学',type:'综合类',level:['985','211','双一流'],location:'甘肃兰州',rankN:40,minRank:'8000',avgSalary:9500,empRate:94.5,tags:'西北第一,基础学科',feats:'城关校区,榆中校区'},
  {id:'nudt',name:'国防科技大学',type:'理工类',level:['985','211','双一流'],location:'湖南长沙',rankN:0,minRank:'1500',avgSalary:0,empRate:100,tags:'军中清华,军校No.1',feats:'长沙校区,军事院校'},

  // ═══════════════════════════════════════════
  // 主要 211 高校 (非985，按区域排列)
  // ═══════════════════════════════════════════
  {id:'bjtu',name:'北京交通大学',type:'理工类',level:['211','双一流'],location:'北京',rankN:40,minRank:'4500',avgSalary:12000,empRate:96.0,tags:'交通强校',feats:'主校区,威海校区'},
  {id:'bupt',name:'北京邮电大学',type:'理工类',level:['211','双一流'],location:'北京',rankN:35,minRank:'3500',avgSalary:15000,empRate:97.5,tags:'两电一邮,通信顶尖',feats:'西土城校区,沙河校区'},
  {id:'cufe',name:'中央财经大学',type:'财经类',level:['211','双一流'],location:'北京',rankN:56,minRank:'2500',avgSalary:14500,empRate:96.5,tags:'财经顶尖,金融黄埔',feats:'学院南路校区,沙河校区'},
  {id:'uibe',name:'对外经济贸易大学',type:'财经类',level:['211','双一流'],location:'北京',rankN:60,minRank:'3000',avgSalary:13500,empRate:96.0,tags:'国际化强校',feats:'朝阳校区'},
  {id:'cupl',name:'中国政法大学',type:'政法类',level:['211','双一流'],location:'北京',rankN:58,minRank:'3200',avgSalary:11000,empRate:93.0,tags:'五院四系,法学No.1',feats:'昌平校区,海淀校区'},
  {id:'cuc',name:'中国传媒大学',type:'综合类',level:['211','双一流'],location:'北京',rankN:72,minRank:'4500',avgSalary:12000,empRate:94.0,tags:'传媒No.1',feats:'定福庄校区'},
  {id:'bjfu',name:'北京林业大学',type:'农林类',level:['211','双一流'],location:'北京',rankN:82,minRank:'8000',avgSalary:9000,empRate:93.0,tags:'林业No.1',feats:'清华东路校区'},
  {id:'sjzRail',name:'石家庄铁道大学',type:'理工类',level:['省重点'],location:'河北石家庄',rankN:170,minRank:'22000',avgSalary:8000,empRate:92.0,tags:'铁道特色',feats:'石家庄校区'},
  {id:'tyut',name:'太原理工大学',type:'理工类',level:['211','双一流'],location:'山西太原',rankN:88,minRank:'12000',avgSalary:8800,empRate:93.0,tags:'山西唯一211',feats:'迎西校区,明向校区'},
  {id:'imu',name:'内蒙古大学',type:'综合类',level:['211','双一流'],location:'内蒙古呼和浩特',rankN:120,minRank:'15000',avgSalary:8000,empRate:91.0,tags:'内蒙古唯一211',feats:'校本部,南校区'},
  {id:'neuL',name:'辽宁大学',type:'综合类',level:['211','双一流'],location:'辽宁沈阳',rankN:100,minRank:'13000',avgSalary:8500,empRate:92.5,tags:'东北财经',feats:'崇山校区,蒲河校区'},
  {id:'dmu',name:'大连海事大学',type:'理工类',level:['211','双一流'],location:'辽宁大连',rankN:95,minRank:'11000',avgSalary:10500,empRate:95.0,tags:'海事No.1',feats:'大连校区'},
  {id:'jluNE',name:'东北师范大学',type:'师范类',level:['211','双一流'],location:'吉林长春',rankN:55,minRank:'8000',avgSalary:9000,empRate:93.5,tags:'师范强校',feats:'本部校区,净月校区'},
  {id:'hlju',name:'黑龙江大学',type:'综合类',level:['省重点'],location:'黑龙江哈尔滨',rankN:125,minRank:'20000',avgSalary:7500,empRate:90.0,tags:'俄语强校',feats:'哈尔滨校区'},
  {id:'shu',name:'上海大学',type:'综合类',level:['211','双一流'],location:'上海',rankN:50,minRank:'6500',avgSalary:11000,empRate:95.5,tags:'上海211',feats:'宝山校区,延长校区,嘉定校区'},
  {id:'ecust',name:'华东理工大学',type:'理工类',level:['211','双一流'],location:'上海',rankN:46,minRank:'5500',avgSalary:11500,empRate:96.0,tags:'化工强校',feats:'徐汇校区,奉贤校区'},
  {id:'dhu',name:'东华大学',type:'理工类',level:['211','双一流'],location:'上海',rankN:68,minRank:'7000',avgSalary:10500,empRate:95.0,tags:'纺织No.1',feats:'松江校区,延安路校区'},
  {id:'shufe',name:'上海财经大学',type:'财经类',level:['211','双一流'],location:'上海',rankN:48,minRank:'2000',avgSalary:16000,empRate:97.5,tags:'财经No.1',feats:'国定路校区'},
  {id:'seuMed',name:'江南大学',type:'理工类',level:['211','双一流'],location:'江苏无锡',rankN:62,minRank:'7000',avgSalary:10000,empRate:95.0,tags:'食品科学No.1',feats:'蠡湖校区'},
  {id:'cumt',name:'中国矿业大学',type:'理工类',level:['211','双一流'],location:'江苏徐州',rankN:75,minRank:'10000',avgSalary:9800,empRate:94.5,tags:'矿业No.1',feats:'南湖校区'},
  {id:'hhu',name:'河海大学',type:'理工类',level:['211','双一流'],location:'江苏南京',rankN:57,minRank:'6500',avgSalary:10500,empRate:95.5,tags:'水利No.1',feats:'鼓楼校区,江宁校区'},
  {id:'njau',name:'南京农业大学',type:'农林类',level:['211','双一流'],location:'江苏南京',rankN:61,minRank:'9000',avgSalary:9200,empRate:93.5,tags:'农林强校',feats:'卫岗校区'},
  {id:'suda',name:'苏州大学',type:'综合类',level:['211','双一流'],location:'江苏苏州',rankN:43,minRank:'5500',avgSalary:10800,empRate:95.5,tags:'地方211标杆',feats:'天赐庄校区,独墅湖校区'},
  {id:'ahd',name:'安徽大学',type:'综合类',level:['211','双一流'],location:'安徽合肥',rankN:90,minRank:'14000',avgSalary:8500,empRate:93.0,tags:'安徽211',feats:'磬苑校区'},
  {id:'hfut',name:'合肥工业大学',type:'理工类',level:['211','双一流'],location:'安徽合肥',rankN:70,minRank:'9500',avgSalary:10000,empRate:95.0,tags:'汽车机械强校',feats:'屯溪路校区,翡翠湖校区'},
  {id:'fzu',name:'福州大学',type:'理工类',level:['211','双一流'],location:'福建福州',rankN:75,minRank:'10000',avgSalary:9500,empRate:94.0,tags:'福建211',feats:'旗山校区'},
  {id:'ncu',name:'南昌大学',type:'综合类',level:['211','双一流'],location:'江西南昌',rankN:65,minRank:'12000',avgSalary:9500,empRate:94.5,tags:'江西No.1,省部共建',feats:'前湖校区,青山湖校区,东湖校区',empNote:'江西省唯一的211和双一流建设高校。前湖校区为主校区，在校生超过5万人。优势学科：食品科学与工程(A类)、临床医学、材料科学与工程、化学。在江西省内就业认可度极高，与江铃、江铜等省内龙头企业有深度合作。'},
  {id:'zzu',name:'郑州大学',type:'综合类',level:['211','双一流'],location:'河南郑州',rankN:51,minRank:'8500',avgSalary:9000,empRate:93.5,tags:'河南唯一211',feats:'主校区,南校区,北校区'},
  {id:'huazhongAgri',name:'华中农业大学',type:'农林类',level:['211','双一流'],location:'湖北武汉',rankN:53,minRank:'11000',avgSalary:9000,empRate:93.0,tags:'农林强校',feats:'狮子山校区'},
  {id:'znufe',name:'中南财经政法大学',type:'政法类',level:['211','双一流'],location:'湖北武汉',rankN:52,minRank:'6000',avgSalary:10500,empRate:95.0,tags:'五院四系,财经强校',feats:'南湖校区,首义校区'},
  {id:'huna',name:'湖南师范大学',type:'师范类',level:['211','双一流'],location:'湖南长沙',rankN:80,minRank:'13000',avgSalary:8000,empRate:92.0,tags:'师范211',feats:'二里半校区'},
  {id:'jnu',name:'暨南大学',type:'综合类',level:['211','双一流'],location:'广东广州',rankN:55,minRank:'7000',avgSalary:11000,empRate:95.0,tags:'华侨最高学府',feats:'石牌校区,番禺校区,珠海校区'},
  {id:'scnu',name:'华南师范大学',type:'师范类',level:['211','双一流'],location:'广东广州',rankN:68,minRank:'8000',avgSalary:9500,empRate:94.0,tags:'华南师范No.1',feats:'石牌校区,大学城校区'},
  {id:'gxu',name:'广西大学',type:'综合类',level:['211','双一流'],location:'广西南宁',rankN:95,minRank:'16000',avgSalary:8000,empRate:91.5,tags:'广西唯一211',feats:'南宁校区'},
  {id:'hainu',name:'海南大学',type:'综合类',level:['211','双一流'],location:'海南海口',rankN:110,minRank:'19000',avgSalary:7800,empRate:90.0,tags:'海南唯一211',feats:'海甸校区,儋州校区'},
  {id:'swufe',name:'西南财经大学',type:'财经类',level:['211','双一流'],location:'四川成都',rankN:52,minRank:'5500',avgSalary:12500,empRate:96.0,tags:'财经强校,金融黄埔',feats:'光华校区,柳林校区'},
  {id:'swjtu',name:'西南交通大学',type:'理工类',level:['211','双一流'],location:'四川成都',rankN:54,minRank:'6000',avgSalary:11500,empRate:96.0,tags:'交通强校',feats:'九里校区,犀浦校区'},
  {id:'sicau',name:'四川农业大学',type:'农林类',level:['211','双一流'],location:'四川雅安',rankN:105,minRank:'15000',avgSalary:8000,empRate:91.0,tags:'农林211',feats:'雅安校区,成都校区,都江堰校区'},
  {id:'gzdx',name:'贵州大学',type:'综合类',level:['211','双一流'],location:'贵州贵阳',rankN:115,minRank:'18000',avgSalary:7800,empRate:90.5,tags:'贵州唯一211',feats:'花溪校区'},
  {id:'ynu',name:'云南大学',type:'综合类',level:['211','双一流'],location:'云南昆明',rankN:85,minRank:'14000',avgSalary:8200,empRate:91.0,tags:'云南唯一211',feats:'呈贡校区,东陆校区'},
  {id:'tibetU',name:'西藏大学',type:'综合类',level:['211','双一流'],location:'西藏拉萨',rankN:190,minRank:'35000',avgSalary:6500,empRate:85.0,tags:'西藏唯一211',feats:'拉萨校区'},
  {id:'xnu',name:'西北大学',type:'综合类',level:['211','双一流'],location:'陕西西安',rankN:67,minRank:'10000',avgSalary:9000,empRate:93.0,tags:'地质强校',feats:'太白校区,长安校区'},
  {id:'snnu',name:'陕西师范大学',type:'师范类',level:['211','双一流'],location:'陕西西安',rankN:72,minRank:'11000',avgSalary:8500,empRate:92.5,tags:'西北师范No.1',feats:'雁塔校区,长安校区'},
  {id:'xidian',name:'西安电子科技大学',type:'理工类',level:['211','双一流'],location:'陕西西安',rankN:42,minRank:'5000',avgSalary:12000,empRate:96.8,tags:'两电一邮,军工背景',feats:'长安校区,雁塔校区'},
  {id:'nwuaf',name:'西北农林科技大学',type:'农林类',level:['985','211','双一流'],location:'陕西杨凌',rankN:65,minRank:'15000',avgSalary:8200,empRate:91.0,tags:'农林985',feats:'杨凌校区'},
  {id:'gsu',name:'兰州理工大学',type:'理工类',level:['省重点'],location:'甘肃兰州',rankN:180,minRank:'24000',avgSalary:7500,empRate:90.0,tags:'甘肃重点',feats:'兰州校区'},
  {id:'qhu',name:'青海大学',type:'综合类',level:['211','双一流'],location:'青海西宁',rankN:170,minRank:'30000',avgSalary:7000,empRate:88.0,tags:'青海唯一211',feats:'西宁校区'},
  {id:'nxu',name:'宁夏大学',type:'综合类',level:['211','双一流'],location:'宁夏银川',rankN:160,minRank:'28000',avgSalary:7200,empRate:89.0,tags:'宁夏唯一211',feats:'银川校区'},
  {id:'xju',name:'新疆大学',type:'综合类',level:['211','双一流'],location:'新疆乌鲁木齐',rankN:130,minRank:'25000',avgSalary:7000,empRate:87.0,tags:'新疆211',feats:'本部校区,北校区'},
  {id:'shzdx',name:'石河子大学',type:'综合类',level:['211','双一流'],location:'新疆石河子',rankN:180,minRank:'32000',avgSalary:6500,empRate:86.0,tags:'新疆211',feats:'石河子校区'},

  // ═══════════════════════════════════════════
  // 各省重点一本 (20所)
  // ═══════════════════════════════════════════
  {id:'gdut',name:'广东工业大学',type:'理工类',level:['省重点'],location:'广东广州',rankN:90,minRank:'14000',avgSalary:10500,empRate:95.0,tags:'广东省重点',feats:'大学城校区,东风路校区'},
  {id:'szu',name:'深圳大学',type:'综合类',level:['省重点'],location:'广东深圳',rankN:66,minRank:'6000',avgSalary:13000,empRate:96.0,tags:'特区强校,上升最快',feats:'后海校区,西丽校区'},
  {id:'njtech',name:'南京工业大学',type:'理工类',level:['省重点'],location:'江苏南京',rankN:85,minRank:'12000',avgSalary:9500,empRate:94.0,tags:'江苏重点',feats:'江浦校区'},
  {id:'hnust',name:'湖南科技大学',type:'理工类',level:['省重点'],location:'湖南湘潭',rankN:150,minRank:'23000',avgSalary:8000,empRate:92.0,tags:'湖南重点',feats:'湘潭校区'},
  {id:'hqu',name:'华侨大学',type:'综合类',level:['省重点'],location:'福建厦门',rankN:135,minRank:'20000',avgSalary:8500,empRate:92.5,tags:'国侨办直属',feats:'厦门校区,泉州校区'},
  {id:'sxdx',name:'山西大学',type:'综合类',level:['双一流'],location:'山西太原',rankN:100,minRank:'16000',avgSalary:8000,empRate:91.0,tags:'百年老校',feats:'坞城校区'},
  {id:'hebdx',name:'河北大学',type:'综合类',level:['省重点'],location:'河北保定',rankN:110,minRank:'18000',avgSalary:7800,empRate:90.5,tags:'河北重点',feats:'本部校区'},
  {id:'henu',name:'河南大学',type:'综合类',level:['双一流'],location:'河南开封',rankN:95,minRank:'16000',avgSalary:8000,empRate:91.0,tags:'百年老校',feats:'明伦校区,金明校区'},
  {id:'ahnu',name:'安徽师范大学',type:'师范类',level:['省重点'],location:'安徽芜湖',rankN:145,minRank:'24000',avgSalary:7500,empRate:90.5,tags:'安徽师范No.1',feats:'赭山校区,花津校区'},
  {id:'sdnu',name:'山东师范大学',type:'师范类',level:['省重点'],location:'山东济南',rankN:120,minRank:'22000',avgSalary:7600,empRate:91.0,tags:'山东师范No.1',feats:'千佛山校区,长清湖校区'},
  {id:'fju',name:'福建师范大学',type:'师范类',level:['省重点'],location:'福建福州',rankN:100,minRank:'19000',avgSalary:7800,empRate:91.0,tags:'福建师范No.1',feats:'旗山校区'},
  {id:'gdnu',name:'广东外语外贸大学',type:'综合类',level:['省重点'],location:'广东广州',rankN:115,minRank:'13000',avgSalary:10000,empRate:94.0,tags:'外语强校',feats:'白云校区,大学城校区'},
  {id:'wust',name:'武汉科技大学',type:'理工类',level:['省重点'],location:'湖北武汉',rankN:105,minRank:'11000',avgSalary:9500,empRate:93.5,tags:'钢铁冶金特色',feats:'青山校区'},
  {id:'cugb',name:'中国地质大学(武汉)',type:'理工类',level:['211','双一流'],location:'湖北武汉',rankN:62,minRank:'9500',avgSalary:10000,empRate:94.0,tags:'地质No.1',feats:'鲁磨路校区'},
  {id:'cqupt',name:'重庆邮电大学',type:'理工类',level:['双一流'],location:'重庆',rankN:98,minRank:'15000',avgSalary:10000,empRate:95.0,tags:'信息通信特色',feats:'南山校区'},
  {id:'xauat',name:'西安建筑科技大学',type:'理工类',level:['省重点'],location:'陕西西安',rankN:125,minRank:'14000',avgSalary:9500,empRate:93.0,tags:'建筑老八校',feats:'雁塔校区,草堂校区'},
  {id:'cust',name:'长春理工大学',type:'理工类',level:['省重点'],location:'吉林长春',rankN:155,minRank:'20000',avgSalary:8000,empRate:91.0,tags:'光学强校',feats:'长春校区'},
  {id:'yanshan',name:'燕山大学',type:'理工类',level:['省重点'],location:'河北秦皇岛',rankN:90,minRank:'13000',avgSalary:9000,empRate:93.0,tags:'机械强校',feats:'秦皇岛校区'},
  {id:'xut',name:'西安理工大学',type:'理工类',level:['省重点'],location:'陕西西安',rankN:130,minRank:'15000',avgSalary:9000,empRate:92.5,tags:'水利强校',feats:'金花校区'},
  {id:'sustech',name:'南方科技大学',type:'理工类',level:['双一流'],location:'广东深圳',rankN:22,minRank:'2000',avgSalary:14000,empRate:97.0,tags:'新型研究型,书院制',feats:'深圳南山校区',empNote:'新型研究型大学，采取综合评价招生，高考成绩占比60%。以理、工、医为主，小而精培养模式。'},

  // ═══════════════════════════════════════════
  // 江西省内重点 + 二本院校 (15所)
  // ═══════════════════════════════════════════
  {id:'jxufe',name:'江西财经大学',type:'财经类',level:['省重点'],location:'江西南昌',rankN:115,minRank:'18000',avgSalary:9000,empRate:94.0,tags:'财经强校,财税特色',feats:'蛟桥园校区,麦庐园校区',empNote:'财经类专业在江西省内就业优势明显，会计学、金融学为国家级特色专业，毕业生遍布省内银行系统、税务系统。'},
  {id:'jxnu',name:'江西师范大学',type:'师范类',level:['省重点'],location:'江西南昌',rankN:130,minRank:'22000',avgSalary:8000,empRate:93.0,tags:'师范重镇,省部共建',feats:'瑶湖校区,青山湖校区',empNote:'江西省最大的师范院校，在校生超过3万人。教育学、汉语言文学、化学为优势学科。毕业生遍布全省中小学，师范类专业就业率稳定在95%以上。'},
  {id:'ecjtu',name:'华东交通大学',type:'理工类',level:['省重点'],location:'江西南昌',rankN:160,minRank:'25000',avgSalary:8500,empRate:93.5,tags:'铁路交通特色',feats:'双港校区',empNote:'以交通为特色、轨道为核心，交通运输、土木工程、电气工程为优势专业。与中国国家铁路集团有深度合作，大量毕业生进入铁路系统。'},
  {id:'jxust',name:'江西理工大学',type:'理工类',level:['省重点'],location:'江西赣州',rankN:180,minRank:'28000',avgSalary:8000,empRate:92.5,tags:'冶金矿业特色',feats:'红旗校区,黄金校区',empNote:'有色金属、采矿工程、冶金工程为传统优势学科，被誉为"有色冶金人才摇篮"。与江西铜业等省内企业深度合作。'},
  {id:'nchu',name:'南昌航空大学',type:'理工类',level:['省重点'],location:'江西南昌',rankN:170,minRank:'26000',avgSalary:8200,empRate:93.0,tags:'航空特色,国防特色',feats:'前湖校区,上海路校区',empNote:'原航空航天部直属高校，材料科学与工程、飞行器制造工程为特色专业，与洪都航空、昌飞等军工企业合作紧密。'},
  {id:'jxau',name:'江西农业大学',type:'农林类',level:['省重点'],location:'江西南昌',rankN:200,minRank:'32000',avgSalary:7500,empRate:91.0,tags:'农林特色,百年老校',feats:'志敏大道校区',empNote:'江西省最早的高等学府之一，农学、林学、动物科学为传统优势专业，在省内农业系统有稳定就业渠道。'},
  {id:'jxtc',name:'江西中医药大学',type:'医学类',level:['省重点'],location:'江西南昌',rankN:220,minRank:'30000',avgSalary:7800,empRate:92.0,tags:'中医药特色',feats:'湾里校区,阳明校区',empNote:'中医学、中药学、针灸推拿为国家特色专业，拥有附属医院多所，毕业生广泛进入省内中医院和制药企业。'},
  {id:'ecut',name:'东华理工大学',type:'理工类',level:['省重点'],location:'江西抚州',rankN:210,minRank:'29000',avgSalary:7800,empRate:91.5,tags:'核工特色,国防科工',feats:'广兰校区,抚州校区',empNote:'原核工业部直属高校，核工程与核技术、测绘科学与技术为国家级特色专业。'},
  {id:'jxgu',name:'井冈山大学',type:'综合类',level:['省重点'],location:'江西吉安',rankN:280,minRank:'38000',avgSalary:7000,empRate:89.0,tags:'革命老区高校,省部共建',feats:'青原校区',empNote:'位于革命圣地井冈山所在地吉安市，师范类和医学类专业在赣中地区有较高认可度。'},
  {id:'jxtech',name:'江西科技师范大学',type:'师范类',level:['省重点'],location:'江西南昌',rankN:300,minRank:'40000',avgSalary:6500,empRate:88.0,tags:'职教师资培养',feats:'枫林校区,红角洲校区',empNote:'以培养职业教育师资为特色，是全国重点建设职教师资培训基地。'},
  {id:'jxjjxy',name:'九江学院',type:'综合类',level:['二本'],location:'江西九江',rankN:380,minRank:'50000',avgSalary:6000,empRate:86.0,tags:'赣北综合院校',feats:'主校区,浔东校区',empNote:'九江市唯一的本科院校，医学、师范类专业在赣北地区就业较好。'},
  {id:'ycu',name:'宜春学院',type:'综合类',level:['二本'],location:'江西宜春',rankN:400,minRank:'55000',avgSalary:5800,empRate:85.0,tags:'赣西综合院校',feats:'学府路校区',empNote:'医学（临床医学、护理学）和师范类为优势专业方向。'},
  {id:'gntc',name:'赣南师范大学',type:'师范类',level:['二本'],location:'江西赣州',rankN:350,minRank:'45000',avgSalary:6200,empRate:87.0,tags:'赣南师范',feats:'蓉江新区校区',empNote:'赣南地区最大的师范院校，教育学、汉语言文学、化学为省级特色专业。'},
  {id:'jxvc',name:'江西职业技术大学',type:'理工类',level:['专科'],location:'江西九江',rankN:500,minRank:'80000',avgSalary:5500,empRate:88.0,tags:'职业本科试点',feats:'九江校区',empNote:'江西省职业本科教育试点院校，培养应用型技术技能人才。'},
  {id:'ncvc',name:'南昌职业技术学院',type:'综合类',level:['专科'],location:'江西南昌',rankN:520,minRank:'85000',avgSalary:5200,empRate:87.0,tags:'高职示范',feats:'南昌校区'},
];

/* ═════════ 自动生成专业数据 ═════════ */
window.universityData.forEach(u => {
  const majorMap = {
    '综合类':[{n:'计算机科学与技术',c:'工学',r:['物理'],s:12000,e:0.96},{n:'法学',c:'法学',r:['不限'],s:10000,e:0.92},{n:'汉语言文学',c:'文学',r:['不限'],s:8500,e:0.91},{n:'经济学',c:'经济学',r:['不限'],s:11000,e:0.95},{n:'临床医学',c:'医学',r:['物理','化学'],s:14000,e:0.98},{n:'软件工程',c:'工学',r:['物理'],s:14000,e:0.97}],
    '理工类':[{n:'计算机科学与技术',c:'工学',r:['物理'],s:13000,e:0.97},{n:'电气工程及其自动化',c:'工学',r:['物理'],s:11000,e:0.96},{n:'机械工程',c:'工学',r:['物理'],s:10000,e:0.95},{n:'自动化',c:'工学',r:['物理'],s:10500,e:0.96},{n:'软件工程',c:'工学',r:['物理'],s:14000,e:0.98},{n:'电子信息工程',c:'工学',r:['物理'],s:12000,e:0.97}],
    '师范类':[{n:'教育学',c:'教育学',r:['不限'],s:8000,e:0.93},{n:'汉语言文学',c:'文学',r:['不限'],s:7500,e:0.91},{n:'数学与应用数学',c:'理学',r:['物理'],s:8000,e:0.92},{n:'英语',c:'文学',r:['不限'],s:7500,e:0.90},{n:'心理学',c:'理学',r:['不限'],s:8500,e:0.89}],
    '财经类':[{n:'会计学',c:'管理学',r:['不限'],s:11000,e:0.96},{n:'金融学',c:'经济学',r:['不限'],s:10500,e:0.94},{n:'财政学',c:'经济学',r:['不限'],s:9500,e:0.93},{n:'国际经济与贸易',c:'经济学',r:['不限'],s:9000,e:0.91},{n:'保险学',c:'经济学',r:['不限'],s:9200,e:0.92}],
    '政法类':[{n:'法学',c:'法学',r:['不限'],s:10000,e:0.92},{n:'会计学',c:'管理学',r:['不限'],s:11000,e:0.95},{n:'金融学',c:'经济学',r:['不限'],s:10500,e:0.94},{n:'行政管理',c:'管理学',r:['不限'],s:8000,e:0.90},{n:'知识产权',c:'法学',r:['不限'],s:9500,e:0.91}],
    '农林类':[{n:'农学',c:'农学',r:['生物'],s:7000,e:0.89},{n:'林学',c:'农学',r:['生物'],s:6800,e:0.88},{n:'动物科学',c:'农学',r:['生物'],s:7200,e:0.90},{n:'食品科学与工程',c:'工学',r:['化学'],s:8500,e:0.92},{n:'园林',c:'农学',r:['不限'],s:7000,e:0.89}],
    '医学类':[{n:'中医学',c:'医学',r:['物理','化学'],s:9000,e:0.95},{n:'中药学',c:'医学',r:['化学','生物'],s:8500,e:0.94},{n:'针灸推拿学',c:'医学',r:['不限'],s:8000,e:0.93},{n:'中西医临床医学',c:'医学',r:['物理','化学'],s:9500,e:0.95}],
  };
  const base = parseInt(u.minRank) || 10000;
  const tmpl = majorMap[u.type] || majorMap['综合类'];
  u.majors = tmpl.map((m,i) => ({
    name:m.n,category:m.c,subjectRequirements:m.r,
    admissionRanks:{2025:{min:base+i*300},2024:{min:base+i*300+200},2023:{min:base+i*300+400}},
    employment:{avgSalary:m.s,rate:m.e,topIndustries:['相关行业']}
  }));
  // Parse tags and features
  if (typeof u.tags === 'string') u.tags = u.tags.split(',').map(s=>s.trim());
  if (typeof u.feats === 'string') u.feats = u.feats.split(',').map(s=>s.trim());
});
