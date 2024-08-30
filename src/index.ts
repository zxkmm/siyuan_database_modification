import {
    Plugin
} from "siyuan";
import "@/index.scss";

export default class PluginSample extends Plugin {


    applyStyles(css) {
        // console.log("applyStyles");
        // console.log(css);
        const head = document.head || document.getElementsByTagName("head")[0];
        const style = document.createElement("style");
        head.appendChild(style);
        style.appendChild(document.createTextNode(css));
      }


    applyPen(){
        const css = `.av__cell:has(.av__celltext.av__celltext--url)::before {
            content: '';
            display: inline-block;
            width: 16px;
            height: 16px;
            background-color: var(--b3-theme-on-surface);
            mask-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>');
            mask-size: contain;
            mask-position: center;
            mask-repeat: no-repeat;
            margin-right: 4px;
            vertical-align: middle;
        }`;


        this.applyStyles(css);
        }

        onLayoutReady() {
            this.applyPen();
        }


    }