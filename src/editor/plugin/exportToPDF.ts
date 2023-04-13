import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
// @ts-ignore
import html2pdf from '../../html2pdf';
import pdf from './icons/exportpdf.svg';

export class ExportToPDF extends Plugin {
  init() {
    this.editor.ui.componentFactory.add('exportToPDF', () => {
      const button = new ButtonView();
      button.set({
        label: '导出 PDF',
        icon: pdf,
        isToggleable: true,
        tooltip: true,
      });

      button.on('execute', () => {
        const data = (this.editor as any).getData();
        html2pdf()
          .set({
            filename: `export-file.pdf`,
            html2canvas: {
              imageTimeout: 15000,
              logging: true,
              useCORS: true,
              scale: 2,
            },
          })
          .from(data)
          .save();
      });

      return button;
    });
  }
}
