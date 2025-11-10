import MarkdownIt from "markdown-it";
import { JSONContent } from "novel";

// Initialize Markdown parser
const md = new MarkdownIt();

// Function to recursively convert parsed Markdown to JSONContent format
const convertMarkdownToJSONContent = (tokens: any[]): JSONContent[] => {
  return tokens
    .map((token) => {
      const jsonContent: JSONContent = {
        type: token.tag || token.type,
        attrs: token.attrs ? Object.fromEntries(token.attrs) : {},
      };

      // If the token has text, assign it to the 'text' field (only if it's non-empty)
      if (token.type === "text" && token.content.trim() !== "") {
        jsonContent.text = token.content;
      }

      // If the token has children, recursively process them as content
      if (token.children && token.children.length) {
        jsonContent.content = convertMarkdownToJSONContent(token.children);
      }

      // Map Markdown or HTML tags (e.g., strong, em) to Tiptap marks
      if (token.tag === "strong" || token.markup === "**") {
        jsonContent.marks = [{ type: "bold" }];
      } else if (token.tag === "em" || token.markup === "_") {
        jsonContent.marks = [{ type: "italic" }];
      }

      return jsonContent;
    })
    .filter((node) => {
      // Remove any nodes that are invalid or contain empty text
      return !(node.type === "text" && !node.text);
    });
};

// Function to parse markdown string to JSONContent
export const parseMarkdown = (markdown: string): JSONContent[] => {
  // Parse the markdown text
  const tokens = md.parseInline(markdown, {});
  // Convert to JSONContent
  return convertMarkdownToJSONContent(tokens);
};
