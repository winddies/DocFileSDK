import logo from './logo.svg';
import './App.css';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';

import GeneralHtmlSupport from '@ckeditor/ckeditor5-html-support/src/generalhtmlsupport';
import { convertToHtml } from 'mammoth/mammoth.browser';
// import docx2html from 'docx2html';
import { useEffect, useRef, useState } from 'react';
import * as docx from 'docx-preview';
import { template } from './template';

function transformElement(element) {
  console.log(element);
  // if (element.children) {
  //   var children = element.children.map(transformElement);
  //   element = { ...element, children: children };
  // }
  // if (element.type === 'paragraph') {
  //   if (element.inden)
  //   element = transformParagraph(element);
  // }

  // if (element.type === 'text' && !element.value.trim()) {
  //   element.value = element.value.replace(/( )/g, '\xa0');
  // }
  // return element;
}

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
  const [currentData, setCurrentData] = useState('');
  const editor = useRef(null);

  useEffect(() => {
    ClassicEditor.create(document.querySelector('#editor'), {
      plugins: [Essentials, Paragraph, Bold, Italic, GeneralHtmlSupport],
      toolbar: ['bold', 'italic'],
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

  // const convert = (arrayBuffer) => {
  //   convertToHtml({ arrayBuffer }, options).then((result) => {
  //     const html = result.value;
  //     console.log('template(html)', template(html));
  //     editor.current.setData(template(html));
  //     console.log('html#####', html);
  //   });
  // };

  const handleFileChange = (info) => {
    const { originFileObj } = info.file;

    docx.renderAsync(originFileObj, document.querySelector('#preview'), null, { inWrapper: false });
    // window.docx2html(originFileObj, document.querySelector('#editor'));
    // readFileInputEventAsArrayBuffer(originFileObj, convert);
  };

  const handleEdit = () => {
    const innerHTML = document.querySelector('#preview').innerHTML;

    document.querySelector('#preview').style = 'display: none';
    editor.current.setData(innerHTML);
  };

  const preview = () => {
    document.querySelector('#editor').style = 'display: none';
    document.querySelector('#preview').style = 'display: normal';
    const html = editor.current.getData();
    document.querySelector('#preview').innerHTML = html;
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
            <Button onClick={preview}>预览</Button>
            <Button onClick={handleEdit}>编辑</Button>

            <Button>导出为 PDF</Button>
          </div>
          <div id="preview"></div>
          <div id="editor"></div>
        </div>
      </div>
    </div>
  );
}

export default App;
