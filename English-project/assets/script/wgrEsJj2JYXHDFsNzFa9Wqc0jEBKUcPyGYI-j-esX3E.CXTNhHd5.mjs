import{t as e}from"./rolldown-runtime.DsXBSD_B.mjs";import{A as t,C as n,D as r,I as i,M as a,P as o,R as s,c,g as l,k as u,l as d,o as f,v as ee}from"./react.rbTZ9EGs.mjs";import{S as te,a as ne,r as p,t as m}from"./motion.tdiwPNbl.mjs";import{$ as h,C as g,J as re,R as _,X as ie,Z as v,a as y,at as b,et as x,j as S,n as C,r as w,t as ae,tt as T,v as E,y as D}from"./framer.XnU7V7sl.mjs";import{g as O,m as k,o as oe,t as se}from"./OIjZRBmWDcIE2B6qgG1j.B81zQK5Y.mjs";import{n as ce,r as le}from"./FCUXU0ndu.n2XE-thf.mjs";var ue=e((()=>{se()}));function A({type:e,url:t,html:n,zoom:r,radius:i,border:a,style:o={}}){return e===`url`&&t?c(de,{url:t,zoom:r,radius:i,border:a,style:o}):e===`html`&&n?c(M,{html:n,style:o}):c(j,{style:o})}function j({style:e}){return c(`div`,{style:{minHeight:z(e),...O,overflow:`hidden`,...e},children:c(`div`,{style:H,children:`To embed a website or widget, add it to the properties\xA0panel.`})})}function de({url:e,zoom:t,radius:n,border:r,style:i}){let s=!i.height;/[a-z]+:\/\//.test(e)||(e=`https://`+e);let l=oe(),[u,d]=o(l?void 0:!1);return a(()=>{if(!l)return;let t=!0;d(void 0);async function n(){let n=await fetch(`https://api.framer.com/functions/check-iframe-url?url=`+encodeURIComponent(e));if(n.status==200){let{isBlocked:e}=await n.json();t&&d(e)}else{let e=await n.text();console.error(e),d(Error(`This site can’t be reached.`))}}return n().catch(e=>{console.error(e),d(e)}),()=>{t=!1}},[e]),l&&s?c(R,{message:`URL embeds do not support auto height.`,style:i}):e.startsWith(`https://`)?u===void 0?c(L,{}):u instanceof Error?c(R,{message:u.message,style:i}):u===!0?c(R,{message:`Can’t embed ${e} due to its content security policy.`,style:i}):c(`iframe`,{src:e,style:{...B,...i,...r,zoom:t,borderRadius:n,transformOrigin:`top center`},loading:`lazy`,fetchPriority:l?`low`:`auto`,referrerPolicy:`no-referrer`,sandbox:fe(l),allowFullScreen:!0,allow:`presentation; fullscreen; accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; clipboard-write`}):c(R,{message:`Unsupported protocol.`,style:i})}function fe(e){let t=[`allow-same-origin`,`allow-scripts`];return e||t.push(`allow-downloads`,`allow-forms`,`allow-modals`,`allow-orientation-lock`,`allow-pointer-lock`,`allow-popups`,`allow-popups-to-escape-sandbox`,`allow-presentation`,`allow-storage-access-by-user-activation`,`allow-top-navigation-by-user-activation`),t.join(` `)}function M({html:e,...t}){if(e.includes(`<\/script>`)){let n=e.includes(`</spline-viewer>`),r=e.includes(`<!-- framer-direct-embed -->`);return c(n||r?P:N,{html:e,...t})}return c(F,{html:e,...t})}function N({html:e,style:t}){let n=r(),[i,l]=o(0);a(()=>{let e=n.current?.contentWindow;function t(t){if(t.source!==e)return;let n=t.data;if(typeof n!=`object`||!n)return;let r=n.embedHeight;typeof r==`number`&&l(r)}return s.addEventListener(`message`,t),e?.postMessage(`getEmbedHeight`,`*`),()=>{s.removeEventListener(`message`,t)}},[]);let u=`
<html>
    <head>
        <style>
            html, body {
                margin: 0;
                padding: 0;
            }

            body {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            :root {
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }

            * {
                box-sizing: border-box;
                -webkit-font-smoothing: inherit;
            }

            h1, h2, h3, h4, h5, h6, p, figure {
                margin: 0;
            }

            body, input, textarea, select, button {
                font-size: 12px;
                font-family: sans-serif;
            }
        </style>
    </head>
    <body>
        ${e}
        <script type="module">
            let height = 0

            function sendEmbedHeight() {
                window.parent.postMessage({
                    embedHeight: height
                }, "*")
            }

            const observer = new ResizeObserver((entries) => {
                if (entries.length !== 1) return
                const entry = entries[0]
                if (entry.target !== document.body) return

                height = entry.contentRect.height
                sendEmbedHeight()
            })

            observer.observe(document.body)

            window.addEventListener("message", (event) => {
                if (event.source !== window.parent) return
                if (event.data !== "getEmbedHeight") return
                sendEmbedHeight()
            })
        <\/script>
    <body>
</html>
`,d={...B,...t};return t.height||(d.height=i+`px`),c(`iframe`,{ref:n,style:d,srcDoc:u})}function P({html:e,style:t}){let n=r();return a(()=>{let t=n.current;if(t)return t.innerHTML=e,I(t),()=>{t.innerHTML=``}},[e]),c(`div`,{ref:n,style:{...V,...t}})}function F({html:e,style:t}){return c(`div`,{style:{...V,...t},dangerouslySetInnerHTML:{__html:e}})}function I(e){if(e instanceof Element&&e.tagName===`SCRIPT`){let t=document.createElement(`script`);t.text=e.innerHTML;for(let{name:n,value:r}of e.attributes)t.setAttribute(n,r);e.parentElement.replaceChild(t,e)}else for(let t of e.childNodes)I(t)}function L(){return c(`div`,{className:`framerInternalUI-componentPlaceholder`,style:{...k,overflow:`hidden`},children:c(`div`,{style:H,children:`Loading…`})})}function R({message:e,style:t}){return c(`div`,{className:`framerInternalUI-errorPlaceholder`,style:{minHeight:z(t),...k,overflow:`hidden`,...t},children:c(`div`,{style:H,children:e})})}function z(e){if(!e.height)return 200}var B,V,H,pe=e((()=>{i(),f(),n(),_(),ue(),D(A,{type:{type:w.Enum,defaultValue:`url`,displaySegmentedControl:!0,options:[`url`,`html`],optionTitles:[`URL`,`HTML`]},url:{title:`URL`,type:w.String,description:`Some websites don’t support embedding.`,hidden(e){return e.type!==`url`}},html:{title:`HTML`,type:w.String,displayTextArea:!0,hidden(e){return e.type!==`html`}},border:{title:`Border`,type:w.Border,optional:!0,hidden(e){return e.type!==`url`}},radius:{type:w.BorderRadius,title:`Radius`,hidden(e){return e.type!==`url`}},zoom:{title:`Zoom`,defaultValue:1,type:w.Number,hidden(e){return e.type!==`url`},min:.1,max:1,step:.1,displayStepper:!0}}),B={width:`100%`,height:`100%`,border:`none`},V={width:`100%`,height:`100%`,display:`flex`,flexDirection:`column`,justifyContent:`center`,alignItems:`center`},H={textAlign:`center`,minWidth:140}})),U,W,G,K,q,J,Y,X,Z,Q,$;e((()=>{f(),_(),m(),n(),pe(),ce(),U=S(A),W={},G=[],K=`framer-4cpPm`,q={YicEPgoKt:`framer-v-uwz01h`},J=(e,t,n)=>e&&t?`position`:n,Y=({value:e})=>h()?null:c(`style`,{dangerouslySetInnerHTML:{__html:e},"data-framer-html-style":``}),X=({height:e,id:t,width:n,...r})=>({...r}),Z=b(l(function(e,n){let i=r(null),a=n??i,o=ee(),{activeLocale:s,setLocale:l}=x();re();let{style:f,className:m,layoutId:h,variant:_,...b}=X(e);T(t(()=>le({},s),[s]));let[S,w]=v(_,W,!1),E=g(K),D=u(y)?.isLayoutTemplate,O=J(D,!!u(ne)?.transition?.layout);return ie({}),c(y.Provider,{value:{activeVariantId:S,primaryVariantId:`YicEPgoKt`,variantClassNames:q},children:d(p,{id:h??o,children:[c(Y,{value:`html body { background: rgb(255, 255, 255); }`}),c(te.div,{...b,className:g(E,`framer-uwz01h`,m),ref:a,style:{...f},children:c(ae,{children:c(C,{className:`framer-192zigu-container`,isAuthoredByUser:!0,isModuleExternal:!0,layout:O,nodeId:`TUlm4FaSG`,scopeId:`FCUXU0ndu`,children:c(A,{height:`100%`,html:`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>V-Probe AI</title>

<style>
body {
    margin: 0;
    font-family: Arial, sans-serif;
    background: #0f172a;
    color: white;
    display: flex;
    flex-direction: column;
    height: 100vh;
}

header {
    padding: 15px;
    background: #020617;
    text-align: center;
    font-size: 22px;
    font-weight: bold;
    border-bottom: 1px solid #1e293b;
}

#chat {
    flex: 1;
    overflow-y: auto;
    padding: 15px;
}

.msg {
    margin: 10px 0;
    padding: 10px;
    border-radius: 10px;
    max-width: 75%;
}

.user {
    background: #2563eb;
    margin-left: auto;
}

.bot {
    background: #1e293b;
}

#inputBox {
    display: flex;
    border-top: 1px solid #1e293b;
}

