import logo from './logo.svg';
import './App.css';
import { Upload, Button, Alert } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import html2pdf from 'html2pdf.js';
// import docx2html from 'docx2html';
import { useEffect, useRef, useState } from 'react';
import * as docx from 'docx-preview';
// import { template } from './template';
import Editor from './Editor';

// function transformElement(element) {
//   console.log(element);
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

// export function readFileInputEventAsArrayBuffer(file, callback) {
//   const reader = new FileReader();

//   reader.onload = function (loadEvent) {
//     const arrayBuffer = loadEvent.target['result'];
//     callback(arrayBuffer);
//   };

//   reader.readAsArrayBuffer(file);
// }

function App() {
  const [initialData, setInitialData] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const EditorRef = useRef();

  // const convert = (arrayBuffer) => {
  //   convertToHtml({ arrayBuffer }, options).then((result) => {
  //     const html = result.value;
  //     console.log('template(html)', template(html));
  //     editor.current.setData(template(html));
  //     console.log('html#####', html);
  //   });
  // };

  const handleFileChange = async (info) => {
    const { originFileObj } = info.file;

    await docx.renderAsync(originFileObj, document.querySelector('#preview'), null, { inWrapper: false });
    const html = document.querySelector('#preview').innerHTML;
    setInitialData(html);
    // window.docx2html(originFileObj, document.querySelector('#editor'));
    // readFileInputEventAsArrayBuffer(originFileObj, convert);
  };

  const handleEdit = () => {
    setShowEditor(true);
  };

  const preview = () => {
    if (!showEditor) return;

    setShowEditor(false);
    const html = EditorRef.current.getData();
    console.log('html###', html);
    document.querySelector('#preview').innerHTML = html;
  };

  const exportToPDF = () => {
    html2pdf(EditorRef.current.getData());
  };

  return (
    <div className="App">
      <div className="box">
        <div className="child1">
          <img src={logo} className="App-logo" alt="logo" width={150} />
        </div>
        <div className="child2">
          <div className="controllerBtn">
            <Upload onChange={handleFileChange}>
              <Button icon={<UploadOutlined />} type="primary">
                Click to Upload
              </Button>
            </Upload>
            {initialData && (
              <>
                <Button onClick={preview}>预览</Button>
                <Button onClick={handleEdit}>编辑</Button>

                <Button onClick={exportToPDF}>导出为 PDF</Button>
              </>
            )}
          </div>
          <div
            className={`previewContainer ${initialData ? 'addPadding' : ''}`}
            {...(showEditor && { style: { display: 'none' } })}
          >
            {!initialData && <Alert message="请点击上面按钮选择 word 文档" />}
            <div id="preview"></div>
          </div>
          <Editor data={initialData} showEditor={showEditor} ref={EditorRef} />
        </div>
      </div>
    </div>
  );
}

export default App;
