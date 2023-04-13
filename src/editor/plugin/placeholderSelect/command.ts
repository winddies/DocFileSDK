import Command from '@ckeditor/ckeditor5-core/src/command';

export default class PlaceholderCommand extends Command {
  execute({ value }: { value: string }) {
    const { editor } = this;
    const { selection } = editor.model.document;

    editor.model.change((writer) => {
      // 创建 placeholder
      const placeholder = writer.createElement('placeholder', {
        ...Object.fromEntries(selection.getAttributes()),
        name: value,
      });

      console.log('placeholder', placeholder);

      // 插入文档中并且设置选择
      editor.model.insertObject(placeholder, null, null, {
        setSelection: 'on',
      });
    });
  }

  refresh() {
    const { model } = this.editor;
    const { selection } = model.document;

    const isAllowed = model.schema.checkChild(selection.focus?.parent as any, 'placeholder');

    this.isEnabled = isAllowed;
  }
}
