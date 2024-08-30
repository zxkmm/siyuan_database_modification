import {
    Plugin,
    showMessage,
    confirm,
    Dialog,
    Menu,
    openTab,
    adaptHotkey,
    getFrontend,
    getBackend,
    IModel,
    Protyle,
    openWindow,
    IOperation,
    Constants,
    openMobileFileById,
    lockScreen,
    ICard,
    ICardData
} from "siyuan";
import "@/index.scss";

import HelloExample from "@/hello.svelte";
import SettingExample from "@/setting-example.svelte";

import { SettingUtils } from "./libs/setting-utils";
import { svelteDialog } from "./libs/dialog";

const STORAGE_NAME = "menu-config";
const TAB_TYPE = "custom_tab";
const DOCK_TYPE = "dock_tab";

// enum ProtyleTypeContainsElemCssName {
//     /**
//      * core selector : .av__cell:has(.av__celltext.THISENUM)
//      */

//     // PRIMARYKEY = "av__celltext", //cant select from frontend
//     TEXT = "av__celltext",
//     // NUMBER = "av__celltext", //cant select from frontend
//     SELECT = "b3-chip", 
//     // MULTISELECT = "b3-chip", // got same css class with SELECT, use SELECT
//     DATE = "av__celltext", // cant select from css class, use data-type and regex in the future
//     ASSETS = "b3-chip av__celltext--url ariaLabel",
//     CKECKBOX = "av__cell av__cell-uncheck av__cell--select av__cell--active",
//     LINK = "av__celltext--url",
//     EMAIL = "av__celltext--url", // cant select from css class, use data-type and regex in the future
//     PHONE = "TODO",
//     TEMPLATE = "TODO", //模板
//     // RELATION = "av__celltext", //cant select from frontend
//     ROLLUP = "TODO",
//     LINENUMBER = "TODO",
//     CREATETIME = "TODO",
//     UPDATETIME = "TODO",
//     FALLBACK = "av__celltext",
// }

// enum ProtyleTypeContainsElemSDataType{

//      /**
//      * core selector : .av__cell[data-dtype="THISENUM"]
//      */

//     PRIMARYKEY = "block-more", 
//     TEXT = "av__celltext",
//     NUMBER = "av__celltext", 
//     SELECT = "b3-chip", 
//     MULTISELECT = "b3-chip",
//     DATE = "av__celltext", 
//     ASSETS = "b3-chip av__celltext--url ariaLabel",
//     CKECKBOX = "av__cell av__cell-uncheck av__cell--select av__cell--active",
//     LINK = "av__celltext--url",
//     EMAIL = "av__celltext--url", 
//     PHONE = "TODO",
//     TEMPLATE = "TODO", 
//     RELATION = "av__celltext", 
//     ROLLUP = "TODO",
//     LINENUMBER = "TODO",
//     CREATETIME = "TODO",
//     UPDATETIME = "TODO",
//     FALLBACK = "av__celltext",
// }

// enum SelectorBuiderMap{
//     PRIMARYKEY = 2,
//     TEXT = 1,
//     NUMBER = "TODO",
//     SELECT = 1,
//     MULTISELECT = 1,
//     DATE = 2, //also regex
//     ASSETS = 1,
//     CKECKBOX = 1,
//     LINK = 1,
//     EMAIL = 1,
//     PHONE = 2,
//     TEMPLATE = "TODO",
//     RELATION = "TODO",
//     ROLLUP = "TODO",
//     LINENUMBER = "TODO",
//     CREATETIME = "TODO",
//     UPDATETIME = "TODO",
//     FALLBACK = "TODO",
// }

export default class PluginSample extends Plugin {

    customTab: () => IModel;
    private isMobile: boolean;
    private blockIconEventBindThis = this.blockIconEvent.bind(this);
    private settingUtils: SettingUtils;

    applyStyles(css) {
        // console.log("applyStyles");
        // console.log(css);
        const head = document.head || document.getElementsByTagName("head")[0];
        const style = document.createElement("style");
        head.appendChild(style);
        style.appendChild(document.createTextNode(css));
      }


    // generateCss(){
    //     const addPenCssTemplate = `

    //     `
    // }

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

