import{t as e}from"./rolldown-runtime.DsXBSD_B.mjs";import{A as t,C as n,D as r,N as i,P as a,T as o,c as s,g as c,k as l,l as u,o as d,s as f,v as ee}from"./react.rbTZ9EGs.mjs";import{S as p,a as m,r as h,t as g}from"./motion.tdiwPNbl.mjs";import{$ as _,C as v,J as y,R as b,X as x,Z as S,_ as C,a as w,at as T,et as E,h as D,j as O,n as k,r as A,t as j,tt as M,v as N,w as P,y as te}from"./framer.XnU7V7sl.mjs";import{a as F,g as ne,h as re,m as ie,n as ae,o as oe}from"./OIjZRBmWDcIE2B6qgG1j.B81zQK5Y.mjs";import{t as se}from"./default-utils.js@_0.45.CFaeM-Gk.mjs";import{n as ce,r as le}from"./LNxQsYorw.BUvVHwgX.mjs";var I,ue=e((()=>{b(),I=P({title:`Blockify`,fragment:`
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec3 rgbToHsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsvToRgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    float aspect = u_resolution.x / u_resolution.y;
    
    ivec2 texSizeI = textureSize(u_texture, 0);
    vec2 texSize = vec2(texSizeI);
    float textureAspect = texSize.x / texSize.y;
    
    vec2 coverScale = vec2(1.0);
    vec2 coverOffset = vec2(0.0);
    
    if (aspect > textureAspect) {
        float scale = aspect / textureAspect;
        coverScale = vec2(1.0, 1.0 / scale);
        coverOffset = vec2(0.0, (1.0 - coverScale.y) * 0.5);
    } else {
        float scale = textureAspect / aspect;
        coverScale = vec2(1.0 / scale, 1.0);
        coverOffset = vec2((1.0 - coverScale.x) * 0.5, 0.0);
    }
    
    float cellsY = u_quantize;
    vec2 cellCount = vec2(cellsY * aspect, cellsY);
    
    vec2 gridUV = v_uv * cellCount;
    
    vec2 cellID;
    vec2 p;
    
    if (u_gridMode > 0.5) {
        float row = floor(gridUV.y);
        float xOffset = mod(row, 2.0) * 0.5;
        float col = floor(gridUV.x + xOffset);
        
        cellID = vec2(col, row);
        p = vec2(gridUV.x + xOffset - col, gridUV.y - row) - 0.5;
    } else {
        cellID = floor(gridUV);
        p = gridUV - cellID - 0.5;
    }
    
    // Texture coordinate
    vec2 texCoord;
    if (u_gridMode > 0.5) {
        float row = cellID.y;
        float xOffset = mod(row, 2.0) * 0.5;
        texCoord = vec2((cellID.x - xOffset + 0.5) / cellCount.x, (cellID.y + 0.5) / cellCount.y);
    } else {
        texCoord = (cellID + 0.5) / cellCount;
    }
    texCoord = texCoord * coverScale + coverOffset;
    texCoord.y = 1.0 - texCoord.y;
    
    vec2 texelCoordF = texCoord * texSize;
    ivec2 texel = ivec2(texelCoordF);
    texel = clamp(texel, ivec2(0), texSizeI - 1);
    
    vec4 sampled = texelFetch(u_texture, texel, 0);
    
    // Color quantization
    if (u_enableQuantization > 0.5 && u_colorLevels > 1.0) {
        float levels = u_colorLevels - 1.0;
        sampled.r = floor(sampled.r * levels + 0.5) / levels;
        sampled.g = floor(sampled.g * levels + 0.5) / levels;
        sampled.b = floor(sampled.b * levels + 0.5) / levels;
        sampled.rgb = clamp(sampled.rgb, 0.01, 0.95);
    }
    
    // Apply hue shift per brick
    float hueShift = random(cellID) * u_hueShift;
    vec3 hsv = rgbToHsv(sampled.rgb);
    hsv.x += hueShift;
    sampled.rgb = hsvToRgb(hsv);
    
    vec4 col = vec4(sampled.rgb, sampled.a);
    
    // Light
    float angle = u_lightAngle * 3.14159265 / 180.0;
    vec2 lightDir = vec2(cos(angle), sin(angle));
    
    // Stud with AA
    float l = dot(p, p) * u_studFactor;
    float fw = fwidth(l);
    float studMask = smoothstep(0.3 + fw, 0.2 - fw, max(l, 0.45 - l));
    col *= 1.0 + studMask * tanh(dot(p, lightDir) * u_lightIntensity);
    
    // Brick outlines with AA
    float edgeStart = 0.47;
    vec2 ap = abs(p);
    float maxP = max(ap.x, ap.y);
    float edgeFw = fwidth(maxP);
    float edgeMask = smoothstep(edgeStart - edgeFw, edgeStart + edgeFw, maxP);
    col *= mix(1.0, 0.9, edgeMask);
    
    fragColor = vec4(col.rgb, 1.0);
}
`,propertyControls:{texture:{type:A.ResponsiveImage,title:`Image`,defaultValue:`data:framer/asset-reference,iePjwFmmdOppWQd5iQSbr8O4UQI.png?originalFilename=P48.png&width=2560&height=1440`},gridMode:{type:A.Enum,title:`Grid`,options:[0,1],optionTitles:[`Square`,`Hex`],defaultValue:0,displaySegmentedControl:!0},quantize:{type:A.Number,title:`Tiles`,defaultValue:16,min:8,max:64,step:1},studFactor:{type:A.Number,title:`Rounding`,defaultValue:3,min:0,max:4,step:.01},lightIntensity:{type:A.Number,title:`Light`,defaultValue:1.4,min:.5,max:2,step:.1},lightAngle:{type:A.Number,title:`Light Angle`,defaultValue:90,min:0,max:360,step:15,displayStepper:!0},enableQuantization:{type:A.Boolean,title:`Posterize`,defaultValue:!1,enabledTitle:`Yes`,disabledTitle:`No`,section:`Filters`},colorLevels:{type:A.Number,title:`Colors`,defaultValue:4,min:2,max:16,step:1,hidden:e=>!e.enableQuantization,section:`Filters`},hueShift:{type:A.Number,title:`Hue Shift`,defaultValue:0,min:0,max:.1,step:.005,hiddenWhenUnset:!0}}})}));function L({url:e,play:t,shouldMute:n,thumbnail:r,isRed:i,onClick:c,border:l,boxShadow:d,onMouseEnter:ee,onMouseLeave:p,onMouseDown:m,onMouseUp:h,title:g,..._}){let v=oe(),y=t!==`Off`,b=v||r!==`Off`&&!y,[x,S]=o(()=>!0,!1),[C,w]=o(()=>!0,!b),[T,E]=a(!1),D=F(_),O=D!==`0px 0px 0px 0px`&&D!==`0px`;if(e===``)return s(pe,{});let k=de(e);if(k===void 0)return s(me,{message:`Invalid Youtube URL.`});let[A,j,M]=k,N=j.searchParams;if(M)for(let[e,t]of M)N.set(e,t),e===`t`&&N.set(`start`,t);N.set(`iv_load_policy`,`3`),N.set(`rel`,`0`),N.set(`modestbranding`,`1`),N.set(`playsinline`,`1`),C?(y||b&&C)&&N.set(`autoplay`,`1`):N.set(`autoplay`,`0`),y&&n&&N.set(`mute`,`1`),t===`Loop`&&(N.set(`loop`,`1`),N.set(`playlist`,A)),i||N.set(`color`,`white`);let P={title:g||`Youtube Video`,allow:`presentation; fullscreen; accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture`,src:j.href,frameBorder:`0`,onClick:c,onMouseEnter:ee,onMouseLeave:p,onMouseDown:m,onMouseUp:h};return u(`article`,{onPointerEnter:()=>E(!0),onPointerLeave:()=>E(!1),onPointerOver:S,onKeyDown:w,onClick:w,style:{...H,borderRadius:D,boxShadow:d,transform:O&&(C||v)?`translateZ(0.000001px)`:`unset`,cursor:`pointer`,overflow:`hidden`},role:`presentation`,children:[b&&u(f,{children:[s(`link`,{rel:`preconnect`,href:`https://i.ytimg.com`}),s(`img`,{decoding:`async`,src:fe(A,r),style:{...W,objectFit:`cover`}})]}),x&&u(f,{children:[s(`link`,{rel:`dns-prefetch`,href:`https://i.ytimg.com`}),s(`link`,{rel:`preconnect`,href:`https://www.youtube.com`}),s(`link`,{rel:`dns-prefetch`,href:`https://www.google.com`})]}),v?null:s(`iframe`,{loading:C?void 0:`lazy`,style:C?W:{...W,display:`none`},...P}),l&&s(`div`,{style:{position:`absolute`,inset:0,pointerEvents:`none`,boxSizing:`border-box`,borderRadius:D,...l}}),C?null:s(he,{onClick:w,isHovered:T,isRed:i})]})}function de(e){let t;try{t=new URL(e)}catch{return[e,R(e),null]}let n=t.searchParams;if(t.hostname===`youtube.com`||t.hostname===`www.youtube.com`||t.hostname===`youtube-nocookie.com`||t.hostname===`www.youtube-nocookie.com`){let e=t.pathname.slice(1).split(`/`),r=e[0];if(r===`watch`){let e=t.searchParams.get(`v`);return[e,R(e),n]}if(r===`embed`)return[e[1],t,n];if(r===`shorts`||r===`live`){let t=e[1];return[t,R(t),n]}}if(t.hostname===`youtu.be`){let e=t.pathname.slice(1);return[e,R(e),n]}}function R(e){return new URL(`https://www.youtube.com/embed/${e}`)}function fe(e,t){let n=`https://i.ytimg.com/vi_webp/`,r=`webp`;switch(t){case`Low Quality`:return`${n}${e}/hqdefault.${r}`;case`Medium Quality`:return`${n}${e}/sddefault.${r}`;case`High Quality`:return`${n}${e}/maxresdefault.${r}`;default:return`${n}${e}/0.${r}`}}function pe(){return s(`div`,{style:{...ne,overflow:`hidden`},children:s(`div`,{style:U,children:`To embed a Youtube video, add the URL to the properties\xA0panel.`})})}function me({message:e}){return s(`div`,{className:`framerInternalUI-errorPlaceholder`,style:{...ie,overflow:`hidden`},children:u(`div`,{style:U,children:[`Error: `,e]})})}function he({onClick:e,isHovered:t,isRed:n}){return s(`button`,{onClick:e,"aria-label":`Play`,style:V,children:u(`svg`,{height:`100%`,version:`1.1`,viewBox:`0 0 68 48`,width:`100%`,children:[s(`path`,{d:`M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z`,fill:t?n?`#f00`:`#000`:`#212121`,fillOpacity:t&&n?1:.8,style:{transition:`fill .1s cubic-bezier(0.4, 0, 1, 1), fill-opacity .1s cubic-bezier(0.4, 0, 1, 1)`}}),s(`path`,{d:`M 45,24 27,14 27,34`,fill:`#fff`})]})})}var z,B,V,H,U,W,ge=e((()=>{d(),n(),b(),se(),(function(e){e.Normal=`Off`,e.Auto=`On`,e.Loop=`Loop`})(z||={}),(function(e){e.High=`High Quality`,e.Medium=`Medium Quality`,e.Low=`Low Quality`,e.Off=`Off`})(B||={}),L.displayName=`YouTube`,te(L,{url:{type:A.String,title:`Video`},play:{type:A.Enum,title:`Autoplay`,options:Object.values(z)},shouldMute:{title:`Mute`,type:A.Boolean,enabledTitle:`Yes`,disabledTitle:`No`,hidden(e){return e.play===`Off`}},thumbnail:{title:`Thumbnail`,description:`Showing a thumbnail improves performance.`,type:A.Enum,options:Object.values(B),hidden(e){return e.play!==`Off`}},isRed:{title:`Color`,type:A.Boolean,enabledTitle:`Red`,disabledTitle:`White`},...ae,border:{type:A.Border,optional:!0},boxShadow:{type:A.BoxShadow,optional:!0,title:`Shadows`},...re}),L.defaultProps={url:`https://youtu.be/8AHPXm9Y6mI`,play:`Off`,shouldMute:!0,thumbnail:`Medium Quality`,isRed:!0,boxShadow:null,border:null},V={position:`absolute`,top:`50%`,left:`50%`,transform:`translate(-50%, -50%)`,width:68,height:48,padding:0,border:`none`,background:`transparent`,cursor:`pointer`},H={position:`relative`,width:`100%`,height:`100%`},U={textAlign:`center`,minWidth:140},W={position:`absolute`,top:0,left:0,height:`100%`,width:`100%`}})),G,K,q,J,Y,X,Z,Q,_e,$,ve,ye;e((()=>{d(),b(),g(),n(),ue(),ge(),ce(),G=O(L),K={},q=[],J=`framer-DsR0R`,Y={k2ZyDcS_F:`framer-v-o3fwms`},X=(e,t,n)=>e&&t?`position`:n,Z=(e,t)=>{if(!(!e||typeof e!=`object`))return{...e,alt:t}},Q=({value:e})=>_()?null:s(`style`,{dangerouslySetInnerHTML:{__html:e},"data-framer-html-style":``}),_e=({height:e,id:t,width:n,...r})=>({...r}),$=T(c(function(e,n){let a=r(null),o=n??a,c=ee(),{activeLocale:d,setLocale:f}=E();y();let{style:g,className:_,layoutId:b,variant:T,...O}=_e(e);M(t(()=>le({},d),[d]));let[A,N]=S(T,K,!1),P=v(J),te=l(w)?.isLayoutTemplate,F=X(te,!!l(m)?.transition?.layout);return x({}),s(w.Provider,{value:{activeVariantId:A,primaryVariantId:`k2ZyDcS_F`,variantClassNames:Y},children:u(h,{id:b??c,children:[s(Q,{value:`html body { background: rgb(255, 255, 255); }`}),u(p.div,{...O,className:v(P,`framer-o3fwms`,_),ref:o,style:{...g},children:[s(k,{className:`framer-4ad91p-container`,layout:F,children:s(C,{__fromCanvasComponent:!0,animated:I.animated,fallbackImage:`https://framerusercontent.com/images/ihcTVcho87UmVygBShM7xbXkJA.png?scale-down-to=1440&width=2866&height=2880`,fragmentShader:I.fragment,height:`100%`,heightmapSource:I.heightmapSource,mode:`progressive`,resolutionScale:I.resolutionScale,skipInitialFallback:!0,uniforms:{u_colorLevels:{type:`number`,value:4},u_enableQuantization:{type:`boolean`,value:!1},u_gridMode:{type:`enum`,value:0},u_hueShift:{type:`number`,value:0},u_lightAngle:{type:`number`,value:90},u_lightIntensity:{type:`number`,value:1.4},u_quantize:{type:`number`,value:16},u_studFactor:{type:`number`,value:3},u_texture:{type:`responsiveimage`,value:Z({pixelHeight:1440,pixelWidth:2560,src:`https://framerusercontent.com/images/iePjwFmmdOppWQd5iQSbr8O4UQI.png?width=2560&height=1440`},``)}},vertexShader:I.vertex,width:`100%`})}),s(D,{__fromCanvasComponent:!0,children:s(i,{children:s(`p`,{dir:`auto`,style:{"--font-selector":`R0Y7SW5yaWEgU2VyaWYtcmVndWxhcg==`,"--framer-font-family":`"Inria Serif", "Inria Serif Placeholder", serif`,"--framer-font-size":`59px`},children:`V-Tube`})}),className:`framer-1a6cbnz`,fonts:[`GF;Inria Serif-regular`],layout:F,verticalAlignment:`top`,withExternalLayout:!0}),s(D,{__fromCanvasComponent:!0,children:s(i,{children:s(`p`,{dir:`auto`,style:{"--font-selector":`R0Y7SW5kaWUgRmxvd2VyLXJlZ3VsYXI=`,"--framer-font-family":`"Indie Flower", sans-serif`,"--framer-font-size":`59px`},children:`For You:`})}),className:`framer-ic32tu`,fonts:[`GF;Indie Flower-regular`],layout:F,verticalAlignment:`top`,withExternalLayout:!0}),s(D,{__fromCanvasComponent:!0,children:s(i,{children:s(`p`,{dir:`auto`,style:{"--framer-font-size":`47px`},children:` `})}),className:`framer-mkw3n6`,fonts:[`Inter`],layout:F,verticalAlignment:`top`,withExternalLayout:!0}),s(j,{children:s(k,{className:`framer-10zi6qa-container`,isAuthoredByUser:!0,isModuleExternal:!0,layout:F,nodeId:`pYKIrvB_i`,scopeId:`LNxQsYorw`,children:s(L,{borderRadius:0,bottomLeftRadius:0,bottomRightRadius:0,boxShadow:``,height:`100%`,id:`pYKIrvB_i`,isMixedBorderRadius:!1,isRed:!0,layoutId:`pYKIrvB_i`,play:`Off`,shouldMute:!0,style:{height:`100%`,width:`100%`},thumbnail:`Medium Quality`,topLeftRadius:0,topRightRadius:0,url:`https://www.youtube.com/watch?v=qT_neByb6KU`,width:`100%`})})}),s(D,{__fromCanvasComponent:!0,children:u(i,{children:[s(`p`,{dir:`auto`,style:{"--font-selector":`R0Y7SW9zZXZrYSBDaGFyb24tcmVndWxhcg==`,"--framer-font-family":`"Iosevka Charon", monospace`,"--framer-font-size":`55px`},children:`Drop Kicking Children`}),s(`p`,{dir:`auto`,style:{"--font-selector":`R0Y7SW9zZXZrYSBDaGFyb24tcmVndWxhcg==`,"--framer-font-family":`"Iosevka Charon", monospace`,"--framer-font-size":`55px`},children:`              Season 1`})]}),className:`framer-j4o89c`,fonts:[`GF;Iosevka Charon-regular`],layout:F,verticalAlignment:`top`,withExternalLayout:!0}),s(D,{__fromCanvasComponent:!0,children:s(i,{children:u(`p`,{dir:`auto`,style:{"--font-selector":`R0Y7SW9zZXZrYSBDaGFyb24tcmVndWxhcg==`,"--framer-font-family":`"Iosevka Charon", monospace`,"--framer-font-size":`55px`},children:[`Peppa Pig playing`,s(`br`,{}),` Fortnite`]})}),className:`framer-10qad2v`,fonts:[`GF;Iosevka Charon-regular`],layout:F,verticalAlignment:`top`,withExternalLayout:!0}),s(D,{__fromCanvasComponent:!0,children:u(i,{children:[s(`p`,{dir:`auto`,style:{"--font-selector":`R0Y7SW9zZXZrYSBDaGFyb24tcmVndWxhcg==`,"--framer-font-family":`"Iosevka Charon", monospace`,"--framer-font-size":`40px`},children:`KAROKE VERSION PERIODIC `}),s(`p`,{dir:`auto`,style:{"--font-selector":`R0Y7SW9zZXZrYSBDaGFyb24tcmVndWxhcg==`,"--framer-font-family":`"Iosevka Charon", monospace`,"--framer-font-size":`40px`},children:`Table - 2018 Edition`})]}),className:`framer-t9dnsm`,fonts:[`GF;Iosevka Charon-regular`],layout:F,verticalAlignment:`top`,withExternalLayout:!0}),s(j,{children:s(k,{className:`framer-1lwqche-container`,isAuthoredByUser:!0,isModuleExternal:!0,layout:F,nodeId:`H2uB_boWi`,scopeId:`LNxQsYorw`,children:s(L,{borderRadius:0,bottomLeftRadius:0,bottomRightRadius:0,boxShadow:``,height:`100%`,id:`H2uB_boWi`,isMixedBorderRadius:!1,isRed:!0,layoutId:`H2uB_boWi`,play:`Off`,shouldMute:!0,style:{height:`100%`,width:`100%`},thumbnail:`Medium Quality`,topLeftRadius:0,topRightRadius:0,url:`https://www.youtube.com/watch?v=FiQWp8N4qtY`,width:`100%`})})}),s(j,{children:s(k,{className:`framer-hdfxar-container`,isAuthoredByUser:!0,isModuleExternal:!0,layout:F,nodeId:`pGbXRkv0p`,scopeId:`LNxQsYorw`,children:s(L,{borderRadius:0,bottomLeftRadius:0,bottomRightRadius:0,boxShadow:``,height:`100%`,id:`pGbXRkv0p`,isMixedBorderRadius:!1,isRed:!0,layoutId:`pGbXRkv0p`,play:`Off`,shouldMute:!0,style:{height:`100%`,width:`100%`},thumbnail:`Medium Quality`,topLeftRadius:0,topRightRadius:0,url:`https://www.youtube.com/watch?v=hEZgPfO-qhs`,width:`100%`})})}),s(j,{children:s(k,{className:`framer-76k1ph-container`,isAuthoredByUser:!0,isModuleExternal:!0,layout:F,nodeId:`KXw1phE_p`,scopeId:`LNxQsYorw`,children:s(L,{borderRadius:0,bottomLeftRadius:0,bottomRightRadius:0,boxShadow:``,height:`100%`,id:`KXw1phE_p`,isMixedBorderRadius:!1,isRed:!0,layoutId:`KXw1phE_p`,play:`Off`,shouldMute:!0,style:{height:`100%`,width:`100%`},thumbnail:`Medium Quality`,topLeftRadius:0,topRightRadius:0,url:`https://www.youtube.com/watch?v=Wq6IaCPy1EI&t=3s`,width:`100%`})})}),s(D,{__fromCanvasComponent:!0,children:s(i,{children:s(`p`,{dir:`auto`,style:{"--framer-font-size":`30px`},children:`Weird Ahh Grinch`})}),className:`framer-gnplzh`,fonts:[`Inter`],layout:F,verticalAlignment:`top`,withExternalLayout:!0})]}),s(`div`,{id:`overlay`})]})})}),[`@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }`,`.framer-DsR0R.framer-g8dtjo, .framer-DsR0R .framer-g8dtjo { display: block; }`,`.framer-DsR0R.framer-o3fwms { background-color: #ffffff; height: 1080px; overflow: var(--overflow-clip-fallback, clip); position: relative; width: 1242px; }`,`.framer-DsR0R .framer-4ad91p-container { flex: none; height: 1440px; left: 0px; position: absolute; right: -191px; top: 0px; }`,`.framer-DsR0R .framer-1a6cbnz { --framer-link-text-color: #0099ff; --framer-link-text-decoration: underline; flex: none; height: 89px; left: calc(50.00000000000002% - 204px / 2); position: absolute; top: 0px; white-space: pre-wrap; width: 204px; word-break: break-word; word-wrap: break-word; }`,`.framer-DsR0R .framer-ic32tu { --framer-link-text-color: #0099ff; --framer-link-text-decoration: underline; flex: none; height: 66px; left: 83px; position: absolute; top: 89px; white-space: pre-wrap; width: 388px; word-break: break-word; word-wrap: break-word; }`,`.framer-DsR0R .framer-mkw3n6 { --framer-link-text-color: #0099ff; --framer-link-text-decoration: underline; flex: none; height: auto; left: 226px; position: absolute; top: 398px; white-space: pre; width: auto; }`,`.framer-DsR0R .framer-10zi6qa-container { flex: none; height: 308px; left: 9px; position: absolute; top: 180px; width: 447px; }`,`.framer-DsR0R .framer-j4o89c { --framer-link-text-color: #0099ff; --framer-link-text-decoration: underline; flex: none; height: auto; left: 103px; position: absolute; top: 488px; white-space: pre; width: auto; }`,`.framer-DsR0R .framer-10qad2v { --framer-link-text-color: #0099ff; --framer-link-text-decoration: underline; flex: none; height: auto; left: 127px; position: absolute; top: 948px; white-space: pre; width: auto; }`,`.framer-DsR0R .framer-t9dnsm { --framer-link-text-color: #0099ff; --framer-link-text-decoration: underline; flex: none; height: auto; left: 744px; position: absolute; top: 506px; white-space: pre; width: auto; }`,`.framer-DsR0R .framer-1lwqche-container { flex: none; height: 332px; left: 661px; position: absolute; top: 604px; width: 521px; }`,`.framer-DsR0R .framer-hdfxar-container { flex: none; height: 332px; left: 61px; position: absolute; top: 620px; width: 521px; }`,`.framer-DsR0R .framer-76k1ph-container { flex: none; height: 346px; left: 621px; position: absolute; top: 157px; width: 529px; }`,`.framer-DsR0R .framer-gnplzh { --framer-link-text-color: #0099ff; --framer-link-text-decoration: underline; flex: none; height: auto; left: 933px; position: absolute; top: 954px; white-space: pre; width: auto; }`],`framer-DsR0R`),ve=$,$.displayName=`Page`,$.defaultProps={height:1080,width:1242},N($,[{explicitInter:!0,fonts:[{cssFamilyName:`Inria Serif`,source:`google`,style:`normal`,uiFamilyName:`Inria Serif`,url:`https://fonts.gstatic.com/s/inriaserif/v18/fC1lPYxPY3rXxEndZJAzN0SpfSzNr0Ck.woff2`,weight:`400`},{cssFamilyName:`Indie Flower`,source:`google`,style:`normal`,uiFamilyName:`Indie Flower`,url:`https://fonts.gstatic.com/s/indieflower/v24/m8JVjfNVeKWVnh3QMuKkFcZla0GG1dKEDw.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F`,url:`https://framerusercontent.com/assets/5vvr9Vy74if2I6bQbJvbw7SY1pQ.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116`,url:`https://framerusercontent.com/assets/EOr0mi4hNtlgWNn9if640EZzXCo.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+1F00-1FFF`,url:`https://framerusercontent.com/assets/Y9k9QrlZAqio88Klkmbd8VoMQc.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0370-03FF`,url:`https://framerusercontent.com/assets/OYrD2tBIBPvoJXiIHnLoOXnY9M.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF`,url:`https://framerusercontent.com/assets/JeYwfuaPfZHQhEG8U5gtPDZ7WQ.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD`,url:`https://framerusercontent.com/assets/GrgcKwrN6d3Uz8EwcLHZxwEfC4.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB`,url:`https://framerusercontent.com/assets/b6Y37FthZeALduNqHicBT6FutY.woff2`,weight:`400`},{cssFamilyName:`Iosevka Charon`,source:`google`,style:`normal`,uiFamilyName:`Iosevka Charon`,url:`https://fonts.gstatic.com/s/iosevkacharon/v1/f0Xv0e-o8dtuW1FZBLWGprOon4cCU-UkOYQC.woff2`,weight:`400`}]},...G],{supportsExplicitInterCodegen:!0}),ye={exports:{Props:{type:`tsType`,annotations:{framerContractVersion:`1`}},queryParamNames:{type:`variable`,annotations:{framerContractVersion:`1`}},default:{type:`reactComponent`,name:`FramerLNxQsYorw`,slots:[],annotations:{framerIntrinsicWidth:`1242`,framerAcceptsLayoutTemplate:`false`,framerColorSyntax:`true`,framerLayoutTemplateFlowEffect:`true`,framerContractVersion:`1`,framerCanvasComponentVariantDetails:`{"propertyName":"variant","data":{"default":{"layout":["fixed","fixed"]}}}`,framerImmutableVariables:`true`,framerDisplayContentsDiv:`false`,framerScrollSections:`false`,framerIntrinsicHeight:`1080`,framerAutoSizeImages:`true`,framerResponsiveScreen:`true`,framerComponentViewportWidth:`true`}},__FramerMetadata__:{type:`variable`}}}}))();export{ye as __FramerMetadata__,ve as default,q as queryParamNames};
//# sourceMappingURL=_RRnh2p8ndyNiVnAahGTAjyUILA5YD1DUM6kDpPAg0k.BZNWEZU4.mjs.map