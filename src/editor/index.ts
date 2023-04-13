import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import CloudServices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices';
import CodeBlock from '@ckeditor/ckeditor5-code-block/src/codeblock';
import { EditorConfig } from '@ckeditor/ckeditor5-core';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import FindAndReplace from '@ckeditor/ckeditor5-find-and-replace/src/findandreplace';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import GeneralHtmlSupport from '@ckeditor/ckeditor5-html-support/src/generalhtmlsupport';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import IndentBlock from '@ckeditor/ckeditor5-indent/src/indentblock';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import Markdown from '@ckeditor/ckeditor5-markdown-gfm/src/markdown';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';
import PlaceholderInput from './plugin/placeholderInput';
import PlaceholderSelect from './plugin/placeholderSelect';

import './index.css';
import { ExportToPDF } from './plugin/exportToPDF';
import { ImportFromWord } from './plugin/importFromWord';

export type ToolBarItem =
  | 'heading'
  | 'sourceEditing'
  | 'exportToPDF'
  | 'bold'
  | 'italic'
  | 'link'
  | 'bulletedList'
  | 'indentBlock'
  | 'indent'
  | 'blockQuote'
  | 'insertTable'
  | 'mediaEmbed'
  | 'undo'
  | 'redo'
  | 'importFromWord'
  | 'exportToPDF'
  | 'findAndReplace';

export interface IEditorConfig extends Omit<EditorConfig, 'plugins'> {
  outSource: 'markdown' | 'html';
  width: number;
  height: number;
  placeholderConfig?: { type: 'select'; options: string[] } | { type: 'input' };
  hideToolbarItems?: ToolBarItem[];
}

class Editor extends ClassicEditor {
  static init(sourceElementOrData: string | HTMLElement, config?: IEditorConfig | undefined) {
    if (config && config.outSource === 'markdown') {
      Editor.builtinPlugins?.push(Markdown);
    }

    let placeholder = 'placeholderInput';
    if (config?.placeholderConfig?.type === 'select') {
      Editor.builtinPlugins?.push(PlaceholderSelect);
      placeholder = 'placeholderSelect';
    } else {
      Editor.builtinPlugins?.push(PlaceholderInput);
    }

    const items = [
      'undo',
      'redo',
      '|',
      'importFromWord',
      'exportToPDF',
      '|',
      placeholder,
      '|',
      'findAndReplace',
      '|',
      'sourceEditing',
      '|',
      'codeBlock',
      '|',
      'heading',
      'bold',
      'italic',
      'link',
      '|',
      'bulletedList',
      'numberedList',
      '|',
      'indent',
      'outdent',
      '|',
      'blockQuote',
      'insertTable',
    ].filter((key) => !config?.hideToolbarItems?.includes(key as ToolBarItem));

    Editor.defaultConfig!.toolbar = {
      ...Editor.defaultConfig?.toolbar,
      items,
    };

    return Editor.create(sourceElementOrData, config).then((editor) => {
      const dom = document.getElementsByClassName('ck-editor__editable_inline') as HTMLCollectionOf<HTMLElement>;
      if (config?.height) {
        dom[0]!.style.height = `${config.height}px`;
      }

      if (config?.width) {
        dom[0]!.style.width = `${config.width}px`;
      }

      return editor as Editor;
    });
  }

  getInsertPlaceholders() {
    const data = this.getData();
    const allPlaceholder = data.match(/<span class="placeholder">(.*?)<\/span>/g) || [];
    const value = allPlaceholder.map((str) => str.match(/(?<=>)(.+?)(?=<)/)?.[0]);
    return value;
  }
}

Editor.builtinPlugins = [
  Autoformat,
  BlockQuote,
  SourceEditing,
  Bold,
  CloudServices,
  Essentials,
  Heading,
  Image,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  Table,
  TableToolbar,
  TextTransformation,
  GeneralHtmlSupport,
  ExportToPDF,
  ImportFromWord,
  FindAndReplace,
  CodeBlock,
];

// Editor configuration.
Editor.defaultConfig = {
  toolbar: {
    items: [
      'undo',
      'redo',
      '|',
      'importFromWord',
      'exportToPDF',
      '|',
      'findAndReplace',
      '|',
      'sourceEditing',
      // 'importFromWord',
      '|',
      'codeBlock',
      '|',
      'heading',
      'bold',
      'italic',
      'link',
      '|',
      'bulletedList',
      'numberedList',
      '|',
      'indent',
      'outdent',
      '|',
      'blockQuote',
      'insertTable',
    ],
  },
  language: 'zh-cn',
  // @ts-ignore
  image: {
    toolbar: ['imageTextAlternative', 'toggleImageCaption', 'imageStyle:inline', 'imageStyle:block', 'imageStyle:side'],
  },
  table: {
    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
  },
  codeBlock: {
    languages: [
      { language: 'plaintext', label: 'Plain text', class: '' },

      { language: 'php', label: 'PHP', class: 'php-code' },

      {
        language: 'javascript',
        label: 'JavaScript',
        class: 'js javascript js-code',
      },

      { language: 'python', label: 'Python' },
    ],
  },
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
};

export default Editor;