    async onload() {
        this.data[STORAGE_NAME] = { readonlyText: "Readonly" };

        console.log("loading plugin-sample", this.i18n);

        const frontEnd = getFrontend();
        this.isMobile = frontEnd === "mobile" || frontEnd === "browser-mobile";
        // 图标的制作参见帮助文档
        this.addIcons(`<symbol id="iconPen" viewBox="0 0 32 32">
<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
</symbol>
`);



        const statusIconTemp = document.createElement("template");
        statusIconTemp.innerHTML = `<div class="toolbar__item ariaLabel" aria-label="Remove plugin-sample Data">
    <svg>
        <use xlink:href="#iconTrashcan"></use>
    </svg>
</div>`;
        statusIconTemp.content.firstElementChild.addEventListener("click", () => {
            confirm("⚠️", this.i18n.confirmRemove.replace("${name}", this.name), () => {
                this.removeData(STORAGE_NAME).then(() => {
                    this.data[STORAGE_NAME] = { readonlyText: "Readonly" };
                    showMessage(`[${this.name}]: ${this.i18n.removedData}`);
                });
            });
        });
        this.addStatusBar({
            element: statusIconTemp.content.firstElementChild as HTMLElement,
        });

        this.addCommand({
            langKey: "showDialog",
            hotkey: "⇧⌘O",
            callback: () => {
                this.showDialog();
            },
            fileTreeCallback: (file: any) => {
                console.log(file, "fileTreeCallback");
            },
            editorCallback: (protyle: any) => {
                console.log(protyle, "editorCallback");
            },
            dockCallback: (element: HTMLElement) => {
                console.log(element, "dockCallback");
            },
        });
        this.addCommand({
            langKey: "getTab",
            hotkey: "⇧⌘M",
            globalCallback: () => {
                console.log(this.getOpenedTab());
            },
        });

        this.addDock({
            config: {
                position: "LeftBottom",
                size: { width: 200, height: 0 },
                icon: "iconSaving",
                title: "Custom Dock",
                hotkey: "⌥⌘W",
            },
            data: {
                text: "This is my custom dock"
            },
            type: DOCK_TYPE,
            resize() {
                console.log(DOCK_TYPE + " resize");
            },
            update() {
                console.log(DOCK_TYPE + " update");
            },
            init: (dock) => {
                if (this.isMobile) {
                    dock.element.innerHTML = `<div class="toolbar toolbar--border toolbar--dark">
                    <svg class="toolbar__icon"><use xlink:href="#iconEmoji"></use></svg>
                        <div class="toolbar__text">Custom Dock</div>
                    </div>
                    <div class="fn__flex-1 plugin-sample__custom-dock">
                        ${dock.data.text}
                    </div>
                    </div>`;
                } else {
                    dock.element.innerHTML = `<div class="fn__flex-1 fn__flex-column">
                    <div class="block__icons">
                        <div class="block__logo">
                            <svg class="block__logoicon"><use xlink:href="#iconEmoji"></use></svg>
                            Custom Dock
                        </div>
                        <span class="fn__flex-1 fn__space"></span>
                        <span data-type="min" class="block__icon b3-tooltips b3-tooltips__sw" aria-label="Min ${adaptHotkey("⌘W")}"><svg class="block__logoicon"><use xlink:href="#iconMin"></use></svg></span>
                    </div>
                    <div class="fn__flex-1 plugin-sample__custom-dock">
                        ${dock.data.text}
                    </div>
                    </div>`;
                }
            },
            destroy() {
                console.log("destroy dock:", DOCK_TYPE);
            }
        });

        this.settingUtils = new SettingUtils({
            plugin: this, name: STORAGE_NAME
        });
        this.settingUtils.addItem({
            key: "Input",
            value: "",
            type: "textinput",
            title: "Readonly text",
            description: "Input description",
            action: {
                // Called when focus is lost and content changes
                callback: () => {
                    // Return data and save it in real time
                    let value = this.settingUtils.takeAndSave("Input");
                    console.log(value);
                }
            }
        });
        this.settingUtils.addItem({
            key: "InputArea",
            value: "",
            type: "textarea",
            title: "Readonly text",
            description: "Input description",
            // Called when focus is lost and content changes
            action: {
                callback: () => {
                    // Read data in real time
                    let value = this.settingUtils.take("InputArea");
                    console.log(value);
                }
            }
        });
        this.settingUtils.addItem({
            key: "Check",
            value: true,
            type: "checkbox",
            title: "Checkbox text",
            description: "Check description",
            action: {
                callback: () => {
                    // Return data and save it in real time
                    let value = !this.settingUtils.get("Check");
                    this.settingUtils.set("Check", value);
                    console.log(value);
                }
            }
        });
        this.settingUtils.addItem({
            key: "Select",
            value: 1,
            type: "select",
            title: "Select",
            description: "Select description",
            options: {
                1: "Option 1",
                2: "Option 2"
            },
            action: {
                callback: () => {
                    // Read data in real time
                    let value = this.settingUtils.take("Select");
                    console.log(value);
                }
            }
        });
        this.settingUtils.addItem({
            key: "Slider",
            value: 50,
            type: "slider",
            title: "Slider text",
            description: "Slider description",
            direction: "column",
            slider: {
                min: 0,
                max: 100,
                step: 1,
            },
            action:{
                callback: () => {
                    // Read data in real time
                    let value = this.settingUtils.take("Slider");
                    console.log(value);
                }
            }
        });
        this.settingUtils.addItem({
            key: "Btn",
            value: "",
            type: "button",
            title: "Button",
            description: "Button description",
            button: {
                label: "Button",
                callback: () => {
                    showMessage("Button clicked");
                }
            }
        });
        this.settingUtils.addItem({
            key: "Custom Element",
            value: "",
            type: "custom",
            direction: "row",
            title: "Custom Element",
            description: "Custom Element description",
            //Any custom element must offer the following methods
            createElement: (currentVal: any) => {
                let div = document.createElement('div');
                div.style.border = "1px solid var(--b3-theme-primary)";
                div.contentEditable = "true";
                div.textContent = currentVal;
                return div;
            },
            getEleVal: (ele: HTMLElement) => {
                return ele.textContent;
            },
            setEleVal: (ele: HTMLElement, val: any) => {
                ele.textContent = val;
            }
        });
        this.settingUtils.addItem({
            key: "Hint",
            value: "",
            type: "hint",
            title: this.i18n.hintTitle,
            description: this.i18n.hintDesc,
        });

        try {
            this.settingUtils.load();
        } catch (error) {
            console.error("Error loading settings storage, probably empty config json:", error);
        }


        this.protyleSlash = [{
            filter: ["insert emoji 😊", "插入表情 😊", "crbqwx"],
            html: `<div class="b3-list-item__first"><span class="b3-list-item__text">${this.i18n.insertEmoji}</span><span class="b3-list-item__meta">😊</span></div>`,
            id: "insertEmoji",
            callback(protyle: Protyle) {
                protyle.insert("😊");
            }
        }];

        this.protyleOptions = {
            toolbar: ["block-ref",
                "a",
                "|",
                "text",
                "strong",
                "em",
                "u",
                "s",
                "mark",
                "sup",
                "sub",
                "clear",
                "|",
                "code",
                "kbd",
                "tag",
                "inline-math",
                "inline-memo",
                "|",
                {
                    name: "insert-smail-emoji",
                    icon: "iconEmoji",
                    hotkey: "⇧⌘I",
                    tipPosition: "n",
                    tip: this.i18n.insertEmoji,
                    click(protyle: Protyle) {
                        protyle.insert("😊");
                    }
                }],
        };

        console.log(this.i18n.helloPlugin);
    }

