import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { toWidget, viewToModelPositionOutsideModelElement } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import PlaceholderCommand from '../placeholderSelect/command'; // ADDED

export default class PlaceholderInputEditing extends Plugin {
  static get requires() {
    return [Widget];
  }

  init() {
    this._defineSchema();
    this._defineConverters();
    this.editor.commands.add('placeholder', new PlaceholderCommand(this.editor));

    this.editor.editing.mapper.on(
      'viewToModelPosition',
      viewToModelPositionOutsideModelElement(this.editor.model, (viewElement) => viewElement.hasClass('placeholder')),
    );
    this.editor.config.define('placeholderConfig', {});
  }

  _defineSchema() {
    const { schema } = this.editor.model;

    schema.register('placeholder', {
      inheritAllFrom: '$inlineObject',

      allowAttributes: ['name'],
    });
  }

  _defineConverters() {
    const { conversion } = this.editor;

    // 查找带有 placeholder class 的 span 标签，在转换 model 时转换成 placeholder 标签
    conversion.for('upcast').elementToElement({
      view: {
        name: 'span',
        classes: ['placeholder'],
      },
      model: (viewElement, { writer: modelWriter }) => {
        // @ts-ignore
        const name = viewElement.getChild(0)?.data;

        return modelWriter.createElement('placeholder', { name });
      },
    });

    // 与上面相反，对 model 里 placeholder 标签的数据转换成 span
    conversion.for('editingDowncast').elementToElement({
      model: 'placeholder',
      view: (modelItem, { writer: viewWriter }) => {
        const widgetElement = createPlaceholderView(modelItem, viewWriter);

        return toWidget(widgetElement, viewWriter);
      },
    });

    conversion.for('dataDowncast').elementToElement({
      model: 'placeholder',
      view: (modelItem, { writer: viewWriter }) => createPlaceholderView(modelItem, viewWriter),
    });

    // @ts-ignore
    function createPlaceholderView(modelItem, viewWriter) {
      const name = modelItem.getAttribute('name');

      const placeholderView = viewWriter.createContainerElement('span', {
        class: 'placeholder',
      });

      // 插入 placeholder text value
      const innerText = viewWriter.createText(name);
      viewWriter.insert(viewWriter.createPositionAt(placeholderView, 0), innerText);

      return placeholderView;
    }
  }
}