input {
    flex: 1;
    padding: 15px;
    border: none;
    outline: none;
    background: #020617;
    color: white;
}

button {
    padding: 15px;
    border: none;
    background: #2563eb;
    color: white;
    cursor: pointer;
}

button:hover {
    background: #1d4ed8;
}
</style>
</head>

<body>

<header>V-Probe AI</header>

<div id="chat"></div>

<div id="inputBox">
    <input id="input" placeholder="Ask V-Probe AI..." />
    <button onclick="send()">Send</button>
</div>

<script>
const API_KEY = "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";
const MODEL = "nvidia/nemotron-3-super-120b-a12b:free";

// 🔥 CUSTOM PROMPT (EDIT THIS HOW YOU WANT)
const SYSTEM_PROMPT = \`
You are V-Probe AI.

You are a smart, fast, slightly futuristic AI assistant.
Your personality:
- You are always kind, not to be mean at others.
- Confident and direct
- Helpful but not overly verbose
- Slightly techy tone
- Gives clear answers, no fluff
- If coding, give clean full solutions
- You get information around the web.
Rules:
- Always respond as V-Probe AI
- Never say you are ChatGPT or OpenAI
- Be efficient and sharp
- Your Creators are: Anirudh Karthik Luca Marchisello Logan Barton
\`;

const chatDiv = document.getElementById("chat");
const input = document.getElementById("input");

// store conversation memory
let messages = [
    { role: "system", content: SYSTEM_PROMPT }
];

function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = "msg " + type;
    div.innerText = text;
    chatDiv.appendChild(div);
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

async function send() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    messages.push({ role: "user", content: text });

    addMessage("Thinking...", "bot");

    try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + API_KEY,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost",
                "X-Title": "V-Probe AI"
            },
            body: JSON.stringify({
                model: MODEL,
                messages: messages
            })
        });

        const data = await res.json();

        chatDiv.lastChild.remove();

        const reply = data?.choices?.[0]?.message?.content || "Error: No response";

        addMessage(reply, "bot");

        messages.push({ role: "assistant", content: reply });

    } catch (err) {
        chatDiv.lastChild.remove();
        addMessage("Error: " + err.message, "bot");
    }
}

input.addEventListener("keypress", function(e) {
    if (e.key === "Enter") send();
});
<\/script>

</body>
</html>`,id:`TUlm4FaSG`,layoutId:`TUlm4FaSG`,radius:`0px`,style:{height:`100%`,width:`100%`},type:`html`,url:``,width:`100%`,zoom:1})})})}),c(`div`,{id:`overlay`})]})})}),[`@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }`,`.framer-4cpPm.framer-14uoj1l, .framer-4cpPm .framer-14uoj1l { display: block; }`,`.framer-4cpPm.framer-uwz01h { background-color: #ffffff; height: 1080px; overflow: var(--overflow-clip-fallback, clip); position: relative; width: 1200px; }`,`.framer-4cpPm .framer-192zigu-container { flex: none; height: 1080px; left: 0px; position: absolute; right: 0px; top: 0px; }`],`framer-4cpPm`),Q=Z,Z.displayName=`Page`,Z.defaultProps={height:1080,width:1200},E(Z,[{explicitInter:!0,fonts:[]},...U],{supportsExplicitInterCodegen:!0}),$={exports:{default:{type:`reactComponent`,name:`FramerFCUXU0ndu`,slots:[],annotations:{framerAutoSizeImages:`true`,framerScrollSections:`false`,framerImmutableVariables:`true`,framerComponentViewportWidth:`true`,framerResponsiveScreen:`true`,framerLayoutTemplateFlowEffect:`true`,framerColorSyntax:`true`,framerCanvasComponentVariantDetails:`{"propertyName":"variant","data":{"default":{"layout":["fixed","fixed"]}}}`,framerDisplayContentsDiv:`false`,framerAcceptsLayoutTemplate:`false`,framerContractVersion:`1`,framerIntrinsicHeight:`1080`,framerIntrinsicWidth:`1200`}},queryParamNames:{type:`variable`,annotations:{framerContractVersion:`1`}},Props:{type:`tsType`,annotations:{framerContractVersion:`1`}},__FramerMetadata__:{type:`variable`}}}}))();export{$ as __FramerMetadata__,Q as default,G as queryParamNames};
//# sourceMappingURL=wgrEsJj2JYXHDFsNzFa9Wqc0jEBKUcPyGYI-j-esX3E.CXTNhHd5.mjs.map