!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(require("@firebase/app-compat"),require("@firebase/app")):"function"==typeof define&&define.amd?define(["@firebase/app-compat","@firebase/app"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).firebase,t.firebase.INTERNAL.modularAPIs)}(this,function(It,St){"use strict";try{!(function(){function t(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var r,e=t(It);class o extends Error{constructor(t,e,n){super(e),this.code=t,this.customData=n,this.name="FirebaseError",Object.setPrototypeOf(this,o.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,a.prototype.create)}}class a{constructor(t,e,n){this.service=t,this.serviceName=e,this.errors=n}create(t,...e){var r,n=e[0]||{},a=`${this.service}/${t}`,i=this.errors[t],i=i?(r=n,i.replace(s,(t,e)=>{var n=r[e];return null!=n?String(n):`<${e}?>`})):"Error",i=`${this.serviceName}: ${i} (${a}).`;return new o(a,i,n)}}const s=/\{\$([^}]+)}/g;class n{constructor(t,e,n){this.name=t,this.instanceFactory=e,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}}const c=(e,t)=>t.some(t=>e instanceof t);let u,i;const f=new WeakMap,p=new WeakMap,d=new WeakMap,l=new WeakMap,g=new WeakMap;let h={get(t,e,n){if(t instanceof IDBTransaction){if("done"===e)return p.get(t);if("objectStoreNames"===e)return t.objectStoreNames||d.get(t);if("store"===e)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return m(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&("done"===e||"store"===e)||e in t}};function v(r){return r!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(i=i||[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey]).includes(r)?function(...t){return r.apply(y(this),t),m(f.get(this))}:function(...t){return m(r.apply(y(this),t))}:function(t,...e){var n=r.call(y(this),t,...e);return d.set(n,t.sort?t.sort():[t]),m(n)}}function w(t){return"function"==typeof t?v(t):(t instanceof IDBTransaction&&(i=t,p.has(i)||(e=new Promise((t,e)=>{const n=()=>{i.removeEventListener("complete",r),i.removeEventListener("error",a),i.removeEventListener("abort",a)},r=()=>{t(),n()},a=()=>{e(i.error||new DOMException("AbortError","AbortError")),n()};i.addEventListener("complete",r),i.addEventListener("error",a),i.addEventListener("abort",a)}),p.set(i,e))),c(t,u=u||[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])?new Proxy(t,h):t);var i,e}function m(t){if(t instanceof IDBRequest)return function(i){const t=new Promise((t,e)=>{const n=()=>{i.removeEventListener("success",r),i.removeEventListener("error",a)},r=()=>{t(m(i.result)),n()},a=()=>{e(i.error),n()};i.addEventListener("success",r),i.addEventListener("error",a)});return t.then(t=>{t instanceof IDBCursor&&f.set(t,i)}).catch(()=>{}),g.set(t,i),t}(t);if(l.has(t))return l.get(t);var e=w(t);return e!==t&&(l.set(t,e),g.set(e,t)),e}const y=t=>g.get(t);const b=["get","getKey","getAll","getAllKeys","count"],I=["put","add","delete","clear"],S=new Map;function C(t,e){if(t instanceof IDBDatabase&&!(e in t)&&"string"==typeof e){if(S.get(e))return S.get(e);const a=e.replace(/FromIndex$/,""),i=e!==a,o=I.includes(a);if(a in(i?IDBIndex:IDBObjectStore).prototype&&(o||b.includes(a))){var n=async function(t,...e){var n=this.transaction(t,o?"readwrite":"readonly");let r=n.store;return i&&(r=r.index(e.shift())),(await Promise.all([r[a](...e),o&&n.done]))[0]};return S.set(e,n),n}}}h={...r=h,get:(t,e,n)=>C(t,e)||r.get(t,e,n),has:(t,e)=>!!C(t,e)||r.has(t,e)};var T="@firebase/installations",k="0.6.4";const E=1e4,j=`w:${k}`,D="FIS_v2",P="https://firebaseinstallations.googleapis.com/v1",$=36e5;var B;const L=new a("installations","Installations",{"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."});function q(t){return t instanceof o&&t.code.includes("request-failed")}function N({projectId:t}){return`${P}/projects/${t}/installations`}function O(t){return{token:t.token,requestStatus:2,expiresIn:(t=t.expiresIn,Number(t.replace("s","000"))),creationTime:Date.now()}}async function A(t,e){var n=(await e.json()).error;return L.create("request-failed",{requestName:t,serverCode:n.code,serverMessage:n.message,serverStatus:n.status})}function M({apiKey:t}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":t})}function x(t,{refreshToken:e}){const n=M(t);return n.append("Authorization",(e=e,`${D} ${e}`)),n}async function V(t){var e=await t();return 500<=e.status&&e.status<600?t():e}function _(e){return new Promise(t=>{setTimeout(t,e)})}const F=/^[cdef][\w-]{21}$/,K="";function H(){try{const e=new Uint8Array(17),n=self.crypto||self.msCrypto;n.getRandomValues(e),e[0]=112+e[0]%16;var t=function(t){const e=function(t){const e=btoa(String.fromCharCode(...t));return e.replace(/\+/g,"-").replace(/\//g,"_")}(t);return e.substr(0,22)}(e);return F.test(t)?t:K}catch(t){return K}}function R(t){return`${t.appName}!${t.appId}`}const W=new Map;function z(t,e){var n=R(t);U(n,e),function(t,e){const n=G();n&&n.postMessage({key:t,fid:e});Y()}(n,e)}function U(t,e){var n=W.get(t);if(n)for(const r of n)r(e)}let J=null;function G(){return!J&&"BroadcastChannel"in self&&(J=new BroadcastChannel("[Firebase] FID Change"),J.onmessage=t=>{U(t.data.key,t.data.fid)}),J}function Y(){0===W.size&&J&&(J.close(),J=null)}const Z="firebase-installations-database",Q=1,X="firebase-installations-store";let tt=null;function et(){return tt=tt||function(t,e,{blocked:n,upgrade:r,blocking:a,terminated:i}){const o=indexedDB.open(t,e),s=m(o);return r&&o.addEventListener("upgradeneeded",t=>{r(m(o.result),t.oldVersion,t.newVersion,m(o.transaction),t)}),n&&o.addEventListener("blocked",t=>n(t.oldVersion,t.newVersion,t)),s.then(t=>{i&&t.addEventListener("close",()=>i()),a&&t.addEventListener("versionchange",t=>a(t.oldVersion,t.newVersion,t))}).catch(()=>{}),s}(Z,Q,{upgrade:(t,e)=>{0===e&&t.createObjectStore(X)}}),tt}async function nt(t,e){var n=R(t);const r=await et(),a=r.transaction(X,"readwrite"),i=a.objectStore(X);var o=await i.get(n);return await i.put(e,n),await a.done,o&&o.fid===e.fid||z(t,e.fid),e}async function rt(t){var e=R(t);const n=await et(),r=n.transaction(X,"readwrite");await r.objectStore(X).delete(e),await r.done}async function at(t,e){var n=R(t);const r=await et(),a=r.transaction(X,"readwrite"),i=a.objectStore(X);var o=await i.get(n),s=e(o);return void 0===s?await i.delete(n):await i.put(s,n),await a.done,!s||o&&o.fid===s.fid||z(t,s.fid),s}async function it(n){let r;var t=await at(n.appConfig,t=>{var e=st(t||{fid:H(),registrationStatus:0}),e=function(t,e){{if(0!==e.registrationStatus)return 1===e.registrationStatus?{installationEntry:e,registrationPromise:async function(t){let e=await ot(t.appConfig);for(;1===e.registrationStatus;)await _(100),e=await ot(t.appConfig);if(0!==e.registrationStatus)return e;{var{installationEntry:n,registrationPromise:r}=await it(t);return r||n}}(t)}:{installationEntry:e};if(!navigator.onLine){var n=Promise.reject(L.create("app-offline"));return{installationEntry:e,registrationPromise:n}}var r={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},n=async function(e,n){try{var t=await async function({appConfig:t,heartbeatServiceProvider:e},{fid:n}){const r=N(t),a=M(t),i=e.getImmediate({optional:!0});!i||(o=await i.getHeartbeatsHeader())&&a.append("x-firebase-client",o);var o={fid:n,authVersion:D,appId:t.appId,sdkVersion:j};const s={method:"POST",headers:a,body:JSON.stringify(o)},c=await V(()=>fetch(r,s));if(c.ok){o=await c.json();return{fid:o.fid||n,registrationStatus:2,refreshToken:o.refreshToken,authToken:O(o.authToken)}}throw await A("Create Installation",c)}(e,n);return nt(e.appConfig,t)}catch(t){throw q(t)&&409===t.customData.serverCode?await rt(e.appConfig):await nt(e.appConfig,{fid:n.fid,registrationStatus:0}),t}}(t,r);return{installationEntry:r,registrationPromise:n}}}(n,e);return r=e.registrationPromise,e.installationEntry});return t.fid===K?{installationEntry:await r}:{installationEntry:t,registrationPromise:r}}function ot(t){return at(t,t=>{if(!t)throw L.create("installation-not-found");return st(t)})}function st(t){return 1===(e=t).registrationStatus&&e.registrationTime+E<Date.now()?{fid:t.fid,registrationStatus:0}:t;var e}async function ct({appConfig:t,heartbeatServiceProvider:e},n){const r=([a,i]=[t,n["fid"]],`${N(a)}/${i}/authTokens:generate`);var a,i;const o=x(t,n),s=e.getImmediate({optional:!0});!s||(c=await s.getHeartbeatsHeader())&&o.append("x-firebase-client",c);var c={installation:{sdkVersion:j,appId:t.appId}};const u={method:"POST",headers:o,body:JSON.stringify(c)},f=await V(()=>fetch(r,u));if(f.ok)return O(await f.json());throw await A("Generate Auth Token",f)}async function ut(r,a=!1){let i;var t=await at(r.appConfig,t=>{if(!pt(t))throw L.create("not-registered");var e,n=t.authToken;if(a||2!==(e=n).requestStatus||function(t){var e=Date.now();return e<t.creationTime||t.creationTime+t.expiresIn<e+$}(e)){if(1===n.requestStatus)return i=async function(t,e){let n=await ft(t.appConfig);for(;1===n.authToken.requestStatus;)await _(100),n=await ft(t.appConfig);var r=n.authToken;return 0===r.requestStatus?ut(t,e):r}(r,a),t;if(!navigator.onLine)throw L.create("app-offline");n=(e=t,n={requestStatus:1,requestTime:Date.now()},Object.assign(Object.assign({},e),{authToken:n}));return i=async function(e,n){try{var r=await ct(e,n),t=Object.assign(Object.assign({},n),{authToken:r});return await nt(e.appConfig,t),r}catch(t){throw!q(t)||401!==t.customData.serverCode&&404!==t.customData.serverCode?(r=Object.assign(Object.assign({},n),{authToken:{requestStatus:0}}),await nt(e.appConfig,r)):await rt(e.appConfig),t}}(r,n),n}return t});return i?await i:t.authToken}function ft(t){return at(t,t=>{if(!pt(t))throw L.create("not-registered");var e,n=t.authToken;return 1===(e=n).requestStatus&&e.requestTime+E<Date.now()?Object.assign(Object.assign({},t),{authToken:{requestStatus:0}}):t})}function pt(t){return void 0!==t&&2===t.registrationStatus}async function dt(t){var e=t;const{installationEntry:n,registrationPromise:r}=await it(e);return(r||ut(e)).catch(console.error),n.fid}async function lt(t,e=!1){var n,r=t;return await((n=(await it(r)).registrationPromise)&&await n),(await ut(r,e)).token}async function gt(t,e){const n=([r,a]=[t,e["fid"]],`${N(r)}/${a}`);var r,a;const i={method:"DELETE",headers:x(t,e)};var o=await V(()=>fetch(n,i));if(!o.ok)throw await A("Delete Installation",o)}function ht(t,e){const n=t["appConfig"];return function(t,e){G();var n=R(t);let r=W.get(n);r||(r=new Set,W.set(n,r)),r.add(e)}(n,e),()=>{!function(t,e){var n=R(t);const r=W.get(n);r&&(r.delete(e),0===r.size&&W.delete(n),Y())}(n,e)}}function vt(t){return L.create("missing-app-config-values",{valueName:t})}const wt="installations",mt=t=>{var e=t.getProvider("app").getImmediate();return{app:e,appConfig:function(t){if(!t||!t.options)throw vt("App Configuration");if(!t.name)throw vt("App Name");for(const e of["projectId","apiKey","appId"])if(!t.options[e])throw vt(e);return{appName:t.name,projectId:t.options.projectId,apiKey:t.options.apiKey,appId:t.options.appId}}(e),heartbeatServiceProvider:St._getProvider(e,"heartbeat"),_delete:()=>Promise.resolve()}},yt=t=>{var e=t.getProvider("app").getImmediate();const n=St._getProvider(e,wt).getImmediate();return{getId:()=>dt(n),getToken:t=>lt(n,t)}};St._registerComponent(new n(wt,mt,"PUBLIC")),St._registerComponent(new n("installations-internal",yt,"PRIVATE")),St.registerVersion(T,k),St.registerVersion(T,k,"esm2017");class bt{constructor(t,e){this.app=t,this._delegate=e}getId(){return dt(this._delegate)}getToken(t){return lt(this._delegate,t)}delete(){return async function(t){var e=t["appConfig"],n=await at(e,t=>{if(!t||0!==t.registrationStatus)return t});if(n){if(1===n.registrationStatus)throw L.create("delete-pending-registration");if(2===n.registrationStatus){if(!navigator.onLine)throw L.create("app-offline");await gt(e,n),await rt(e)}}}(this._delegate)}onIdChange(t){return ht(this._delegate,t)}}(B=e.default).INTERNAL.registerComponent(new n("installations-compat",t=>{var e=t.getProvider("app-compat").getImmediate(),n=t.getProvider("installations").getImmediate();return new bt(e,n)},"PUBLIC")),B.registerVersion("@firebase/installations-compat","0.2.4")}).apply(this,arguments)}catch(t){throw console.error(t),new Error("Cannot instantiate firebase-installations-compat.js - be sure to load firebase-app.js first.")}});
//# sourceMappingURL=firebase-installations-compat.js.map
