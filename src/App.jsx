import { useState } from 'react';
import { BeansiteXP, Window } from './sdk/sdk';
import "./stylesheets/style/App.css";
const App=()=>{
  return(<>
    <BeansiteXP>
      <Window 
      size={{
        "height": "38vmin",
        "width": "58vmin"}} 
      pos={{
        "x":"calc(50% - (58vmin / 2))",
        "y":"calc(50% - (38vmin / 2) - 48px)",}}
      includeTitlebarOptions={{
        "min": true,
        "max": true,
        "close": true,
      }}
      callbacks={{
        beforeWindowClose:()=>{
          console.log("closing window");},
        beforeWindowMinimize:()=>{
          console.log("minmizing window");},
        beforeWindowMaximize:()=>{
          console.log("maximizing window");},
        beforeWindowUnmaximize:()=>{
          console.log("unmaximizing window");},
      }}
      id="testwin"
      title="Test Window"
      icon="/icons/xp/Command Prompt.png">
          <h1>Hello World!</h1>
          <button id="button">Press Me!</button>
      </Window>
    </BeansiteXP>
  </>)
}
export default App;