import ReactDOM from "react-dom/client";
import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider } from "antd";
import { ContentScriptContext } from "wxt/utils/content-script-context";
import App from "@/App";

const CONTAINER_ID = "WXT-CONTAINER";

const initVisualEditor = async (ctx: ContentScriptContext) => {
  const ui = await createShadowRootUi(ctx, {
    name: "wxt-content",
    position: "inline",
    anchor: "body",
    onMount: (container, shadowRoot, shadowHost) => {
      const wrapper = document.createElement("div");
      container.append(wrapper);
      const root = ReactDOM.createRoot(wrapper);
      root.render(
        <StyleProvider container={shadowRoot}>
          <ConfigProvider getPopupContainer={() => shadowRoot as any}>
            <App />
          </ConfigProvider>
        </StyleProvider>
      );
      shadowHost.id = CONTAINER_ID;
      return { root, wrapper };
    },
    onRemove: (elements) => {
      elements?.root.unmount();
      elements?.wrapper.remove();
    },
  });
  ui.mount();
  return ui;
};

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",
  async main(ctx) {
    let ui: null | globalThis.ShadowRootContentScriptUi<{
      root: ReactDOM.Root;
      wrapper: HTMLDivElement;
    }> = null;
    try {
      ui = await initVisualEditor(ctx);
    } catch (e) {
      console.log(e);
    }

    browser.runtime.onMessage.addListener(async (event) => {
      if (event.action === "TOGGLE") {
        if (!ui) {
          ui = await initVisualEditor(ctx);
        } else {
          ui.remove();
          ui = null;
        }
      }
    });
  },
});