    onLayoutReady() {

        this.applyPen();
        // this.loadData(STORAGE_NAME);
        this.settingUtils.load();
        console.log(`frontend: ${getFrontend()}; backend: ${getBackend()}`);

        console.log(
            "Official settings value calling example:\n" +
            this.settingUtils.get("InputArea") + "\n" +
            this.settingUtils.get("Slider") + "\n" +
            this.settingUtils.get("Select") + "\n"
        );

        let tabDiv = document.createElement("div");
        new HelloExample({
            target: tabDiv,
            props: {
                app: this.app,
            }
        });
        this.customTab = this.addTab({
            type: TAB_TYPE,
            init() {
                this.element.appendChild(tabDiv);
                console.log(this.element);
            },
            beforeDestroy() {
                console.log("before destroy tab:", TAB_TYPE);
            },
            destroy() {
                console.log("destroy tab:", TAB_TYPE);
            }
        });
    }

    async onunload() {
        console.log(this.i18n.byePlugin);
        showMessage("Goodbye SiYuan Plugin");
        console.log("onunload");
    }

    uninstall() {
        console.log("uninstall");
    }

    async updateCards(options: ICardData) {
        options.cards.sort((a: ICard, b: ICard) => {
            if (a.blockID < b.blockID) {
                return -1;
            }
            if (a.blockID > b.blockID) {
                return 1;
            }
            return 0;
        });
        return options;
    }

    /**
     * A custom setting pannel provided by svelte
     */
    openDIYSetting(): void {
        let dialog = new Dialog({
            title: "SettingPannel",
            content: `<div id="SettingPanel" style="height: 100%;"></div>`,
            width: "800px",
            destroyCallback: (options) => {
                console.log("destroyCallback", options);
                //You'd better destroy the component when the dialog is closed
                pannel.$destroy();
            }
        });
        let pannel = new SettingExample({
            target: dialog.element.querySelector("#SettingPanel"),
        });
    }

    private eventBusPaste(event: any) {
        // 如果需异步处理请调用 preventDefault， 否则会进行默认处理
        event.preventDefault();
        // 如果使用了 preventDefault，必须调用 resolve，否则程序会卡死
        event.detail.resolve({
            textPlain: event.detail.textPlain.trim(),
        });
    }

    private eventBusLog({ detail }: any) {
        console.log(detail);
    }

    private blockIconEvent({ detail }: any) {
        detail.menu.addItem({
            iconHTML: "",
            label: this.i18n.removeSpace,
            click: () => {
                const doOperations: IOperation[] = [];
                detail.blockElements.forEach((item: HTMLElement) => {
                    const editElement = item.querySelector('[contenteditable="true"]');
                    if (editElement) {
                        editElement.textContent = editElement.textContent.replace(/ /g, "");
                        doOperations.push({
                            id: item.dataset.nodeId,
                            data: item.outerHTML,
                            action: "update"
                        });
                    }
                });
                detail.protyle.getInstance().transaction(doOperations);
            }
        });
    }

    private showDialog() {
        // let dialog = new Dialog({
        //     title: `SiYuan ${Constants.SIYUAN_VERSION}`,
        //     content: `<div id="helloPanel" class="b3-dialog__content"></div>`,
        //     width: this.isMobile ? "92vw" : "720px",
        //     destroyCallback() {
        //         // hello.$destroy();
        //     },
        // });
        // new HelloExample({
        //     target: dialog.element.querySelector("#helloPanel"),
        //     props: {
        //         app: this.app,
        //     }
        // });

    }


}
