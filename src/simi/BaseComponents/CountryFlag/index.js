import React from 'react'

require('./country-flag.scss')

const rawCountryList = '[[4,"Afghanistan","af","afg","af"],[8,"Albania","al","alb","al"],[12,"Algeria","dz","dza","dz"],[16,"American Samoa","as","asm","as"],[20,"Andorra","ad","and","ad"],[24,"Angola","ao","ago","ao"],[660,"Anguilla","ai","aia","ai"],[10,"Antarctica","aq","ata","aq"],[28,"Antigua and Barbuda","ag","atg","ag"],[32,"Argentina","ar","arg","ar"],[51,"Armenia","am","arm","am"],[533,"Aruba","aw","abw","aw"],[36,"Australia","au","aus","au"],[40,"Austria","at","aut","at"],[31,"Azerbaijan","az","aze","az"],[44,"Bahamas","bs","bhs","bs"],[48,"Bahrain","bh","bhr","bh"],[50,"Bangladesh","bd","bgd","bd"],[52,"Barbados","bb","brb","bb"],[112,"Belarus","by","blr","by"],[56,"Belgium","be","bel","be"],[84,"Belize","bz","blz","bz"],[204,"Benin","bj","ben","bj"],[60,"Bermuda","bm","bmu","bm"],[64,"Bhutan","bt","btn","bt"],[68,"Bolivia","bo","bol","bo"],[70,"Bosnia and Herzegovina","ba","bih","ba"],[72,"Botswana","bw","bwa","bw"],[76,"Brazil","br","bra","br"],[86,"British Indian Ocean Territory","io","iot","io"],[92,"British Virgin Islands","vg","vgb","vg"],[96,"Brunei","bn","brn","bn"],[100,"Bulgaria","bg","bgr","bg"],[854,"Burkina Faso","bf","bfa","bf"],[108,"Burundi","bi","bdi","bi"],[116,"Cambodia","kh","khm","kh"],[120,"Cameroon","cm","cmr","cm"],[124,"Canada","ca","can","ca"],[132,"Cape Verde","cv","cpv","cv"],[136,"Cayman Islands","ky","cym","ky"],[140,"Central African Republic","cf","caf","cf"],[148,"Chad","td","tcd","td"],[152,"Chile","cl","chl","cl"],[156,"China","cn","chn","cn"],[162,"Christmas Island","cx","cxr","cx"],[166,"Cocos Islands","cc","cck","cc"],[170,"Colombia","co","col","co"],[174,"Comoros","km","com","km"],[184,"Cook Islands","ck","cok","ck"],[188,"Costa Rica","cr","cri","cr"],[191,"Croatia","hr","hrv","hr"],[192,"Cuba","cu","cub","cu"],[531,"Curacao","cw","cuw","cw"],[196,"Cyprus","cy","cyp","cy"],[203,"Czech Republic","cz","cze","cz"],[180,"Democratic Republic of the Congo","cd","cod","cd"],[208,"Denmark","dk","dnk","dk"],[262,"Djibouti","dj","dji","dj"],[212,"Dominica","dm","dma","dm"],[214,"Dominican Republic","do","dom","do"],[626,"East Timor","tl","tls","tl"],[218,"Ecuador","ec","ecu","ec"],[818,"Egypt","eg","egy","eg"],[222,"El Salvador","sv","slv","sv"],[226,"Equatorial Guinea","gq","gnq","gq"],[232,"Eritrea","er","eri","er"],[233,"Estonia","ee","est","ee"],[231,"Ethiopia","et","eth","et"],[238,"Falkland Islands","fk","flk","fk"],[234,"Faroe Islands","fo","fro","fo"],[242,"Fiji","fj","fji","fj"],[246,"Finland","fi","fin","fi"],[250,"France","fr","fra","fr"],[258,"French Polynesia","pf","pyf","pf"],[266,"Gabon","ga","gab","ga"],[270,"Gambia","gm","gmb","gm"],[268,"Georgia","ge","geo","ge"],[276,"Germany","de","deu","de"],[288,"Ghana","gh","gha","gh"],[292,"Gibraltar","gi","gib","gi"],[300,"Greece","gr","grc","gr"],[304,"Greenland","gl","grl","gl"],[308,"Grenada","gd","grd","gd"],[316,"Guam","gu","gum","gu"],[320,"Guatemala","gt","gtm","gt"],[831,"Guernsey","gg","ggy","gg"],[324,"Guinea","gn","gin","gn"],[624,"Guinea-Bissau","gw","gnb","gw"],[328,"Guyana","gy","guy","gy"],[332,"Haiti","ht","hti","ht"],[340,"Honduras","hn","hnd","hn"],[344,"Hong Kong","hk","hkg","hk"],[348,"Hungary","hu","hun","hu"],[352,"Iceland","is","isl","is"],[356,"India","in","ind","in"],[360,"Indonesia","id","idn","id"],[364,"Iran","ir","irn","ir"],[368,"Iraq","iq","irq","iq"],[372,"Ireland","ie","irl","ie"],[833,"Isle of Man","im","imn","im"],[376,"Israel","il","isr","il"],[380,"Italy","it","ita","it"],[384,"Ivory Coast","ci","civ","ci"],[388,"Jamaica","jm","jam","jm"],[392,"Japan","jp","jpn","jp"],[832,"Jersey","je","jey","je"],[400,"Jordan","jo","jor","jo"],[398,"Kazakhstan","kz","kaz","kz"],[404,"Kenya","ke","ken","ke"],[296,"Kiribati","ki","kir","ki"],[0,"Kosovo","xk","xkx",""],[414,"Kuwait","kw","kwt","kw"],[417,"Kyrgyzstan","kg","kgz","kg"],[418,"Laos","la","lao","la"],[428,"Latvia","lv","lva","lv"],[422,"Lebanon","lb","lbn","lb"],[426,"Lesotho","ls","lso","ls"],[430,"Liberia","lr","lbr","lr"],[434,"Libya","ly","lby","ly"],[438,"Liechtenstein","li","lie","li"],[440,"Lithuania","lt","ltu","lt"],[442,"Luxembourg","lu","lux","lu"],[446,"Macau","mo","mac","mo"],[807,"Macedonia","mk","mkd","mk"],[450,"Madagascar","mg","mdg","mg"],[454,"Malawi","mw","mwi","mw"],[458,"Malaysia","my","mys","my"],[462,"Maldives","mv","mdv","mv"],[466,"Mali","ml","mli","ml"],[470,"Malta","mt","mlt","mt"],[584,"Marshall Islands","mh","mhl","mh"],[478,"Mauritania","mr","mrt","mr"],[480,"Mauritius","mu","mus","mu"],[175,"Mayotte","yt","myt","yt"],[484,"Mexico","mx","mex","mx"],[583,"Micronesia","fm","fsm","fm"],[498,"Moldova","md","mda","md"],[492,"Monaco","mc","mco","mc"],[496,"Mongolia","mn","mng","mn"],[499,"Montenegro","me","mne","me"],[500,"Montserrat","ms","msr","ms"],[504,"Morocco","ma","mar","ma"],[508,"Mozambique","mz","moz","mz"],[104,"Myanmar","mm","mmr","mm"],[516,"Namibia","na","nam","na"],[520,"Nauru","nr","nru","nr"],[524,"Nepal","np","npl","np"],[528,"Netherlands","nl","nld","nl"],[530,"Netherlands Antilles","an","ant","an"],[540,"New Caledonia","nc","ncl","nc"],[554,"New Zealand","nz","nzl","nz"],[558,"Nicaragua","ni","nic","ni"],[562,"Niger","ne","ner","ne"],[566,"Nigeria","ng","nga","ng"],[570,"Niue","nu","niu","nu"],[408,"North Korea","kp","prk","kp"],[580,"Northern Mariana Islands","mp","mnp","mp"],[578,"Norway","no","nor","no"],[512,"Oman","om","omn","om"],[586,"Pakistan","pk","pak","pk"],[585,"Palau","pw","plw","pw"],[275,"Palestine","ps","pse","ps"],[591,"Panama","pa","pan","pa"],[598,"Papua New Guinea","pg","png","pg"],[600,"Paraguay","py","pry","py"],[604,"Peru","pe","per","pe"],[608,"Philippines","ph","phl","ph"],[612,"Pitcairn","pn","pcn","pn"],[616,"Poland","pl","pol","pl"],[620,"Portugal","pt","prt","pt"],[630,"Puerto Rico","pr","pri","pr"],[634,"Qatar","qa","qat","qa"],[178,"Republic of the Congo","cg","cog","cg"],[638,"Reunion","re","reu","re"],[642,"Romania","ro","rou","ro"],[643,"Russia","ru","rus","ru"],[646,"Rwanda","rw","rwa","rw"],[652,"Saint Barthelemy","bl","blm","gp"],[654,"Saint Helena","sh","shn","sh"],[659,"Saint Kitts and Nevis","kn","kna","kn"],[662,"Saint Lucia","lc","lca","lc"],[663,"Saint Martin","mf","maf","gp"],[666,"Saint Pierre and Miquelon","pm","spm","pm"],[670,"Saint Vincent and the Grenadines","vc","vct","vc"],[882,"Samoa","ws","wsm","ws"],[674,"San Marino","sm","smr","sm"],[678,"Sao Tome and Principe","st","stp","st"],[682,"Saudi Arabia","sa","sau","sa"],[686,"Senegal","sn","sen","sn"],[688,"Serbia","rs","srb","rs"],[690,"Seychelles","sc","syc","sc"],[694,"Sierra Leone","sl","sle","sl"],[702,"Singapore","sg","sgp","sg"],[534,"Sint Maarten","sx","sxm","sx"],[703,"Slovakia","sk","svk","sk"],[705,"Slovenia","si","svn","si"],[90,"Solomon Islands","sb","slb","sb"],[706,"Somalia","so","som","so"],[710,"South Africa","za","zaf","za"],[410,"South Korea","kr","kor","kr"],[728,"South Sudan","ss","ssd","ss"],[724,"Spain","es","esp","es"],[144,"Sri Lanka","lk","lka","lk"],[729,"Sudan","sd","sdn","sd"],[740,"Suriname","sr","sur","sr"],[744,"Svalbard and Jan Mayen","sj","sjm","sj"],[748,"Swaziland","sz","swz","sz"],[752,"Sweden","se","swe","se"],[756,"Switzerland","ch","che","ch"],[760,"Syria","sy","syr","sy"],[158,"Taiwan","tw","twn","tw"],[762,"Tajikistan","tj","tjk","tj"],[834,"Tanzania","tz","tza","tz"],[764,"Thailand","th","tha","th"],[768,"Togo","tg","tgo","tg"],[772,"Tokelau","tk","tkl","tk"],[776,"Tonga","to","ton","to"],[780,"Trinidad and Tobago","tt","tto","tt"],[788,"Tunisia","tn","tun","tn"],[792,"Turkey","tr","tur","tr"],[795,"Turkmenistan","tm","tkm","tm"],[796,"Turks and Caicos Islands","tc","tca","tc"],[798,"Tuvalu","tv","tuv","tv"],[850,"U.S. Virgin Islands","vi","vir","vi"],[800,"Uganda","ug","uga","ug"],[804,"Ukraine","ua","ukr","ua"],[784,"United Arab Emirates","ae","are","ae"],[826,"United Kingdom","gb","gbr","uk"],[840,"United States","us","usa","us"],[858,"Uruguay","uy","ury","uy"],[860,"Uzbekistan","uz","uzb","uz"],[548,"Vanuatu","vu","vut","vu"],[336,"Vatican","va","vat","va"],[862,"Venezuela","ve","ven","ve"],[704,"Vietnam","vn","vnm","vn"],[876,"Wallis and Futuna","wf","wlf","wf"],[732,"Western Sahara","eh","esh","eh"],[887,"Yemen","ye","yem","ye"],[894,"Zambia","zm","zmb","zm"],[716,"Zimbabwe","zw","zwe","zw"]]';
// const IDX_NUMERIC = 0;
// const IDX_NAME = 1;
const IDX_ALPHA2 = 2;
const IDX_ALPHA3 = 3;
// const IDX_TLD = 4;

