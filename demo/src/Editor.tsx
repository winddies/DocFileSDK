// @ts-nocheck
import FileSdk from 'wind-file-sdk';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

// export class ABIFileSdk {
//   handle(editorContainer: HTMLElement | string) {
//     console.log(editorContainer);
//   }
// }

export default forwardRef(function Editor({ showEditor, data }, dataRef) {
  const editor = useRef(null);

  useImperativeHandle(dataRef, () => ({
    getData: () => editor.current.getData(),
    setData: (data) => editor.current?.setData(data),
  }));

  useEffect(() => {
    if (editor.current) return;
    FileSdk.createEditor(document.querySelector('#editor'), {
      // hideToolbarItems: ['importFromWord', 'exportToPDF'],
      // placeholderConfig: { type: 'select', options: ['value1', 'value2']},
      height: 800,
    })
      .then((value) => {
        editor.current = value;
        window.editor = value;
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (data) {
      editor.current?.setData(data);
    }
  }, [data]);

  useEffect(() => {
    const shouldShow = showEditor;
    setTimeout(() => {
      const element = document.getElementsByClassName('ck-editor');
      if (element) {
        element[0].style.display = shouldShow ? 'block' : 'none';
      }
    }, 0);
  }, [showEditor]);

  return <div id="editor"></div>;
});
