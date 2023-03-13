import logo from './logo.svg';
import './App.css';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';

import GeneralHtmlSupport from '@ckeditor/ckeditor5-html-support/src/generalhtmlsupport';
import { convertToHtml } from 'mammoth/mammoth.browser';
// import docx2html from 'docx2html';
import { useEffect, useRef } from 'react';
import { template } from './template';

// function transformElement(element) {
//   console.log(element);
//   if (element.children) {
//     var children = element.children.map(transformElement);
//     element = { ...element, children: children };
//   }
//   if (element.type === 'paragraph') {
//     element = transformParagraph(element);
//   }
//   return element;
// }

// function transformParagraph(element) {
//   if (element.alignment === 'center' && !element.styleId) {
//     return { ...element, styleName: 'center' };
//   } else {
//     return element;
//   }
// }

// var options = {
//   styleMap: ['u => u', "p[style-name='center'] => p.center"],
//   transformDocument: transformElement,
// };

export function readFileInputEventAsArrayBuffer(file, callback) {
  const reader = new FileReader();

  reader.onload = function (loadEvent) {
    const arrayBuffer = loadEvent.target['result'];
    callback(arrayBuffer);
  };

  reader.readAsArrayBuffer(file);
}

function App() {
  const editor = useRef(null);

  useEffect(() => {
    ClassicEditor.create(document.querySelector('#editor'), {
      plugins: [Essentials, Paragraph, GeneralHtmlSupport],
      htmlSupport: {
        allow: [
          {
            name: /.*/,
            attributes: true,
            classes: true,
            styles: true,
          },
        ],
      },
    })
      .then((value) => {
        editor.current = value;
        console.log('value##', value);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const convert = (arrayBuffer) => {
    convertToHtml({ arrayBuffer }, options).then((result) => {
      const html = result.value;
      editor.current.setData(template(html));
    });
  };

  const handleFileChange = (info) => {
    const { originFileObj } = info.file;
    // window.docx2html(originFileObj, document.querySelector('#editor'));
    readFileInputEventAsArrayBuffer(originFileObj, convert);
  };

  return (
    <div className="App">
      <div className="box">
        <div className="child1">
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        <div className="child2">
          <div className="controllerBtn">
            <Upload onChange={handleFileChange}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            <Button>预览</Button>
            <Button>导出为 PDF</Button>
          </div>
          <div id="editor"></div>
        </div>
      </div>
    </div>
  );
}

export default App;
