import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { clickOutsideHandler, ContextualBalloon } from '@ckeditor/ckeditor5-ui';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import FormView from './view';

export default class PlaceholderInputUI extends Plugin {
  static get requires() {
    return [ContextualBalloon];
  }

  _balloon: any;
  formView: any;

  init() {
    const { editor } = this;

    // Create the balloon and the form view.
    this._balloon = this.editor.plugins.get(ContextualBalloon);
    this.formView = this._createFormView();

    editor.ui.componentFactory.add('placeholderInput', () => {
      const button = new ButtonView();

      button.label = 'placeholder';
      button.tooltip = true;
      button.withText = true;

      // Show the UI on button click.
      this.listenTo(button, 'execute', () => {
        this._showUI();
      });

      return button;
    });
  }

  _createFormView() {
    const { editor } = this;
    const formView = new FormView(editor.locale);

    // Execute the command after clicking the "Save" button.
    this.listenTo(formView, 'submit', () => {
      const { value } = formView.placeholderInputView.fieldView.element;
      editor.execute('placeholder', {
        value,
      });
      editor.editing.view.focus();

      this._hideUI();
    });

    // Hide the form view after clicking the "Cancel" button.
    this.listenTo(formView, 'cancel', () => {
      this._hideUI();
    });

    // Hide the form view when clicking outside the balloon.
    clickOutsideHandler({
      emitter: formView,
      activator: () => this._balloon.visibleView === formView,
      contextElements: [this._balloon.view.element],
      callback: () => this._hideUI(),
    });

    return formView;
  }

  _showUI() {
    this._balloon.add({
      view: this.formView,
      position: this._getBalloonPositionData(),
    });

    this.formView.focus();
  }

  _hideUI() {
    // Clear the input field values and reset the form.
    this.formView.placeholderInputView.fieldView.value = '';
    this.formView.element.reset();

    this._balloon.remove(this.formView);

    // Focus the editing view after inserting the placeholder so the user can start typing the content
    // right away and keep the editor focused.
    this.editor.editing.view.focus();
  }

  _getBalloonPositionData() {
    const { view } = this.editor.editing;
    const viewDocument = view.document;
    let target = null;

    // Set a target position by converting view selection range to DOM
    target = () => view.domConverter.viewRangeToDom(viewDocument.selection.getFirstRange() as any);

    return {
      target,
    };
  }
}
