import { createContext } from "react";
import React from 'react'
import run from "../config/gemini";

export const Context = createContext();



const ContextProvider = (props) => {

     const [input, setInput] = React.useState("")
     const [recentPrompt, setRecentPrompt] = React.useState("")
     const [prevPrompts, setPrevPrompts] = React.useState([])
     const [showResult, setShowResult] = React.useState(false)
     const [loading, setLoading] = React.useState(false)
     const [resultData, setResultData] = React.useState("")



    const delayPara = (index,nextWord) => {
        setTimeout(function () {
            setResultData(prev=>prev+nextWord);
        },95*index)

    }

    const onSent = async (prompt) => {
        setResultData("")
        setLoading(true)
        setShowResult(true)
        setRecentPrompt(input)
        setPrevPrompts(prev=>[...prev,input])
        const response = await run(input)
        let responseArray = response.split("**");
        let newResponse;
        for( let i=0; i < responseArray.length; i++){
            if(i === 0 || i%2 !== 1){
                newResponse += responseArray[i];
            } else {
                newResponse += "<b>" + responseArray[i] + "</b>  "
            }
        }

        let newResponse2 = newResponse.split("*").join("</br>")
        
        let newResponseArray = newResponse2.split(" ");
        for(let i=0; i < newResponseArray.length; i++){
            const nextWord = newResponseArray[i]
            delayPara(i,nextWord+ " ")
        }
        setLoading(false)
        setInput("")

    }

    const contextValue = { 
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput

    }
    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;