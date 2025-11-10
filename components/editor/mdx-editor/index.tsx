"use client";

import { BoldItalicUnderlineToggles, CodeToggle, InsertCodeBlock, InsertFrontmatter, InsertImage, InsertSandpack, InsertTable, ListsToggle, MDXEditor, MDXEditorMethods, MDXEditorProps, Separator, UndoRedo, codeBlockPlugin, frontmatterPlugin, headingsPlugin, imagePlugin, listsPlugin, markdownShortcutPlugin, quotePlugin, sandpackPlugin, tablePlugin, thematicBreakPlugin, toolbarPlugin } from "@mdxeditor/editor";
import { FC } from "react";
import '@mdxeditor/editor/style.css'

interface EditorProps extends MDXEditorProps {
    markdown: string;
    editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
}

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs.
 */
const MDEditor: FC<EditorProps> = ({ markdown, editorRef, ...props }) => {
    return (
        <MDXEditor
            plugins={[
                // Example Plugin Usage
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                markdownShortcutPlugin(),
                tablePlugin(),
                imagePlugin(),
                frontmatterPlugin(),
                codeBlockPlugin(),
                toolbarPlugin({
                    toolbarContents: () => (
                        <>
                            {' '}
                            <UndoRedo />
                            <BoldItalicUnderlineToggles />
                            <InsertImage />
                            <InsertTable />
                            <InsertFrontmatter />
                            <ListsToggle />
                            <CodeToggle />
                            <Separator />
                        </>
                    )
                })
            ]}
            markdown={markdown}
            {...props}
            ref={editorRef}
            className="rounded-lg text-primary border"
        />
    );
};

export default MDEditor;