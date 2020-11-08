
export function compileCode (src: string, sandbox: any) {
  src = 'with (sandbox) {\n' + src + '\n}';
  var fn = new Function('sandbox', src);
  return fn.bind(sandbox);
}

export function compileAndRun(src: string, sandbox: any) {
  return compileCode(src, sandbox)(sandbox);
}