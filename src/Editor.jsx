import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting'

import GeneralHtmlSupport from '@ckeditor/ckeditor5-html-support/src/generalhtmlsupport';
import { forwardRef, useImperativeHandle, useEffect, useRef } from 'react';


export default forwardRef(function Editor({ showEditor, data }, dataRef) {
    const editor = useRef(null);

    useImperativeHandle(dataRef, () => ({
        getData: () => editor.current.getData(),
        setData: (data) => editor.current?.setData(data)
    }))

    useEffect(() => {
        if (editor.current) return

        ClassicEditor.create(document.querySelector('#editor'), {
            plugins: [GeneralHtmlSupport, Essentials, Paragraph, Bold, Italic, SourceEditing],
            toolbar: ['bold', 'italic', 'sourceEditing'],
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

    useEffect(() => {
        if (data) {
            editor.current?.setData(data)
        }

    }, [data])

   useEffect(() => {
    const shouldShow = showEditor
    setTimeout(() => {
        const element = document.getElementsByClassName('ck-editor')
    if (element) {
        console.log('element', element)
        element[0].style.display = shouldShow ? 'block' : 'none';
    }
    }, 0)
    

    }, [showEditor]);


    return (
        <div id="editor"></div >
    )
})
