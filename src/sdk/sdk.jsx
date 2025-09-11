import { Component, createRef, useState, createContext, useEffect, useRef } from "react";
// import { createSlice, configureStore } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import store from './store/store';
import { setUsername } from "./store/userdataslice";
import { Window, WinUtils } from "./modules/Window";
import { generateId, timeout } from "./modules/lib";
// import bsod from "./modules/BSoD";
import { Provider } from 'react-redux';
import "./stylesheets/style/core.css";
import { Taskbar, TaskbarIcon, StartMenu } from "./modules/Explorer";
// import NotificationSystem, { Notification } from "./modules/Notification";
// import { createNotification } from "./store/notificationslice";
import html2canvas from "html2canvas";
import { Explorer } from "./modules/Explorer"
import BeanShell from './modules/BeanShell';
import Settings from './modules/Settings';
import ClosedBetaLogin from "./modules/closedBetaLogin";
import BeanXPRouter from "./router";
import { Menu, Item, Separator, Submenu, useContextMenu } from 'react-contexify';
import 'react-contexify/ReactContexify.css';
import { toast, ToastContainer, Slide } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { CreateNotification } from './modules/Notification';
import { DesktopIcon } from "./modules/desktopIcon";

const BeansiteXP=({ 
  startMenuShortcuts=[],
  desktopShortcuts=[],
  children, 
  config={
    "debugMode": location.hostname=="localhost"?true:false,
    "closedBeta": true,
    "beansitePlugins":[], // for future feature
  }
})=>{
  const windows=useSelector((state)=>state.windows.value);
  const userdata=useSelector((state)=>state.userdata);
  const tbi=useSelector((state)=>state.tbi.value);
  const dispatch=useDispatch();

  // content menu stuff
  const MENU_ID='mbxp_contextmenu';
  const{show}=useContextMenu({
    id: MENU_ID,
  });
  const[contextMenuProps,setContextMenuProps]=useState({
    element:document,
    elementType:document.tagName
  });
  async function paste(input) {
    const text=await navigator.clipboard.readText();
    input.value=`${input.value}${text}`;
  }
  const handleContextMenu=(event)=>{
    show({
      event,
      props: {
        element:event.target,
        elementType:event.target.tagName
      }
    });
  }
  const handleItemClick=({id,event,props})=>{
    if(config.debugMode)console.log(event,props);
    setContextMenuProps(props);
    switch(id.slice(8)){
      case "refresh":location.reload();break;
      case "copy":document.execCommand('copy');break;
      case "cut":document.execCommand('cut');break;
      case "paste":
        if(props.elementType=="TEXTAREA"||(props.elementType=="INPUT"&&props.element.type=="text"))paste(props.element);break;
      default:
        if(config.debugMode)console.log(`[SDK] context menu item "${id}" has no action`);
    }
  }

  useEffect(()=>{
    dispatch(setUsername("Guest"));
    if(globalThis.IN_DESKTOP_ENV){
      console.log("running on desktop env");
    }
    if(config.debugMode&&location.hostname=="localhost"){
      console.log("[SDK] Debug mode is enabled by default in localhost");
    }
    window.addEventListener("keydown",(e)=>{
      if(e.repeat)return;
      /*// if (e.ctrlKey && e.key === 's') {
        // e.preventDefault();
        // html2canvas(document.body,{
          // backgroundColor:null}).then(canvas=>{
          // // document.body.appendChild(canvas);
          // var image=canvas.toDataURL("image/png").replace("image/png","image/octet-stream");
          // var link=document.createElement('a');
          // var currentDate=new Date();
          // link.setAttribute('download',`screenshot-${currentDate.getMonth()+1}-${currentDate.getDate()}-${currentDate.getFullYear()}.png`);
          // link.setAttribute('href',image);
          // link.click();
        // });
      // }*/
    })
  },[]);
  return (<>
    {config.closedBeta&&!config.debugMode?<ClosedBetaLogin/>:null}
    <div id="bxpgui" onContextMenu={handleContextMenu}>
      <div id="hueFilter" className="screen_filter"></div>
      <div id="blurFilter" className="screen_filter"></div>
      <div id="brightnessFilter" className="screen_filter"></div>
      <div id="contrastFilter" className="screen_filter"></div>
      <div id="saturateFilter" className="screen_filter"></div>
      <div id="invertFilter" className="screen_filter"></div>
      <div id="lsdFilter1" className="screen_filter"></div>
      <div id="lsdFilter2" className="screen_filter"></div>
      <div id="lsdFilter3" className="screen_filter"></div>
      <Menu id={MENU_ID}>
        <Item id="mbxpccm_refresh" onClick={handleItemClick}>Refresh</Item>
        <Separator />
        <Item id="mbxpccm_cut" onClick={handleItemClick}>Cut</Item>
        <Item id="mbxpccm_copy" onClick={handleItemClick}>Copy</Item>
        <Item id="mbxpccm_paste" onClick={handleItemClick}>Paste</Item>
        <Separator />
        <Item id="mbxpccm_del" onClick={handleItemClick}>Delete</Item>
        <Item id="mbxpccm_rename" onClick={handleItemClick}>Rename</Item>
      </Menu>
      <div id="desktopIconWrapper">
        {desktopShortcuts.map((data,index)=>
          <DesktopIcon 
            key={`di_${data.win_id}`}
            win_id={data.win_id}
            title={data.title}
            icon={data.icon}/>)}
        {/* \{\/\* Test \*\/\} <DesktopIcon win_id="welcome" title="Dingus" icon="/icons/xp/Information.png" /> */}
      </div>
      <div id="winWrapper">
        {children}
        <Explorer />
        <BeanShell />
        <Settings />
        <Window 
          size={{
            "height": "38vmin",
            "width": "58vmin"}} 
          pos={{
            "x":["left","30vmin"],
            "y":["top","30vmin"],}}
          includeTitlebarOptions={{
            "min": true,
            "max": true,
            "close": true,}}
          id="paint"
          title="Paint"
          icon="/icons/xp/Paint.png"
          closed>
            <iframe src="https://jspaint.app/"  />
        </Window>
      {config.debugMode?<>
        <Window
          size={{
            "height": "38vmin",
            "width": "58vmin"}} 
          pos={{
            "x":["left","5vmin"],
            "y":["top","calc(100% - (5vmin + 48px + 38vmin))"],}}
          includeTitlebarOptions={{
            "min": true,
            "max": true,
            "close": true,}}
          id="debugMenu"
          title="Debug Menu"
          icon="/icons/xp/Services.png"
          closed
          markdownSource={`# Debug Menu
---
this menu contains debug options to test beansites functionality

---
### All Debug Tools:`}>
            <button 
              className='button1'
              onClick={()=>{
                //! old notification script
                /* dispatch(createNotification({
                  "title": generateId(5),
                  "id": generateId(10),})); */
                CreateNotification("Test Notification")
              }}>createNotification</button>
        </Window>
      </>:null}
      </div>
      <div id="maximizePreview"></div>
      <StartMenu shortcuts={startMenuShortcuts} />
      {/* <NotificationSystem /> */}
      <ToastContainer />
      <Taskbar>
        {Object.keys(tbi).map((win_id)=>
          <TaskbarIcon 
            key={`tbi_${win_id}`} 
            title={tbi[win_id].title} 
            id={`${win_id}_tbs`} 
            eid={tbi[win_id].eid} 
            icon={tbi[win_id].icon} />)}
      </Taskbar>
    </div>
  </>);
}
export { CreateNotification } from './modules/Notification';
export { generateId, timeout } from "./modules/lib";
export { Window, WinUtils, waitForElm } from "./modules/Window";
export { 
  InitializeGoogleAnalytics,
  TrackGoogleAnalyticsEvent, 
} from "./modules/Analytics";
export { BeanXPRouter };
export default BeansiteXP;