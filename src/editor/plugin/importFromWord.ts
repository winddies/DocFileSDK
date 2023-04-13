// @ts-nocheck
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileDialogButtonView from '@ckeditor/ckeditor5-upload/src/ui/filedialogbuttonview';
import * as docx from 'docx-preview';
import word from './icons/importword.svg';

export class ImportFromWord extends Plugin {
  init() {
    this.editor.ui.componentFactory.add('importFromWord', () => {
      const view = new FileDialogButtonView();

      view.set({
        acceptedType: 'docx',
        allowMultipleFiles: false,
      });

      view.buttonView.set({
        label: 'import word',
        icon: word,
        tooltip: true,
      });

      view.on('done', (evt, files) => {
        const file = files[0];
        const container = document.createElement('div');
        docx
          .renderAsync(file, container, undefined, {
            inWrapper: false,
            breakPages: true,
            ignoreLastRenderedPageBreak: true,
            // @ts-ignore 原来的类型漏掉了 useBase64URL
            useBase64URL: true,
          })
          .then(() => {
            setTimeout(() => {
              const html = container.innerHTML;
              this.editor.setData(html);
            }, 500);
          });
      });

      return view;

      // const button = new ButtonView();
      // button.set({
      //   label: '从 word 导入',
      //   isToggleable: true,
      //   tooltip: true,
      // });

      // button.on('execute', () => {
      //   this.editor.model.change((writer) => {
      //     this.editor.model.insertContent(writer.createText());
      //   });
      // });

      // return button;
    });
  }
}
