import * as docx from 'docx-preview';
import Editor, { type IEditorConfig } from './editor';
// html2pdf 是三方开源库：https://github.com/eKoopmans/html2pdf.js，
// 这里拉到本地是为了修复其中的 bug (canvas 绘制时宽度取小了，在只有一页 word 的时候，会出现导出 pdf 时多一页空白的情况)
// @ts-ignore 忽视 html2pdf 的类型报错
import html2pdf from './html2pdf';

const getContainer = (source: HTMLElement | string) => {
  const dom = typeof source === 'string' ? (document.querySelector(source) as HTMLElement) : source;
  if (dom instanceof HTMLElement) {
    return dom;
  }

  throw new Error("container source doesn't exist,please check dom has loaded");
};

export interface IExportToPDFConfig {
  margin?: number | [number, number] | [number, number, number, number];
  filename?: string;
  pagebreak?: any;
  image?: Record<string, any>;
  enableLinks?: boolean;
  html2canvas?: Record<string, any>;
  jsPDF?: Record<string, any>;
}

export default class FileSdk {
  static createEditor(source: HTMLElement | string, editorConfig?: IEditorConfig): Promise<Editor> {
    const container = getContainer(source);
    return Editor.init(container, editorConfig);
  }

  static docxPreview(
    data: Blob | ArrayBuffer | Uint8Array,
    source: HTMLElement | string,
    config?: Partial<docx.Options>,
  ): Promise<string> {
    const container = getContainer(source);
    return new Promise((resolve, reject) => {
      docx
        .renderAsync(data, container, undefined, {
          inWrapper: false,
          breakPages: true,
          ignoreLastRenderedPageBreak: true,
          // @ts-ignore 原来的类型漏掉了 useBase64URL
          useBase64URL: true,
          ...config,
        })
        .then(() => {
          setTimeout(() => resolve(container.innerHTML), 500);
        }, reject);
    });
  }

  static htmlPreview(source: HTMLElement | string, data: string) {
    const container = getContainer(source);
    container.innerHTML = data;
  }

  static htmlToPDF(source: HTMLElement | string, fileName = 'export-pdf', config?: IExportToPDFConfig) {
    html2pdf()
      .set({
        pagebreak: { mode: 'avoid-all' },
        filename: `${fileName}.pdf`,
        html2canvas: {
          imageTimeout: 15000,
          logging: true,
          useCORS: true,
          scale: 2,
        },
        ...config,
      })
      .from(source)
      .save();
  }
}
