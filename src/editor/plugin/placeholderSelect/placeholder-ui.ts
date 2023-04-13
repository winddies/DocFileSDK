import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

import Model from '@ckeditor/ckeditor5-ui/src/model';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';

export default class PlaceholderUI extends Plugin {
  init() {
    const { editor } = this;
    const { t } = editor;
    const placeholderConfig = editor.config.get('placeholderConfig'); // CHANGED

    editor.ui.componentFactory.add('placeholderSelect', (locale) => {
      const dropdownView = createDropdown(locale);

      addListToDropdown(
        dropdownView,
        // @ts-ignore
        getDropdownItemsDefinitions(placeholderConfig?.options || []),
      );

      dropdownView.buttonView.set({
        // The t() function helps localize the editor. All strings enclosed in t() can be
        // translated and change when the language of the editor changes.
        label: t('Placeholder'),
        tooltip: true,
        withText: true,
      });

      // dropdown 的启用状态跟 command 状态进行绑定
      const command = editor.commands.get('placeholderSelect');
      dropdownView.bind('isEnabled').to(command as any);

      // 当下拉选项被点击时执行命令
      this.listenTo(dropdownView, 'execute', (evt) => {
        editor.execute('placeholderSelect', {
          value: (evt.source as any).commandParam,
        });
        editor.editing.view.focus();
      });

      return dropdownView;
    });
  }
}

function getDropdownItemsDefinitions(placeholderNames: string[]) {
  const itemDefinitions = new Collection();

  for (const name of placeholderNames) {
    const definition = {
      type: 'button',
      model: new Model({
        commandParam: name,
        label: name,
        withText: true,
      }),
    };

    // Add the item definition to the collection.
    itemDefinitions.add(definition);
  }

  return itemDefinitions;
}
