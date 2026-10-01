import type { RenderOptions } from 'takumi-pdf/no-init';
import type { VNode } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { render } from 'takumi-pdf/no-init';
import { createSSRApp } from 'vue';

const documentCss = 'html,body{margin:0;padding:0}h1,h2,h3,h4,h5,h6,p{margin:0}';

export async function serializeTakumi(document: VNode): Promise<string> {
  const app = createSSRApp({ render: () => document });
  const html = (await renderToString(app)).replace(/<!--(?:\[|\]|)-->/g, '');
  return `<style>${documentCss}</style>${html}`;
}

export async function renderTakumi(document: VNode, options?: RenderOptions): Promise<Uint8Array> {
  return render(await serializeTakumi(document), options);
}
