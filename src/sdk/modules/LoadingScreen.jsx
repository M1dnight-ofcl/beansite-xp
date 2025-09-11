import tips from "../../assets/tips";
import { useEffect, useState } from "react";
const LoadingScreen=()=>{
    const shuffle = (array) => { 
        for (let i=array.length-1;i>0;i--) { 
          const j=Math.floor(Math.random()*(i + 1)); 
          [array[i],array[j]]=[array[j],array[i]]; 
        } return array; 
    };
    const shuffledTips=shuffle(shuffle(tips));
    let i=0;
    const[tip,setTip]=useState(shuffledTips[i]);
    const tipsInterval=setInterval(()=>{
        i++;setTip(shuffledTips[i]);},5000);
    useEffect(() => {
        const onPageLoad=()=>{
            if(document.getElementById("loading")){
                setTimeout(()=>{clearInterval(tipsInterval);},1000);
                document.getElementById("loading").classList.add("fadeout");
                setTimeout(()=>{document.getElementById("loading").style.display="none";},1000);
            }
            if(confirm("There is new version of beansite. Would you like to switch?")){
                window.location.href="https://mb7.vercel.app";
            }
        };
        if(document.readyState === 'complete'){onPageLoad();}else{
            window.addEventListener('load', onPageLoad, false);
            return () => window.removeEventListener('load', onPageLoad);
        }
    },[]);
    return(<div id="loading">
        <div id="loadingIcon"></div>
        <div id="loadingBar">
            <div id="loadingIcons">█ █ █ █ █ █</div>
        </div>
        <p id="loadingTips">{tip}</p>
    </div>);
}
export default LoadingScreen;