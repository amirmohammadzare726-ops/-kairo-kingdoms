import { useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { Building2, Coins, Crown, Gem, Hammer, Map, Shield, Swords, Users, Wheat, Castle, Pickaxe, Store, Sprout, Plus, ArrowUp, Sword, HeartPulse, TrendingUp } from "lucide-react";
import StrategyMap from "../components/StrategyMap";
import styles from "./_index.module.css";

const territories = [
  {name:"قلمرو آذر",owner:"اتحاد آذر",color:"#39c6d9",troops:12400,cities:3,villages:12},
  {name:"قلمرو سایه",owner:"اتحاد سایه",color:"#6e7cff",troops:9800,cities:2,villages:9},
  {name:"قلمرو سرخ",owner:"فرمانروای سرخ",color:"#ec6f75",troops:15100,cities:4,villages:15},
  {name:"قلمرو سبز",owner:"نگهبانان شمال",color:"#57c98b",troops:8700,cities:2,villages:11}
];
const initialCities = [
  {name:"شهر آذر",type:"پایتخت",level:12,population:28450,loyalty:96,wall:8},
  {name:"شهر بندر",type:"تجاری",level:8,population:18200,loyalty:91,wall:5},
  {name:"دژ شمالی",type:"نظامی",level:7,population:12400,loyalty:88,wall:7},
  {name:"شهر سبز",type:"کشاورزی",level:6,population:9700,loyalty:94,wall:4}
];
const buildingCatalog = [
  {id:"castle",name:"قلعه",desc:"افزایش دفاع و امنیت شهر",cost:{gold:900,stone:600,wood:250},icon:Castle,art:"/_cdn/static/913f42cf-df3f-4ca7-9070-8f0f25684b17.png"},
  {id:"barracks",name:"سربازخانه",desc:"آموزش و نگهداری نیروها",cost:{gold:650,stone:250,wood:500},icon:Shield,art:"/_cdn/static/4dbed021-7db4-49d0-9af2-8a9555a0f329.png"},
  {id:"mine",name:"معدن",desc:"افزایش تولید سنگ و طلا",cost:{gold:500,wood:350,stone:150},icon:Pickaxe,art:"/_cdn/static/b27c2061-d01a-4fb3-9f2e-1790cdd65b5f.png"},
  {id:"farm",name:"مزرعه",desc:"افزایش تولید غذا",cost:{gold:300,wood:250,stone:100},icon:Sprout,art:"/_cdn/static/b8c95590-4723-45eb-aeae-bf8bdbfb4fcf.png"},
  {id:"market",name:"بازار",desc:"افزایش درآمد طلا",cost:{gold:700,wood:450,stone:200},icon:Store,art:"/_cdn/static/7cf6375c-3a26-4fc0-84f8-f0c160935ee2.png"}
];
const troopTypes = [
  {id:"infantry",name:"پیاده‌نظام",desc:"نیروی پایه و ارزان",power:10,cost:{food:80,gold:35},icon:Shield,art:"/_cdn/static/8984bdba-7a81-4039-bffb-f54b3ee6f560.png"},
  {id:"archer",name:"کماندار",desc:"حمله از فاصله دور",power:14,cost:{food:100,gold:55},icon:TargetIcon,art:"/_cdn/static/4a8ccfe2-c73c-42f8-9a0a-55bb6fb61387.png"},
  {id:"cavalry",name:"سواره‌نظام",desc:"سریع و قدرتمند",power:24,cost:{food:160,gold:120},icon:HorseIcon,art:"/_cdn/static/25f3fa3d-bd6c-4d87-85d5-5a7e432be00d.png"}
];
function TargetIcon({size=18}:{size?:number}){return <Swords size={size}/>}
function HorseIcon({size=18}:{size?:number}){return <Crown size={size}/>}

export default function HomePage(){
 const [sel,setSel]=useState(0);
 const [tab,setTab]=useState("cities");
 const [cityIndex,setCityIndex]=useState(0);
 const [cities,setCities]=useState(initialCities);
 const [buildings,setBuildings]=useState<Record<string,number>>({castle:3,barracks:2,mine:2,farm:3,market:1});
 const [resources,setResources]=useState({gold:12480,wood:8920,stone:6740,food:15230});
 const [army,setArmy]=useState({infantry:18000,archer:12000,cavalry:6000});
 const [notice,setNotice]=useState("به سرزمین خود خوش آمدی، فرمانده.");
 const [buildingChoice,setBuildingChoice]=useState("castle");
 const current=territories[sel];
 const selectedCity=cities[Math.min(cityIndex,cities.length-1)];
 const totalTroops=army.infantry+army.archer+army.cavalry;
 const income=useMemo(()=>({gold:120+buildings.market*35,wood:90+buildings.mine*8,stone:55+buildings.mine*24,food:160+buildings.farm*45}),[buildings]);
 const resourceRows=[["طلا",resources.gold,"/_cdn/static/896e3af7-14dc-4b1c-bab7-46fefa4d50ba.png"],["چوب",resources.wood,"/_cdn/static/00089ae8-9a70-4b6f-b92a-b26a0db72c4b.png"],["سنگ",resources.stone,"/_cdn/static/4a910190-d841-4cde-b915-f256949d6956.png"],["غذا",resources.food,"/_cdn/static/88418a1c-5625-42ce-9003-4e2da4137867.png"]] as const;
 const spend=(cost:Record<string,number>)=>{
   if(Object.entries(cost).some(([k,v])=>(resources as any)[k]<v)){setNotice("منابع کافی نیست؛ ابتدا اقتصاد قلمرو را تقویت کن.");return false}
   setResources(prev=>({...prev,...Object.fromEntries(Object.entries(cost).map(([k,v])=>[k,(prev as any)[k]-v]))}));
   return true;
 };
 const build=()=>{
   const item=buildingCatalog.find(b=>b.id===buildingChoice)!;
   if(!spend(item.cost))return;
   setBuildings(prev=>({...prev,[item.id]:(prev[item.id]||0)+1}));
   setNotice(item.name+" با موفقیت ساخته شد. سطح فعلی: "+((buildings[item.id]||0)+1));
 };
 const upgradeCity=()=>{
   if(!spend({gold:1200,stone:500,food:350}))return;
   setCities(prev=>prev.map((c,i)=>i===cityIndex?{...c,level:c.level+1,population:c.population+1200}:c));
   setNotice(selectedCity.name+" به سطح بالاتر ارتقا یافت.");
 };
 const recruit=(id:string)=>{
   const troop=troopTypes.find(t=>t.id===id)!;
   if(!spend(troop.cost))return;
   setArmy(prev=>({...prev,[id]:(prev as any)[id]+100}));
   setNotice("۱۰۰ نیروی "+troop.name+" آموزش داده شد.");
 };
 const collectIncome=()=>{
   setResources(prev=>({gold:prev.gold+income.gold,wood:prev.wood+income.wood,stone:prev.stone+income.stone,food:prev.food+income.food}));
   setNotice("درآمد دوره‌ای قلمرو به خزانه اضافه شد.");
 };
 return <main className={styles.page} dir="rtl"><Helmet><title>کایرو کینگدامز — مدیریت قلمرو</title></Helmet>
 <header className={styles.header}><div className={styles.brand}><span className={styles.brandMark}><Crown size={19}/></span><div><strong>کایرو کینگدامز</strong><small>فرمانروایی آذر · روز ۱۸</small></div></div><div className={styles.headerStats}>{resourceRows.map(([label,value,art])=><div className={styles.resource} key={label}><img src={art} alt="" /><span>{label}</span><b>{value.toLocaleString("fa-IR")}</b></div>)}</div><button className={styles.profileButton} aria-label="فرمانده"><Crown size={18}/></button></header>
 <section className={styles.shell}>
 <aside className={styles.side}><div className={styles.sectionTitle}><Shield size={16}/> فرمانروایی</div><div className={styles.rulerCard}><div className={styles.avatar}><Crown size={20}/></div><div><b>فرمانده کایرو</b><span>سطح ۱۸ · اتحاد آذر</span></div></div>
 <div className={styles.territories}>{territories.map((t,i)=><button key={t.name} className={styles.territory+(sel===i?" "+styles.active:"")} onClick={()=>setSel(i)}><i style={{background:t.color}}/><div><b>{t.name}</b><span>{t.owner}</span></div><em>{t.troops.toLocaleString("fa-IR")}</em></button>)}</div>
 <div className={styles.sectionTitle}><Map size={16}/> آمار قلمرو</div><div className={styles.infoGrid}><div><span>شهرها</span><b>{current.cities.toLocaleString("fa-IR")}</b></div><div><span>روستاها</span><b>{current.villages.toLocaleString("fa-IR")}</b></div><div><span>ارتش قلمرو</span><b>{current.troops.toLocaleString("fa-IR")}</b></div><div><span>وفاداری</span><b>۹۴٪</b></div></div>
 <div className={styles.notice}>{notice}</div></aside>
 <section className={styles.center}>
 <div className={styles.mapTopbar}><div><span className={styles.kicker}>قلمرو بزرگ آذر</span><h1 className={styles.mapTitle}>{({cities:"شهرهای من",buildings:"ساخت‌وساز",army:"فرماندهی ارتش",economy:"خزانه و اقتصاد",map:"نقشه جهان"} as Record<string,string>)[tab]}</h1></div><div className={styles.dayBadge}>روز ۱۸ · فصل بهار</div></div>
 <nav className={styles.tabs}>{[["map","نقشه",Map],["cities","شهرها",Building2],["buildings","ساخت",Hammer],["army","ارتش",Swords],["economy","خزانه",Coins]].map(([id,label,Icon])=>{const I=Icon;return <button key={id as string} className={tab===id?styles.tabActive:styles.tab} onClick={()=>setTab(id as string)}><I size={18}/><span>{label as string}</span></button>})}</nav>
 {tab==="map"&&<><div className={styles.mapWrap}><StrategyMap/></div><div className={styles.mapHint}><span>نمای سه‌بعدی قلمرو</span><span>چرخش و زوم لمسی</span></div></>}
 {tab==="cities"&&<div className={styles.panel}><div className={styles.panelHeading}><div><span className={styles.kicker}>مراکز سکونت</span><h2>شهرهای قلمرو</h2></div><span className={styles.countPill}>{cities.length.toLocaleString("fa-IR")} شهر</span></div><div className={styles.cityLayout}><div className={styles.cityList}>{cities.map((c,i)=><button key={c.name} className={styles.cityItem+(cityIndex===i?" "+styles.cityActive:"")} onClick={()=>setCityIndex(i)}><span className={styles.cityIcon}><Building2 size={18}/></span><span><b>{c.name}</b><small>{c.type} · سطح {c.level.toLocaleString("fa-IR")}</small></span><em>›</em></button>)}</div><div className={styles.cityDetail}><img className={styles.cityBanner} src="/_cdn/static/c180dca6-622c-462a-a5e8-daa41c5535f0.png" alt="نمایی از پایتخت آذر"/><div className={styles.cityHero}><img className={styles.cityArtwork} src="/_cdn/static/3d81ddf0-9073-40d4-9f87-c302ef069aad.png" alt="نمای هنری شهر آذر"/><div><h3>{selectedCity.name}</h3><span>{selectedCity.type}</span></div><b>سطح {selectedCity.level.toLocaleString("fa-IR")}</b></div><div className={styles.metricGrid}><div><span>جمعیت</span><b>{selectedCity.population.toLocaleString("fa-IR")}</b></div><div><span>وفاداری</span><b>{selectedCity.loyalty.toLocaleString("fa-IR")}٪</b></div><div><span>استحکامات</span><b>{selectedCity.wall.toLocaleString("fa-IR")}</b></div><div><span>رشد جمعیت</span><b>+۲٫۴٪</b></div></div><button className={styles.primary} onClick={upgradeCity}><ArrowUp size={16}/> ارتقای شهر · ۱۲۰۰ طلا، ۵۰۰ سنگ</button></div></div></div>}
 {tab==="buildings"&&<div className={styles.panel}><div className={styles.panelHeading}><div><span className={styles.kicker}>توسعه زیرساخت</span><h2>ساختمان‌های شهر</h2></div><span className={styles.countPill}>{buildingCatalog.length.toLocaleString("fa-IR")} نوع</span></div><div className={styles.buildGrid}>{buildingCatalog.map(item=>{const Icon=item.icon;return <article className={styles.buildCard} key={item.id}>{item.art?<img className={styles.buildArtwork} src={item.art} alt={item.name}/>:<div className={styles.buildIcon}><Icon size={21}/></div>}<div className={styles.buildTitle}><h3>{item.name}</h3><span>سطح {((buildings[item.id]||0)).toLocaleString("fa-IR")}</span></div><p>{item.desc}</p><div className={styles.costLine}><span>طلا {item.cost.gold}</span><span>چوب {item.cost.wood||0}</span><span>سنگ {item.cost.stone||0}</span></div><button className={styles.secondary} onClick={()=>{setBuildingChoice(item.id);if(spend(item.cost)){setBuildings(prev=>({...prev,[item.id]:(prev[item.id]||0)+1}));setNotice(item.name+" ارتقا یافت.")}}}><Plus size={15}/> ساخت / ارتقا</button></article>})}</div></div>}
 {tab==="army"&&<div className={styles.panel}><div className={styles.panelHeading}><div><span className={styles.kicker}>نیروهای نظامی</span><h2>ارتش فرمانده کایرو</h2></div><span className={styles.countPill}>{totalTroops.toLocaleString("fa-IR")} سرباز</span></div><div className={styles.armyBanner}><Swords size={26}/><div><b>قدرت رزمی کل</b><strong>{(army.infantry*10+army.archer*14+army.cavalry*24).toLocaleString("fa-IR")}</strong></div></div><div className={styles.troopGrid}>{troopTypes.map(t=>{const Icon=t.icon;return <article className={styles.troopCard} key={t.id}>{t.art?<img className={styles.troopArtwork} src={t.art} alt={t.name}/>:<div className={styles.buildIcon}><Icon size={22}/></div>}<h3>{t.name}</h3><p>{t.desc}</p><b className={styles.troopCount}>{(army as any)[t.id].toLocaleString("fa-IR")} نفر</b><span className={styles.muted}>قدرت هر سرباز: {t.power}</span><button className={styles.primary} onClick={()=>recruit(t.id)}><Plus size={15}/> آموزش ۱۰۰ نیرو</button><small>هزینه: {t.cost.food} غذا · {t.cost.gold} طلا</small></article>})}</div></div>}
 {tab==="economy"&&<div className={styles.panel}><div className={styles.panelHeading}><div><span className={styles.kicker}>خزانه و تولید</span><h2>اقتصاد قلمرو</h2></div><span className={styles.countPill}>دوره تولید</span></div><div className={styles.economyGrid}>{resourceRows.map(([label,value,art],i)=><article className={styles.economyCard} key={label}><img src={art} alt=""/><span>{label}</span><b>{value.toLocaleString("fa-IR")}</b><small>موجودی انبار</small><div className={styles.income}> <TrendingUp size={14}/> +{Object.values(income)[i].toLocaleString("fa-IR")} در هر دوره</div></article>)}</div><button className={styles.primary+" "+styles.collectButton} onClick={collectIncome}><Coins size={17}/> دریافت درآمد دوره‌ای</button><div className={styles.notice}>تولید منابع فعلاً با فشردن دکمه دریافت درآمد انجام می‌شود؛ در مرحله بعد زمان‌بندی خودکار و ذخیره‌سازی دائمی اضافه می‌شود.</div></div>}
 </section>
 <aside className={styles.details}><div className={styles.sectionTitle}><Crown size={16}/> پایتخت</div><div className={styles.capitalCard}><div className={styles.capitalIcon}><Crown size={22}/></div><div><h2>شهر آذر</h2><span>مرکز {current.name}</span></div><b>سطح ۱۲</b></div><div className={styles.detailStats}>{[["جمعیت","82,450",Users],["ارتش",totalTroops.toLocaleString("en-US"),Swords],["شهرها",String(current.cities),Building2],["قلعه‌ها",String(buildings.castle),Crown]].map(([label,value,Icon])=>{const I=Icon;return <div key={label as string}><I size={16}/><span>{label as string}</span><b>{value as string}</b></div>})}</div><div className={styles.sectionTitle}><Building2 size={16}/> ساختمان‌های کلیدی</div><div className={styles.buildings}>{buildingCatalog.slice(0,3).map(b=><div key={b.id}><b>{b.name}</b><span>سطح {(buildings[b.id]||0).toLocaleString("fa-IR")}</span></div>)}</div><button className={styles.secondary} onClick={()=>setTab("buildings")}><Building2 size={16}/> مدیریت ساختمان‌ها</button></aside>
 </section><footer className={styles.footer}><span>فرماندهی کل · اتحاد آذر</span><span>نسخه آزمایشی</span></footer></main>
}
