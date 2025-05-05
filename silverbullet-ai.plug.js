var c=e=>{throw new Error("Not initialized yet")},l=typeof window>"u"&&typeof globalThis.WebSocketPair>"u";typeof Deno>"u"&&(self.Deno={args:[],build:{arch:"x86_64"},env:{get(){}}});var m=new Map,u=0;l&&(globalThis.syscall=async(e,...t)=>await new Promise((i,o)=>{u++,m.set(u,{resolve:i,reject:o}),c({type:"sys",id:u,name:e,args:t})}));function d(e,t,i){l&&(c=i,self.addEventListener("message",o=>{(async()=>{let n=o.data;switch(n.type){case"inv":{let a=e[n.name];if(!a)throw new Error(`Function not loaded: ${n.name}`);try{let s=await Promise.resolve(a(...n.args||[]));c({type:"invr",id:n.id,result:s})}catch(s){console.error("An exception was thrown as a result of invoking function",n.name,"error:",s.message),c({type:"invr",id:n.id,error:s.message})}}break;case"sysr":{let a=n.id,s=m.get(a);if(!s)throw Error("Invalid request id");m.delete(a),n.error?s.reject(new Error(n.error)):s.resolve(n.result)}break}})().catch(console.error)}),c({type:"manifest",manifest:t}))}function x(e){let t=atob(e),i=t.length,o=new Uint8Array(i);for(let n=0;n<i;n++)o[n]=t.charCodeAt(n);return o}function p(e){typeof e=="string"&&(e=new TextEncoder().encode(e));let t="",i=e.byteLength;for(let o=0;o<i;o++)t+=String.fromCharCode(e[o]);return btoa(t)}async function h(e,t){if(typeof e!="string"){let i=new Uint8Array(await e.arrayBuffer()),o=i.length>0?p(i):void 0;t={method:e.method,headers:Object.fromEntries(e.headers.entries()),base64Body:o},e=e.url}return syscall("sandboxFetch.fetch",e,t)}globalThis.nativeFetch=globalThis.fetch;function v(){globalThis.fetch=async function(e,t){let i=t&&t.body?p(new Uint8Array(await new Response(t.body).arrayBuffer())):void 0,o=await h(e,t&&{method:t.method,headers:t.headers,base64Body:i});return new Response(o.base64Body?x(o.base64Body):null,{status:o.status,headers:o.headers})}}l&&v();var b="You are a AI assistant for a user of Silverbullet. The SilverBullet documentation can be found [here](https://silverbullet.md)",f=`{
      "type" = "object",
      "properties" = {
        "baseURL" = {
          "type" = "string",
          "default" = "https://openrouter.ai/api/v1"
        },
        "apiKey" = {
          "type" = "string"
        },
        "modelName" = {
          "type" = "string"
        },
        "systemPrompt" = {
          "type" = "string",
          "default" = ${b}
        }
      } 
}`;typeof self>"u"&&(self={syscall:()=>{throw new Error("Not implemented here")}});function r(e,...t){return globalThis.syscall(e,...t)}await r("config.define","ai",f);async function g(){let e=await r("config.get","ai","{}");console.log(e)}var y={getConfig:g},P={name:"silverbullet-ai",requiredPermissions:["fetch"],functions:{getConfig:{path:"sbai.ts:getConfig",command:{name:"AI: Get Configuration Options"}}},assets:{}},ge={manifest:P,functionMapping:y};d(y,P,self.postMessage);export{ge as plug};
