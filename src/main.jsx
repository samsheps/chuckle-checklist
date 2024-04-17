import React from "react"
import ReactDOM from "react-dom/client"
import { App } from "./App.jsx"
import "./index.css"

const container = document.getElementById("root")
const root = ReactDOM.createRoot(container)
root.render(<App />) // here we are rendering the app component. taking all of the jsx we're returning from the app component and rendering it on the root.
// the space after "App " makes components more easily spottable