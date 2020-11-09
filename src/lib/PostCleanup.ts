export function PostCleanupContent(content: string) {
    return RemoveEmptyLines(content);
}

function RemoveEmptyLines(content: string) {
    return content
        .replace(/^\s*[\r\n]+/gm, '')
        .replace(/[\r\n]/gm,'\n');
}