const lazyLoadCountryMap = (mapName, keyIndex) => {
    console.log(mapName)
    console.log(keyIndex)
    if (!window.simi_global_map_name)
        window.simi_global_map_name = []
    if (!window.simiflag_global_country_list)
        window.simiflag_global_country_list = JSON.parse(rawCountryList)
    if (!window.simi_global_map_name[mapName]) {
        window.simi_global_map_name[mapName] = new Map();
        for (const country of window.simiflag_global_country_list) {
            window.simi_global_map_name[mapName].set(country[keyIndex], country);
        }
    }
}

const getCountryByMapName = (keyIndex, code) => {
    const mapName = `map-${keyIndex}`;
    lazyLoadCountryMap(mapName, keyIndex);
    return window.simi_global_map_name[mapName].get(code.toLowerCase());
}

const CountryFlag = props => {
    const { alpha2, alpha3 } = props
    let className = ''
    //let flagAlpha2 = ''

    const getCountryByAlpha2 = (alpha2) => {
        //don't need to go around with this
        //const country = getCountryByMapName(IDX_ALPHA2, alpha2);
        //makeCountryFlagInfo(country);
        className = `flag flag-${alpha2.toLowerCase()}`
        //flagAlpha2 = alpha2.toLowerCase()
    }

    const getCountryByAlpha3 = (alpha3) => {
        const country = getCountryByMapName(IDX_ALPHA3, alpha3);
        makeCountryFlagInfo(country);
    }
    /*
    const getCountryByTopLevelDomain = (tld) => {
        const country = getCountryByMapName(IDX_TLD, tld);
        makeCountryFlagInfo(country);
    }

    const  getCountryByIsoNumeric = (isoNumeric) => {
        const country = getCountryByMapName(IDX_NUMERIC, isoNumeric);
        makeCountryFlagInfo(country);
    }
    */

    const makeCountryFlagInfo = (country) => {
        if (country) {
            className = `flag flag-${country[IDX_ALPHA2]}`
            flagAlpha2 = country[IDX_ALPHA2]
        } else {
            return 0;
        }
    }

    if (alpha2) {
        getCountryByAlpha2(alpha2)
        // const flagNA = ['aq', 'hm', 'cx', 'gf', 'bv', 'cc', 'io', 'pm']
        // if (flagAlpha2 && flagNA.indexOf(flagAlpha2) !== -1){
        //     return (
        //         <div className="flag">
        //             <img src={`https://cdn.ip2location.com/assets/img/flags/${flagAlpha2}.png`}
        //                 alt="flag"
        //                 style={{width: '100%', marginTop: 5}} />
        //         </div>
        //     )
        // }
        return <div className={className} />
    }
    if (alpha3) {
        getCountryByAlpha3(alpha3)
        return <div className={className} />
    }
    return ''

}

export default CountryFlag;