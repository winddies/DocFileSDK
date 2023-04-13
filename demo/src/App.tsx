// @ts-nocheck
import {
  DownloadOutlined,
  EditOutlined,
  EyeOutlined, UploadOutlined
} from "@ant-design/icons";
import { Alert, Button, Upload } from "antd";


import "./App.css";
import logo from "./logo.svg";


// import docx2html from 'docx2html';
import * as docx from "docx-preview";
import { useRef, useState } from "react";
// import { template } from './template';
import Editor from "./Editor";
// import { ParseModal } from "./Modal";



function App() {
  const [previewData, setPreviewData] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [showParserModal, setShowParserModal] = useState(false);
  const editorRef = useRef();
  const fileName = useRef();

  const handleFileChange = async (info) => {
    const { originFileObj } = info.file;
    fileName.current = originFileObj.name;

    const result = await docx.renderAsync(
      originFileObj,
      document.querySelector("#preview") as any,
      null,
      {
        inWrapper: false,
        breakPages: true,
        ignoreLastRenderedPageBreak: true,
        useBase64URL: true,
      }
    );

    console.log("result####", result);
    // document.querySelector('#preview').innerHTML = result;

    setTimeout(() => {
      setPreviewData(document.querySelector("#preview").innerHTML);
    }, 500);

    // window.docx2html(originFileObj, document.querySelector('#editor'));
    // readFileInputEventAsArrayBuffer(originFileObj, convert);
  };

  const handleEdit = () => {
    setShowEditor(true);
    setPreviewData(document.querySelector("#preview").innerHTML);
  };

  const preview = () => {
    if (!showEditor) return;

    setShowEditor(false);
    const html = editorRef.current.getData();
    document.querySelector("#preview").innerHTML = html;
    setPreviewData(html);
  };

  const exportToPDF = async () => {
    const data = editorRef.current.getData();
    const spanS = '<span class="placeholder">{{color2}}</span>'
    const allPlaceholder = data.match(/<span class="placeholder">(.*?)<\/span>/g)
    const value = allPlaceholder.map(str => str.match(/(?<=>)(.+?)(?=<)/)[0])
    console.log('allPlaceholder', value)
    // fileName.current = fileName.current.replace(/\.docx/, "");


    // ABIFileSdk.htmlToPDF(data,`${fileName.current}.pdf`)
 

  };

  return (
    <div className="App">
      <div className="box">
        <div className="child1">
          <img src={logo} className="App-logo" alt="logo" width={150} />
        </div>
        <div className="child2">
          <div className="controllerBtn">
            <Upload
              onChange={handleFileChange}
              className="upload-btn"
              showUploadList={false}
            >
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
                  style={{ background: "#fff7e6" }}
                >
                  预览
                </Button>
                <Button
                  onClick={handleEdit}
                  icon={<EditOutlined />}
                  className="file-button"
                  style={{ background: "#feffe6" }}
                >
                  编辑
                </Button>

                <Button
                  onClick={exportToPDF}
                  icon={<DownloadOutlined />}
                  className="file-button"
                  style={{ background: "#e6fffb" }}
                >
                  导出为 PDF
                </Button>
              </>
            )}
          </div>
          <div
            className={`previewContainer ${previewData ? "addPadding" : ""}`}
            {...(showEditor && { style: { display: "none" } })}
          >
            {!previewData && (
              <Alert message="请点击上面按钮选择 .docx 类型的 word 文档，注意：2004之前的 .doc 类型 word 不支持" />
            )}
            <div id="preview"></div>
          </div>
          <Editor data={previewData} showEditor={showEditor} ref={editorRef} />
        </div>
      </div>
      {/* <ParseModal
        isOpen={showParserModal}
        onOk={handleReplace}
        onCancel={() => setShowParserModal(false)}
      /> */}
    </div>
  );
}

export default App;
