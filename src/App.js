import logo from './logo.svg';
import './App.css';
import { Upload, Button, Alert } from 'antd';
import { UploadOutlined, DownloadOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';

import html2pdf from './html2pdf';
import html2PDF from './jspdf';

// import docx2html from 'docx2html';
import { useRef, useState } from 'react';
import * as docx from 'docx-preview';
// import { template } from './template';
import Editor from './Editor';
import { ParseModal } from './Modal';
import html2canvas from 'html2canvas';

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
  const [previewData, setPreviewData] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [showParserModal, setShowParserModal] = useState(false);
  const editorRef = useRef();
  const fileName = useRef();

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
    fileName.current = originFileObj.name;

    await docx.renderAsync(originFileObj, document.querySelector('#preview'), null, {
      inWrapper: false,
      breakPages: true,
      ignoreLastRenderedPageBreak: true,
    });

    setTimeout(() => {
      const html = document.querySelector('#preview').innerHTML;
      setPreviewData(html);
    }, 500);

    // window.docx2html(originFileObj, document.querySelector('#editor'));
    // readFileInputEventAsArrayBuffer(originFileObj, convert);
  };

  const handleEdit = () => {
    setShowEditor(true);
    setPreviewData(document.querySelector('#preview').innerHTML);
  };

  const preview = () => {
    if (!showEditor) return;

    setShowEditor(false);
    const html = editorRef.current.getData();
    console.log('html###', html);
    document.querySelector('#preview').innerHTML = html;
    setPreviewData(html);
  };

  const exportToPDF = async () => {
    const data = editorRef.current.getData();
    fileName.current = fileName.current.replace(/\.docx/, '');

    const canvas = await html2canvas(document.querySelector('#preview'));
    console.log('canvas 1', canvas.width, canvas.height);
    // html2PDF(document.querySelector('#preview'), {
    //   output: `${fileName.current}.pdf`,
    //   margin: { bottom: 10, top: 10 },
    // });

    console.log('download start');

    html2pdf()
      .set({
        margin: [0, 0, 0, 0],
        // pagebreak: { mode: 'avoid-all' },
        filename: `${fileName.current}.pdf`,
        html2canvas: { imageTimeout: 15000, logging: true, useCORS: false },
        // jsPDF: { unit: 'mm', format: 'letter', orientation: 'p' },
      })
      .from(data)
      .save();

    // html2PDF(document.querySelector('#preview'), {
    //   output: `${fileName.current}.pdf`,
    //   margin: { bottom: 10, top: 10 },
    // });

    // console.log('pdf:###', pdf);

    // html2pdf(data, {
    //   margin: [5, 0, 5, 0],
    //   pagebreak: { mode: 'avoid-all', avoid: 'img' },
    //   filename: `${fileName.current}.pdf`,
    //   // container: document.querySelector('#preview'),
    //   // html2canvas: { useCORS: true, scale: 2 },
    //   // jsPDF: { unit: 'mm', format: 'a4', orientation: 'p' },
    // });
  };

  const handleReplace = (replaceInfo) => {
    const { match, target } = replaceInfo;
    const data = showEditor ? editorRef.current.getData() : previewData;
    const result = data.replace(new RegExp(match, 'g'), target);
    console.log('replace result------:', result);
    if (showEditor) {
      editorRef.current.setData(result);
    } else {
      document.querySelector('#preview').innerHTML = result;
      setPreviewData(result);
    }

    setShowParserModal(false);
  };

  return (
    <div className="App">
      <div className="box">
        <div className="child1">
          <img src={logo} className="App-logo" alt="logo" width={150} />
        </div>
        <div className="child2">
          <div className="controllerBtn">
            <Upload onChange={handleFileChange} className="upload-btn" showUploadList={false}>
              <Button icon={<UploadOutlined />} type="primary">
                Click to Upload File(.docx)
              </Button>
            </Upload>
            {previewData && (
              <>
                <Button
                  onClick={preview}
                  icon={<EyeOutlined />}
                  className="file-button"
                  style={{ background: '#fff7e6' }}
                >
                  预览
                </Button>
                <Button
                  onClick={handleEdit}
                  icon={<EditOutlined />}
                  className="file-button"
                  style={{ background: '#feffe6' }}
                >
                  编辑
                </Button>

                <Button
                  onClick={() => setShowParserModal(true)}
                  className="file-button"
                  style={{ background: '#f4ffb8' }}
                >
                  解析替换
                </Button>

                <Button
                  onClick={exportToPDF}
                  icon={<DownloadOutlined />}
                  className="file-button"
                  style={{ background: '#e6fffb' }}
                >
                  导出为 PDF
                </Button>
              </>
            )}
          </div>
          <div
            className={`previewContainer ${previewData ? 'addPadding' : ''}`}
            {...(showEditor && { style: { display: 'none' } })}
          >
            {!previewData && (
              <Alert message="请点击上面按钮选择 .docx 类型的 word 文档，注意：2004之前的 .doc 类型 word 不支持" />
            )}
            <div id="preview"></div>
          </div>
          <Editor data={previewData} showEditor={showEditor} ref={editorRef} />
        </div>
      </div>
      <ParseModal isOpen={showParserModal} onOk={handleReplace} onCancel={() => setShowParserModal(false)} />
    </div>
  );
}

export default App;
