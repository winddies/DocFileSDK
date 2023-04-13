// template.js，包含样式的完整html生成方法
export function template(str) {
  let htmlTemple1 = getHtmlTemple1(str.match(/[^><]+(?=<\/p>)/gim)[0]);
  return `${htmlTemple1}${str}${htmlTemple2}`;
}

function getHtmlTemple1(title) {
  return `<!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8" />
            <meta
                name="viewport"
                content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, minimal-ui"
            />
            <link href="//www.ppdaicdn.com/favicon.ico" rel="shortcut icon" />
            <link href="./common/common.css"/>
            <link href="./common/protocol.css"/>
            <title>${title}</title>
            <meta http-equiv="Cache-Control" content="no-cache" />
            <meta http-equiv="Pragma" content="no-cache" />
            <meta http-equiv="expires" content="0" />
            <meta name="format-detection" content="telephone=no" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="applicable-device" content="mobile" />
            <style>
            body {
                color: #384369;
                background: #fff;
                margin: 0;
                font-size: 3.7333vw;
                display: flex;
                flex-direction: column;
                overflow-x: hidden;
                margin:0 auto;
                padding:3vw;
            }
            p{
                border: none;
                margin: 0;
                padding: 0;
                line-height:6vw;
                margin-bottom:1vw
            }
            .container>p:first-child{
                width: 100%;
                text-align: center;
                font-size: 5.8667vw;
                font-weight: 700;
                margin-top: 5vw;
                margin-bottom: 7vw;
            }
            .container {
                display: flex;
                flex-direction: column;
                flex: 1;
                overflow-x: hidden;
                /* padding: 5.3333vw; */
                background: #fff;
                -webkit-overflow-scrolling: touch;
            }
            .center{
                text-align: center;
            }
            pre {
                font-size: 3.2vw;
                transform: scale(0.8);
                transform-origin: 0;
            }
    
            .title {
                width: 100%;
                text-align: center;
                font-size: 5.8667vw;
                font-weight: 700;
                margin-top: 5vw;
                margin-bottom: 7vw;
            }
    
            .service-wrap-title {
                color: #384369;
                font-size: 4.2667vw;
                display: inline-block;
                padding: 1.3333vw 0;
                font-weight: 600;
            }
    
            .service-wrap-ele {
                margin: 0;
                color: #384369;
                padding-bottom: 0;
            }
    
            .service-wrap-ele span {
                min-width: 12vw;
                display: inline-block;
                text-align: center;
                border-bottom: solid 1px;
                line-height: 0.9;
                padding: 0 6px;
            }
    
            table {
                color: #384369;
                border-right: 0.2667vw solid #384369;
                border-bottom: 0.2667vw solid #384369;
                border-color: #384369;
                border-collapse: collapse;
                border-spacing: 0;
                margin: 2vw 0;
                width: 100%;
                box-sizing:border-box;
            }
    
            table td {
                border-left: 0.2667vw solid #384369;
                border-top: 0.2667vw solid #384369;
                width: 53.3333vw;
                text-align: left;
                height: 9.3333vw;
            }
            
            th{
                text-align: center !important;
            }

            tr>td:first-child strong {
                text-align: center !important;
                width: 100%;
                display: block;
            }
        
            th,
            td {
            padding: 0 1.2vw;
            font-weight: normal;
            word-wrap: break-word;
            word-break: break-all;
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            }
        
            .bottom-btn-container {
                height: 13.3333vw;
                background: #fff;
                border-top: 0.1333vw solid #f0eded;
                display: flex;
                justify-content: space-between;
                padding: 0 5.3333vw;
                box-sizing: border-box;
            }
    
            .bottom-btn-container span {
                display: inline-block;
                line-height: 13.3333vw;
                font-size: 3.2vw;
                color: #6685ed;
            }
        </style>
        </head>
        <body><div class="container">`;
}

const htmlTemple2 = `</div></body></html>`;
