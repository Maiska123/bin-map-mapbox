if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return i[e]||(s=new Promise((async s=>{if("document"in self){const i=document.createElement("script");i.src=e,document.head.appendChild(i),i.onload=s}else importScripts(e),s()}))),s.then((()=>{if(!i[e])throw new Error(`Module ${e} didn’t register its module`);return i[e]}))},s=(s,i)=>{Promise.all(s.map(e)).then((e=>i(1===e.length?e[0]:e)))},i={require:Promise.resolve(s)};self.define=(s,a,r)=>{i[s]||(i[s]=Promise.resolve().then((()=>{let i={};const d={uri:location.origin+s.slice(1)};return Promise.all(a.map((s=>{switch(s){case"exports":return i;case"module":return d;default:return e(s)}}))).then((e=>{const s=r(...e);return i.default||(i.default=s),i}))})))}}define("./sw.js",["./workbox-f7715658"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"angular.json",revision:"041824cff583b00748c3dc6564bf747b"},{url:"dist/***REMOVED***/3.jpg",revision:"c3f824f5149566cdf8744a00fe00aacf"},{url:"dist/***REMOVED***/assets/img/3.jpg",revision:"c3f824f5149566cdf8744a00fe00aacf"},{url:"dist/***REMOVED***/assets/svg/bin.svg",revision:"16aec8d26f37707219a193d702aa104e"},{url:"dist/***REMOVED***/firebase-auth-es2015.js",revision:"46beeabe58623d829ed7a95d80156afd"},{url:"dist/***REMOVED***/firebase-auth-es5.js",revision:"e450482a0817aee01177bb12a1f53590"},{url:"dist/***REMOVED***/index.html",revision:"b8bd18cd27ff0b8d8b618d0d2ec9c369"},{url:"dist/***REMOVED***/main-es2015.js",revision:"40532ba5d2d82a3088097656c74664e4"},{url:"dist/***REMOVED***/main-es5.js",revision:"7f39e61d33cbe5ea08d889dd9d008f83"},{url:"dist/***REMOVED***/polyfills-es2015.js",revision:"f829b777ecc0c27132118f0c40508bc4"},{url:"dist/***REMOVED***/polyfills-es5.js",revision:"ce3cc2df58754b851b2e4de2abf854d3"},{url:"dist/***REMOVED***/runtime-es2015.js",revision:"7209fb3d9efc625b04a0995ed0468388"},{url:"dist/***REMOVED***/runtime-es5.js",revision:"19d1d3a2acc9b9aded1619593905e53e"},{url:"dist/***REMOVED***/styles-es2015.js",revision:"b16565c4a19ee1f9e383a747c9f5fbba"},{url:"dist/***REMOVED***/styles-es5.js",revision:"1b7522b991e4a09e231d6b8a29331150"},{url:"e2e/protractor.conf.js",revision:"9951b5ad987560bd55cc256f998ce576"},{url:"e2e/tsconfig.json",revision:"e1c0f6bcb8c54f3cb270670c5291fcbf"},{url:"firebase.json",revision:"a2c827f2f512155439ae1ff522060094"},{url:"karma.conf.js",revision:"89e0c0f08a85e2b5eb11d1f48b98be7d"},{url:"old dist/dist/***REMOVED***/3.jpg",revision:"c3f824f5149566cdf8744a00fe00aacf"},{url:"old dist/dist/***REMOVED***/assets/img/3.jpg",revision:"c3f824f5149566cdf8744a00fe00aacf"},{url:"old dist/dist/***REMOVED***/assets/svg/bin.svg",revision:"16aec8d26f37707219a193d702aa104e"},{url:"old dist/dist/***REMOVED***/firebase-auth-es2015.js",revision:"46beeabe58623d829ed7a95d80156afd"},{url:"old dist/dist/***REMOVED***/firebase-auth-es5.js",revision:"e450482a0817aee01177bb12a1f53590"},{url:"old dist/dist/***REMOVED***/index.html",revision:"b8bd18cd27ff0b8d8b618d0d2ec9c369"},{url:"old dist/dist/***REMOVED***/main-es2015.js",revision:"40532ba5d2d82a3088097656c74664e4"},{url:"old dist/dist/***REMOVED***/main-es5.js",revision:"7f39e61d33cbe5ea08d889dd9d008f83"},{url:"old dist/dist/***REMOVED***/polyfills-es2015.js",revision:"f829b777ecc0c27132118f0c40508bc4"},{url:"old dist/dist/***REMOVED***/polyfills-es5.js",revision:"ce3cc2df58754b851b2e4de2abf854d3"},{url:"old dist/dist/***REMOVED***/runtime-es2015.js",revision:"7209fb3d9efc625b04a0995ed0468388"},{url:"old dist/dist/***REMOVED***/runtime-es5.js",revision:"19d1d3a2acc9b9aded1619593905e53e"},{url:"old dist/dist/***REMOVED***/styles-es2015.js",revision:"b16565c4a19ee1f9e383a747c9f5fbba"},{url:"old dist/dist/***REMOVED***/styles-es5.js",revision:"1b7522b991e4a09e231d6b8a29331150"},{url:"package copy.json",revision:"66dfdebc159a8f63d838e5632b175954"},{url:"package-lock.json",revision:"2686f0e9f1e35ef8f5cbbb451ab2d889"},{url:"package.json",revision:"4d05db4e0d2c9751c1d179b76c461b21"},{url:"src/app/app.component.html",revision:"750d502c495c8f53a8d23c815909e3eb"},{url:"src/app/hello/hello.component.html",revision:"58162b6680f3d22316406146f9cbe6c3"},{url:"src/app/map-box/distance/distance.component.html",revision:"fb182ba290ce44c5ec84cbac29f3ac19"},{url:"src/app/map-box/drawing-canvas/drawing-canvas.component.html",revision:"447d93d92823afe41e44c77996c0a382"},{url:"src/app/map-box/drawing-menu/drawing-menu.component.html",revision:"cad5eaccb62e2b5c8515f75ccf9a22e9"},{url:"src/app/map-box/hamburger-menu/hamburger-menu.component.html",revision:"fe82529c3812d1602cb2aa6987f7607a"},{url:"src/app/map-box/map-box.component.html",revision:"3d83e8ec0a396fd928028f787ee6d192"},{url:"src/app/map-box/painting-menu/painting-menu.component.html",revision:"04270fbd34f82fa0fcaaac45e076ad3e"},{url:"src/assets/img/3.jpg",revision:"c3f824f5149566cdf8744a00fe00aacf"},{url:"src/assets/svg/bin.svg",revision:"16aec8d26f37707219a193d702aa104e"},{url:"src/index.html",revision:"fca057e36ff5b54d987aca2be9db62b0"},{url:"src/tampereen_roskikset.json",revision:"0007fc7733752eca0e032a4c154ef1b1"},{url:"src/workbox/webpack.config.js",revision:"78a8401ec449dcfc469d99796e841f54"},{url:"tsconfig.app.json",revision:"2c09e8e20486d17eb4b8f60d95ea2432"},{url:"tsconfig.json",revision:"d55a50be725351ad212bbc08b21886dc"},{url:"tsconfig.spec.json",revision:"de44a74e62132a1f51959c44e606cbd3"},{url:"tslint copy.json",revision:"f86d612d62bbb22ba81d1962bb79cb52"},{url:"tslint.json",revision:"ce959097693cc0df5929b16128ab63d7"},{url:"webpack.config.js",revision:"829f4c6304657f0d81e71f69283d79a6"},{url:"yarn.lock",revision:"aa71b7947172610812ed7515bb4865d1"}],{})}));
//# sourceMappingURL=sw.js.map
